#!/bin/bash

const jsonpath = require('jsonpath');
const fs = require('fs');
const Yaml = require('./Yaml');
const Git = require('./Git');
const SKIPPED_LINES_MARKER = '---SKIPPED-LINES---';

class Snippet {
    constructor({ path, branch, selector, isEmpty, masterSnippet }) {
        this.selector = selector;
        this.path = path;
        this.branch = branch;
        this.isEmpty = isEmpty;
        this.masterSnippet = masterSnippet;

        this.textContent = this.loadTextContent();
        this.language = this.detectLanguage(path);
    }

    loadTextContent() {
        if (this.isEmpty) {
            return "";
        } else if (this.branch) {
            return Git.file(this.path, Git.branchName(this.branch), true);
        } else {
            return fs.readFileSync(this.path, "utf-8");
        }
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

    getContentAsObject( textContent ) {
        switch (this.language) {
            case 'yaml':
                return Yaml.parse(textContent);
            case 'json':
                try {
                    return textContent ? JSON.parse(textContent) : undefined;
                } catch (error) {
                    throw new Error(`JSON parse error in file "${this.path}": ${error.toString()}`);
                }
            default:
                throw new Error(`Language "${this.language}" has no object representation.`);
        }
    }

    render(options) {
        if (this.selector) {
            return this.renderWithSelector(options);
        } else {
            return this.renderWithText(options);
        }
    }

    renderWithText() {
        return this.textContent;
    }

    selectorPath() {
        const content = this.getContentAsObject( this.textContent );
        if (!content) return undefined;
        const paths = jsonpath.paths(content, this.selector);
        if (paths.length < 1) {
            return undefined;
        }
        return paths[0];
    }

    existsPath(path) {
        const content = this.getContentAsObject( this.textContent );
        const contentNode = this.byPath(content, path);
        return !!contentNode;
    }

    makeBeforeNodeContent(beforeNode) {
        if (Array.isArray(beforeNode)) {
            return [ "..." ];
        } else if (typeof beforeNode === "object") {
            return { SKIPPED_LINES_MARKER: SKIPPED_LINES_MARKER }
        } else {
            return beforeNode;
        }
    }

    selectedContent() {
        const content = this.getContentAsObject( this.textContent );
        return content && jsonpath.query(content, this.selector)[0];
    }

    contentFromPath({ context, selectedContent } = {}) {
        const content = this.getContentAsObject( this.textContent );
        const snippet = content && jsonpath.query(content, this.selector)[0];
        const path = jsonpath.paths(content, this.selector)[0];
        let root = undefined;
        let node = snippet;
        let selectedNode = node;
        let nodeName = undefined;
        let i = 0;
        for (const element of [].concat(path).reverse()) {
            i++;
            const effectiveNode = node === selectedNode ? selectedContent : node;
            if (element === '$') {
                root = node;
            } else if (typeof element === "number") {
                const contentNode = this.byPath(content, path.slice(0, path.length - i));
                let newNode = [];
                if (element >= 1) newNode.push(SKIPPED_LINES_MARKER);
                if (element >= 2 && contentNode && contentNode[element - 1]) {
                    const beforeNode = contentNode[element - 1];
                    if (typeof beforeNode === "object" && !Array.isArray(beforeNode)) {
                        const beforeNodeFirstKey = Object.getOwnPropertyNames(beforeNode)[0];
                        if (beforeNodeFirstKey) {
                            newNode.push({ [beforeNodeFirstKey]: this.makeBeforeNodeContent(beforeNode[beforeNodeFirstKey]),
                                           [SKIPPED_LINES_MARKER]: SKIPPED_LINES_MARKER  });
                        }
                    }
                }
                if (element >= 0 && effectiveNode) {
                    newNode.push(effectiveNode);
                }
                node = newNode;
            } else {
                const contentNode = this.byPath(content, path.slice(0, path.length - i));
                if (!contentNode) {
                    if (this.masterSnippet) continue;
                    throw new Error(`Cannot resolve JSON path ${path.slice(0, path.length - i).join(".")}`);
                }
                const nodeKeys = Object.getOwnPropertyNames(contentNode);
                const index = nodeKeys.indexOf(element);
                const subNode = node;
                node = {};
                if (context) {
                    if (index >= 1 || index < 0 && nodeKeys.length >= 1) {
                        const nodeValue = contentNode[nodeKeys[0]];
                        node[nodeKeys[0]] = typeof nodeValue === "object" ? "..." : nodeValue
                    }
                    if (index >= 3 || index < 0 && nodeKeys.length >= 3) node[SKIPPED_LINES_MARKER] = SKIPPED_LINES_MARKER;
                    if (index >= 2 || index < 0 && nodeKeys.length >= 2) {
                        const beforeNodeName = nodeKeys[index - 1];
                        const beforeNode = contentNode[beforeNodeName];
                        node[beforeNodeName] = this.makeBeforeNodeContent(beforeNode);
                    }
                } else {
                    if (index >= 1 || index < 0 && nodeKeys.length >= 1) {
                        node[SKIPPED_LINES_MARKER] = SKIPPED_LINES_MARKER;
                    }
                }
                const effectiveNode = subNode === selectedNode ? selectedContent : subNode;
                if (effectiveNode)
                    node[element] = effectiveNode;
            }

            context = false;
        }

        return root;
    }

    renderWithSelector(options) {
        let path = this.selectorPath();
        if (!path && this.masterSnippet) path = this.masterSnippet.selectorPath();
        if (!path) return "";

        const root = this.contentFromPath(options);
        if (!root) return "";

        let renderedContent;
        switch (this.language) {
            case 'yaml':
                renderedContent = Yaml.stringify(root);
                break;
            case 'json':
                renderedContent = JSON.stringify(root, null, 2);
                break;
            default:
                throw new Error(`Cannot format language "${this.language}".`);
        }

        renderedContent = renderedContent.replace(/^(\s*)[^\n\r]+---SKIPPED-LINES---[^\n\r]+/gms, (a, s) => `${s}...`);
        return renderedContent;
    }

    byPath(content, path) {
        let node = undefined;
        for (const element of path) {
            if (element === '$') {
                node = content;
            } else {
                node = node[element];
            }
            if (!node) return undefined;
        }

        return node;
    }
}

module.exports = Snippet;