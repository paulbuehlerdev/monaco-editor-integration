declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AI_API_KEY: string;
    }
  }
}

export {}
