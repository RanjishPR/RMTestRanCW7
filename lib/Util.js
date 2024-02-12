'use strict';

const fs = require('fs');
const Path = require('path');
const { execSync, spawnSync } = require('child_process');

const loggingLevels = {
    'error': 0,
    'warning': 1,
    'info': 2,
    'verbose': 3,
    'debug': 4,
    'silly': 5
  };

/**
 * @typedef {{stdio? : string|Array<string>, secretsToHide? : Array<string>}} ExecOptions
 */

/**
 * Various utilities for implementing scripts
 */
class Util {
    /**
     *
     * @param {string} path
     * @return {string}
     */
    static readTextFile(path) {
        return fs.readFileSync(path, {encoding: "UTF-8"});
    }

    /**
     * @public
     * Return files of a directory recursively
     * @param {string} dir Directory
     * @param {string} basePath Base path for the returned files
     */
    static readFilesRecursive(dir, basePath = ".") {
        let files = [];
        const dirEntries = fs.readdirSync(dir, { withFileTypes: true });
        for (const dirEntry of dirEntries) {
            const relativePath = Path.join(basePath, dirEntry.name);
            if (dirEntry.isDirectory()) {
                files = files.concat(Util.readFilesRecursive(Path.join(dir, dirEntry.name), relativePath ));
            } else {
                files.push(relativePath);
            }
        }
        return files;
    }

    /**
     *
     * @param {string} path
     */
    static unlinkContainedFilesRecursively(path) {
        if ((!typeof path === "string" && path.length > 0)) throw new Error('The argument "path" must be a non-empty string.');
        const absolutePath = Path.isAbsolute(path) ? path : Path.resolve(process.cwd(), path);
        if (absolutePath === "/") throw new Error('Not allowed at root directory');
        const absolutePathParsed = Path.parse(path);
        if (absolutePathParsed.root === absolutePathParsed.dir) throw new Error(`Not allowed for path "${path}", because its a first-level path.`);

        if (!fs.existsSync(absolutePath)) return;
        const dirEntries = fs.readdirSync(absolutePath, { withFileTypes: true });
        for (const dirEntry of dirEntries) {
            const entryPath = Path.join(absolutePath, dirEntry.name);
            if (dirEntry.isDirectory() && !dirEntry.isSymbolicLink()) {
                Util.unlinkContainedFilesRecursively(entryPath);
                fs.rmdirSync(entryPath);
            } else {
                fs.unlinkSync(entryPath);
            }
        }
    }

    /**
     *
     * @param {string} str
     * @param {string} [path]
     */
    static printOrWrite(str, path = undefined) {
        if (path)
            fs.writeFileSync(path, str);
        else
            console.log(str);
    }

    static debugLoggingEnabled() {
        return String(process.env.LOG_LEVEL).toLowerCase()==="debug";
    }

    static numberForLevel(level) {
        const levelNumber = loggingLevels[level.toLowerCase()];
        if (levelNumber === undefined)
            return loggingLevels["info"];
        else
            return levelNumber;
    }

    static setLogLevel(logLevel) {
        Util.logLevel = logLevel.toLowerCase();
        if (loggingLevels[Util.logLevel] === undefined)
            throw new Error(`Unsupported log level "${logLevel}"`);
    }

    static checkLogLevel(level) {
        return Util.numberForLevel(level) <= Util.numberForLevel(Util.logLevel || process.env.LOG_LEVEL || "INFO");
    }

    /**
     *  @public
     * @param msg debug message
     */
    static debug(msg) {
        if (Util.debugLoggingEnabled()) console.error(`[DEBUG] ${msg}`);
    }

    /**
     *  @public
     * @param msg info message
     */
    static info(msg) {
        if (Util.checkLogLevel("info"))
            console.error(`[INFO] ${msg}`);
    }

    /**
     *  @public
     * @param msg warning message
     */
    static warn(msg) {
        if (Util.checkLogLevel("warn"))
            console.error(`[WARN] ${msg}`);
    }


    /**
     *  @public
     * @param msg error message
     */
    static error(msg) {
        if (Util.checkLogLevel("error"))
            console.error(`[ERROR] ${msg.stack || msg}`);
    }

    /**
     *  @public
     * @param msg notice message
     */
    static note(msg) {
        if (Util.checkLogLevel("info"))
            console.error(`[NOTE] ${msg}`);
    }

    /**
     *
     * @param {string} path
     * @return {Array<string>}
     */
    static readLinesOfFile(path) {
        return Util.readTextFile(path).replace(/[\r\n]+$/).split(/[\r\n]+/);
    }

    /**
     * @param{string} path
     * @return {*}
     */
    static readJson(path) {
        return JSON.parse(Util.readTextFile(path));
    }

    static writeJson(path, obj) {
        fs.writeFileSync(path, JSON.stringify(obj, null, 4), "utf8");
    }

    /** @param {...string} command */
   static execRead(...command) {
        const result = this.exec( { stdio: [ "inherit", "pipe", "inherit" ] }, ...command );
        return result.stdout.toString();
    }

    /**
     * Execute command directly without shell
     *
     * No shell replacement takes places. Therefore this is safer to use, especially with arguments
     * that may contain unknown, external values.
     *
     * Options can be supplied in an object:
     * * secretsToHide: Array with strings that are hidden from log output, e.g. passwords
     *
     * @public
     * @param {Array<string|ExecOptions>} command Command and args
     */
    static exec(...commandArgs) {
        /** @type {ExecOptions} */
        // @ts-ignore
        const options = commandArgs.filter( entry => typeof entry === "object" ).reduce( (options, currentOptions) => Object.assign(options, currentOptions), {});
        /** @type {Array<string>} */
        // @ts-ignore
        const command = commandArgs.filter( entry => typeof entry !== "object" );

        const spawnOptions = { shell: false, stdio: options.stdio || "inherit" };

        let commandOutput = command.join(" ");
        if (options.secretsToHide) {
            commandOutput = options.secretsToHide.reduce( (output, secret) => output.replace(secret,"***"), commandOutput);
        }

        if (Util.checkLogLevel("info"))
            console.log(`[EXEC] ${commandOutput}`);
        const result = spawnSync(command[0], command.slice(1), spawnOptions);
        if (result.status !== 0) throw new Error(`Command failed with return code ${result.status}`);
        return result;
    }

    static withWorkingDir(workingDir, func) {
        const origWorkingDir = process.cwd();
        Util.cd(workingDir);

        try {
            func();
        } finally {
            Util.cd(origWorkingDir);
        }
    }

    static cd(path) {
        process.chdir(path);
    }

    /**
     * Searchs string array for first occurrence of pattern and returns the first sub match
     * @param {string} string
     * @param {RegExp} pattern
     * @param {string} [defaultValue]
     */
    static extract(string, pattern, defaultValue) {
        const array = string.split(/[\n\r]+/);
        for (let line of array) {
            const match = line.match(pattern);
            if (match) {
                return match[1];
            }
        }

        if (typeof defaultValue === "undefined")
            throw Error(`Pattern not found: ${pattern}`);
        else
            return defaultValue;
    }

    /**
     * Call function and throw specified error if it fails
     * @template T
     * @param {function() : T} func
     * @param {string} errorMessage Error message to throw if func() throws an exception
     * @returns {T}
     */
    static callAndReplaceError(func, errorMessage) {
        try {
            return func();
        } catch (error) {
            const newError = new Error(error);
            newError.stack += "\ncaused by:\n" + error.stack;
            throw newError;
        }
    }

    static copyFile(from, to) {
        Util.info(`Copy "${from}" to "${to}"`);
        fs.copyFileSync(from, to);
    }
}

Util.execSync = Util.exec;
Util.logLevel = undefined;

module.exports = Util;