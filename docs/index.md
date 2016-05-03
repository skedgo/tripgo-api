# TripGo Developer

---

## Overview

The TripGo API allows you to plan **door-to-door trips** using a large variety of **public and private transport.** It integrates **real-time** information and, for selected providers, allows users to **book and pay** for transport.

---

## Getting started

### Getting an API key

The API is not yet open to the public. If you would like early access, [please email us](mailto://api@skedgo.com). For details about pricing and on limits of the free tier, see the [SkedGo website](https://skedgo.com/home/partnerships/tripgo-api/).

Once you have an API key, make sure to send it along with every request as the `X-TripGo-Key` header.

### Before you dive in

This API is powered by multiple servers, not all of which cover every region. **You have to use the correct host names for the region that you query**. You get those host names by first querying `regions.json` and looking up the `urls` for that region. You should only cache this information short term as those URLs can change without notice.

This API is optimised to return a large number of trip results while maintaining a small package sizes. This has a number of complications. Notably, to get a trip's segments you need to combine the segment references with the segment templates.

---

## API specs

The specifications are available in OpenAPI (formerly Swagger) format. Pick your favorite UI to browse the specs:

- [Swagger UI](http://skedgo.github.io/tripgo-api/swagger/)
- [Swagger editor UI](http://editor.swagger.io/#/?import=http://skedgo.github.io/tripgo-api/tripgo.swagger.yaml)

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
- Placeholders in segment templates (coming soon)

Locations:

- [Locations, cell IDs and hash codes](advanced.md#locations-cell-ids-and-hash-codes)
