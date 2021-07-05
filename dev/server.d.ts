/// <reference types="node" />
import type { ServerResponse } from 'http';
import connect from 'connect';
import { InlineConfig, ViteDevServer } from 'vite';
export declare type SsrOptions = {
    plugin?: string;
    ssr?: string;
    getRenderContext?: (params: {
        url: string;
        request: connect.IncomingMessage;
        response: ServerResponse;
        resolvedEntryPoint: Record<string, any>;
    }) => Promise<any>;
};
export declare const createSSRDevHandler: (server: ViteDevServer, options?: SsrOptions) => connect.NextHandleFunction;
export default function createSsrServer(options?: SsrOptions & InlineConfig): Promise<{
    listen(port?: number | undefined): Promise<void>;
}>;
