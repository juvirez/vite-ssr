"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const vite_1 = require("vite");
const plugin_replace_1 = __importDefault(require("@rollup/plugin-replace"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const utils_1 = require("./utils");
module.exports = async ({ clientOptions = {}, serverOptions = {}, } = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const viteConfig = await config_1.resolveViteConfig();
    const distDir = (_b = (_a = viteConfig.build) === null || _a === void 0 ? void 0 : _a.outDir) !== null && _b !== void 0 ? _b : path_1.default.resolve(process.cwd(), 'dist');
    const clientBuildOptions = vite_1.mergeConfig({
        build: {
            outDir: path_1.default.resolve(distDir, 'client'),
            ssrManifest: true,
        },
    }, clientOptions);
    const clientResult = (await vite_1.build(clientBuildOptions));
    const indexHtml = clientResult.output.find((file) => file.type === 'asset' && file.fileName === 'index.html');
    // -- SSR build
    const serverBuildOptions = vite_1.mergeConfig({
        build: {
            outDir: path_1.default.resolve(distDir, 'server'),
            // The plugin is already changing the vite-ssr alias to point to the server-entry.
            // Therefore, here we can just use the same entry point as in the index.html
            ssr: await config_1.getEntryPoint(viteConfig.root),
            rollupOptions: {
                plugins: [
                    plugin_replace_1.default({
                        values: {
                            __VITE_SSR_HTML__: utils_1.buildHtmlDocument(indexHtml.source),
                        },
                    }),
                ],
            },
        },
    }, serverOptions);
    await vite_1.build(serverBuildOptions);
    // --- Generate package.json
    const type = 
    // @ts-ignore
    ((_e = (_d = (_c = serverBuildOptions.build) === null || _c === void 0 ? void 0 : _c.rollupOptions) === null || _d === void 0 ? void 0 : _d.output) === null || _e === void 0 ? void 0 : _e.format) === 'es'
        ? 'module'
        : 'commonjs';
    // index.html is not used in SSR and might be served by mistake
    await fs_1.promises
        .unlink(path_1.default.join((_f = clientBuildOptions.build) === null || _f === void 0 ? void 0 : _f.outDir, 'index.html'))
        .catch(() => null);
    const packageJson = {
        type,
        main: path_1.default.parse((_g = serverBuildOptions.build) === null || _g === void 0 ? void 0 : _g.ssr).name + '.js',
        ssr: {
            // This can be used later to serve static assets
            assets: (await fs_1.promises.readdir((_h = clientBuildOptions.build) === null || _h === void 0 ? void 0 : _h.outDir)).filter((file) => !/(index\.html|manifest\.json)$/i.test(file)),
        },
        ...(serverBuildOptions.packageJson || {}),
    };
    await fs_1.promises.writeFile(path_1.default.join((_j = serverBuildOptions.build) === null || _j === void 0 ? void 0 : _j.outDir, 'package.json'), JSON.stringify(packageJson, null, 2));
};
