#!/usr/bin/env node

'use strict'

const Path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const Yaml = require('../../lib/Yaml');
const Examples = require('../../lib/Examples');
const Git = require('../../lib/Git');
const Util = require('../../lib/Util');
const TutorialUtil = require('../../lib/TutorialUtil');
const runCli = require('../../lib/cli/runCli');
const { setFlagsFromString } = require('v8');

function usage() {
    return `usage: ${process.argv[1]}
        Prints examples for external publishing in the form:
            <branch>:<baseBranch>

        Set the "external" flag in examples.yml to mark the example for external publishing
            external: true
    `;
}

function main(args) {
    args.ensureCompleted();

    const examples = Examples.load();
    for (const example of examples.examples) {
        if (example.branch && example.external === true) {
            console.log(`${example.branch}:${example.baseBranch}`);
        }
    }
}

runCli(main, usage);