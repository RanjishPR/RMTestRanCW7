'use strict';

const Path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const Util = require('./Util');
const Git = require('./Git');
const glob = require('glob');

const DOC_DIR = Path.join(__dirname, "..");

class Example {
    constructor(exampleData, examples) {
        this.exampleData = exampleData;
        this.examples = examples;
        this.name = this.exampleData.branch;
    }

    getBaseDocExample() {
        if (!this.exampleData.baseId) return undefined;
        const baseExample = this.examples.get(this.exampleData.baseId);
        return baseExample.getThisOrBaseDocExample();
    }

    getThisOrBaseDocExample() {
        if (this.exampleData.doc)
            return this;
        else
            return this.getBaseDocExample();
    }

    storeGeneratorTemplates() {
        Util.unlinkContainedFilesRecursively(this.generatorTemplateDir());

        let diffFiles;
        if (this.exampleData.baseBranch) {
            diffFiles = Git.diffNames(Git.branchName(this.exampleData.branch), Git.branchName(this.exampleData.baseBranch));
        } else {
            diffFiles = Git.listFiles();
        }

        for (const file of diffFiles) {
            this.storeGeneratorTemplate(file);
        }
    }

    storeTemplates() {
        for (const filePattern of this.exampleData.files || []) {
            const files = glob.sync(filePattern, { nodir: true });
            for (const file of files) {
                this.storeTemplate(file);
            }
        }
    }

    storeTemplate(file) {
        const content = fs.readFileSync(file);
        const path = this.templatePath(file);
        Util.info(`Store template "${path}"`);
        fs.mkdirSync(Path.dirname(path), {recursive: true});
        fs.writeFileSync(path, content);
    }

    storeGeneratorTemplate(file) {
        if (!fs.existsSync(file)) return;
        const content = fs.readFileSync(file, "utf-8");
        const path = this.generatorTemplatePath(file);
        Util.info(`Store generator template "${path}"`);
        fs.mkdirSync(Path.dirname(path), {recursive: true});
        const newContent = this.replaceExampleValuesToVars(content);
        fs.writeFileSync(path, newContent);
    }

    replaceExampleValuesToVars(content) {
        let newContent = content;
        for (const variable of this.vars()) {
            if (variable.exampleValue) {
                newContent = newContent.split(variable.exampleValue).join(`<%= ${variable.name} %>`);
            }
        }

        return newContent;
    }

    templateDir(name = this.name) {
        return Path.join(DOC_DIR, "templates", name);
    }

    templatePath(file) {
        return Path.join(this.templateDir(), file);
    }

    generatorTemplateDir(name = this.name) {
        return Path.join(DOC_DIR, "generators/cpapp/templates", name);
    }

    generatorTemplateRootDir() {
        return Path.join(DOC_DIR, "generators/cpapp/templates");
    }

    generatorTemplatePath(file) {
        return Path.join(this.generatorTemplateDir(), file);
    }

    base() {
        if (this.exampleData.baseBranch)
            return this.examples.get(this.exampleData.baseBranch)
        else
            return undefined;
    }

    vars() {
        let vars = {};
        const varsArray = this.exampleData.vars || [];
        if (this.base()) {
            for (const variable of this.base().vars()) {
                vars[variable.name] = variable;
            }
        }
        for (const variable of varsArray) {
            vars[variable.name] = variable;
        }

        const varsMergedArray = [];
        for (const variableName of Object.getOwnPropertyNames(vars)) {
            varsMergedArray.push(vars[variableName]);
        }
        return varsMergedArray;
    }

    generatorTemplatesMap() {
        let templates = {};
        if (this.base())
            templates = this.base().generatorTemplatesMap();

        const files = this.localGeneratorTemplateFiles();
        for (const file of files) {
            templates[file] = Path.join(this.generatorTemplatePath(file));
        }

        return templates;
    }

    localGeneratorTemplateFiles() {
        if (!fs.existsSync(this.generatorTemplateDir())) return [];
        return Util.readFilesRecursive(this.generatorTemplateDir());
    }

    generatorTemplateFiles() {
        const templates = this.generatorTemplatesMap();
        const files = [];
        for (const template in templates) {
            files.push({
                file: template,
                template: Path.relative(this.generatorTemplateRootDir(), templates[template])
            });
        }

        return files;
    }

    diffFiles() {
        if (this.exampleData.baseBranch) {
            return Git.diffNames(Git.branchName(this.exampleData.baseBranch), Git.branchName(this.exampleData.branch));
        } else {
            return Git.listFiles(Git.branchName(this.exampleData.branch));
        }
    }

    exampleFileName() {
        return this.exampleData.branch.replace(/\//g, "-");
    }

    docPath() {
        const [ doc, ] = (this.exampleData.doc || "").split("#");
        if (doc)
            return Path.join(DOC_DIR, "docs", `${doc}.md`);
        else
            return undefined;
    }

}

module.exports = Example;