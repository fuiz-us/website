# Fuiz

Host live quizzes freely

<img src="https://gitlab.com/opencode-mit/fuiz-website/-/raw/main/static/favicon.svg?ref_type=heads" width="128" height="128" alt="Switcheroo icon">

[![License](https://img.shields.io/gitlab/license/opencode-mit/fuiz?style=for-the-badge)](https://gitlab.com/opencode-mit/fuiz/-/raw/main/LICENSE)

## Dependencies

This is the code for the website (developed in Svelte). It relies on two other components to function properly:

- Backend game server: Code is open source under [opencode-mit/fuiz](https://gitlab.com/opencode-mit/fuiz). The urls to it are defined by: PUBLIC_BACKEND_URL and PUBLIC_WS_URL. In production, this is [api.fuiz.us](https://api.fuiz.us/).
- Backend image server: Code is open source under [opencode-mit/corkboard](https://gitlab.com/opencode-mit/corkboard). The url to it is defined by PUBLIC_CORKBOARD_URL. In production, this is [corkboard.fuiz.us](https://corkboard.fuiz.us/).

Additionally, the website relies on Cloudflare APIs for viewing the library. Since this is not a core component of the website, we will be putting off its proper documentation.

Due to the nature of fast development, it's not a goal at the moment to make self-hosting as easy as possible. Once things stabilize a bit more we will put an effort towards providing docker images.

## Developing

After installing dependancies with `bun install`, start a development server:

```bash
bun run dev
```

While we use `bun` ourselves, `npm` should work just as fine.

## Status

The live components' status can be accessed on [status.fuiz.us](https://status.fuiz.us/).
