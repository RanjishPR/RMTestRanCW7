'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

class Yaml {

    static load(path) {
        try {
            const yamlText = fs.readFileSync(path, 'utf8');
            return yaml.safeLoad(yamlText);
        } catch (ex) {
            throw new Error(`Error while loading yaml file: "${path}"\n\n${ex.stack}\n\n`);
        }
    }

    static parse(yamlText) {
        return yaml.safeLoad(yamlText);
    }

    static save(path, obj) {
        fs.writeFileSync(path, yaml.safeDump(obj));
    }

    static stringify(obj) {
        // Increase line width to avoid wrapping lines in YAML (">-" directive)
        return yaml.safeDump(obj, { lineWidth: 300 });
    }
}

module.exports = Yaml;