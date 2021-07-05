export declare type Meta = {
    propsGetter?: boolean | string;
    state?: Record<string, any> | null;
    [key: string]: any;
};
export declare type Base = (params: {
    url: Location | URL;
}) => string;
export declare type State = Record<string, any>;
export declare type PagePropsOptions = {
    passToPage?: boolean;
};
export declare type Renderer = (url: string | URL, options?: {
    manifest?: Record<string, string[]>;
    preload?: boolean;
    [key: string]: any;
}) => Promise<{
    html: string;
    dependencies: string[];
}>;
