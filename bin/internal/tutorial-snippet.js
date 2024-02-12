#!/usr/bin/env node

const fs = require('fs');
const path = process.argv[2];
const yaml = fs.readFileSync(path, "utf-8");
const filters = process.argv.slice(3);
const Snippet2 = require('../../lib/Snippet2');

const match = path.match(/\.([^\.]+)$/) || [];
const ext = match[1] || "";

const snippet = new Snippet2(yaml, ext);
snippet.parse();
const result = snippet.filterLines(filters);
if (result.length > 0) {
    const parentLines = snippet.filterParentsOf(result[0]);

    for (const tokenLine of parentLines.concat(result)) {
        console.log(tokenLine.line);
    }
}