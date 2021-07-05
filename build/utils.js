"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHtmlDocument = void 0;
const defaultHtmlParts = [
    'headTags',
    'body',
    'bodyAttrs',
    'htmlAttrs',
    'initialState',
].reduce((acc, item) => ({ ...acc, [item]: `\${${item}}` }), {});
function buildHtmlDocument(template, parts = defaultHtmlParts) {
    return template
        .replace('<html', `<html ${parts.htmlAttrs} `)
        .replace('<body', `<body ${parts.bodyAttrs} `)
        .replace('</head>', `${parts.headTags}\n</head>`)
        .replace('<div id="app"></div>', `<div id="app" data-server-rendered="true">${parts.body}</div>\n\n<script>window.__INITIAL_STATE__=${parts.initialState}</script>`);
}
exports.buildHtmlDocument = buildHtmlDocument;
