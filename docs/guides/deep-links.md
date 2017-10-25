# Deep Linking

For a light-weight alternative to using our API, you can also deep-link into the TripGo app.

## Routing results

`$schema://$host/go?$parameters`

Opens the routing results for the specified destination, and optionally the start and time:

- `flat`, `flng`: Start coordinates. If not specified, the user's current location is used.
- `tlat`, `tlng`: End coordinates. Required, unless `tname` is provided.
- `tname`: Destination as a search string (supports [what3words](http://what3words.com)). Required, unless `tlat` and `tlng` are provided.
- `type`: `0` for leaving ASAP, `1` for leaving after `time`, `2` for arriving by `time`. Required.
- `time`: Query time in seconds since 1970. Required, unless `type` is set to `0`.

Examples:

- iOS: [tripgo:///go?tname=dragon.letter.spoke](tripgo:///go?tname=dragon.letter.spoke)
- Web: [http://tripgo.com/go?tname=dragon.letter.spoke](http://tripgo.com/go?tname=dragon.letter.spoke)

## Destination information

`$schema://$host/meet?$parameters`

Opens the search screen with the destination and arrival time filled in.

- `lat`, `lng`: Coordinate where to meet. Required, unless `name` is provided.
- `name`: Destination as a search string (supports [what3words](http://what3words.com)). Required, unless `lat` and `lng` are provided.
- `time`: Arrival time in seconds since 1970. Required.

Examples:

- iOS: [tripgo:///meet?lat=-33.94501&lng=151.25807&at=1385535734](tripgo:///meet?lat=-33.94501&lng=151.25807&at=1385535734)
- Web: [http://tripgo.com/meet?lat=-33.94501&lng=151.25807&at=1385535734](http://tripgo.com/meet?lat=-33.94501&lng=151.25807&at=1385535734)


## Timetable

`$schema://$host/stop/$region/$stopCode`

Opens the departures timetable for a given stop. `$region` and `$stop` use region codes and stop codes as defined in our API.

Examples:

- iOS: [tripgo:///stop/AU_NSW_Sydney/2035143](tripgo:///stop/AU_NSW_Sydney/2035143)
- Web: [http://tripgo.com/stop/AU_NSW_Sydney/2035143](http://tripgo.com/stop/AU_NSW_Sydney/2035143)
