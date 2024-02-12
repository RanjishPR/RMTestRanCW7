'use strict';

const Path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const Yaml = require('./Yaml');
const Example = require('./Example');
const TutorialUtil = require('./TutorialUtil');
const Util = require('./Util');

class Examples {
    constructor(docsDir) {
        this.path = Path.join(docsDir || __dirname, "../examples.yml");
    }

    static deleteTemplates() {
        Util.unlinkContainedFilesRecursively(Path.join(TutorialUtil.docPath(), "templates"));
    }

    static load(docsDir) {
        const examples = new Examples(docsDir);
        examples.load();
        return examples;
    }

    load() {
        this.examples = Yaml.load(this.path).examples.map( example => {
            example.id = example.id || example.branch;
            example.baseId = example.baseId || example.baseBranch;
            return example;
        });
    }

    get(name) {
        const exampleData = this.examples.find( example => example.id === name );
        if (!exampleData) throw new Error(`Example "${name}" doesn't exists.`);
        return new Example(exampleData, this);
    }

    getData(name) {
        return this.examples.find( example => example.id === name );
    }

    getByMarkdown(path) {
        const pathMatch = path.replace(/\\/g, '/').match(/\/docs\/(.*)\.md$/);
        if (!pathMatch) throw new Error(`Markdown path must match pattern "docs/**/*.md", but is "${path}"`);
        const [, doc ] = pathMatch;
        const exampleData = this.examples.find( example => example.doc === doc );
        if (!exampleData) throw new Error(`Example for doc "${doc}" doesn't exists.`);
        return new Example(exampleData, this);
    }

    getModulesWithBranch() {
        return this.examples.filter(example => example.branch );
    }

    getByDoc(docName) {
        return this.examples.find( example => example.doc === docName && example.branch && !example.hidden );
    }

    getBranchByDoc(docName) {
        const example = this.getByDoc(docName);
        return example && example.branch;
    }

    getBaseBranchByDoc(docName) {
        let example = this.getByDoc(docName);
        while (example) {
            if (!example.baseBranch) return undefined;
            example = this.getData(example.baseBranch);
            if (!example) return;
            if (!example.hidden && example.branch && example.doc) return example.branch;
        }
    }
}

module.exports = Examples;