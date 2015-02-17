# Usage Guide

## What is the radiodan server for?

The radiodan server manages the audio playout system. It starts player
processes, listens for and executes commands, and communicates changes in the
system. A full set of commands and events are listed in the [Message Format
guide](message-format.md).

Once the server is started, you communicate with this server using an
application written with the [radiodan client library][1].

## Installation

The server is written in [Node.js][4]. We're currently testing against the
following branches:

* 0.11
* 0.10

Node.js dependencies can be resolved using `npm install`.

## Dependencies

The server has the following binary dependencies:

* A running [RabbitMQ][2] server, used as a messaging broker with the other apps
  in the system.
* A compatible music player. These players should be installed, but not started
  as a daemon by default.  We currently support:
    * [MPD][3]
    * [Mopidy][5]

## Configuration File

The server requires a config file on start up. This file is written in
[JSON][6].

The following keys can be applied to each player object individually, or as
defaults in a `defaults` key.

### dataPath

Location to store player-related databases, logs, etc. Paths can be absolute or
relative to the location of the config file.

### httpStreaming

Use the players built-in HTTP streaming. Can be useful for creating HTML5 radio
apps. The port will be assigned to the next available on startup.

### outputFormat

The format for playout through speakers. The format is
`<sample rate in hz>:<bits>:<channels>`. The default is
    `44100:16:2`.

### player

The external player type. Defaults to `mpd`. Requires that the matching player
must be supported and installed, as above.

### music

Path to the music files the player can access.

### players

An array of player objects. Player objects can have any of the above attributes
as well as these required keys:

### name

Human-readable description of player name.

### id

Short-form version of player name. Will be used in `pub/sub` requests for in
formation and commands sent by your client apps.

### Example File

```json
{
  "dataPath": "/tmp/.radiodan",
  "defaults": {
    "music": "/media/Music",
    "outputFormat": "44100:16:1",
    "player": "mpd"
  },
  "players": [
    {
      "name": "Main",
      "id": "main",
      "player": "mopidy"
    },
    {
      "name": "Announcer",
      "id": "announcer",
      "music": "../audio"
    }
  ]
}
```

## Environent Variables

The server supports the following environment variables on start-up:

### LOG_LEVEL

Defines the verbosity of logging in the system. Supported levels match those in
currently in npm: `silly, verbose, info, http, warn, error, silent`.

Logger writes to `STDOUT`.

#### PORT

Specifies the http port the server will bind to. Defaults to `5000`.

## Command to start server

`./bin/server <path to config json>`

[1]: https://github.com/radiodan/radiodan-client.js
[2]: http://www.rabbitmq.com/
[3]: http://www.musicpd.org/
[4]: http://nodejs.org
[5]: https://www.mopidy.com/
[6]: http://json.org/
