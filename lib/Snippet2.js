#!/usr/bin/env node

class Snippet2 {
    constructor(source, format) {
        this.source = source;
        this.format = format.toLowerCase();
    }

    parse() {
        if (this.format === "yaml" || this.format === "yml") {
            this.lines = this.tokenizeYaml(this.source);
        } else {
            this.lines = this.tokenizeTabs(this.source);
        }

        this.linkLines(this.lines);
    }

    tokenizeYaml(source) {
        const lines = source.split(/[\n\r]+/);
        const tokenLines = [];
        for (const line of lines) {
            const match = line.match(/^(\s*)(-\s*)?(\w+)\s*(:)?(.*)$/);
            if (match) {
                let [ ,indentSpaces, hyphenWithSpaces, word, colon, rest ] = match;
                indentSpaces = (indentSpaces + (hyphenWithSpaces || "")).replace(/\t/g, "  ");
                tokenLines.push({ parsed: true, indent: indentSpaces.length, hypen: !!hyphenWithSpaces, word, colon, rest, line });
            } else {
                tokenLines.push({ indent:0, line });
            }
        }
        return tokenLines;
    }

    tokenizeTabs(source) {
        const lines = source.split(/[\n\r]+/);
        const tokenLines = [];
        for (const line of lines) {
            const [, indentSpaces, rest ] = line.match(/^(\s*)(.*)$/);
            const tokenLine = ({ parsed: true, indent: indentSpaces.replace(/\t/g, "  ").length, line, rest });
            tokenLines.push(tokenLine);
        }

        return tokenLines;
    }

    linkLines(tokenLines) {
        let obj;
        let root = obj = { indent:-1, childIndent:0, childIndex:-1 };
        let previousLine = root;

        for (const tokenLine of tokenLines) {
            if (tokenLine.parsed) {
                while (tokenLine.indent < obj.childIndent) {
                    obj = obj.parent;
                }
                if (tokenLine.indent > obj.childIndent) {
                    obj = previousLine;
                    obj.childIndent = tokenLine.indent;
                    obj.childIndex = -1;
                }
                if (tokenLine.hypen) {
                    obj.childIndex++;
                    obj.type = "ARRAY";
                }

                previousLine = tokenLine;
            }

            tokenLine.index  = obj.childIndex;
            tokenLine.parent = obj;
        }

        return root;
    }

    findLine(tokenLines, term) {
        let i = 0;
        for (const tokenLine of tokenLines) {
            if (tokenLine.line.indexOf(term)>=0) return i;
            i++;
        }

        return -1;
    }

    filterLines(filters) {
        let filteredLines = this.lines;
        let i;
        for (const filter of filters) {
            i = this.findLine(filteredLines, filter);
            if (i < 0) return [];

            const line = filteredLines[i];
            if (line.index === -1 || typeof line.index === "undefined")
                filteredLines = this.filterChildNode(filteredLines, i);
            else
                filteredLines = this.filterNode(filteredLines, i);
        }

        return filteredLines;
    }

    indexOf(line) {
        return this.lines.indexOf(line);
    }

    filterParentsOf(line) {
        const i = this.indexOf(line);
        if (i<0) return [];
        return this.filterParents(this.lines, i);
    }

    filterParents(tokenLines, index, prevIndex) {
        const tokenLine = tokenLines[index];
        let result = [];

        const parent = tokenLines[index].parent;
        const parentIndex = tokenLines.indexOf(parent);
        if (parentIndex >= 0) {
            result = this.filterParents(tokenLines, parentIndex, index);
        }

        if (index === prevIndex - 1 ) {
            return result.concat([ tokenLine ]);
        } else if (index < prevIndex - 1) {
            return result.concat([ tokenLine, { line: " ".repeat(tokenLines[prevIndex].indent) + "..." } ]);
        } else {
            return result;
        }
    }

    isContained(parentLine, line) {
        return line.indent > parentLine.indent || !line.parsed;
    }

    isSame(parentLine, line) {
        return line.parent === parentLine.parent && line.index === parentLine.index || !line.parsed;;
    }

    filterNode(tokenLines, startIndex) {
        const startLine = tokenLines[startIndex];
        let tokenLine = startLine;
        let i = startIndex;
        const result = [];
        while ( tokenLine &&
                (this.isContained(startLine, tokenLine) ||
                 this.isSame(startLine, tokenLine))) {

            result.push(tokenLine);
            tokenLine = tokenLines[++i];
        }

        return result;
    }

    filterChildNode(tokenLines, startIndex) {
        const startLine = tokenLines[startIndex];
        let tokenLine = tokenLines[startIndex + 1];
        if (!tokenLines) return [];
        let i = startIndex + 1;
        const result = [];
        while ( tokenLine &&
                this.isContained(startLine, tokenLine)) {

            result.push(tokenLine);
            tokenLine = tokenLines[++i];
        }

        return result;
    }
}

module.exports = Snippet2;

