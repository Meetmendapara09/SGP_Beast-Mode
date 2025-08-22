/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

// Additional type definitions to resolve node_modules errors
declare global {
  // Extend global types to include missing Node.js APIs
  interface AggregateError extends Error {
    errors: Error[];
  }
  
  interface ErrorOptions {
    cause?: unknown;
  }
  
  var AggregateError: {
    prototype: AggregateError;
    new(errors: Error[], message?: string): AggregateError;
  };
}

// Module declarations for missing type definitions
declare module 'VAR_MODULE_GLOBAL_ERROR' {
  const GlobalError: React.ComponentType<any>;
  export default GlobalError;
}

declare module 'react-server-dom-webpack/server' {
  export function createTemporaryReferenceSet(): any;
  export function renderToReadableStream(element: any, options?: any): any;
  export function decodeReply(body: any): any;
  export function decodeAction(body: any): any;
  export function decodeFormState(state: any): any;
}

declare module 'react-server-dom-webpack/static' {
  export function prerender(element: any, options?: any): any;
  export { prerender as unstable_prerender };
}

export {};