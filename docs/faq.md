# General

## Languages

> Which languages does the API support?

Most text that's returned in the results and meant to be displayed to users has been localised to several languages - Chinese (simplified and traditional), Danish, Dutch, English, German, Italian, Finnish, French, Korean, Portuguese, Spanish.

The translations are done [in the open on Crowdin](https://crowdin.com/project/tripgo) and everyone can contribute, including adding new languages.

One note of causion: Some text, such as line names and status alerts, is provided by transport providers and only available in the languages provided by them.

---

## Regions

> What are regions?

Our API splits the world into several pieces, which we call regions. Several endpoints require you to pass along a region code, e.g., because identifiers might be duplicated around the world.

You can get a list of regions by quering [`regions.json`](/#tag/Configuration%2Fpaths%2F~1regions.json%2Fpost):

```
curl 'https://api.tripgo.com/v1/regions.json' -H 'Content-Type: application/json' --compressed -H "X-TripGo-Key: $tripgoKey" -d '{"v":2}'
```

Then extract the polylines from there and match your coordinates to a region. This endpoint also tells you which modes are supported by routing for a given region. 

> I noticed URLs in those regions, how can/should I use those?

Most developer should not need to worry about these and can just use the `api.tripgo.com` domain. However, performance critical application can use this to reduce lag and directly hit the routing servers.

*For advanced users*: This exposes to you that our API is covered by multiple servers - though not every server covers ever region. You can use the URLs to directly query servers covering a certain region – which can be beneficial to reduce lag and is recommended for server-to-server communication. However, be aware that you should add failover from one server to another yourself then, as individual servers can go down unannounced for maintenance. You should only cache this information short term as those URLs can change without notice.

---

## Health check

> How can I check whether the service is working?

You can to that by querying our [`regions.json`](/#tag/Configuration%2Fpaths%2F~1regions.json%2Fpost) endpoint, adding the `X-TripGo-HealthCheck` header:

```bash
curl 'https://api.tripgo.com/v1/regions.json' -H "X-TripGo-Key: $tripgoKey" -H "X-TripGo-HealthCheck: true"
```

If the health-check passed, you'll get a 200 OK back with the following body:

```json
{"healthCheckPassed": true}
```

These requests are free of charge.

---

## Map Data

> Which Map Data Layer do you use?

Our platform uses OSM ([Open Street Map](https://www.openstreetmap.org)) for the underlying map data, and this information is used when we calculate routes (mainly for private transport modes). This data affects, for example, how we decide what routes are faster, the shapes of the resulting trips for roads, paths and cycleways, among others.
We can also integrate other data layers (such as [Here](https://www.here.com/)) upon request. If you want to use other data layer than OSM, please get in touch with our team [by mail](mailto:api@skedgo.com) or on [Slack](http://slack.tripgo.com/) (by [self-invite](http://slackin.tripgo.com/)). 

> But I see Google Maps in TripGo apps

TripGo Android app and our web app use [Google Maps](https://developers.google.com/maps/documentation/) to display information on the map, whereas the TripGo iOS app uses [Apple Maps](https://developer.apple.com/maps/). 
Note, however, that this is different from the map data used by the platform to calculate routes. Google or Apple Maps are the visual map used by front-end apps to display trips and locations to the end user.
It is up to the front-ends to decide which mapping UI SDK to use. It is important to note that different mapping UIs may have restrictions in their licensing terms which other APIs and services can be used to display on and alongside those maps.

---

# Routing


## Mode Identifiers

> What are all these peculiar looking strings such as `pt_pub`?

### Syntax

The syntax of the mode string is like this:

`<group>_<mode that makes sense to the user>[_<provider or fine-grained mode>][_<line number>]`

### List of groups

*Warning*: This list can expand at any time when types of transport are added to SkedGo's backend, so if you hard-code how to interpret these identifiers, make sure to handle it gracefully if the API returns an identifier that you haven't yet seen.

* `pt_` is for transit which runs on schedules
* `ps_` is for taxi-like on-demand services
* `me_` is for vehicles you drive yourself
* `cy_` is for cycling **Deprecated (use `me_mic_` instead)**
* `wa_` is for walking and similar (e.g., wheelchair)
* `in_` is for intercity long distance transport
* `stationary_` is for stationary segments in between transport segments

#### `pt_`

* `pt_pub` is "public transit" that is accessible to the general public
  * `pt_pub_bus`
  * `pt_pub_cablecar`
  * `pt_pub_carferry`
  * `pt_pub_coach`, long-distance buses
  * `pt_pub_expressbus`
  * `pt_pub_ferry`
  * `pt_pub_funicular`
  * `pt_pub_gondola`
  * `pt_pub_metro`, similar to subway but also going overground
  * `pt_pub_monorail`
  * `pt_pub_regionaltrain`, e.g., inter-city trains
  * `pt_pub_subway`
  * `pt_pub_train`, primarily local/commuter trains
  * `pt_pub_tram`
* `pt_ltd_SCHOOLBUS` is public transit of limited access (school buses)
  * `pt_ltd_SCHOOLBUS_<line number>` for a specific school bus line

#### `ps_`

* `ps_drt` is for demand-responsive transport
  * `ps_tnc_{provider}` to enable just a specific provider, e.g., `ps_tnc_lyft`
* `ps_tax` is for taxis
* `ps_tnc` is for ride-hailing (TNC is California's official code for them)
  * `ps_tnc_{provider}` to enable just a specific provider, e.g., `ps_tnc_lyft`

#### `me_`

* `me_car` is for your own car
* `me_car-s` is for car sharing (like ZipCar or GoGet)
* `me_car-r` is for car rental (like Budget)
* `me_car-p` is for car pooling (like BlaBlaCar)
* `me_mot` is for your own motorbike
* `me_mic` is for your own micro-mobility
  * `me_mic_bic`, regular _bic_ycle
  * `me_mic_fold-bic`, _fold_ing/portable _bic_ycle that will be taken on any public transport mode, and will be taken all the way to the destination
  * `me_mic_e-sco`, _e-sco_oter up to 25 km/h. Portable, allowed on cycle lanes in general, except specific rules in certain countries
  * `me_mic_fast-e-sco`, _fast_ _e-sco_oter up to 45 km/h. Portable, not allowed on cycle lanes in general, except specific rules in certain countries
* `me_mic-s` is for shared micro-mobility, e.g., bike-sharing or scooter-sharing

#### `stationary_`

* `stationary_parking-onstreet` is for parking a vehicle on-street
* `stationary_parking-offstreet` is for parking a vehicle in an off-street location
* `stationary_wait` is a buffer for waiting for the following transport, e.g., waiting for a taxi or ride share to show up, but *not* for transferring between timetable-based public transport segments which get the special identifier below.
* `stationary_transfer` is for transferring between timetable-based public transport segments, often following a walk; note: you only get this if there are at least two public transport segments in a trip.
* `stationary_vehicle-collect` is for picking up a shared vehicle
* `stationary_vehicle-return` is for returning a shared vehicle
* `stationary_airport-checkin` is for checking in at an airport
* `stationary_airport-checkout` is for "checking out" off an airport, e.g., for picking up luggage and going through immigration
* `stationary_airport-transfer` is for transferring between flights at an airport

---


## Single-modal vs. multi-modal routing

> How do I get these sweet results which combine taxis or other private transport modes with public transport?

You need to specify multiple modes in the `routing.json` requests, e.g., by using `modes=pt_pub&modes=ps_tax`. You can specify a long list of modes as the API will then return suitable combinations for any of those.

> What if I want to get both public-transport-only results and mixed results?

**By default the request with multiple modes will only return inter-modal results, no results for individual modes.**

The *preferred* way is to send off separate requests, e.g., if you want public transport, taxi, and combinations of the two, you need to send three requests: one with `modes=pt_pub`, one with `modes=ps_tax`, and one with `modes=pt_pub&modes=ps_tax`.

Alternatively, you can send the optional `allModes=true` with the request that has all the modes. In that case a single request is sufficient to get all the single-modal and inter-modal results, but use this with caution as by the notes below.

A few things to note:

1. It is preferred to send separate per-mode requests as some modes depend on external API calls, which slow things down.
2. Inter-modal results are generally not as fast to calculate due to the many combinations to crunch and them being likely to depend on *multiple* external API calls.
2. By having the inter-modal request not returning single-modal results, you don't need to do any duplicate detection between the results of the different calls as they are mutually exclusive.
3. You'll only get such inter-modal combinations where that combination is better in some way than using any individual mode by itself. It is therefore quite common that inter-modal requests result in an empty response.

---


## Trips, groups, frequencies and templates

> What is the logic behind trip groups and what does the frequency property mean?

Each group is one way of getting from A to B. Each trip in a group is taking the same modes, and similar stops and tickets. They can take different services and different platforms, but overall they are all the same way of getting where you want to go, just at different times.

Frequency is related to this. It's the average frequency for how often such trips in a group run. It's an indication of how long you'd need to wait if you missed a trip in that group.

In our UI, for showing alternative ways of getting from A to B, we display a list of trip groups and for each trip group we display a "representative" trip, which is the one that fits the query the best. That's the trip in the trip group with the lowest `weightedScore`.

> Why are segments split into references and templates?

This is related to trip groups: Trips in those groups often vary in just a few components but often take the same way or share other properties. The shared properties live in the templates while the properties that typically vary between trips live in the references. This can significantly cut down the size of the results and, thus, also the parsing speed on the client.

---

## Trips results

> Why do I get trips that don't start or end at the requested coordinates?

The routing results snap to the road/footpath network. So if your requested coordinates don't fall on a the network, the trips that you get will start/end at the nearest location of the road/footpath network.

The start of a trip, depends on the available modes. If the query is for driving, they will start at nearest road that allows driving, while trips that allow walking (or cycling) will start at the nearest footpath. This means that if you request multiple different modes, the trips might start at different locations, depending on the modes used in the trip.

The end of a trip will snap to the nearest footpath, i.e., driving trips might end with parking and then a walk.

> Why do I get trips with the first segment of a trip already in the past?

When you have a trip group, you will get trips departing before the best one matching the query. 
What you should do is, grey it out in the UI and don't select it by default (the weighted score is a good indicator for this).

Note that you can even get a trip group only with a trip in the past, e.g., if you queried for 12:15am and the last ferry left at 12:10.

> Why do I get trips having segments that "go back in time" and result in arriving after the depart of the next one?
  
There may be cases where a segment of a trip is delayed, and due to realtime updates, the trip gets negative waiting times,  e.g., a bus is delayed by 5 minutes and the trip had a connection of 2 minutes to take a train.

These cases should be handled by the app, either by alerting the user, by recomputing the trip, or by any other measure you consider appropriate.  

> Why do I get trips that don't start or end at the exact coordinates that I requested?

This is expectd and intentional. Our routing engine can only route from a point on the transport network to another point on the transport network. If the requested coordinates aren't on the transport network, it looks for the closest point on the transport network to snap to and route between them. This is made explicit in the routing results which return the query inputs and also for each trip where it started and ends.

This also explains why some short distance routings requests don't return anything. Information on that level might not be available, and routing starts and ends at practically at effectively the same location, resulting in nothing to return.

Imagine you drop a pin in the middle of a lake. Our routing engine routes to the closest point along a footpath to that point, and the trips terminate there. Requesting a walk from there to the middle of the lake wouldn't return anything. The same applies to parks or routing to the middle of a block where there's no additional information in OpenStreetMap.

You can indicate this in your UI by drawing a hop or dashed line between the requested coordinates and where the trip starts or ends.

Note the `fromStreetName` and `toStreetName` input parameters which let you bias which streets our routing engine should snap to. Say, a user typed in "15 Main St" into your app, which your geocoding service turns into a point coordinate in the middle of a block which is actually closer to somewhere on "2nd St". Our route would start on "2nd St". If you provide "Main St" as the `fromStreetName`  parameter, it'll tell our routing engine to prefer to start on nearby streets of that name, even if they aren't the closest in a straight-line distance.

---

## Placeholders in segment templates

> What are all the possible values for placeholders and how should they get interpreted?

In order to use segment templates for multiple similar segments, the `notes` and `action` fields of a segment templates use placeholders, which should be filled it at run-time with the information from the segment template, and potentially updated with real-time data.

- `<NUMBER>`: Placeholder for the number of short name of the transit service, e.g., `segment.serviceNumber`.
- `<LINE_NAME>`: Placeholder for the long name of the transit service, e.g., `segment.serviceName`.
- `<DIRECTION>`: Placeholder for the direction of the transit service, e.g., `segment.serviceDirection`.
- `<LOCATIONS>`: Placeholder for the start and end location of the segment, e.g., `segment.start -> segment.end`.
- `<PLATFORM>`: Placeholder for the embarkation platform of the transit service, e.g., `segment.platform`.
- `<STOPS>`: Placeholder for the number of stops that a transit service takes from the start to the end of the segment (including the disembarkation, but excluding the embarkation stop), e.g., `segment.stops`.
- `<TIME>`*: Placeholder for the departure time of the segment, e.g., `segment.startTime` formatted as a time. Note that this can directly follow a `<NUMBER>` template, so you might have to add spacing. 
- `<DURATION>`*: Placeholder for the total duration of the segment, e.g., `segment.endTime - segment.startTime` formatted as a duration string.
- `<TRAFFIC>`: (Badly named) placeholder for the total duration *without* traffic of the segment, e.g., `segment.durationWithoutTraffic` formatted as a duration string.

`*`: Should be updated with real-time data.

---

## Advanced Routing Features

> How does `wheelchair` flag in true affect the resulting trips?

There are three possible scenarios for public services, public stops, and paths: we know they are wheelchair accessible, we know they are not wheelchair accessible, or we don't have information about them. When the `wheelchair` flag is on, our routing engine will try to avoid services, stops and paths that are known by us to be inaccessible. In addition, we'll change 'walking' instructions to 'rolling' instructions, and indicate which sections are accessible, inaccessible or unknown.

>  What's the `action` field in the alerts for?

Sometimes we get real-time data that may change the accessibility status for public stops, 
for example when a lift is temporarily out of service in a train station. In these cases, 
we provide a mechanism that allows to identify the problem and send a re-route request 
specifically asking to avoid the stop(s) that have become inaccessible.

If the embark/disembark stop of a public segment has issues, then we'll associate that 
segment with an alert describing the issue and containing a special `action` field of 
type `rerouteExcludingStops` which provides a list of the affected stop codes. Then if 
you want to get a new set of results avoiding those stops, you can add the `avoidStops` 
parameter to your original routing request, using the stop codes provided in the alert 
action field, and re-send it.

**Note** that this new request will only avoid the stops you specifically indicated with the 
`avoidStops` parameter, so your new set of results may again include an alert for a different
stop that also has issues. So you may want to send a third request asking to avoid this
one too, but it's important that you include all of them in the `avoidStops` list, or 
otherwise you'll get again the stops that were first excluded.

---


# Locations

## Locations, cell IDs and hash codes

> What are the cell IDs in the `locations.json` endpoint?

The way map regions are specified takes a bit of getting used to but it's worth it, as it allows caching results on the client, while frequently calling this endpoint to make sure the local data is update without requiring a lot of data overhead (and having most of the logic on the server). This works by splitting the world into individual cells which get an identifier which represents the south-west corner as `$(lat*cellsPerDegree)#$(lng*cellsPerDegree)`.


> Got it. And `cellIDHashCodes`?

You typically call `locations.json` with the cell IDs, but if you want to cache this information on the client, then, later, you'll want to use `cellIDHashCodes` as the input. Here you, again, send the cell IDs but this time with the hash codes for each cell from the previous output. You'll then only get content for cells if their content changed.

---

### Example

Let's say, you want the minor stops around CBD of Sydney, Australia. You'll first request:

    {
      "region": "AU_NSW_Sydney",
      "level": 2,
      "cellIDs": [
        "-2540#11339",
        "-2540#11340",
        "-2540#11341",
        "-2541#11339",
        "-2541#11340",
        "-2541#11341",
        "-2542#11339",
        "-2542#11340",
        "-2542#11341"
      ]
    }

You'll then get results:

    {
      "groups": [
        {
          "hashCode": 690784261,
          "key": "-2540#11339",
          "stops": [...]
        },
        {
          "hashCode": -1940969928,
          "key": "-2540#11340",
          "stops": [...]
        }
      ]
    }

You can then cache these and later on request again for changes by supplying `cellIDHashCodes`:

    {
      "region": "AU_NSW_Sydney",
      "level": 2,
      "cellIDHashCodes": {
        "-2540#11339": 690784261,
        "-2540#11340": -1940969928
      }
    }

Which will then only return any groups that have changed. If nothing changed, you'll just get back:

    {
      "groups": []
    }

---

**Note**: You can do the same thing for the major stations of level 1. In that case the cell ID is typically the code of the region itself:

    {
      "region": "AU_NSW_Sydney",
      "cellIDHashCodes": {
        "AU_NSW_Sydney": 1096794422
      }
    }
