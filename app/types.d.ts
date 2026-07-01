declare module 'json-server' {
  import type { Application, RequestHandler } from 'express';

  interface DbChain {
    sortBy(field: string): DbChain;
    value(): Array<Record<string, unknown>>;
    remove(query: Record<string, unknown>): { write(): void };
  }

  interface Db {
    get(collection: string): DbChain;
  }

  interface JsonServerRouter extends RequestHandler {
    db: Db;
  }

  const jsonServer: {
    create(): Application;
    router(source: string): JsonServerRouter;
    defaults(options?: {
      logger?: boolean;
      readOnly?: boolean;
      bodyParser?: boolean;
      noCors?: boolean;
      static?: string;
    }): RequestHandler;
    bodyParser: RequestHandler;
    rewriter(rules: Record<string, string>): RequestHandler;
  };

  export default jsonServer;
}
