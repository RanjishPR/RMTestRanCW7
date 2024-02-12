#!/usr/bin/env node

'use strict';

const runCli = require('../../lib/cli/runCli');
const fs = require('fs');
const Path = require('path');
const Util = require('../../lib/Util');

function usage() {
    return `${process.argv[1]} SOURCE-FILE [EXTERNAL-FILE]

        Convert MD file to external version, by:
            * Removing tab with "SAP" information
    `;
}

const TAB_REGEXP = /^(\s*)===\s+"(SAP|External)"\s*$/;

// ![AppGen](markdown/images/vscappgenerator.png "AppGen")
const IMAGE_REGEXP = /\!\[[^\]]+\]\(([^ )]+)/g;

function copyImages(content, fromPath, toPath) {
    let result;
    while((result = IMAGE_REGEXP.exec(content)) !== null) {
        const imageFromPath = Path.join(Path.dirname(fromPath), result[1]);
        const imageToPath = Path.join(Path.dirname(toPath), result[1]);
        console.log(`Copy image "${imageFromPath}" -> "${imageToPath}"`);
        const image = fs.readFileSync(imageFromPath);
        fs.writeFileSync(imageToPath, image);
    }
}

function convertExternal(fromPath, toPath) {
    const content = fs.readFileSync(fromPath, "utf-8");
    copyImages(content, fromPath, toPath);

    const lines = content.split(/\r?\n\r?/);
    const it = lines[Symbol.iterator]();
    const outLines = [];
    const write = line => outLines.push(line);

    for (const line of it) {
        const m = line.match(TAB_REGEXP);
        if (!m) {
            write(line);
        } else {
            let [, spaces, visibility] = m;
            let subSpacesLength = undefined;

            for (const line of it) {
                const m = line.match(TAB_REGEXP);
                if (m) {
                    const [, nextSpaces, nextVisibility] = m;
                    if (nextSpaces !== spaces) break;
                    visibility = nextVisibility;
                } else {
                    if (line.startsWith(spaces) && line.substr(spaces.length).match(/^\s+/)) {
                        if (!subSpacesLength) {
                            const m = line.match(/^\s+/)
                            subSpacesLength = m[0].length;
                        }

                        // Write visible content with removed indent
                        if (visibility === "External") write(line.substr(subSpacesLength));
                    } else if (line.match(/^\s*$/)) {
                        // Empty line
                        write("");
                    } else {
                        // End of section
                        write(line);
                        break;
                    }
                }
            }
        }
    }

    if (toPath)
        fs.writeFileSync(toPath, outLines.join("\n"));
    else
        console.log(outLines.join("\n"));
}

function main(args) {
    const sourceFile = args.fetch();
    const externalFile = args.fetch(false);
    args.ensureCompleted();
    convertExternal(sourceFile, externalFile);
}

runCli(main, usage);
