const {spawn} = require("child_process");
const {join} = require("path");

const isWindows = process.platform === "win32";

const VIRTUAL_ENV_PATH = "venv";
const COMMAND_PREFIX = join(VIRTUAL_ENV_PATH, isWindows ? "Scripts" : "bin");
const COMMAND_SERVE = [`${join(COMMAND_PREFIX, "mkdocs")}`, ["serve"]];

function run() {
    console.log(...COMMAND_SERVE);
    const emitter = spawn(...COMMAND_SERVE);
    emitter.stdout.on("data", (buffer) => console.log(buffer.toString()));
    emitter.stderr.on("data", (buffer) => console.error(buffer.toString()));
}

run();
