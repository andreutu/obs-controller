<h1 align="center">OBS Controller</h1> 

A locally run web panel that acts as an OBS controller / stream deck, perfect for phones or tablets.

The goal of this project is to provide a self-hosted "stream deck" that users can connect to from their mobile devices with little to no configuration. Customization is also a major focus, giving users full freedom of choosing what options to keep on-hand.

> [!WARNING]
> This project is currently in heavy development. Contributions are not accepted at this time. Features might drastically change.

## Security Notice

The web server is intended to run locally, isolated to the local network. **Do not expose** the application to the public internet through port forwarding.

Keep **password authentication** for the OBS WebSocket **enabled** at all times. You *could* turn it off, but it wouldn't be fun for other people in the household to be able to control your stream...

## Planned Features (in order)

- Start / stop controls for streaming and recording
- Audio controls - levels, muting or unmuting inputs and outputs
- Switching OBS scenes, transitions and their duration
- Grid-like interface with "blocks" that can be added or removed as needed
- Import or export configurations and profiles
- Discord integration for muting and deafening yourself
- System controls (not sure at the moment)

## Structure

```
obs-controller/
├── apps/
│   ├── server  // Fastify backend and API
│   └── web     // React frontend, served by the server
└── packages/
    └── ui      // shadcn component library
```

## Environment

| Variable | Default value | Description |
| -------- | -------------- | ----------- |
| `SERVER_HOST` | `0.0.0.0` | Bind address of the Fastify server. |
| `SERVER_PORT` | `3000` | Port of the Fastify server. |
