#!/usr/bin/env node

'use strict';

const runCli = require('../../lib/cli/runCli');
const fs = require('fs');
const Path = require('path');
const Util = require('../../lib/Util');
const glob = require("fast-glob");
const Examples = require('../../lib/Examples');

function usage() {
    return `${process.argv[1]}

        Copy template file for externally visible code branches
    `;
}

function copyFile(from, to) {
    mkdirFor(to);
    Util.copyFile(from, to);
}

function mkdirFor(path) {
    const dirPath = Path.dirname(path);
    fs.mkdirSync(dirPath, {recursive: true});
}

function copyTemplates() {
    const examples = Examples.load();
    for (const example of examples.examples) {
        if (!(example.branch && example.external === true)) continue;
        const fromDir = Path.join("templates", example.branch);
        const toDir = Path.join("tmp/gen/external/templates", example.branch);

        const extFiles = glob.sync("**/*", { cwd: fromDir, dot: true });
        for (const extFile of extFiles) {
            copyFile(Path.join(fromDir, extFile) , Path.join(toDir, extFile));
        }
    }
}

function main(args) {
    args.fetch(false);
    args.ensureCompleted();
    copyTemplates();
}

runCli(main, usage);
