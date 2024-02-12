#!/usr/bin/env node

'use strict';

const Markdown = require('../../lib/Markdown');
const Examples = require('../../lib/Examples');
const DiffSnippet = require('../../lib/DiffSnippet');
const Path = require('path');
const Util = require('../../lib/Util');
const { getUnpackedSettings } = require('http2');
const Git = require('../../lib/Git');
const TutorialUtil = require('../../lib/TutorialUtil');

TutorialUtil.assertAppPath();

const argv = require('yargs/yargs')(process.argv.slice(2))
  .command('$0', 'update snippets for current branch', () => {}, (argv) => {
    const currentBranchName = Git.currentBranchName();
    Util.info(`Update snippets for branch ${currentBranchName}`);
    updateCodeSnippets(exampleData => exampleData.branch === currentBranchName);
  })
  .command('all', 'update all snippets', () => {
    Util.info(`Update all snippets`);
    updateCodeSnippets( () => true);
  })
  .argv;


function updateCodeSnippets(filter) {
  const examples = new Examples();
  examples.load();
  for (const exampleData of examples.examples.filter( exampleData => exampleData.branch )) {
      if (!filter(exampleData)) continue;

      const example = examples.get(exampleData.id);
      const doc = example.docPath();
      if (!doc) continue;
      const md = new Markdown({examples, path: doc});
      md.load();
      if (!md.needsProcessing()) continue;
      Util.info(`Processing "${doc}"`);
      md.process();
      md.save();
  }
}

/*
const md = new Markdown({examples, path: Path.join(__dirname, "../../", "docs/SaaS_cFLP.md")});

for (const exampleData of examples.examples) {
    const example = examples.get(exampleData.branch);
    for (const file of example.diffFiles()) {
        const diffSnippet = new DiffSnippet({path: file, branch: example.exampleData.branch, baseBranch: example.exampleData.baseBranch });

        console.log(`# ${file}`);
        console.log();
        console.log(diffSnippet.render());
    }
}

//md.load();
//md.process();
console.log(md.content);
*/