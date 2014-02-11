# Message Formats

## Feedback to commands

Every client that issues commands connects to the `radiodan-command-reply`
exchange.  Replies are sent back through this exchange for each command sent.
Any errors will be populated with an error object, otherwise `false`.

    {
      correlation_id: <id of sent message>,
      error: <false / error object>
    }

# Player

## Volume

### radio.<id>.command

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

### radio.<id>.volume

    {
      value: 90
    }

# Playlist

## Add

### radio.<id>.command

    {
      action: 'playlist.add',
      playlist: [
        '<file-path>',
        '<url>'
      ],
      clear: <true|false>
    }

`clear`: clear the existing playlist

# Database

## Update

### radio.<id>.command

    {
      action: 'database.update',
      force: <true|false>, 
      path: '<file-path>'
    }

`force` checks all files for ID3 tag updates, otherwise new/modified files are checked.

## Ideas

radio.<id>.playlist.info

{
	type: playlist,
  position: 529,
	seekTime: 56,
  tracks: [
		{ <object> },
    ...
  ]
}
