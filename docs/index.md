# TripGo API

The TripGo API allows you to plan **door-to-door trips** using a large variety of **public and private transport.** It integrates **real-time** information and, for selected providers, allows users to **book and pay** for transport.

---

## Getting started

### 1. Getting an API key

[Get an API key](https://tripgo.3scale.net/signup?plan_ids[]=2357355863999).  For details about pricing and on limits of the free tier, see the [SkedGo website](https://skedgo.com/home/partnerships/tripgo-api/).

Once you have an API key, make sure to send it along with every request as the `X-TripGo-Key` header.

### 2. Getting the base URL

Unfortunately we don't yet have a unified URL for all areas, as failover is expected to be done client-side.  You can get a list of regions and URLs with something like:

```
curl 'https://tripgo.skedgo.com/satapp/regions.json' -H 'Accept: application/json' --compressed -H "X-TripGo-Key: $tripgoKey" -d '{"v":2}'
```

Keep in mind that this API is powered by multiple servers, not all of which cover every region. **You have to use the correct host names for the region that you query**. You get those host names by first querying [`regions.json`](https://skedgo.github.io/tripgo-api/#tag/Configuration%2Fpaths%2F~1regions.json%2Fpost) and looking up the `urls` for that region. You should only cache this information short term as those URLs can change without notice.

### 3. Make a request

Our API can do a lot more than just [directions](https://skedgo.github.io/tripgo-api/#tag/Routing%2Fpaths%2F~1routing.json%2Fget), but if that is what you are interested in, then try something like:

```
curl 'https://granduni-au-nsw-sydney-tripgo.skedgo.com/satapp/routing.json?from=(-33.8593716,151.20766249999997)&to=(-33.86390160000001,151.20846840000002)&departAfter=1532799914&modes[]=wa_wal&v=11&locale=en' -H 'Accept: application/json' --compressed -H "X-TripGo-Key: $tripgoKey" -g
```
Keep in mind that this API is optimised to return a large number of trip results while maintaining small response sizes. This has a number of complications. Notably, to get a trip's segments you need to combine the segment references with the segment templates.

### Before you dive in

Check `FastGo`, our [blog post](https://skedgo.github.io/fastgo-react-native/) and sample app showing one way of using the API.

If you know how to debug a web app, look at the network activity for [our web app](https://tripgo.com/) to get an idea of which API calls to use when.  (Filter for "satapp".)

## API specs

The specifications are available in OpenAPI (formerly Swagger) format. Pick your favorite UI to browse the specs:

- [Swagger UI](https://skedgo.github.io/tripgo-api/swagger/)
- [Swagger editor UI](http://editor.swagger.io/#/?import=http://skedgo.github.io/tripgo-api/tripgo.swagger.yaml)
- [ReDoc](https://skedgo.github.io/tripgo-api/)

---

## Advanced

Once you dig into the API, you'll likely soon want to know more about some of its details.

General:

- [Regions and base URLs](advanced.md#regions-and-base-urls)
- [Mode identifiers explained](advanced.md#mode-identifiers)
- Constructing URLs for images (coming soon)

Routing:

- [Single-modal vs. multi-modal routing](advanced.md#single-modal-vs-multi-modal-routing)
- [Trips, groups, frequencies and templates](advanced.md#trips-groups-frequencies-and-templates)
- [Placeholders in segment templates](advanced.md#placeholders-in-segment-templates)

Locations:

- [Locations, cell IDs and hash codes](advanced.md#locations-cell-ids-and-hash-codes)

---

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
- Web: [http://tripgo.me/go?tname=dragon.letter.spoke](http://tripgo.me/go?tname=dragon.letter.spoke)

## Destination information

`$schema://$host/meet?$parameters`

Opens the search screen with the destination and arrival time filled in.

- `lat`, `lng`: Coordinate where to meet. Required, unless `name` is provided.
- `name`: Destination as a search string (supports [what3words](http://what3words.com)). Required, unless `lat` and `lng` are provided.
- `time`: Arrival time in seconds since 1970. Required.

Examples:

- iOS: [tripgo:///meet?lat=-33.94501&lng=151.25807&at=1385535734](tripgo:///meet?lat=-33.94501&lng=151.25807&at=1385535734)
- Web: [http://tripgo.me/meet?lat=-33.94501&lng=151.25807&at=1385535734](http://tripgo.me/meet?lat=-33.94501&lng=151.25807&at=1385535734)


## Timetable

`$schema://$host/stop/$region/$stopCode`

Opens the departures timetable for a given stop. `$region` and `$stop` use region codes and stop codes as defined in our API.

Examples:

- iOS: [tripgo:///stop/AU_NSW_Sydney/2035143](tripgo:///stop/AU_NSW_Sydney/2035143)
- Web: [http://tripgo.me/stop/AU_NSW_Sydney/2035143](http://tripgo.me/stop/AU_NSW_Sydney/2035143)


---

# Transport Provider Integration

For integrating new transport services into the TripGo app, as well as the TripGo API, please have a look at our [Transport Providers website](https://skedgo.com/home/partnerships/transport-providers/) and get in touch with our team.
