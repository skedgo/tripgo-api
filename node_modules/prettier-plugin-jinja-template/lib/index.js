"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printers = exports.parsers = exports.languages = void 0;
const parser_1 = require("./parser");
const printer_1 = require("./printer");
const PLUGIN_KEY = "jinja-template";
exports.languages = [
    {
        name: "JinjaTemplate",
        parsers: [PLUGIN_KEY],
        extensions: [".jinja", ".jinja2", ".j2", ".html"],
        vscodeLanguageIds: ["jinja"],
    },
];
exports.parsers = {
    [PLUGIN_KEY]: {
        astFormat: PLUGIN_KEY,
        parse: parser_1.parse,
        locStart: (node) => node.index,
        locEnd: (node) => node.index + node.length,
    },
};
exports.printers = {
    [PLUGIN_KEY]: {
        print: printer_1.print,
        embed: printer_1.embed,
        getVisitorKeys: printer_1.getVisitorKeys,
    },
};
