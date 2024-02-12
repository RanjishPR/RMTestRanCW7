#!/usr/bin/env node

'use strict'

const fs = require('fs');
const Yaml = require('../../lib/Yaml');

class MdWriter {
    constructor() {
        this.s = "";
    }

    header() {
        this.s = `
[//]: # (DO NOT MODIFY THIS FILE)
[//]: # (IT IS GENERATED USING bin/internal/build-links-md.js)
[//]: # (BASED ON links.yml)

# Links

| Topic | Description | Link |
|--|--|--|`;
    }

    link(link) {
        return `[${link}](${link})`;
    }

    entry(entry) {
        this.s += `\n| ${entry.topic} | ${entry.description} | ${this.link(entry.link)}`;
    }

    footer() {
        this.s += `\n`;
    }

    save(path) {
        fs.writeFileSync(path, this.s);
    }
}

function renderLinks(context = {}, entries) {
    for (const entry of entries) {
        if (entry.topic) {
            const subContext = Object.assign({}, context, entry);
            renderLinks(subContext, entry.links || []);
        } else {
            const [description] = Object.getOwnPropertyNames(entry);
            const link = entry[description];
            if (description) {
                mdWriter.entry(Object.assign({}, context, { description, link }));
            }
        }
    }
}

const links = Yaml.load("links.yml").links;
const mdWriter = new MdWriter();
mdWriter.header();
renderLinks(undefined, links);
mdWriter.footer();
mdWriter.save("docs/Links.md");
