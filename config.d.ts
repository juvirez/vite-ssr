export declare function resolveViteConfig(mode?: string): Promise<Readonly<Omit<import("vite").UserConfig, "plugins" | "alias" | "dedupe" | "assetsInclude" | "optimizeDeps"> & {
    configFile: string | undefined;
    configFileDependencies: string[];
    inlineConfig: import("vite").InlineConfig;
    root: string;
    base: string;
    publicDir: string;
    command: "build" | "serve";
    mode: string;
    isProduction: boolean;
    env: Record<string, any>;
    resolve: import("vite").ResolveOptions & {
        alias: import("vite").Alias[];
    };
    plugins: readonly import("vite").Plugin[];
    server: import("vite").ResolvedServerOptions;
    build: Required<Omit<import("vite").BuildOptions, "base" | "polyfillDynamicImport">>;
    assetsInclude: (file: string) => boolean;
    logger: import("vite").Logger;
    createResolver: (options?: Partial<import("vite").InternalResolveOptions> | undefined) => import("vite").ResolveFn;
    optimizeDeps: Omit<import("vite").DepOptimizationOptions, "keepNames">;
}>>;
export declare function getEntryPoint(root?: string, indexHtml?: string): Promise<string>;
