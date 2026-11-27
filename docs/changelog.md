# Changelog

Changes to the TripGo API that API users and white-label clients may need to know about, newest first. Entries are grouped by the date they reached production. Numbers in brackets are SkedGo's internal ticket references.

<!--
Maintainers: add an entry under a "## Unreleased" heading (create it if needed) in the same PR that documents the change, or in the tripgo-api PR linked from the skedgo-java PR. When the change reaches production, move it under a heading with the release date (YYYY-MM-DD, Sydney time).

Write for API users: what changed, which endpoint, parameter or field, and whether they need to do anything. Lead with Added, Changed, Removed, Fixed or Improved. Leave out internal-only changes, and don't name clients.
-->

## Unreleased

- **Added:** `routing.json` takes `cm`, the maximum cycling duration in minutes, like `wm` for walking. It applies to bicycles, the traveller's own or shared, but not to other micromobility. (#25710)
- **Fixed:** The maximum walking duration `wm` now also applies to walking to and from taxis. (#25630)
- **Fixed:** `routing.json` GET requests apply whole-number parameters sent with a decimal point, such as `wm=20.0`. Before, such values were ignored and the default used, which for `wm` means no walking limit. TripKit sends `wm` this way.
- **Fixed:** Some motorway sections were missing from the road network, so driving trips along them took long detours. Applies to each region from its next data update. (#26587)
- **Fixed:** Some TransLink services in South East Queensland (`AU_QLD_Southern`) got no real-time, or real-time for only part of the trip, when TransLink's feed sent their stop times out of order. They now take real-time like other services. (#22052)
- **Fixed:** `departures.json` includes real-time predictions that come from an operator's own real-time service rather than a GTFS-RT feed, such as in Leicester (`GB_ENG_Leicester`). Those departures now have `realTimeDeparture` and report `realTimeStatus: IS_REAL_TIME`; before, they only had timetable times and `CAPABLE`. The first request for a departure can still come back without the prediction while it's fetched; later requests include it. (#26537)
- **Fixed:** Where a region's vehicle positions and real-time predictions come from separate sources, `departures.json`, `latest.json` and trips report `realTimeStatus: IS_REAL_TIME` for services with a predicted time, and `CANCELLED` for services cancelled in real time. Before, the status could stay `CAPABLE` or be left out even though a predicted time was returned, and such cancellations could be missed. (#26537)

## 2026-11-22

- **Added:** La Rochelle (`FR_NAQ_LaRochelle`) includes Yélo, the city's urban network. (#26575)

## 2026-11-21

- **Fixed:** Requesting `departures.json` with a different spelling of a parent stop's code, such as lower case, no longer changes the code that `locationInfo.json`, `routeInfo.json` and later `departures.json` responses return for that stop. `departures.json` now always returns the parent's own code in `parentStops`, which can differ in case from the requested code. The `departures.json` docs now describe `parentStops` and how to match a requested parent stop to the `embarkationStops` of its children. (#26118)
- **Improved:** NSW regional buses in Sydney (`AU_NSW_Sydney`), such as around Newcastle and the Hunter, the Central West and the South East and Tablelands, take their timetables and real-time from Transport for NSW's per-area regional bus feeds, so their real-time matches the timetable. (#14492)

## 2026-11-20

- **Added:** New York (`US_NY_NewYorkCity`) has real-time for the Long Island Rail Road and service alerts for the subway. Timetables for the MTA's subway, buses, Long Island Rail Road and Metro-North update again, and PATH's, which had expired, is current again. Applies to each region from its next data update. (#26591)

## 2026-11-18

- **Removed:** Rewards listing and redemption endpoints (`GET data/user/rewards`, `GET data/user/rewards/array`, and `POST data/user/rewards/{rewardID}/redeem`) and administrative reward uploads (`POST reward/admin/` and `POST reward/admin/csv`). Bundle payment options no longer offer rewards discounts, and payment requests selecting a reward are rejected. Remove reward listing, redemption, and discounted-payment flows from clients. Historical reward transactions and refunds remain supported. (#25953)
- **Removed:** `rewardsBalance`, `availableRewardsBalance`, and `lifetimeRewardsBalance` from user balance responses, including `GET data/user/balance` and balances embedded in user bundle responses. Clients must stop relying on these fields. (#25953)
- **Changed:** Wallet and user balance responses no longer fall back to legacy monetary balances. Empty wallets report zero; existing wallets require a current wallet balance. The `userBalance` response field and deprecated `rawBalance` alias remain available and both use the current wallet balance. (#25953)

## 2026-11-17

- **Removed:** Wallet transport modes no longer include `notificationEmail`, `rewardPerCost`, `symbolicRewardPerCost` or `hideCost`. Remove dependencies on these fields from wallet configuration and app displays.
- **Removed:** Trip responses no longer include `rewardPoints`. Booking confirmations no longer include `purchase.rewardPoints`, `purchase.source` or `purchase.receipts`; clients must stop relying on these fields. Reward and redemption transactions are unaffected.
- **Changed:** Wallets no longer hide costs. Available segment and ticket prices are returned, trip totals include those costs, and purchase prices, currency and budget points are no longer suppressed by `hideCost`.
- **Removed:** Receipt attachment upload, deletion and image retrieval are no longer available: `POST booking/v2/{id}/receipt`, `DELETE booking/v2/{bookingID}/receipt/{receiptID}` and `GET booking/v2/receipt/{userID}/{bookingID}/{receiptID}`. Stop calling these endpoints. The independent TOMP `POST booking/v2/{bookingID}/legs/{legID}/receipt` pricing webhook remains available.
- **Removed:** Booking responses no longer include `confirmation.driver`, an undocumented object describing the driver assigned to the booking. (#26554)
- **Changed:** Regional buses in Northern NSW (`AU_NSW_Northern`) take their timetables and real-time from Transport for NSW's per-area regional bus feeds. (#26549)

## 2026-11-16

- **Fixed:** Under load, `routing.json` could return trips with a segment whose `segmentTemplateHashCode` wasn't in `segmentTemplates`. Clients that skip such trips, as TripKit does, lost them from the results. (#26551)
- **Fixed:** Real-time departures of services that call at the same stop twice, such as loop routes, are matched to the right visit. Before, a departure could show the prediction for the vehicle's later visit, or appear about an hour late. (#26216)

## 2026-11-13

- **Added:** Two new regions in British Columbia: `CA_BC_FortStJohn` for the Peace region (Fort St John, Dawson Creek, Chetwynd, Hudson's Hope and Tumbler Ridge) and `CA_BC_Cranbrook` for the East Kootenay and the BC Rockies. `CA_AB_Edmonton` and `CA_AB_Calgary` now end at the Alberta border, and `CA_BC_Kelowna` reaches further east to cover the Kootenay Lake stops. Each region now has a single time zone. (#26504)

## 2026-11-12

- **Fixed:** Regions in Norway and Sweden whose timetables come from NeTEx feeds, such as `NO_Oslo` and `SE_Sundsvall`, get timetable updates again. (#26526)
- **Fixed:** When a booking with an external provider is cancelled and the provider reports a final fare, such as nothing or a cancellation fee, the booking takes that fare and its payment is adjusted to match. Before, cancelled bookings could keep their original price. (#26376)

## 2026-11-11

- **Added:** Booking confirmations can include `purchase.earliestDepartureTime` and `purchase.latestDepartureTime`, ISO 8601 bounds of the pickup window supplied by the operator. These values are refreshed when the provider updates the booking. `purchase.pickupWindowDuration` is deprecated; use the new timestamps when available. (#26392)

## 2026-11-06

- **Changed:** Trip follow-up URLs, such as `updateURL`, now preserve the requested API hostname, including regional and `-only` hosts. Follow-up requests can be routed to a server with the required trip regions. Booking URLs are unchanged. (#26352)

## 2026-11-03

- **Fixed:** After British Columbia's time zone change on 1 November 2026, BC Transit real-time showed every service as 60 minutes late. Real-time for these services is now worked out from the timetable and the feed's delays. Timetables for Dawson Creek and Fort St John also use the right time zone, for each affected region from its next data update. (#26502, #26496)

## 2026-10-30

- **Changed:** Buses in Canberra (`AU_ACT_Canberra`) report bike access as unknown rather than allowed. Light rail and trains still allow bikes by default. This affects `bicycleAccessible`. (#26432)

## 2026-10-25

- **Changed:** Rail replacement buses on route QR1 in Canberra (`AU_ACT_Canberra`) don't allow bikes. (#26384)
- **Fixed:** The Nouvelle-Aquitaine regions `FR_NAQ_Bordeaux`, `FR_NAQ_Agen`, `FR_NAQ_Bayonne`, `FR_NAQ_MontDeMarsan` and `FR_NAQ_Pau` use their regional fare rules instead of generic fares. Applies to each region from its next data update. (#26382)

## 2026-10-24

- **Added:** Corsica (`FR_20R_Corse`) includes Bastia's urban network, Via Bastia, and Porto-Vecchio's A Citadina, and has real-time for A Citadina and the Via Strada interurban buses. (#26362)

## 2026-10-23

- **Fixed:** Melbourne public transport trips have myki and SkyBus fares again. They had none after the timetable data renamed its operators. Applies from the region's next data update. (#26399)
- **Fixed:** Virginia Railway Express (VRE) trips in the Washington, DC region have the right fares. Before, many were priced at $99, so routing favoured other options. Applies from the region's next data update. (#26401)

## 2026-10-22

- **Added:** Quick-booking responses can include additional-passenger fares and an optional `min` per fare (minimum quantity when selected). For providers that support additional passengers, clients can select a primary fare together with additional-passenger fares and submit their IDs and quantities in `fares`. See [fare selection](enterprise/bookings-api.md#selecting-fares-and-additional-passengers). (#26146)
- **Changed:** Booking submissions validate selected fare IDs and quantities against the available fares. Unknown or duplicate selected fare IDs, quantities outside the offered `min`/`max` bounds, and selections containing only additional-passenger fares are rejected. Taxi bookings require exactly one primary fare type, even when `singleFareOnly` is false to allow additional passengers. (#26146)
- **Fixed:** Sydney Metro trips are priced by Opal distance band too, instead of always at the lowest band. Applies from the region's next data update. (#25959)

## 2026-10-17

- **Changed:** Tasmania (`AU_TAS_Tasmania`) takes its timetables from the statewide government feed. This adds Kinetic, Tassielink, Manion's, Calow's and Derwent Ferries services to Metro Tasmania's, and replaces Hobart's timetable, which had expired.
- **Changed:** The Irish regions `IE_L_Dublin`, `IE_M_Cork`, `IE_M_Limerick`, `IE_C_Galway` and `IE_U_Donegal`, and `GB_NIR_NorthernIreland`, take their timetables from Transport for Ireland's combined feed. Galway, Donegal and Northern Ireland now include every TFI operator in their area, not a selection. Applies to each region from its next data update.

## 2026-10-14

- **Fixed:** Sydney train trips are priced by Opal distance band again. The band table had been missing from the region's data since 2022. Applies from the region's next data update. (#25959)

## 2026-10-09

- **Fixed:** Sydney Trains and intercity train trips in Sydney have Opal fares again, instead of none. Applies from the region's next data update. (#25959)
- **Fixed:** TCAT buses in Troyes are back in `FR_GES_Troyes` and `FR_BFC_Auxerre`, after their old timetable source went offline, and now have real-time, including service alerts. Applies to each region from its next data update. (#26311)

## 2026-10-06

- **Changed:** Trips only include `subscribeURL` and `unsubscribeURL` when the request has a `userToken` header, as subscribing requires one. (#26298)
- **Fixed:** `geocode.json` now honours a full `Accept-Language` header such as `de-DE,de;q=0.9`. Before, only a bare language code like `de` worked, and anything else fell back to English. (#26284)
- **Added:** SkedGo can now configure default `ph[<kind>]` values per API key, which apply to all `routing.json` GET requests of that key. A value sent in the request still wins for that kind. (#26090)

## 2026-10-05

- **Fixed:** A request whose `Accept-Language` header wasn't a plain language code (for example `zh-CN,zh-Hans;q=0.9`) could make later requests to the same server fail with HTTP 500. Localised responses also no longer pick up the language of another request. (#26285)

## 2026-10-02

- **Added:** `routing.json` takes new `ph[<kind>]` parameters, for extra _parking hassle_ when travellers park their own car, by where they park: `ph[*]` (anywhere), `ph[pnr]` (Park & Ride), `ph[offstreet]`, `ph[onstreet]` and `ph[garage]`. For example, `ph[*]=10&ph[pnr]=0` demotes driving except to a Park & Ride. Penalised trips are ranked lower, not removed. (#26090)
- **Changed:** Requests for only the traveller's own vehicle (`me_car`, `me_mot`, or their own bicycle or micromobility vehicle) now always return a trip, however short, instead of it losing out to walking. With `allModes=true` these trips are kept too, so the results match making one request per mode. (#26090)
- **Fixed:** Light rail in Canberra (`AU_ACT_Canberra`) follows public holiday timetables, as it now comes from the same feed as Canberra's buses. (#26262)

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
