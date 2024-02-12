#!/usr/bin/env node

'use strict';

const Markdown = require('../../lib/Markdown');
const Examples = require('../../lib/Examples');
const DiffSnippet = require('../../lib/DiffSnippet');
const Path = require('path');
const Util = require('../../lib/Util');
const Yaml = require('../../lib/Yaml');
const TutorialUtil = require('../../lib/TutorialUtil');
const runCli = require('../../lib/cli/runCli');
const UsageError = require('../../lib/cli/UsageError');
const fs = require('fs');

function usage() {
    return `${process.argv[1]} MKDOCS-YML
        Print MD files from nav tree of a mkdocs.yml files
    `;
}

function filesFromEntry(file) {
    let files = [];

    if (Array.isArray(file)) {
        files = files.concat(filesFromArray(file));
    } else if (typeof file === "string") {
        files.push(file)
    } else if (typeof file === "object") {
        const keys = Object.getOwnPropertyNames(file);
        for (const key of keys) {
            files = files.concat(filesFromEntry(file[key]));
        }
    } else {
        throw new Error(`Unrecognizable nav entry in external/mkdocs.yml: ${file}`);
    }

    return files;
}

function filesFromArray(a) {
    let files = [];

    for (const file of a) {
        files = files.concat(filesFromEntry(file));
    }

    return files;
}

function filesFromYaml(path) {
    const yaml = TutorialUtil.loadMkdocsYml(path);
    return filesFromArray(yaml.nav);
}


function main(args) {
    const path = args.fetch();
    args.ensureCompleted();

    const files = filesFromYaml(path).map( file => `docs/${file}`);
    const filesWithSpaces = files.filter( file => file.match(/\s/) );
    if (filesWithSpaces.length > 0) {
        throw new Error(`Please don't use spaces in MD file names:\n${filesWithSpaces.join("\n")}`);
    }
    console.log(files.join("\n"));
}

runCli(main, usage);
