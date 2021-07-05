import type { Plugin } from 'vite';
import { SsrOptions } from './dev/server';
declare type ViteSsrPluginOptions = {
    features?: {
        /**
         * Use '@apollo/client' renderer if present
         * @default true
         */
        reactApolloRenderer?: boolean;
        /**
         * Collect 'styled-components' styles if present
         * @default true
         */
        reactStyledComponents?: boolean;
        /**
         * Collect '@material-ui/core' styles if present
         * @default true
         */
        reactMaterialUi?: boolean;
    };
};
declare const _default: (options?: ViteSsrPluginOptions & SsrOptions) => Plugin;
export = _default;
