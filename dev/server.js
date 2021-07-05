"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSSRDevHandler = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const vite_1 = require("vite");
const config_1 = require("../config");
const utils_1 = require("../build/utils");
function fixEntryPoint(vite) {
    // The plugin is redirecting to the entry-client for the SPA,
    // but we need to reach the entry-server here. This trick
    // replaces the plugin behavior in the config and seems
    // to keep the entry-client for the SPA.
    for (const alias of vite.config.resolve.alias || []) {
        // @ts-ignore
        if (alias._viteSSR === true) {
            alias.replacement = alias.replacement.replace('client', 'server');
        }
    }
}
const createSSRDevHandler = (server, options = {}) => {
    options = {
        ...server.config.inlineConfig,
        ...options,
    };
    const resolve = (p) => path_1.default.resolve(server.config.root, p);
    async function getIndexTemplate(url) {
        // Template should be fresh in every request
        const indexHtml = await fs_1.promises.readFile(resolve('index.html'), 'utf-8');
        return await server.transformIndexHtml(url, indexHtml);
    }
    const handleSsrRequest = async (request, response, next) => {
        if (request.method !== 'GET' || request.originalUrl === '/favicon.ico') {
            return next();
        }
        fixEntryPoint(server);
        try {
            const template = await getIndexTemplate(request.originalUrl);
            const entryPoint = options.ssr || (await config_1.getEntryPoint(server.config.root, template));
            let resolvedEntryPoint = await server.ssrLoadModule(resolve(entryPoint));
            resolvedEntryPoint = resolvedEntryPoint.default || resolvedEntryPoint;
            const render = resolvedEntryPoint.render || resolvedEntryPoint;
            const protocol = 
            // @ts-ignore
            request.protocol ||
                (request.headers.referer || '').split(':')[0] ||
                'http';
            const url = protocol + '://' + request.headers.host + request.originalUrl;
            // This context might contain initialState provided by other plugins
            const context = options.getRenderContext
                ? await options.getRenderContext({
                    url,
                    request,
                    response,
                    resolvedEntryPoint,
                })
                : {};
            if (context && context.status) {
                // If response-like is provided, just return the response
                for (const [key, value] of Object.entries(context.headers || {})) {
                    response.setHeader(key, value);
                }
                response.statusCode = context.status;
                response.statusMessage = context.statusText;
                return response.end(context.body);
            }
            const htmlParts = await render(url, { request, response, ...context });
            const html = utils_1.buildHtmlDocument(template, htmlParts);
            response.setHeader('Content-Type', 'text/html');
            response.end(html);
        }
        catch (e) {
            server.ssrFixStacktrace(e);
            console.log(e.stack);
            next(e);
        }
    };
    return handleSsrRequest;
};
exports.createSSRDevHandler = createSSRDevHandler;
async function createSsrServer(options = {}) {
    // Enable SSR in the plugin
    process.env.__DEV_MODE_SSR = 'true';
    const viteServer = await vite_1.createServer({
        ...options,
        server: options,
    });
    return {
        async listen(port) {
            if (!globalThis.fetch) {
                const fetch = await Promise.resolve().then(() => __importStar(require('node-fetch')));
                // @ts-ignore
                globalThis.fetch = fetch.default || fetch;
            }
            await viteServer.listen(port);
            viteServer.config.logger.info('\n -- SSR mode\n');
        },
    };
}
exports.default = createSsrServer;
