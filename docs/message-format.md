## Volume

### radio.<id>.command

Set to an absolute value:

    {
      action: 'volume',
      value:  90
    }

Set using an offset of the current volume:

    {
      action: 'volume',
      diff:  -10
    }

### radio.<id>.volume

    {
      value: 90
    }


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

radio.<id>.command

[
	{
  	action: new-playlist,
  	tracks: [
    	{ <object> },
    	..
  	]
	},
	{
		action: play,
  	seekTime: 3
	}
]

{
	action: add-track-to-playlist,
	position: 5,
  tracks: [
		<TRACK IDENTIFIER>,
  ]
}

radio.<id>.command

{
  action: skip,
	postion: 2
}
