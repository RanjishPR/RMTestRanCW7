/**
 * Installs virtualenv in the current environment and subsequently uses
 * virtualenv to create a virtual Python environment in `VIRTUAL_ENV_PATH`
 * (default: `./venv`). Requirements are listed in `requirements.txt`.
 */

const {exec} = require("child_process");
const {join} = require("path");
const {promisify} = require("util");
const debug = require("debug");

const log = debug("venv");

/**
 * Asynchronously executes the specified command, returning {stdout, stderr}.
 * 
 * @param {string} command Command to run 
 * @returns {stdout, stderr} stdout and stderr, defaulting to empty string
 */
const execAsync = async (command) => {
    log(command);
    const out = await promisify(exec)(command);
    log(out.stdout);
    if(out.stderr) console.error(out.stderr);
    return out;
};

const isWindows = process.platform === "win32";

const COMMAND_READ_VENV = `echo ${isWindows ? "%VIRTUAL_ENV%" : "$VIRTUAL_ENV"}`;
const VIRTUAL_ENV_PATH = "venv";
const COMMAND_PREFIX = join(VIRTUAL_ENV_PATH, isWindows ? "Scripts" : "bin");
const commandInstallVirtualEnv = env => `${env.pip} install --user virtualenv`;
const commandInitVirtualEnv = env => `${env.python} -m virtualenv venv`;
const commandInstallDependencies = env => join(COMMAND_PREFIX, `${env.pip} install -r requirements.txt`);

async function getPythonInterpreter() {
    if((await execAsync("python3 --version")).stderr === '') return {python: "python3", pip: "pip3"};
    if((await execAsync("python --version")).stderr === '') return {python: "python", pip: "pip"};
    throw new Error("Unable to detect Python version. Is it installed?")
}

async function run() {
    console.log("Setting up virtual Python env. Set DEBUG=venv to show debug log.");

    const env = await getPythonInterpreter();
    let venvPath = (await execAsync(COMMAND_READ_VENV)).stdout;
    log(`VEnv path: '${venvPath}'`)
    if(venvPath === "\n" // Do not run init again if parent shell is running in virtualenv
        || venvPath === "%VIRTUAL_ENV%\r\n") { // When running Windows, the variable name is printed instead
        await execAsync(commandInstallVirtualEnv(env));
        await execAsync(commandInitVirtualEnv(env));
    } else log("Skipping virtual env setup since virtual env was detected.");
    await execAsync(commandInstallDependencies(env));
}

run();
