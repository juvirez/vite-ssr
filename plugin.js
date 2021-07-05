"use strict";
const server_1 = require("./dev/server");
const pluginName = 'vite-ssr';
const entryServer = '/entry-server';
const entryClient = '/entry-client';
function detectReactConfigFeatures(features = {}) {
    const external = [];
    let useApolloRenderer;
    let useStyledComponents;
    let useMaterialUi;
    // TODO use virtual modules for feature-detection
    try {
        require.resolve('@apollo/client/react/ssr');
        useApolloRenderer = features.reactApolloRenderer !== false;
    }
    catch (error) {
        external.push('@apollo/client');
    }
    try {
        require.resolve('styled-components');
        useStyledComponents = features.reactStyledComponents !== false;
    }
    catch (error) {
        external.push('styled-components');
    }
    try {
        require.resolve('@material-ui/core');
        useMaterialUi = features.reactMaterialUi !== false;
    }
    catch (error) {
        external.push('@material-ui/core');
    }
    return {
        ssr: { external },
        define: {
            __USE_APOLLO_RENDERER__: !!useApolloRenderer,
            __USE_STYLED_COMPONENTS__: !!useStyledComponents,
            __USE_MATERIAL_UI__: !!useMaterialUi,
        },
    };
}
module.exports = function ViteSsrPlugin(options = {}) {
    return {
        name: pluginName,
        config() {
            let isReact = false;
            try {
                require.resolve('@vitejs/plugin-react-refresh');
                isReact = true;
            }
            catch (error) { }
            const detectedFeats = {
                ...(isReact && detectReactConfigFeatures(options.features)),
            };
            return {
                ...detectedFeats,
                ssr: {
                    ...detectedFeats.ssr,
                    noExternal: [pluginName],
                },
            };
        },
        configResolved: (config) => {
            let lib = '/vue'; // default
            if (config.plugins.findIndex((plugin) => plugin.name === 'react-refresh') >=
                0) {
                lib = '/react';
            }
            config.resolve.alias.push({
                find: /^vite-ssr(\/vue|\/react)?$/,
                replacement: pluginName + lib + (config.build.ssr ? entryServer : entryClient),
                // @ts-ignore
                _viteSSR: true,
            });
            // @ts-ignore
            config.optimizeDeps = config.optimizeDeps || {};
            config.optimizeDeps.include = config.optimizeDeps.include || [];
            config.optimizeDeps.include.push(pluginName + lib + entryClient, pluginName + lib + entryServer);
        },
        async configureServer(server) {
            if (process.env.__DEV_MODE_SSR) {
                const handler = server_1.createSSRDevHandler(server, options);
                return () => server.middlewares.use(handler);
            }
        },
    };
};
