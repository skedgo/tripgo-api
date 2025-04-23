"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.surroundingBlock = exports.findPlaceholders = exports.embed = exports.print = exports.getVisitorKeys = void 0;
const doc_1 = require("prettier/doc");
const jinja_1 = require("./jinja");
const NOT_FOUND = -1;
process.env.PRETTIER_DEBUG = "true";
const getVisitorKeys = (ast) => {
    if ("type" in ast) {
        return ast.type === "root" ? ["nodes"] : [];
    }
    return Object.values(ast)
        .filter((node) => {
        return node.type === "block";
    })
        .map((e) => e.id);
};
exports.getVisitorKeys = getVisitorKeys;
const print = (path) => {
    const node = path.getNode();
    if (!node) {
        return [];
    }
    switch (node.type) {
        case "expression":
            return printExpression(node);
        case "statement":
            return printStatement(node);
        case "comment":
            return printCommentBlock(node);
        case "ignore":
            return printIgnoreBlock(node);
    }
    return [];
};
exports.print = print;
const printExpression = (node) => {
    const multiline = node.content.includes("\n");
    const expression = doc_1.builders.group(doc_1.builders.join(" ", [
        ["{{", node.delimiter.start],
        multiline
            ? doc_1.builders.indent(getMultilineGroup(node.content))
            : node.content,
        multiline
            ? [doc_1.builders.hardline, node.delimiter.end, "}}"]
            : [node.delimiter.end, "}}"],
    ]), {
        shouldBreak: node.preNewLines > 0,
    });
    return node.preNewLines > 1
        ? doc_1.builders.group([doc_1.builders.trim, doc_1.builders.hardline, expression])
        : expression;
};
const printStatement = (node) => {
    const multiline = node.content.includes("\n");
    const statemnt = doc_1.builders.group(doc_1.builders.join(" ", [
        ["{%", node.delimiter.start],
        multiline
            ? doc_1.builders.indent(getMultilineGroup(node.content))
            : node.content,
        multiline
            ? [doc_1.builders.hardline, node.delimiter.end, "%}"]
            : [node.delimiter.end, "%}"],
    ]), { shouldBreak: node.preNewLines > 0 });
    if (["else", "elif"].includes(node.keyword) &&
        (0, exports.surroundingBlock)(node)?.containsNewLines) {
        return [doc_1.builders.dedent(doc_1.builders.hardline), statemnt, doc_1.builders.hardline];
    }
    if (node.keyword === "set" && node.preNewLines > 1) {
        return doc_1.builders.group([doc_1.builders.trim, doc_1.builders.hardline, statemnt]);
    }
    return statemnt;
};
const printCommentBlock = (node) => {
    const comment = doc_1.builders.group(node.content, {
        shouldBreak: node.preNewLines > 0,
    });
    return node.preNewLines > 1
        ? doc_1.builders.group([doc_1.builders.trim, doc_1.builders.hardline, comment])
        : comment;
};
const printIgnoreBlock = (node) => {
    return node.content;
};
const embed = () => {
    return async (textToDoc, print, path, options) => {
        const node = path.getNode();
        if (!node || !["root", "block"].includes(node.type)) {
            return undefined;
        }
        const mapped = await Promise.all(splitAtElse(node).map(async (content) => {
            let doc;
            if (content in node.nodes) {
                doc = content;
            }
            else {
                doc = await textToDoc(content, {
                    ...options,
                    parser: "html",
                });
            }
            let ignoreDoc = false;
            return doc_1.utils.mapDoc(doc, (currentDoc) => {
                if (typeof currentDoc !== "string") {
                    return currentDoc;
                }
                if (currentDoc === "<!-- prettier-ignore -->") {
                    ignoreDoc = true;
                    return currentDoc;
                }
                const idxs = (0, exports.findPlaceholders)(currentDoc).filter(([start, end]) => currentDoc.slice(start, end + 1) in node.nodes);
                if (!idxs.length) {
                    ignoreDoc = false;
                    return currentDoc;
                }
                const res = [];
                let lastEnd = 0;
                for (const [start, end] of idxs) {
                    if (lastEnd < start) {
                        res.push(currentDoc.slice(lastEnd, start));
                    }
                    const p = currentDoc.slice(start, end + 1);
                    if (ignoreDoc) {
                        res.push(node.nodes[p].originalText);
                    }
                    else {
                        res.push(path.call(print, "nodes", p));
                    }
                    lastEnd = end + 1;
                }
                if (lastEnd > 0 && currentDoc.length > lastEnd) {
                    res.push(currentDoc.slice(lastEnd));
                }
                ignoreDoc = false;
                return res;
            });
        }));
        if (node.type === "block") {
            const block = buildBlock(path, print, node, mapped);
            return node.preNewLines > 1
                ? doc_1.builders.group([doc_1.builders.trim, doc_1.builders.hardline, block])
                : block;
        }
        return [...mapped, doc_1.builders.hardline];
    };
};
exports.embed = embed;
const getMultilineGroup = (content) => {
    // Dedent the content by the minimum indentation of any non-blank lines.
    const lines = content.split("\n");
    const minIndent = Math.min(...lines
        .slice(1) // can't be the first line
        .filter((line) => line.trim())
        .map((line) => line.search(/\S/)));
    return doc_1.builders.group(lines.map((line, i) => [
        doc_1.builders.hardline,
        i === 0
            ? line.trim() // don't dedent the first line
            : line.trim()
                ? line.slice(minIndent).trimEnd()
                : "",
    ]));
};
const splitAtElse = (node) => {
    const elseNodes = Object.values(node.nodes).filter((n) => n.type === "statement" &&
        ["else", "elif"].includes(n.keyword) &&
        node.content.search(n.id) !== NOT_FOUND);
    if (!elseNodes.length) {
        return [node.content];
    }
    const re = new RegExp(`(${elseNodes.map((e) => e.id).join(")|(")})`);
    return node.content.split(re).filter(Boolean);
};
/**
 * Returns the indexs of the first and the last character of any placeholder
 * occuring in a string.
 */
const findPlaceholders = (text) => {
    const res = [];
    let i = 0;
    while (true) {
        const start = text.slice(i).search(jinja_1.Placeholder.startToken);
        if (start === NOT_FOUND)
            break;
        const end = text
            .slice(start + i + jinja_1.Placeholder.startToken.length)
            .search(jinja_1.Placeholder.endToken);
        if (end === NOT_FOUND)
            break;
        res.push([start + i, end + start + i + jinja_1.Placeholder.startToken.length + 1]);
        i += start + jinja_1.Placeholder.startToken.length;
    }
    return res;
};
exports.findPlaceholders = findPlaceholders;
const surroundingBlock = (node) => {
    return Object.values(node.nodes).find((n) => n.type === "block" && n.content.search(node.id) !== NOT_FOUND);
};
exports.surroundingBlock = surroundingBlock;
const buildBlock = (path, print, block, mapped) => {
    // if the content is empty or whitespace only.
    if (block.content.match(/^\s*$/)) {
        return doc_1.builders.fill([
            path.call(print, "nodes", block.start.id),
            doc_1.builders.softline,
            path.call(print, "nodes", block.end.id),
        ]);
    }
    if (block.containsNewLines) {
        return doc_1.builders.group([
            path.call(print, "nodes", block.start.id),
            doc_1.builders.indent([doc_1.builders.softline, mapped]),
            doc_1.builders.hardline,
            path.call(print, "nodes", block.end.id),
        ]);
    }
    return doc_1.builders.group([
        path.call(print, "nodes", block.start.id),
        mapped,
        path.call(print, "nodes", block.end.id),
    ]);
};
