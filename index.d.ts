// This is a generic mix of framework types
import type { IncomingMessage } from 'connect'
import type { ServerResponse } from 'http'

declare module 'vite-ssr' {
  const handler: (
    App: any,
    options: {
      routes: Record<string, any>[]
      base?: (params: { url: URL }) => string
      routerOptions?: Record<string, any>
      head?: any
      debug?: { mount?: boolean }
      transformState?: (
        state: any,
        defaultTransformer: (state: any) => any
      ) => any | Promise<any>
    },
    hook?: (params: {
      url: URL
      app: any
      router: any
      isClient: boolean
      initialState: any
      initialRoute: any
      request?: IncomingMessage
      response?: ServerResponse
      [key: string]: any
    }) => any
  ) => any

  export default handler
  export const ClientOnly: any
}
