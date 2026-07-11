declare module "cloudflare:workers" {
  export const env: {
    DB?: D1Database;
    [key: string]: unknown;
  };
}

type Fetcher = {
  fetch(input: Request | string, init?: RequestInit): Promise<Response>;
};

type D1Database = unknown;
