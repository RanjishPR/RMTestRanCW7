#!/usr/bin/env node

'use strict'

const fs = require('fs');
const Examples = require('../../lib/Examples');
const DiffSnippet = require('../../lib/DiffSnippet');

const DOC_URL = "https://pages.github.tools.sap/CPES/CPAppDevelopment";
const COMPARE_URL = "https://github.tools.sap/CPES/CPAppDevelopment-dev-dev/compare";
const BRANCHES_URL = "https://github.tools.sap/CPES/CPAppDevelopment-dev/tree";

class MdWriter {
    constructor() {
        this.s = "";
    }

    header() {
        this.s = `
[//]: # (DO NOT MODIFY THIS FILE)
[//]: # (IT IS GENERATED USING bin/internal/build-examples-md.js)
[//]: # (BASED ON examples.yml)

# Branches

| Tutorial | Branch | Based on Branch | Changes | Changes |
|--|--|--|--|--|`;
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
        this.writeLn("## Dependency Graph");
        this.writeLn();
        this.writeLn("```mermaid");
        this.writeLn("graph TD");
        examples.forEach( example => {
            if (example.baseBranch)
                this.writeLn(`${example.baseBranch} --> ${example.branch}`);
        });
        this.writeLn("```")
    }
}

const examples = new Examples();
examples.load();

const mdWriter = new MdWriter();
mdWriter.header();
for (const exampleData of examples.examples.filter( example => example.branch)) {
    const example = examples.get(exampleData.id);
    mdWriter.example(example);
}
mdWriter.diagram( examples.examples );
mdWriter.footer();
mdWriter.save("docs/Examples.md");

if (!fs.existsSync("docs/diffs")) fs.mkdirSync("docs/diffs");

for (const exampleData of examples.examples.filter( example => example.branch)) {
    const example = examples.get(exampleData.id);

    let diffContent = `#${example.exampleData.branch}\n\n`;
    for (const file of example.diffFiles()) {
        const diffSnippet = new DiffSnippet({path: file, branch: example.exampleData.branch, baseBranch: example.exampleData.baseBranch });

        diffContent += `## ${file}`;
        const sep = "```";
        diffContent += `\n${sep}\n<!-- cpes-file ${file} -->\n${sep}\n\n`;
        diffContent += `\n${diffSnippet.render()}\n`;

    }
    fs.writeFileSync(`docs/diffs/${example.exampleFileName()}.md`, diffContent);
}
