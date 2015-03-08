# Message Format

## Available Subcriptions

Clients can subscribe to these subcription channels to recieve the latest data,
on change.

### event.audio.`<id>`

Returns the master volume of the audio device.

### event.player.`<id>`.playlist

Returns the contents of the current playlist with associated metadata. This metadata may differ depending on the item type (e.g. IP streams and local files).

```json
[
  {
    "file": "The Field/01 Is This Power.mp3",
    "Last-Modified": "2011-10-06T15:51:42Z",
    "Time": "517",
    "Artist": "The Field",
    "Album": "Looping State of Mind",
    "Title": "Is This Power",
    "Track": "01/07",
    "Pos": "0",
    "Id": "12"
  },
  {
    "file": "http://media.ic.example.com/stream/media_stream",
    "Title": "No Title",
    "Pos": "1",
    "Id": "13"
  }
]
```

### event.player.`<id>`.player

Returns the state of the player
(random, play state, which song is being played)

```json
{
  "volume": "100",
  "repeat": "0",
  "random": "0",
  "single": "0",
  "consume": "0",
  "playlist": "30",
  "playlistlength": "2",
  "mixrampdb": "0.000000",
  "state": "play",
  "song": "0",
  "songid": "16",
  "time": "1:560",
  "elapsed": "0.976",
  "bitrate": "192",
  "audio": "44100:16:2",
  "nextsong": "1",
  "nextsongid": "17"
}
```

### event.player.`<id>`.volume

Returns the volume of the player. Note that this is not the volume of the
physical device, each player has it's own volume level.

```json
{
  "volume": "20"
}
```

### event.player.`<id>`.database.modified

Triggers when the database has been updated and the update has resulted in modifications. Typically triggered by a `database.update` command.

```json
{}
```

### event.player.`<id>`.database.update.start

The database has started to be refreshed.

```json
{}
```

### event.player.`<id>`.database.update.end

The database has finished updating. If new data has been found, the
`database.modified` event will also be triggered.

```json
{}
``

## Feedback to commands

Every client that issues commands connects to the `radiodan-command-reply`
exchange.  Replies are sent back through this exchange for each command sent.
Any errors will be populated with an error object, otherwise `false`.

```json
{
  "correlation_id": <id of sent message>,
  "error": <false / error object>,
  "response": <response object>
}
```

Response is only set if error is false.

# Discovery

### command.discover.`<type>`

This command allows introspection within the current server.

Available types:

* player

```json
[
  {
    "name": "First player",
    "id":   "player1"
  }
]
```
# Audio

## Volume

### command.audio.`<id>`

Set to an absolute value:

```json
{
  "value":  90
}
```
Set using an offset of the current volume:

```json
{
  "diff":  -10
}
```

# Player

## Play

### command.player.`<id>`

Start playing the current playlist

```json
{
  "action": 'player.play',
  "position": <integer>
}
```

`position` is an optional argument of the position in the playlist to start
playing.

## Next

### command.player.`<id>`

```json
{
  "action": "player.next"
}
```

## Previous

### command.player.`<id>`

```json
{
  "action": "player.previous"
}
```

## Seek

### command.player.`<id>`

```json
{
  "action": "player.seek",
  "time": <integer/offset>,
  "position": <integer>
}
```

Position is optional, or else will seek to current track.
Time can be an absolute value to seek to.
Time can be an offset (starts with +/-) if seeking on current track.

## Stop

### command.player.`<id>`

```json
{
  "action": "player.stop"
}
```

## Volume

### command.player.`<id>`

Set to an absolute value:

```json
{
  "action": "player.volume",
  "value":  90
}
```

Set using an offset of the current volume:

```json
{
  "action": "player.volume",
  "diff":  -10
}
```

### event.player.`<id>`.volume

```json
{
  "volume": 90
}
```

## Repeat

### command.player.`<id>`

```json
{
  "action": "player.repeat",
  "value": <true|false>
}
```

## Random

### command.player.`<id>`

```json
{
  "action": "player.random",
  "value": <true|false>
}
```

## Pause

### command.player.`<id>`

```json
{
  "action": "player.pause",
  "value": <true|false>
}

# Playlist

## Add

### command.player.`<id>`

```json
{
  "action": "playlist.add",
  "playlist": [
    "<file-path>",
    "<url>"
  ],
  "clear": <true|false>
}
```

`clear`: clear the existing playlist

## Load

Appends the content of the given playlist to the player's current playlist

### command.player.`<id>`

```json
{
  "action": "playlist.load",
  "playlist": [
    "<file-path>",
    "<url>"
  ],
  "clear": <true|false>
}
```

`clear`: clear the existing playlist before loading

## Clear

### command.player.`<id>`

```json
{
  "action": "playlist.clear"
}
```

## Delete

### command.player.`<id>`

```json
{
  "action": "playlist.delete",
  "position": <integer>,
  "start": <integer>,
  "end": <integer>
}
```

Must specify *either* a range (start & end) or position.

## Move

### command.player.`<id>`

```json
{
  "action": "playlist.delete",
  "from": <integer>,
  "start": <integer>,
  "end": <integer>
  "to": <integer>
}
```

Moves track(s) to specificed destination.
Must specify *either* a range (start & end) or position.

# Database

## Search

```json
{
  "action" "database.search",
  <term>: <value>
}
```

Any number of valid search terms with string values are accepted.

Valid search terms:

```ruby
artist album title track name genre date
composer performer comment disc filename any
```

## Update

### command.player.`<id>`

```json
{
  "action": "database.update",
  "force": <true|false>,
  "path": "<file-path>"
}
```

`force` checks all files for ID3 tag updates, otherwise new/modified files are
checked.

# Device

## Shutdown

### command.device.shutdown

```json
{
  "action": "<shutdown|restart>"
}
```

Shutsdown the `radiodan` device, if the
[`Cease`](https://github.com/radiodan/cease/) service is running with
sufficient permissions. The `restart` action will restart the device.

## Ideas (TBA)

radio.`<id>`.playlist.info

```json
{
  "type": playlist,
  "position": 529,
  "seekTime": 56,
  "tracks": [
    { <object> },
    ...
  ]
}
```
