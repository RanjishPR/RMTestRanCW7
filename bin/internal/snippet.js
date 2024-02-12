#!/usr/bin/env node

const DiffSnippet = require('../../lib/DiffSnippet');

const s = new DiffSnippet({path: 'mta.yaml', jsonPath: '$.modules[?(@.name=="cpsaasapp-app")]', branch:"saas/app", baseBranch:"saas/cflp"});
s.render();