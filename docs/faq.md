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

You can get a list of regions by quering [`regions.json`](https://developer.tripgo.com/#tag/Configuration%2Fpaths%2F~1regions.json%2Fpost):

```
curl 'https://api.tripgo.com/v1/regions.json' -H 'Accept: application/json' --compressed -H "X-TripGo-Key: $tripgoKey" -d '{"v":2}'
```

Then extract the polylines from there and match your coordinates to a region. This endpoint also tells you which modes are supported by routing for a given region. 

> I noticed URLs in those regions, how can/should I use those?

Most developer should not need to worry about these and can just use the `api.tripgo.com` domain. However, performance critical application can use this to reduce lag and directly hit the routing servers.

*For advanced users*: This exposes to you that our API is covered by multiple servers - though not every server covers ever region. You can use the URLs to directly query servers covering a certain region – which can be beneficial to reduce lag and is recommended for server-to-server communication. However, be aware that you should add failover from one server to another yourself then, as individual servers can go down unannounced for maintenance. You should only cache this information short term as those URLs can change without notice.

---


# Routing


## Mode Identifiers

> What are all these peculiar looking strings such as `pt_pub`?

### Syntax

The syntax of the mode string is like this:

`<group>_<mode that makes sense to the user>[_<provider or fine-grained mode>][_<line number>]`

### List of groups

* `pt_` is for transit which runs on schedules
* `ps_` is for taxi-like on-demand services
* `me_` is for vehicles you drive yourself
* `cy_` is for cycling
* `wa_` is for walking
* `in_` is for intercity long distance transport

#### `pt_`

* `pt_pub` is "public transit" that is accessible to public
  * `pt_pub_bus`
  * `pt_pub_train`
  * `pt_pub_ferry`
  * `pt_pub_tram`
  * `pt_pub_subway`
  * `pt_pub_monorail`
  * `pt_pub_cablecar`
  * `pt_pub_funicular`
  * `pt_pub_gondola`
* `pt_ltd_SCHOOLBUS` is public transit of limited access (school buses)
  * `pt_ltd_SCHOOLBUS_<line number>` for a specific school bus line

#### `ps_`

* `ps_tax` is for taxis
* `ps_tnc` is for uber and alike (TNC is California's official code for them)
  * `ps_tnc_lyft`
  * `ps_tnc_sidecar`
  * `ps_tnc_uber`
* `ps_shu` is for (airport) shuttles

#### `me_`

* `me_car` is for your own car
* `me_car-s` is for car sharing (like ZipCar or GoGet)
* `me_car-r` is for car rental (like Budget)
* `me_car-p` is for car pooling (like BlaBlaCar)
* `me_mot` is for your own motorbike

---


## Single-modal vs. multi-modal routing

> How do I get these sweet results which combine taxis or other private transport modes with public transport?

You need to specify multiple modes in the `routing.json` requests, e.g., by using `modes=pt_pub&modes=ps_tax`. You can specify a long list of modes as the API will then return suitable combinations for any of those.

> What if I want to get both public-transport-only results and mixed results?

In this case you need to currently send off multiple requests, e.g., if you want public transport, taxi, and combinations of the two, you need to send three requests: one with `modes=pt_pub`, one with `modes=ps_tax`, and one with `modes=pt_pub&modes=ps_tax`.

**The request with multiple modes will only return inter-modal results, no results for individual modes.** A few things to note about this:

1. This is done as inter-modal results can be slower to calculate due to the many combinations to crunch and them being likely to depend on external API calls, slowing things down further.
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