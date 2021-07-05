"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntryPoint = exports.resolveViteConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const vite_1 = require("vite");
async function resolveViteConfig(mode) {
    return vite_1.resolveConfig({}, 'build', mode || process.env.MODE || process.env.NODE_ENV);
}
exports.resolveViteConfig = resolveViteConfig;
async function getEntryPoint(root, indexHtml) {
    if (!root) {
        const config = await resolveViteConfig();
        root = config.root;
    }
    if (!indexHtml) {
        indexHtml = await fs_1.default.promises.readFile(path_1.default.resolve(root, 'index.html'), 'utf-8');
    }
    const matches = indexHtml
        .substr(indexHtml.lastIndexOf('script type="module"'))
        .match(/src="(.*)">/i);
    const entryFile = (matches === null || matches === void 0 ? void 0 : matches[1]) || 'src/main';
    return path_1.default.join(root, entryFile);
}
exports.getEntryPoint = getEntryPoint;
