# Changelog

Changes to the TripGo API that API users and white-label clients may need to know about, newest first. Entries are grouped by the date they reached production. Numbers in brackets are SkedGo's internal ticket references.

<!--
Maintainers: add an entry under a "## Unreleased" heading (create it if needed) in the same PR that documents the change, or in the tripgo-api PR linked from the skedgo-java PR. When the change reaches production, move it under a heading with the release date (YYYY-MM-DD, Sydney time).

Write for API users: what changed, which endpoint, parameter or field, and whether they need to do anything. Lead with Added, Changed, Removed, Fixed or Improved. Leave out internal-only changes, and don't name clients.
-->

## 2026-10-06

- **Changed:** Trips only include `subscribeURL` and `unsubscribeURL` when the request has a `userToken` header, as subscribing requires one. (#26298)
- **Fixed:** `geocode.json` now honours a full `Accept-Language` header such as `de-DE,de;q=0.9`. Before, only a bare language code like `de` worked, and anything else fell back to English. (#26284)
- **Added:** SkedGo can now configure default `ph[<kind>]` values per API key, which apply to all `routing.json` GET requests of that key. A value sent in the request still wins for that kind. (#26090)

## 2026-10-05

- **Fixed:** A request whose `Accept-Language` header wasn't a plain language code (for example `zh-CN,zh-Hans;q=0.9`) could make later requests to the same server fail with HTTP 500. Localised responses also no longer pick up the language of another request. (#26285)

## 2026-10-02

- **Added:** `routing.json` takes new `ph[<kind>]` parameters, for extra _parking hassle_ when travellers park their own car, by where they park: `ph[*]` (anywhere), `ph[pnr]` (Park & Ride), `ph[offstreet]`, `ph[onstreet]` and `ph[garage]`. For example, `ph[*]=10&ph[pnr]=0` demotes driving except to a Park & Ride. Penalised trips are ranked lower, not removed. (#26090)
- **Changed:** Requests for only the traveller's own vehicle (`me_car`, `me_mot`, or their own bicycle or micromobility vehicle) now always return a trip, however short, instead of it losing out to walking. With `allModes=true` these trips are kept too, so the results match making one request per mode. (#26090)

## 2026-09-18

- **Added:** `clients.json` includes dark-mode app colours, `tintColorDark`, `barBackgroundDark` and `barForegroundDark`, in `appColors` where configured. (#26198)
- **Changed:** Taxi bookings made through provider integrations identify the rider to the provider by their short user ID, where they have one.
- **Changed:** When an admin books on behalf of a rider and invoices an organisation, the rider is now added to that organisation. (#21198)

## 2026-09-16

- **Removed:** The `psb` ("payment sandbox") parameter of the booking and payment endpoints is ignored, and payment URLs no longer include it. Whether Stripe runs in test or live mode now depends on the server environment, not on the request.

## 2026-09-14

- **Fixed:** In `departures.json`, real-time data for today's run of a service no longer marks the same service on other days as `IS_REAL_TIME` or `CANCELLED`. (#26087)
- **Changed:** In `departures.json`, services of real-time capable operators that have no real-time data yet now have `realTimeStatus` set to `CAPABLE`, where it used to be missing. Clients can keep checking `latest.json` for these services. (#26166)
- **Removed:** The legacy Stripe webhook endpoint `payment/stripe/webhook` is gone; use `payment/stripe/webhook/v2/{stripeAccount}`. Webhooks are now rejected unless their Stripe signature can be verified. (#25749)

## 2026-09-10

- **Fixed:** Bookings with external on-demand providers can be made up to 5 minutes after the trip's start time, instead of being rejected as in the past. (#26030)

## 2026-09-08

- **Improved:** `agenda/run`: when a user's day is edited several times in a row, only the latest version is computed and superseded runs stop early, so the final agenda is ready sooner. (#25927)

## 2026-08-27

- **Fixed:** `info/routeInfo.json` returns one complete shape for routes that run several loops out of the same stop, or whose loop is split over several patterns, with every stop on the shape and in travel order. Before, only part of such a route was drawn and some stops were far from it. A duplicated last stop was also removed. (#26066, #26088)
- **Fixed:** Rules on whether bicycles may be taken on public transport now apply as each region defines them. This affects `bicycleAccessible` and trips that take a bicycle on public transport, for each region from its next data update. (#26103)
- **Fixed:** Long-distance driving trips no longer make detours around roundabouts, for each region from its next data update. (#26016)

## 2026-08-24

- **Fixed:** On-demand services with zone-based pricing now price pick-ups and drop-offs on a zone's boundary. (#26003)
- **Fixed:** Changing a booking from return to one-way before confirming it no longer leaves the outbound and return bookings linked.

## 2026-08-21

- **Changed:** `service.json` returns HTTP 400 instead of 200 when `region` or `serviceTripID` is missing. (#25970)

## 2026-08-19

- **Changed:** Updated the exchange rates used to compare costs in different currencies, which hadn't been refreshed since 2015. This changes trip ranking where a currency has moved a lot against the US dollar (for example in Argentina, Turkey and Egypt), and `usdCost` in bookings. Prices in local currency are unchanged.

## 2026-08-13

- **Added:** Booking providers can offer several products with different booking rules, such as which days they can be booked. Fare options that can't be booked for the chosen time are left out, and a booking is only refused if none of them can be booked. (#25831)
- **Added:** `clients.json` includes `uiConfig.messages` (`smsDisclaimer` and `categoryDescription`, each with translations) and `profile.riderCategories`, where configured for the app. (#25907)

## 2026-08-05

- **Fixed:** Roads that double as emergency landing strips are no longer left out of the road network. One of these cut the Eyre Highway in Australia, so driving trips along it took huge detours. Applies to each region from its next data update. (#26014)

## 2026-07-09

- **Fixed:** Regions whose public transport feeds use accented characters in station IDs, such as `FR_PAC_RegionSud` and `FR_PDL_Angers`, get timetable updates again. (#25875)

## 2026-07-06

- **Improved:** `locations.json` no longer takes up to half a minute on the first request for a region after a server restart, as shared-vehicle providers are now loaded when the server starts. (#25903)

## 2026-07-02

- **Changed:** `regions.json` lists the main TripGo API URL in every region's `urls`, instead of the URLs of individual servers. The `urls` field is deprecated: send all requests to the main TripGo API host. (#25689)
- **Fixed:** A custom walking (`ws`) or cycling (`cs`) speed of zero, or one that isn't a finite number, now falls back to the default (medium) speed instead of breaking the routing results. (#25888)
