#!/usr/bin/env node

'use strict';

const runCli = require('../../lib/cli/runCli');
const fs = require('fs');
const Path = require('path');
const Util = require('../../lib/Util');
const convertMdToExternal = require('../../lib/convert-md-to-external.js');
const mkdocsNavFiles = require('../../lib/mkdocs-nav-files.js');
const glob = require("fast-glob");

function usage() {
    return `${process.argv[1]}

        Build external repository
    `;
}

function copyFile(from, to) {
    mkdirFor(to);
    if (from.match(/\.md$/)) {
        convertMdToExternal(from, to);
    } else {
        Util.copyFile(from, to);
    }
}

function mkdirFor(path) {
    const dirPath = Path.dirname(path);
    fs.mkdirSync(dirPath, {recursive: true});
}

function copyFiles() {
    const extFiles = glob.sync("external/docs/**/*");
    const mkdocNavFiles = mkdocsNavFiles("external/mkdocs.yml");

    let allFiles = [];
    const filesGlob = Util.readLinesOfFile("external/FILES");
    for (const fileGlob of filesGlob) {
        const files = glob.sync(fileGlob);
        allFiles = allFiles.concat(files);
    }

    allFiles = allFiles.concat(mkdocNavFiles);

    for (const file of allFiles) {
        const extFile = Path.join("external", file);
        if (extFiles.indexOf(extFile) >= 0) {
            Util.info(`Skipping ${file} because external version exists.`);
        }

        const toFile = (file.startsWith("docs" + Path.posix.sep) || file.startsWith("docs" + Path.win32.sep))  ? Path.join("tmp/src/external", file) : Path.join("tmp/gen/external", file);
        copyFile(file, toFile);
    }

    for (const file of extFiles) {
        const toFile = Path.join("tmp/src/external", Path.relative("external", file));
        copyFile(file, toFile);
    }
}

function main(args) {
    args.fetch(false);
    args.ensureCompleted();
    copyFiles();
}

runCli(main, usage);
