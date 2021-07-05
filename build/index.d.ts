import { InlineConfig } from 'vite';
declare type BuildOptions = {
    clientOptions?: InlineConfig;
    serverOptions?: InlineConfig & {
        packageJson?: Record<string, unknown>;
    };
};
declare const _default: ({ clientOptions, serverOptions, }?: BuildOptions) => Promise<void>;
export = _default;
