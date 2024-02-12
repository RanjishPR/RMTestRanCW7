#!/usr/bin/env node

'use strict'

const fs = require('fs');
const Examples = require('../../lib/Examples');
const DiffSnippet = require('../../lib/DiffSnippet');

const DOC_URL = "https://pages.github.tools.sap/CPES/CPAppDevelopment";
const COMPARE_URL = "https://github.tools.sap/CPES/CPAppDevelopment-dev/compare";
const BRANCHES_URL = "https://github.tools.sap/CPES/CPAppDevelopment-dev/tree";

class MdWriter {
    constructor() {
        this.s = "";
    }

    header() {
        this.s = `
[//]: # (DO NOT MODIFY THIS FILE)
[//]: # (IT IS GENERATED USING bin/internal/build-modules-md.js)
[//]: # (BASED ON examples.yml)

# Tutorial Overview

The diagram shows the order and dependency of the different modules of this tutorial. Most modules are based on each other and you need to work through them in the given sequence. Some are additional steps that are not picked up by others.

`;
    }

    branchLink(name) {
        return `[${name}](${BRANCHES_URL}/${name})`;
    }

    docLink(name, link) {
        return `[${name}](${DOC_URL}/${link})`;
    }

    changesLink(baseBranch, branch) {
        return `[Git](${COMPARE_URL}/${baseBranch}..${branch})`;
    }

    changesMdLink(name) {
        return `[MD](../diffs/${name})`;
    }


    example(example) {
        const d = example.exampleData;
        this.s += `\n${this.docLink(d.description, d.doc)} | ${d.branch ? this.branchLink(d.branch) : "-"} | ${d.baseBranch ? this.branchLink(d.baseBranch) : "-"} | ${d.baseBranch ? this.changesLink(d.baseBranch, d.branch) : "-"} | ${d.baseBranch ? this.changesMdLink(example.exampleFileName()) : "-"}`;
    }

    footer() {
        this.s += `\n`;
    }

    save(path) {
        fs.writeFileSync(path, this.s);
    }

    writeLn(...str) {
        this.s += str.join("") + `\n`;
    }

    diagram(examples) {
        this.writeLn();
        this.writeLn();
        this.writeLn("```mermaid");
        this.writeLn("graph TD");
        examples.examples.filter( exampleData => exampleData.doc ).forEach( exampleData => {
            const example = examples.get(exampleData.id);
            const baseDocExample = example.getBaseDocExample();
            if (baseDocExample)
                this.writeLn(`${baseDocExample.exampleData.id}("${baseDocExample.exampleData.description || baseDocExample.exampleData.doc}") --> ${example.exampleData.id}("${example.exampleData.description || example.exampleData.doc}")`);
        });
        this.writeLn("```")
    }
}

const examples = new Examples();
examples.load();

const mdWriter = new MdWriter();
mdWriter.header();
mdWriter.diagram( examples );
mdWriter.footer();
mdWriter.save("docs/Module_Sequence.md");
