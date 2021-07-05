/// <reference types="node" />
import type { App, Component } from 'vue';
import type { RouteLocationNormalized, RouteLocationRaw, RouterOptions, Router } from 'vue-router';
import type { HeadClient } from '@vueuse/head';
import type { Meta, PagePropsOptions, Renderer } from '../utils/types';
import type { IncomingMessage } from 'connect';
import type { ServerResponse } from 'http';
export declare type ExtendedRouteRaw = RouteLocationRaw & {
    props?: any;
    meta?: Meta;
};
export declare type ExtendedRouteNormalized = RouteLocationNormalized & {
    props?: any;
    meta?: Meta;
};
export declare type Options = {
    routes: ExtendedRouteRaw[];
    base?: (params: {
        url: Location | URL;
    }) => string;
    routerOptions?: Omit<RouterOptions, 'routes' | 'history'>;
    debug?: {
        mount?: boolean;
    };
    pageProps?: PagePropsOptions;
    transformState?: (state: any, defaultTransformer: (state: any) => any) => any | Promise<any>;
};
declare type HookResponse = void | {
    head?: HeadClient;
};
export declare type Hook = (params: {
    app: App;
    url: URL | Location;
    router: Router;
    isClient: boolean;
    initialState: Record<string, any>;
    initialRoute: RouteLocationNormalized;
    request?: IncomingMessage;
    response?: ServerResponse;
    [key: string]: any;
}) => HookResponse | Promise<HookResponse>;
export declare type ClientHandler = (App: Component, options: Options, hook?: Hook) => Promise<void>;
export declare type SsrHandler = (App: Component, options: Options, hook?: Hook) => Renderer;
export {};
