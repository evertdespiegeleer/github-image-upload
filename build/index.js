#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("./module");
exports.upload = module_1.upload;
const cli_1 = require("./cli");
//Check if called by command line or as module
if (require.main === module) {
    //Command line
    cli_1.init();
}
else {
    //module
}
//# sourceMappingURL=index.js.map