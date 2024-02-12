'use strict'

const Util = require('./Util');
const { spawnSync } = require('child_process');

function split(str) {
    return str.split(/\s+/);
}

function lines(str) {
    const trimmed = str.trim();
    if (!trimmed) return [];
    return trimmed.split(/[\r\n]+/);
}

const branchNameCache = {};

class Git {

    static exec(...args) {
        const result = spawnSync('git', args);
        if (result.status === 0) {
            return result.stdout.toString();
        } else {
            Util.error(`Command failed: git ${args.join(" ")}`);
            console.log(result.stderr.toString());
            console.log(result.stdout.toString());
            process.exit(1);
        }
    }

    static execIgnoreError(...args) {
        const result = spawnSync('git', args);
        if (result.status === 0) {
            return result.stdout.toString();
        } else {
            return "";
        }
    }

    static tryExec(...args) {
        const result = spawnSync('git', args);
        return result.status === 0;
    }


    static currentBranch() {
        return Git.exec(...split("rev-parse --abbrev-ref HEAD")).trim();
    }

    static revParse(treeish) {
        return Git.exec('rev-parse', treeish).trim();
    }

    /**
     * Compare branch "treeish" with branch "treeishCompare".
     *
     * @param {string} treeish
     * @param {string} treeishCompare
     * @returns {string} treeish is UP_TO_DATE, AHEAD, BEHIND or DIVERGED from treeishCompare
     */
    static compareRevs(treeish, treeishCompare) {
        const commit = Git.revParse(treeish);
        const commitCompare = Git.revParse(treeishCompare);

        if (commit === commitCompare) {
            return Git.UP_TO_DATE;
        }

        const mergeBase = Git.exec('merge-base', treeish, treeishCompare).trim();

        if (commit === mergeBase) {
            return Git.BEHIND;
        } else if (commitCompare === mergeBase) {
            return Git.AHEAD;
        } else {
            return Git.DIVERGED;
        }
    }


    static diffNames(treeish, baseTreeish) {
        return lines(Git.exec('diff', '--name-only', treeish, baseTreeish));
    }

    static listFiles(treeish) {
        if (treeish) {
            return lines(Git.exec('ls-tree', '--name-only', '-r', treeish));
        } else {
            return lines(Git.exec('ls-files'));
        }
    }

    static file(path, treeish, ignoreError = false) {
        if (ignoreError) {
            return Git.execIgnoreError('show', treeish ? `${treeish}:${path}` : path);
        } else {
            return Git.exec('show', treeish ? `${treeish}:${path}` : path);
        }
    }

    static revExists(rev) {
        return Git.tryExec('rev-parse', '--verify', rev);
    }

    static trackBranch(branch, remoteBranch) {
        Git.exec('branch', '--track', branch, remoteBranch);
    }

    static branchName(branch) {
        if (!branchNameCache[branch]) {
            branchNameCache[branch] = Git.revExists(branch) ? branch : `origin/${branch}`;
        }

        return branchNameCache[branch];
    }

    static commit(message) {
        if (!message) throw new Error(`Git commit message missing.`);
        Git.exec("commit", "-m", message);
    }

    static add(...files) {
        Git.exec("add", ...files);
    }

    static checkout(branch) {
        Git.exec("checkout", branch);
    }

    static sync(rebase) {
        if (rebase) Git.exec("pull", "--rebase");
        else Git.exec("pull");
    }

    static merge(args, branch) {
        Git.exec("merge", args, branch);
    }
}

Git.UP_TO_DATE = 'UP_TO_DATE';
Git.AHEAD = 'AHEAD';
Git.BEHIND = 'BEHIND';
Git.DIVERGED = 'DIVERGED';

module.exports = Git;