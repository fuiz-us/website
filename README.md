# Fuiz

Host live quizzes freely

<img src="https://gitlab.com/fuiz/website/-/raw/main/static/favicon.svg?ref_type=heads" width="128" height="128" alt="Fuiz icon">

[![License](https://img.shields.io/gitlab/license/fuiz/website?style=for-the-badge)](https://gitlab.com/fuiz/website/-/raw/main/LICENSE)

## Dependencies

This is the code for the website (developed in Svelte). It relies on two other components to function properly:

- Backend game server: Code is open source under [fuiz/hosted-server](https://gitlab.com/fuiz/hosted-server). The urls to it are defined by: PUBLIC_BACKEND_URL and PUBLIC_WS_URL. In production, this uses a serverless version [fuiz/cloudflare-serverless](https://gitlab.com/fuiz/cloudflare-serverless) hosted at [api.fuiz.us](https://api.fuiz.us/).
- Backend image server: Code is open source under [fuiz/corkboard](https://gitlab.com/fuiz/corkboard). The url to it is defined by PUBLIC_CORKBOARD_URL. In production, this uses a similar open source serverless version [fuiz/corkboard-serverless](https://gitlab.com/fuiz/corkboard-serverless) hosted at [corkboard.fuiz.us](https://corkboard.fuiz.us/).

Additionally, the website relies on Cloudflare APIs for viewing the library and basic user authentication and storage. If you want to enable these features you need to use [wrangler](https://github.com/cloudflare/workers-sdk).

Due to the nature of fast development, it's not a goal at the moment to make self-hosting as easy as possible. Once things stabilize a bit more we will put an effort towards providing docker images.

## Developing

After installing dependancies with `bun install`, start a development server:

```bash
bun run dev
```

While we use `bun` ourselves, `npm` should work just as fine.

You might need the following environment variables (`.env.local`):

```bash
# the link to the current hosted version, production: fuiz.org
PUBLIC_DISPLAY_PLAY_URL="localhost:5173"
# same as above but with the actual protocol, production: https://fuiz.org
PUBLIC_PLAY_URL="http://localhost:5173"
# the game backend, production: https://api.fuiz.us
PUBLIC_BACKEND_URL="http://localhost:8787"
# same as above but a websocket url, production: wss://api.fuiz.us
PUBLIC_WS_URL="ws://localhost:8787"
# image server url, in pproduction: https://corkboard.fuiz.us
PUBLIC_CORKBOARD_URL="http://localhost:43907"
```

You might also need:

```bash
# Needed for Auth.js, can be generated with: bunx/npx auth secret
AUTH_SECRET={random string}
# Google Auth Client Id and Secret Key
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

If you're using the library feature, you should also have:

```bash
WALLO_ORIGIN=https://wallo.dev
# From https://wallo.dev
WALLO_CLIENT_ID=
WALLO_CLIENT_SECRET=
```

## Status

The live components' status can be accessed on [status.fuiz.us](https://status.fuiz.us/).
