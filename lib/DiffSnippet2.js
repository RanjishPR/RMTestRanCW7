#!/bin/bash

const jsonpath = require('jsonpath');
const Git = require('./Git');
const Snippet2 = require('./Snippet2');
const JsDiff = require('diff');
const DiffSnippetFormatter = require('./DiffSnippetFormatter');

class DiffSnippet2 {
    constructor({ path, branch, baseBranch, selector}) {
        this.path = path;
        this.baseBranch = baseBranch;
        this.branch = branch;
        this.selector = selector;
    }

    detectLanguage(path) {
        if (path.match(/\.ya?ml$/)) {
            return 'yaml';
        } else if (path.match(/\.json$/)) {
            return 'json';
        } else if (path.match(/\.js$/)) {
            return 'js';
        } else if (path.match(/\.sh$/)) {
            return 'sh';
        } else {
            return 'text';
        }
    }

    load(path, branch) {
        if (branch) {
            return Git.file(path, Git.branchName(branch), true);
        } else {
            return fs.readFileSync(path, "utf-8");
        }
    }

    args() {
        const regex = /\s*(?:([^\s"']+)|(?:"([^"]+)")|(?:'([^']+)'))/g;
        let args = [];
        let match;
        while((match = regex.exec(this.selector)) !== null) {
            args.push(match[1] || match[2] || match[3]);
        }

        console.log(args);

        return args;
    }

    render(deletes = true) {
        const language = this.detectLanguage(this.path);

        let args = this.args();
        if (args[0] === "--branch") {
            this.branch = this.baseBranch = args[1];
            args = args.slice(2);
        }
        const filters = args;

        const source = this.load(this.path, this.branch);
        let baseSource = "";
        try {
            baseSource = this.load(this.path, this.baseBranch);
        } catch(error) {
            //
        }

        this.snippetObj = new Snippet2(source, language);
        this.baseSnippetObj = new Snippet2(baseSource, language);

        this.snippetObj.parse();
        this.baseSnippetObj.parse();

        const filteredSnippet = this.snippetObj.filterLines(filters);
        const baseFilteredSnippet = this.baseSnippetObj.filterLines(filters);
        const parentSnippet = filteredSnippet.length > 0 ? this.snippetObj.filterParentsOf(filteredSnippet[0]) : [];
        const snippet = parentSnippet.concat(filteredSnippet).map( line => line.line ).join("\n");
        const baseSnippet = parentSnippet.concat(baseFilteredSnippet).map( line => line.line ).join("\n");

        const formatter = new DiffSnippetFormatter(language);

        const diffs = JsDiff.diffLines(baseSnippet, snippet);
        let i = 1;
        for (const diff of diffs) {
            if (this.diffSelector && this.diffSelector.indexOf(i++) < 0) continue;
            if (this.showDiffIndex)
                formatter.add(`DIFF INDEX: ${i++}`);
            if (diff.added) {
                formatter.add(diff.value);
            } else if (diff.removed) {
                if (deletes) formatter.remove(diff.value);
            } else {
                formatter.keep(diff.value);
            }
        }

        return formatter.render();
    }
}

module.exports = DiffSnippet2;