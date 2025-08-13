# Monaco Integration

## Setup

- ```npm install``` in both `editor-client` and `copilot-server` directories.
- in `copilot-server` copy the `.env.example` to `.env` and set the `AI_API_KEY` variable.
    - only Mistral AI seems supported for the copilot library

## Start

- Start the server with `npm run dev` in the `copilot-server` directory.
- Start the client with `npm run dev` in the `editor-client` directory.