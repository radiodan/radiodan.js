# Message Formats

## Available Subcriptions

Clients can subscribe to these subcription channels to recieve the latest data,
on change.

### event.audio.`<id>`

Returns the master volume of the audio device.

### event.radio.`<id>`.playlist

Returns the contents of the current playlist.

### event.radio.`<id>`.player

Returns the state of the player
(random, play state, which song is being played)

### event.radio.`<id>`.volume

Returns the volume of the player.
Note that this is not the volume of the physical device, each player has it's
own volume level.

### event.radio.`<id>`.database.modified

Returns statistics on the contents of the music database, if the database has
been modified. Typically triggered by a `database.update` command.

### event.radio.`<id>`.database.update.start

The database has started to be refreshed.

### event.radio.`<id>`.database.update.end

The database has finished updating. If new data has been found, the
`database.modified` event will also be triggered.

## Feedback to commands

Every client that issues commands connects to the `radiodan-command-reply`
exchange.  Replies are sent back through this exchange for each command sent.
Any errors will be populated with an error object, otherwise `false`.

    {
      correlation_id: <id of sent message>,
      error: <false / error object>,
      response: <response object>
    }

Response is only set if error is false.

# Discovery

### command.discover.`<type>`

This command allows introspection within the current server.

Available types:

* player

    [
      {
        "name": "First player",
        "id":   "player1"
      }
    ]

# Audio

## Volume

### command.audio.`<id>`

Set to an absolute value:

    {
      value:  90
    }

Set using an offset of the current volume:

    {
      diff:  -10
    }

# Player

## Play

### command.radio.`<id>`

Start playing the current playlist

    {
      action: 'player.play',
      position: <integer>
    }

`position` is an optional argument of the position in the playlist to start
playing.

## Next

### command.radio.`<id>`

    {
      action: 'player.next'
    }

## Previous

### command.radio.`<id>`

    {
      action: 'player.previous'
    }

## Seek

### command.radio.`<id>`

    {
      action: 'player.seek',
      time: <integer/offset>,
      position: <integer>
    }

Position is optional, or else will seek to current track.
Time can be an absolute value to seek to.
Time can be an offset (starts with +/-) if seeking on current track.

## Stop

### command.radio.`<id>`

    {
      action: 'player.stop'
    }

## Volume

### command.radio.`<id>`

Set to an absolute value:

    {
      action: 'player.volume',
      value:  90
    }

Set using an offset of the current volume:

    {
      action: 'player.volume',
      diff:  -10
    }

### event.radio.`<id>`.volume

    {
      value: 90
    }

## Repeat

### command.radio.`<id>`

    {
      action: 'player.repeat',
      value: <true|false>
    }

## Random

### command.radio.`<id>`

    {
      action: 'player.random',
      value: <true|false>
    }

## Pause

### command.radio.`<id>`

    {
      action: 'player.pause',
      value: <true|false>
    }

# Playlist

## Add

### command.radio.`<id>`

    {
      action: 'playlist.add',
      playlist: [
        '<file-path>',
        '<url>'
      ],
      clear: <true|false>
    }

`clear`: clear the existing playlist

## Load

Appends the content of the given playlist to the player's current playlist

### command.radio.`<id>`

    {
      action: 'playlist.load',
      playlist: [
        '<file-path>',
        '<url>'
      ],
      clear: <true|false>
    }

`clear`: clear the existing playlist before loading

## Clear

### command.radio.`<id>`

    {
      action: 'playlist.clear'
    }

## Delete

### command.radio.`<id>`

    {
      action: 'playlist.delete',
      position: <integer>,
      start: <integer>,
      end: <integer>
    }

Must specify *either* a range (start & end) or position.

## Move

### command.radio.`<id>`

    {
      action: 'playlist.delete',
      from: <integer>,
      start: <integer>,
      end: <integer>
      to: <integer>
    }

Moves track(s) to specificed destination.
Must specify *either* a range (start & end) or position.

# Database

## Search

    {
      action" 'database.search',
      <term>: <value>
    }

Any number of valid search terms with string values are accepted.

Valid search terms:

    artist album title track name genre date
    composer performer comment disc filename any

## Update

### command.radio.`<id>`

    {
      action: 'database.update',
      force: <true|false>,
      path: '<file-path>'
    }

`force` checks all files for ID3 tag updates, otherwise new/modified files are
checked.

# Device

## Shutdown

### command.device.shutdown
    {
      action: '<shutdown|restart>'
    }

Shutsdown the `radiodan` device, if the
[`Cease`](https://github.com/radiodan/cease/) service is running with
sufficient permissions. The `restart` action will restart the device.

## Ideas

radio.`<id>`.playlist.info

{
  type: playlist,
  position: 529,
  seekTime: 56,
  tracks: [
    { <object> },
    ...
  ]
}
