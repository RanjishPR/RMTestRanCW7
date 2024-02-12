#!/usr/bin/env node

"use strict";

const Examples = require("../../lib/Examples");
const Path = require("path");
const Util = require("../../lib/Util");
const { getUnpackedSettings } = require("http2");
const Git = require("../../lib/Git");
const TutorialUtil = require("../../lib/TutorialUtil");
const fs = require("fs");
const { spawnSync } = require("child_process");

TutorialUtil.assertAppPath();

function script(addArgs = []) {
  const args = process.argv
    .slice(2)
    .filter((arg) => addArgs.indexOf(arg) === -1)
    .concat(addArgs);
  return ["node", "../CPAppDevelopment-doc/bin/internal/manage-examples.js"]
    .concat(args)
    .map((arg) => (arg.match(/ /) ? `"${arg}"` : arg))
    .join(" ");
}

function info(...msg) {
  console.log("[INFO]", ...msg);
}

function error(...msg) {
  console.log("[ERROR]", ...msg);
}

const DOC_URL = "https://pages.github.tools.sap/CPES/CPAppDevelopment";
const BRANCHES_URL = "https://github.tools.sap/CPES/CPAppDevelopment/tree";

const DOC_DIR = Path.join(__dirname, "../..");

const Branch = class {
  constructor(name) {
    this.name = name;
  }

  rename(newName) {
    this.checkout();
    this.sync();
    info(`Rename branch "${this.name}" to "${newName}"`);
    spawnSync("git", ["branch", "-D", newName]);
    if (fs.existsSync(this.templateDir())) {
      fs.mkdirSync(Path.dirname(this.templateDir(newName)), {
        recursive: true,
      });
      fs.renameSync(this.templateDir(), this.templateDir(newName));
    }
    exec("git", ["checkout", "-b", newName]);
    exec("git", ["branch", "-D", this.name]);

    this.name = newName;
  }

  merge(baseBranch) {
    info(`Merge branch "${baseBranch}"`);
    exec("git", ["merge", baseBranch]);
  }

  push() {
    info(`Push branch to Remote`);
    exec("git", ["push"]);
  }

  diffRemote(diffRemote) {
    if (Git.revExists(`origin/${this.name}`)) {
      const result = spawnSync("git", ["diff", `origin/${this.name}`, "HEAD"]);
      const resultStr = result.stdout.toString() + result.stderr.toString();
      if (resultStr) {
        info(`Diff to remote:`);
        console.log(resultStr);
        console.log("");
        console.log("");
      }
    } else {
      info("Remote branch doesn't exists");
    }
  }

  sameAsRemote() {
    if (this.exists(`origin/${this.name}`)) {
      const result = spawnSync("git", [
        "diff",
        "HEAD",
        `origin/${this.name}`,
        "--exit-code",
      ]);
      return result.status === 0;
    } else {
      return false;
    }
  }

  stagedSameAsCommited() {
    const result = spawnSync("git", ["diff", "--staged", "--exit-code"]);
    return result.status === 0;
  }

  templateDir(name = this.name) {
    return Path.join(DOC_DIR, "templates", name);
  }

  templatePath(file) {
    return Path.join(this.templateDir(), file);
  }

  storeTemplate(file) {
    const content = fs.readFileSync(file);
    const path = this.templatePath(file);
    info(`Store template "${path}"`);
    fs.mkdirSync(Path.dirname(path), { recursive: true });
    fs.writeFileSync(path, content);
  }

  hasFile(file) {
    try {
      Util.execRead("git", "show", this.name, "--", file);
      return true;
    } catch (error) {
      return false;
    }
  }

  delete() {
    Util.exec("git", "branch", "-D", this.name);
  }

  createFrom(fromBranch) {
    Util.exec("git", "checkout", "-b", this.name, fromBranch);
  }

  commit(msg) {
    Util.exec("git", "commit", "-m", msg);
  }

  reset() {
    Util.exec("git", "reset", "--hard");
  }
}

function tagAll(tagPrefix) {
  Git.exec("fetch");

  const examplesObj = Examples.load();
  const examples = examplesObj.getModulesWithBranch();

  for (const example of examples) {
    if (
      Git.UP_TO_DATE !==
      Git.compareRevs(example.branch, `origin/${example.branch}`)
    ) {
      error(
        `Tagging is only possible if all branches are in sync with the remote. This branch is not in sync: ${example.branch}`
      );
      process.exit(1);
    }
  }

  for (const example of examples) {
    const tag = `${tagPrefix}/${example.branch}`;
    info(`Create tag "${tag}".`);
    Git.exec("tag", tag, example.branch);
    info(`Push tag "${tag}".`);
    Git.exec("push", "origin", tag);
  }
}

function updateReadMe() {
  const readme = fs.readFileSync(
    Path.join(__dirname, "../..", "SAP/README.md"),
    "utf-8"
  );
  const currentReadme = fs.readFileSync("README.md", "utf-8");
  if (readme === currentReadme) return;
  fs.writeFileSync("README.md", readme);
  Git.add("README.md");
  Git.commit(`Update README.md ${new Date().toISOString()}`);
}

function getCurrentExample() {
  const currentBranch = Git.currentBranch();
  const examplesObj = Examples.load();
  const examples = examplesObj.examples.filter(
    (example) => example.branch === currentBranch
  );

  if (examples.length !== 1)
    throw new Error(`Current branch ${currentBranch} is not an example branch`);
  return examples[0];
}

function getExamples() {
  const examplesObj = Examples.load();
  return examplesObj.examples.filter((example) => example.branch);
}

function syncAll(rebase = true) {
  Util.info(`Sync all example branches`);
  Git.exec("fetch");

  const examples = getExamples();
  for (const example of examples) {
    sync(example, rebase);
  }
}

function sync(example, rebase) {
  Util.info(`Syncing branch ${example.branch}`);
  Git.checkout(example.branch);
  Git.sync(rebase);
}

function pushAll() {
  syncAll();

  Util.info(`Push all example branches`);

  const examples = getExamples();
  for (const example of examples) {
    push(example);
  }
}

function push(example) {
  Util.info(`Push branch ${example.branch}`);
  Git.checkout(example.branch);
  Git.exec("push");
}

function updateAll() {
  syncAll();

  Util.info(`Merge all branches`);

  const examples = getExamples();
  for (const example of examples) {
    update(example);
  }
}

function updateFromHere() {
  const currentBranch = Git.currentBranch();
  let filter = false;
  const examples = getExamples().filter((example) => {
    filter = filter || example.branch === currentBranch;
    return filter && example.branch;
  });

  for (const example of examples) {
    update(example);
  }
}

function updateNext() {
  const currentBranch = Git.currentBranch();
  let updateNext = false;
  const examples = getExamples().filter((example) => {
    if (updateNext) {
      updateNext = false;
      return true;
    }
    updateNext = example.branch === currentBranch;
    return false;
  });

  for (const example of examples) {
    update(example);
  }
}

function updateCurrent() {
  const example = getCurrentExample();
  Util.info(`Update snippets for branch ${example.branch}`);
  update(example);
}

function update(example) {
  const branch = new Branch(example.branch);
  const merge = true;

  Git.checkout(example.branch);
  Git.sync(true);

  if (example.build) {
    for (const buildStep of example.build) {
      console.log(buildStep);
      Util.exec("bash", "-c", buildStep);
    }
    if (branch.stagedSameAsCommited()) branch.reset();
    else branch.commit(`Build ${new Date().toISOString()}`);
  } else if (example.baseBranch) {
    if (merge) {
      try {
        Git.merge("--no-edit", example.baseBranch);
      } catch (err) {
        error(`Merge failed: ${err.toString()}`);
        error();
        error(`1. Solve the conflicts:`);
        console.log(Git.exec("diff", "--check"));
        error(`2. Add the fixed files with: git add <files>`);
        error(`3. Complete merge with     : git commit`);
        error(`4. Push to remote          : git push`);
        if (!current)
          error(
            `5. Continue from here      : ${script([], ["--from-current"])}`
          );
        process.exit(1);
      }
    }
    if (merge) branch.diffRemote();
  }

  updateReadMe();
}

function updateAllTemplates() {
  syncAll();

  const examplesObj = Examples.load();
  const examples = getExamples();
  Examples.deleteTemplates();
  for (const example of examples) {
    Git.checkout(example.branch);
    const exampleObj = examplesObj.get(example.branch);
    exampleObj.storeTemplates();
    //exampleObj.storeGeneratorTemplates();
  }
}

/*
    } else if (fromCurrent) {
      const currentBranch = Git.currentBranch();
      let filter = false;
      examples = examplesObj.examples.filter((example) => {
        filter = filter || example.branch === currentBranch;
        return filter && example.branch;
      });
    } else {
      examples = examplesObj.examples.filter((example) => example.branch);
    }
    */

function renameBranches(examples) {
  const branchMap = {};
  const mapName = (name) => branchMap[name] || name;

  for (const example of examples) {
    if (example.newBranch) {
      branchMap[example.branch] = example.newBranch;
    }
  }

  if (Object.getOwnPropertyNames(branchMap).length == 0) return;

  for (const example of examples) {
    delete example.newBranch;
    example.branch = mapName(example.branch);
    if (example.baseBranch) example.baseBranch = mapName(example.baseBranch);
  }

  const pushDeletes = [];

  for (const branchName of Object.getOwnPropertyNames(branchMap)) {
    const branch = new Branch(branchName);
    branch.rename(branchMap[branchName]);
    pushDeletes.push(`git push origin --delete "${branchName}"`);
  }

  console.log("");
  console.log("");
  info(
    "Execute the following commands to delete the renamed branch on the remote:"
  );
  console.log("");
  console.log(pushDeletes.join("\n"));
  console.log("");
  console.log("");

  Yaml.save(Path.join(DOC_DIR, "examples.yml"), { examples });
  process.exit(0);
}

/*
      if (example.baseBranch) {
        const baseBranch = new Branch(example.baseBranch);
        if (baseBranch.hasFile(".tutorial-ignore")) {
          baseBranch.checkout();
          baseBranch.sync(rebase);

          baseBranchName = "tmp-pre-merge";
          const tmpBranch = new Branch("tmp-pre-merge");
          try {
              tmpBranch.delete();
          } catch(error) {
              // ignore
          }
          tmpBranch.createFrom(example.baseBranch);
          let gitignore = "";
          try {
            gitignore = Util.readTextFile(".gitignore");
          } catch (error) {
            // ignore
          }
          const tutorialIgnore = Util.readTextFile(".tutorial-ignore");
          fs.writeFileSync(".gitignore", gitignore + "\n" + tutorialIgnore);

          Git.exec("rm", "-f", "--force", ".tutorial-ignore");
          Git.exec("rm", "-r", "--cached", ".");
          Git.exec("add", ".");
          if (gitignore) {
              Git.exec("checkout", "--", ".gitignore");
          } else {
              Git.exec("rm", "-f", ".gitignore");
          }

          if (!baseBranch.stagedSameAsCommited()) {
            baseBranch.commit("remove files from .tutorialignore");
          }

          Git.exec("clean", "-d", "-f");
        }
      }
      */

     const argv = require("yargs/yargs")(process.argv.slice(2))
     .command(
       "$0",
       "merge example base branch into current branch",
       () => {},
       (argv) => {
         updateCurrent();
       }
     )
     .command("next", "update next example", () => {
      updateNext();
     })
     .command("from-here", "merge all example branches from the current branch", () => {
      updateFromHere();
     })
     .command("all", "merge all example branches", () => {
       updateAll();
     })
     .command("sync-all", "sync all example branches", () => {
       syncAll();
     })
     .command("push-all", "push all example branches", () => {
       pushAll();
     })
     .command("templates", "update all templates", () => {
      updateAllTemplates();
     }).argv;

   if (TutorialUtil.appPath() !== process.cwd()) {
     Util.error(
       `The current directory "${process.cwd()}" is not the example application path.`
     );
     Util.error(
       `Please change to "${TutorialUtil.appPath()}" and run this script again:`
     );
     Util.error(script());
     process.exit(1);
   }
