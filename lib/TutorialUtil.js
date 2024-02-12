'use strict';

const Path = require('path');
const fs = require('fs');
const Util = require('./Util');

let appPath = undefined;

class TutorialUtil {
    static docPath() {
        return Path.dirname(__dirname);
    }

    static docsExternalSrcPath(file = "") {
        return Path.join(TutorialUtil.docPath(), "tmp/src/external/docs", file);
    }

    static docsPath(file = "") {
        return Path.join(TutorialUtil.docPath(), "docs", file);
    }

    static appPath() {
        if (!appPath) {
            appPath = Path.join(Path.dirname(TutorialUtil.docPath()), "CPAppDevelopment-app");
            if (!fs.existsSync(appPath))
                throw new Error(`Example application path ${appPath} does not exists. Make sure to set-up your Git repository as explained in the Internal.md document.`);
        }
        return appPath;
    }

    static assertAppPath() {
        if (TutorialUtil.appPath() !== process.cwd()) {
            Util.error(`The current directory "${process.cwd()}" is not the example app path.`);
            Util.error(`Please change to "${TutorialUtil.appPath()}" and run this script again:`);
            process.exit(1);
        }
    }

    static loadMkdocsYml(path) {

        const yaml = require('js-yaml');
        const fs = require('fs');

        let MkdocsType = new yaml.Type('tag:yaml.org,2002:python/name:pymdownx.superfences.fence_div_format', {
            kind: 'scalar',
            instanceOf: String,
            construct: data => new String(data),
          });

        let MKDOCS_SCHEMA = yaml.Schema.create([ MkdocsType ]);

        const yamlText = fs.readFileSync(path, 'utf8');
        return yaml.safeLoad(yamlText, { schema: MKDOCS_SCHEMA });
    }
}

module.exports = TutorialUtil;