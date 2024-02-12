#!/usr/bin/env node

/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var app = express();

const port = process.argv[2] || 8001;

app.use(express.static(path.join(__dirname, '../../tmp/gen/external/docs')));
console.log(`Serving on http://localhost:${port}`);
app.listen(port);
