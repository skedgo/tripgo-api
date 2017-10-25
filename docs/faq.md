# General

## Base URLs and regions

> What is the base URL of the API? What, wait... why does it depend on the region?

The way the TripGo API currently works, the base URL for everything except the `regions.json` endpoint depends on the region: 

1. Hit `https://tripgo.skedgo.com/satapp/regions.json`
2. Find the region you’re interested in, e.g., `UK_London`
3. Then use a URL from that regions `urls` as the base URL for all subsequent calls: e.g., `https://hadron-uk-london.tripgo.skedgo.com/satapp/routing.json`

The reason for this is that we have a few servers around the globe, but not every server has every region, and if there’s an error connecting to one server, the clients can switch to the next. (If you want to be fancy, you could also ping each server and directly send requests to the server that's responding the fastest.)

We are currently considering to do that work server-side to make the API easier to use by just having a single base URL for all calls for all regions.

---


## Languages

> Which languages does the API support?

Most text that's returned in the results and meant to be displayed to users has been localised to several languages - Chinese (simplified and traditional), Danish, Dutch, English, German, Italian, Finnish, French, Korean, Portuguese, Spanish.

The translations are done [in the open on Crowdin](https://crowdin.com/project/tripgo) and everyone can contribute, including adding new languages.

One note of causion: Some text, such as line names and status alerts, is provided by transport providers and only available in the languages provided by them.

---


# Routing


## Mode Identifiers

> What are all these peculiar looking strings such as `pt_pub`?

### Syntax

The syntax of the mode string is like this:

`<group>_<mode that makes sense to the user>[_<provider or fine-grained mode>]`

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