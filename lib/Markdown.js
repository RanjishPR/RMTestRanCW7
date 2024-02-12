'use strict';

const fs = require('fs');
const Util = require('./Util');
const DiffSnippet = require('./DiffSnippet');
const DiffSnippet2 = require('./DiffSnippet2');
const Git = require('./Git');

class Markdown {
    /**
     *
     * @param {{examples : import('./Examples'), path : string}} param0
     */
    constructor( {examples, path} ) {
        this.examples = examples;
        this.path = path;
    }

    load() {
        this.content = fs.readFileSync(this.path, "utf-8");
    }

    needsProcessing() {
        return !!this.content.match(/<!--\s+(snippet|cpes-\w+)\s*(.*?)\s*-->/);
    }

    process() {
        const reg = /([\t ]*)<!--\s+(snippet|cpes-\w+)\s*(.*?)\s*-->/g;
        let result;
        let index = 0;
        let newContentArray = [];
        while((result = reg.exec(this.content)) !== null) {
            newContentArray.push(this.content.substr(index, reg.lastIndex - index));

            let processResult;
            let indent = result[1];
            switch (result[2]) {
                case 'cpes-file':
                    processResult = this.processFile(result[3]);
                    break;
                case 'snippet':
                    processResult = this.processSnippet(result[3]);
                    break;
                default:
                    Util.warn(`Unknown directive "${processResult[1]}"`);
            }

            processResult.placeholder.lastIndex = reg.lastIndex;
            const placeholderMatch  = processResult.placeholder.exec(this.content);
            if (placeholderMatch) {
                reg.lastIndex = index = processResult.placeholder.lastIndex;
            } else {
                index = reg.lastIndex;
            }

            newContentArray.push(processResult.content.split(/\n/).map( line => line.length>0 ? `${indent}${line}` : "" ).join("\n"));
        }
        newContentArray.push(this.content.substr(index));

        this.content = newContentArray.join("\n");
    }

    processFile(file) {
        const [ path, selector ] = file.split(":");
        Util.info(file);
        const example = this.example();
        const snippet = new DiffSnippet({path, selector, branch: example.exampleData.branch, baseBranch: example.exampleData.baseBranch});
        return { placeholder: /^[\n\r]*\s*```.*?```\r?\n/gsm, content: snippet.render(false) };
    }

    processSnippet(file) {
        const [ , path, selector ] = file.match(/^([^\s]+)(?:\s+(.*))?$/)
        Util.info(file);
        const example = this.example();
        const snippet = new DiffSnippet2({path, selector, branch: example.exampleData.branch, baseBranch: example.exampleData.baseBranch});
        return { placeholder: /^[\n\r]*\s*```.*?```\r?\n/gsm, content: snippet.render(false) };
    }

    save() {
        fs.writeFileSync(this.path, this.content);
    }

    example() {
        return this.examples.getByMarkdown(this.path);
    }

}
module.exports = Markdown;