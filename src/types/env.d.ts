declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT: string;

    POSTGRES_HOST: string;
    POSTGRES_USER: string;
    POSTGRES_DB: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_PORT: string;
  }
}
