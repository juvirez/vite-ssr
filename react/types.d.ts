/// <reference types="node" />
import type { FunctionComponent, ReactNode } from 'react';
import type { Base, Meta, PagePropsOptions, Renderer } from '../utils/types';
import type { IncomingMessage } from 'connect';
import type { ServerResponse } from 'http';
export declare type RouteRaw = {
    name?: string;
    path: string;
    component: any;
    meta?: Meta;
    routes?: RouteRaw[];
    [key: string]: any;
};
export declare type PropsProvider = FunctionComponent<{
    from?: RouteRaw;
    to: RouteRaw;
    [key: string]: any;
}>;
export declare type Options = {
    routes: RouteRaw[];
    base?: Base;
    debug?: {
        mount?: boolean;
    };
    pageProps?: PagePropsOptions;
    transformState?: (state: any, defaultTransformer: (state: any) => any) => any | Promise<any>;
    suspenseFallback?: ReactNode;
    PropsProvider?: PropsProvider;
    prepassVisitor?: any;
};
export declare type Hook = (params: {
    url: URL | Location;
    router: any;
    isClient: boolean;
    initialState: Record<string, any>;
    request?: IncomingMessage;
    response?: ServerResponse;
    [key: string]: any;
}) => any | Promise<any>;
export declare type ClientHandler = (App: any, options: Options, hook?: Hook) => Promise<void>;
export declare type SsrHandler = (App: any, options: Options, hook?: Hook) => Renderer;
