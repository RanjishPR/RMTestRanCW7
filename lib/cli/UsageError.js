'use strict';

class UsageError extends Error {

    /**
     * @param {string} msg
     */
    constructor(msg = "Wrong arguments") {
        super(msg);
        Object.setPrototypeOf(this, UsageError.prototype);
    }

    static handleHelpArg(args) {
        switch (args.get()) {
            case '-h':
            case '--help':
                throw new UsageError(`Usage`);
        }
    }
}

module.exports = UsageError;
