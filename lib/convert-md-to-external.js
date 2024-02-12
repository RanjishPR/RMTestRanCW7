#!/usr/bin/env node

'use strict';

const fs = require('fs');
const Path = require('path');
const Util = require('./Util');

const TAB_REGEXP = /^(\s*)===\s+"(SAP|External|AWS Canary)"\s*$/;

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
    Util.info(`Convert MD file "${fromPath}" -> "${toPath}"`);

    const content = fs.readFileSync(fromPath, "utf-8");
    copyImages(content, fromPath, toPath);

    const lines = content.split(/\r?\n\r?/);
    const it = lines[Symbol.iterator]();
    const outLines = [];
    const write = line => outLines.push(line);

    for (let line of it) {
        line = line.replace(/\t/g, "    ");
        const m = line.match(TAB_REGEXP);
        if (!m) {
            write(line);
        } else {
            let [, spaces, visibility] = m;
            let subSpacesLength = undefined;

            for (let line of it) {
                line = line.replace(/\t/g, "    ");
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
                        if (visibility === "External") write(spaces + line.substr(subSpacesLength));
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

module.exports = convertExternal;
