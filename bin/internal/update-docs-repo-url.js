#!/usr/bin/env node

const url = process.argv[2];
const fs = require('fs');
const Util = require('../../lib/Util');

const files = [ 'docs/Prepare-Dev-Environment-CAP.md' ];

for (const file of files) {
    let str = Util.readTextFile(file);
    str = str.replace("https://github.tools.sap/CPES/CPAppDevelopment.git", url);
    fs.writeFileSync(file, str);
}