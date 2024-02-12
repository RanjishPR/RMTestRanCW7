#!/usr/bin/env node

const url = process.argv[2];
const fs = require('fs');
const Util = require('../../lib/Util');
let mkdocs = Util.readTextFile("mkdocs.yml");
mkdocs = mkdocs.replace(/^(repo_url:\s*.*)/gm, `repo_url: ${url}`);
fs.writeFileSync("mkdocs.yml", mkdocs);