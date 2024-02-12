'use strict';

const UsageError = require('./UsageError');

class Args {
    constructor() {
        this.iterator = process.argv.slice(2)[Symbol.iterator]();
        this.entry = undefined;
        this.counter = 0;
    }

    read(required = true) {
        this.entry = this.iterator.next();
        if (this.entry.done)
            if (required) {
                throw new UsageError("Missing Argument");
            } else {
                return;
            }

        this.counter++;
        if (this.entry.value.length === 0) {
            throw new UsageError("Expected non empty string for parameter");
        }

        return this.entry.value;
    }

    fetch(required = true) {
        if (this.entry && !this.entry.done) {
            const value = this.entry.value;
            this.entry = undefined;
            return value;
        } else {
            const value = this.read(required);
            this.entry = undefined;
            return value;
        }
    }

    get(required) {
        if (this.entry && !this.entry.done) {
            return this.entry.value;
        } else {
            return this.read(required);
        }
    }

    consume() {
        this.entry = undefined;
    }


    ensureCompleted() {
        const entry = this.iterator.next();
        if (!entry.done)
            throw new UsageError("Too Many Arguments");
    }

    parseArgs( ...funcs ) {
        let counter;
        let allFuncs = [ UsageError.handleHelpArg ].concat(funcs);
        do {
            counter = this.counter;
            for (const func of allFuncs) {
                const arg = this.get(false);
                if (!arg) return; // Exit if there are no more args

                if (func.handleArgs) {
                    func.handleArgs(this)
                } else {
                    func(this);
                }
            }
        } while(this.counter > counter);
    }

    filterArgs( ...funcs ) {
        let remainingArgs = [];
        let counter;
        let allFuncs = [ UsageError.handleHelpArg ].concat(funcs);

        for(;;) {
            do {
                counter = this.counter;
                for (const func of allFuncs) {
                    const arg = this.get(false);
                    if (!arg) break; // Exit if there are no more args

                    if (func.handleArgs) {
                        func.handleArgs(this)
                    } else {
                        func(this);
                    }
                }
            } while (this.counter > counter);

            const unhandledArg = this.fetch(false);
            if (unhandledArg) {
                remainingArgs.push( unhandledArg );
            } else {
                break;
            }
        }

        this.iterator = remainingArgs[Symbol.iterator]();
        this.entry = undefined;
    }
}

module.exports = Args;