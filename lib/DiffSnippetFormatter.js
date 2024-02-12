#!/bin/bash

class DiffSnippetFormatter {
    constructor(language) {
        this.language = language;
        this.lines = [];
        this.hlLines = [];
        this.onlyAdd = true;
    }

    add(str) {
        const lines = this.splitLines(str);
        this.hlLines.push(`${this.lines.length+1}-${this.lines.length + lines.length}`)
        this.lines = this.lines.concat(lines);
    }

    remove(str) {
        const lines = this.splitLines(str);
        this.hlLines.push(`${this.lines.length+1}-${this.lines.length + lines.length}`)
        this.lines = this.lines.concat(lines.map( line => `[DELETE] ${line}`));
        this.onlyAdd = false;
    }

    keep(str) {
        const lines = this.splitLines(str);
        this.lines = this.lines.concat(lines);
        this.onlyAdd = false;
    }

    splitLines(str) {
        return str.replace(/[\n\r]+$/, "").split(/[\n\r]+/);
    }

    render() {
        const sep = '```';
        const hlLines = (this.hlLines.length && !this.onlyAdd) ? `hl_lines="${this.hlLines.join(" ")}"` : "";
        const out = `${sep}${this.language}${hlLines ? " " : ""}${hlLines}\n${this.lines.join("\n")}\n${sep}`;
        return out;
    }
}

module.exports = DiffSnippetFormatter;