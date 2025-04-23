"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const jinja_1 = require("./jinja");
const regex_1 = __importDefault(require("./regex"));
const NOT_FOUND = -1;
const parse = (text) => {
    const statementStack = [];
    const root = {
        id: "0",
        type: "root",
        content: text,
        preNewLines: 0,
        originalText: text,
        index: 0,
        length: 0,
        nodes: {},
    };
    const generatePlaceholder = placeholderGenerator(text);
    let match;
    let i = 0;
    while ((match = root.content.slice(i).match(regex_1.default)) !== null) {
        if (!match.groups || match.index === undefined) {
            continue;
        }
        const matchLength = match[0].length;
        // skip script and style blocks
        if (match.groups.scriptBlock || match.groups.styleBlock) {
            i += match.index + matchLength;
            continue;
        }
        const matchText = match.groups.node;
        const expression = match.groups.expression;
        const statement = match.groups.statement;
        const ignoreBlock = match.groups.ignoreBlock;
        const comment = match.groups.comment;
        if (!matchText && !expression && !statement && !ignoreBlock && !comment) {
            continue;
        }
        const placeholder = generatePlaceholder();
        const emptyLinesBetween = root.content
            .slice(i, i + match.index)
            .match(/^\s+$/) || [""];
        const preNewLines = emptyLinesBetween.length
            ? emptyLinesBetween[0].split("\n").length - 1
            : 0;
        const node = {
            id: placeholder,
            preNewLines,
            originalText: matchText,
            index: match.index + i,
            length: matchText.length,
            nodes: root.nodes,
        };
        if (comment != undefined || ignoreBlock != undefined) {
            root.content = replaceAt(root.content, placeholder, match.index + i, matchLength);
            root.nodes[node.id] = {
                ...node,
                type: comment ? "comment" : "ignore",
                content: comment || ignoreBlock,
            };
            i += match.index + placeholder.length;
        }
        if (expression != undefined) {
            const delimiter = {
                start: match.groups.startDelimiterEx,
                end: match.groups.endDelimiterEx,
            };
            root.content = replaceAt(root.content, placeholder, match.index + i, matchLength);
            root.nodes[node.id] = {
                ...node,
                type: "expression",
                content: expression,
                delimiter,
            };
            i += match.index + placeholder.length;
        }
        if (statement != undefined) {
            const keyword = match.groups.keyword;
            const delimiter = {
                start: match.groups.startDelimiter,
                end: match.groups.endDelimiter,
            };
            if (keyword.startsWith("end")) {
                let start;
                while (!start) {
                    start = statementStack.pop();
                    if (!start) {
                        throw new Error(`No opening statement found for closing statement "{% ${statement} %}".`);
                    }
                    if (keyword.replace(/end_?/, "") !== start.keyword) {
                        root.content = replaceAt(root.content, start.id, start.index, start.length);
                        i += start.id.length - start.length;
                        start = undefined;
                        continue;
                    }
                }
                const end = {
                    ...node,
                    index: match.index + i,
                    type: "statement",
                    content: statement,
                    keyword,
                    delimiter,
                };
                root.nodes[end.id] = end;
                const originalText = root.content.slice(start.index, end.index + end.length);
                const block = {
                    id: generatePlaceholder(),
                    type: "block",
                    start: start,
                    end: end,
                    content: originalText.slice(start.length, originalText.length - end.length),
                    preNewLines: start.preNewLines,
                    containsNewLines: originalText.search("\n") !== NOT_FOUND,
                    originalText,
                    index: start.index,
                    length: end.index + end.length - start.index,
                    nodes: root.nodes,
                };
                root.nodes[block.id] = block;
                root.content = replaceAt(root.content, block.id, start.index, originalText.length);
                i += match.index + block.id.length + end.length - originalText.length;
            }
            else {
                root.nodes[node.id] = {
                    ...node,
                    type: "statement",
                    content: statement,
                    keyword,
                    delimiter,
                };
                statementStack.push(root.nodes[placeholder]);
                i += match.index + matchLength;
            }
        }
    }
    for (const stmt of statementStack) {
        root.content = root.content.replace(stmt.originalText, stmt.id);
    }
    return root;
};
exports.parse = parse;
const placeholderGenerator = (text) => {
    let id = 0;
    return () => {
        while (true) {
            id++;
            const placeholder = jinja_1.Placeholder.startToken + id + jinja_1.Placeholder.endToken;
            if (!text.includes(placeholder)) {
                return placeholder;
            }
        }
    };
};
const replaceAt = (str, replacement, start, length) => {
    return str.slice(0, start) + replacement + str.slice(start + length);
};
