#!/bin/bash

const jsonpath = require('jsonpath');
const Yaml = require('./Yaml');
const Snippet = require('./Snippet');
const JsDiff = require('diff');
const DiffSnippetFormatter = require('./DiffSnippetFormatter');

class DiffSnippet {
    constructor({ path, branch, baseBranch, selector}) {
        this.path = path;
        this.baseBranch = baseBranch;
        this.branch = branch;
        if (selector === "?") {
            this.showDiffIndex = true;
        } if (String(selector).match(/^(\d+,?)+$/)) {
            this.diffSelector = selector.split(/,/).map( sel => parseInt(sel, 10) );
        } else {
            this.objSelector = selector;
        }

        this.snippet = new Snippet({path, branch, selector: this.objSelector});
        this.baseSnippet = new Snippet({path, branch: baseBranch, selector: this.objSelector, isEmpty: !baseBranch, masterSnippet: this.snippet});
    }

    render(deletes = true) {
        let snippet;
        let baseSnippet;

        if (this.objSelector) {
            const isCreate = !this.baseSnippet.selectorPath();
            const selectedContent = this.snippet.selectedContent();
            const selectedBaseContent = this.baseSnippet.selectedContent();
            snippet = this.snippet.render({ context: isCreate, selectedContent: selectedContent });
            baseSnippet = this.snippet.render({ context: isCreate, selectedContent: selectedBaseContent });
        } else {
            snippet = this.snippet.render();
            baseSnippet = this.baseSnippet.render();
        }
        const formatter = new DiffSnippetFormatter(this.snippet.language);

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

module.exports = DiffSnippet;