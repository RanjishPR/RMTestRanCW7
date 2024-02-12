#!/usr/bin/env node

'use strict';

const TutorialUtil = require('./TutorialUtil');

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


module.exports = function mkdocsNavFiles(path) {

    const files = filesFromYaml(path).map( file => `docs/${file}`);
    const filesWithSpaces = files.filter( file => file.match(/\s/) );
    if (filesWithSpaces.length > 0) {
        throw new Error(`Please don't use spaces in MD file names:\n${filesWithSpaces.join("\n")}`);
    }

    return files;
}