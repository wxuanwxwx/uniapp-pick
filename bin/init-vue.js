#!/usr/bin/env node

const path = require('path');
const Compiler = require('../lib/Compiler');
let config = require(path.resolve('webpack.config.js'));
new Compiler(config).start();
