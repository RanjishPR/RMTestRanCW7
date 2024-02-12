'use strict';

const UsageError = require('./UsageError');
const Args = require('./Args');

module.exports = async function runCli( func, usage ) {
    setInterval( () => true, 10000);
    try {
        await func(new Args());
        process.exit(0);
    } catch (error) {
        console.error(error.stack);
        if (error instanceof UsageError) {
            console.error(usage());
        }
        process.exit(1);
    }
}