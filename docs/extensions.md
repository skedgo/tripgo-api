# Extensions

Right after signing up, the API will serve results for regions and transport providers that publish their data as Open Data and which have already been connected to our system.

The TripGo API can be extended in the following ways:

1. Unlock transport modes, regions and real-time data from services that require you to first accept their terms or acquire API credentials.
2. Add new transport modes through our TSP Connectors.
3. Add new regions through our Region Connectors (coming soon).


---

## Unlocking transport modes

To get results for providers who aren't using Open Data, follow the instructions for the provider below. If you want to use a provider that hasn't yet been connected to our system, please get in touch with our team [by mail](mailto:api@skedgo.com) or on [Slack](http://slack.tripgo.com/) (by [self-invite](http://slackin.tripgo.com/)).


### BlaBlaCar 🌍

*Integrations*: Routing, Real-time

1. Read the [terms of use of BlaBlaCar's API](https://dev.blablacar.com/terms) and make sure you comply with them in your app.
2. Sign up to [BlaBlaCar's API](https://dev.blablacar.com).
3. Enter your `BlaBlaCar auth key` in your [application credentials](https://tripgo.3scale.net/admin/applications).
4. BlaBlaCar results will start coming through the TripGo API for your API key (after at most 5 minutes).


### Flinkster 🇪🇺

*Integrations*: Locations, Routing, Real-time

1. Sign up to [Deutsche Bahn's Flinkster API](https://developer.deutschebahn.com/store/apis/info?name=Flinkster_API_NG&version=v1&provider=DBOpenData)
2. Login to Deutsche Bahn's developer website, select "My Subscriptions" and generate an "Access Token"
3. Enter this as your `Flinkster access token` in your [application credentials](https://tripgo.3scale.net/admin/applications).
4. Flinkster results will start coming through the TripGo API for your API key (after at most 5 minutes).


### GoGet 🇦🇺

*Integrations*: Locations, Routing, Real-time

1. Get in touch with [GoGet](https://www.goget.com.au/)'s sales team and get access to their API.
2. Enter your `GoGet ConsumerKey` and `GoGet ConsumerSecret` in your [application credentials](https://tripgo.3scale.net/admin/applications).
3. GoGet results will start coming through the TripGo API for your API key (after at most 5 minutes).

### Lyft 🇺🇸

*Integrations*: Routing, Real-time, Bookings

1. Read the [terms of use of Lyft's API](https://developer.lyft.com/docs/lyft-developer-platform-terms-of-use) and make sure you comply with them in your app.
2. Sign up to [Lyft's API](http://developer.lyft.com).
3. Enter your `Lyft Client ID` and `Lyft Client Secret` in your [application credentials](https://tripgo.3scale.net/admin/applications).
4. Lyft results will start coming through the TripGo API for your API key (after at most 5 minutes).

### MyDriver 🌎

*Integrations*: Routing, Real-time

1. Get in touch with [MyDriver](https://www.mydriver.com)'s sales team and get access to their API.
2. Enter your `MyDriver username` and `MyDriver password` in your [application credentials](https://tripgo.3scale.net/admin/applications).
3. MyDriver results will start coming through the TripGo API for your API key (after at most 5 minutes).

### Ola 🇮🇳 🇦🇺 🇳🇿 🇬🇧

*Integrations*: Routing, Real-time

1. Get in touch with [Ola](https://www.olacabs.com/)'s sales team and get access to their API.
2. Enter your `OLA ApiKey` in your [application credentials](https://tripgo.3scale.net/admin/applications).
3. Ola results will start coming through the TripGo API for your API key (after at most 5 minutes).

### Uber 🌎

*Integrations*: Routing, Real-time, Bookings

1. Read the [terms of use of Uber's API](https://developer.uber.com/docs/riders/terms-of-use) and make sure you comply with them in your app.
2. Sign up to [Uber's ride request API](https://developer.uber.com/docs/riders/ride-requests/introduction).
3. Enter your `Uber client ID`, `Uber client secret` and `Uber server token` in your [application credentials](https://tripgo.3scale.net/admin/applications). 
4. Uber results will start coming through the TripGo API for your API key (after at most 5 minutes).


### Zipcar 🇺🇸

*Integrations*: Locations, Routing, Real-time

1. Get in touch with [Zipcar](http://www.zipcar.com) and get access to their API.
2. Enter your `Zipcar API key` in your [application credentials](https://tripgo.3scale.net/admin/applications). 
3. Zipcar results will start coming through the TripGo API for your API key (after at most 5 minutes).


---

## Unlocking real-time data

To get real-time data for providers who aren't using Open Data, follow the instructions for the provider below. If you want to use a provider that hasn't yet been connected to our system, please get in touch with our team [by mail](mailto:api@skedgo.com) or on [Slack](http://slack.tripgo.com/) (by [self-invite](http://slackin.tripgo.com/)).

### Live-Traffic from Google 🌎

1. Read the [terms of use of Google Maps](https://developers.google.com/maps/terms) and make sure you comply with them in your app - in particular, that you are using a Google Map.
2. Sign up to the [Google Maps Directions API](https://developers.google.com/maps/documentation/directions/start)
3. Enter your `Google Maps Directions API key` in your [application credentials](https://tripgo.3scale.net/admin/applications). 
4. Car results leaving now will then come augmented with Google's drive time predictions through the TripGo API for your API key (after at most 5 minutes).

### Live-Traffic from TomTom 🌎

1. Sign up to the [TomTom Maps API](https://developer.tomtom.com/user/register), making sure you read the terms and comply with them - in particular, that you're not affiliated with a prohibited party and that you're using a TomTom or TomTom licenses map UI (e.g., Apple Maps).
2. Enter your `TomTom consumer API key` and `TomTom consumer secret` in your [application credentials](https://tripgo.3scale.net/admin/applications). 
3. Car results leaving now will then come augmented with TomTom's drive time predictions through the TripGo API for your API key (after at most 5 minutes).

### Chicago's CTA 🇺🇸

1. Read the [terms of use of CTA's API](http://www.transitchicago.com/developers/terms.aspx) and make sure you comply with them in your app
2. Sign up to [CTA's API](http://www.transitchicago.com/developers/)
3. Enter your `CTA key for Chicago` in your [application credentials](https://tripgo.3scale.net/admin/applications). 
4. Real-time data for CTA for your TripGo API key will be enabled (after at most 5 minutes).


<!--
### Montreal's AMT

1. 
2. [Let us know]() that you comply with the terms. We'll then enable real-time data for AMT for your TripGo API key.
-->

---

## Unlocking geocoding providers

To get results from geocoding data for providers who aren't using Open Data when using `geocoding.json` endpoint, follow the instructions for the provider below. These providers will only apply for non auto-completion requests, except for What3Words ones, which can be used for both type of geocoding requests. If you want to use a provider that hasn't yet been connected to our system, please get in touch with our team [by mail](mailto:api@skedgo.com) or on [Slack](http://slack.tripgo.com/) (by [self-invite](http://slackin.tripgo.com/)).

### Foursquare 🌎

1. Read the [Foursquare Terms of Use](https://developer.foursquare.com/docs/terms-of-use/overview) and make sure you comply with them in your app.
2. Sign up to the [Foursquare Developers Site](https://foursquare.com/developers/signup)
3. Enter your `Foursquare API key` in your [application credentials](https://tripgo.3scale.net/admin/applications). 
4. Add `allowFoursquare=true` to your geocoding requests, and then geocoding results will then come augmented with Foursquare's API through the TripGo API for your API key (after at most 5 minutes).

### Google Places 🌎

1. Read the [Places API Policies](https://developers.google.com/places/web-service/policies) and make sure you comply with them in your app - in particular, that you are using a Google Map.
2. Sign up to the [Google Places API](https://developers.google.com/places/web-service/get-api-key)
3. Enter your `Google Places API key` in your [application credentials](https://tripgo.3scale.net/admin/applications). 
4. Add `allowGoogle=true` to your geocoding requests, and then geocoding results will then come augmented with Google Places's API through the TripGo API for your API key (after at most 5 minutes).

### What3Words 🌎

1. Read the [API Licence Agreement](https://what3words.com/developers/api-licence-agreement/) and make sure you comply with them in your app.
2. Sign up to the [What3Words API](https://what3words.com/developers/)
3. Enter your `What 3 Words key` in your [application credentials](https://tripgo.3scale.net/admin/applications). 
4. Add `allowW3W=true` to your geocoding requests, and then geocoding results will then come augmented with What3Words's API through the TripGo API for your API key (after at most 5 minutes).

### Yelp 🌎

1. Read the [Yelp Terms of Use](https://www.yelp.com/developers/api_terms) and make sure you comply with them in your app.
2. Sign up to the [Yelp Developers Site](https://www.yelp.com/developers)
3. Enter your `Yelp API key` in your [application credentials](https://tripgo.3scale.net/admin/applications). 
4. Add `allowYelp=true` to your geocoding requests, and then geocoding results will then come augmented with Yelp's API through the TripGo API for your API key (after at most 5 minutes).

---

## TSP connectors

For TSPs that are not yet integrated into our platform, you can add them by:
 
1. Implementing the corresponding API according to our [API specs](https://skedgo.github.io/TSP-APIs/), and then
2. Sending the URL of where you have deployed your implementation to [api@skedgo.com](mailto:api@skedgo.com).
 
The process then involves a manual step (which we plan to automate) to add that to our list of TSP connectors and enable it, and that's it, results will then include the new TSP.
 

### How does this work

All TSP connector APIs [share](https://skedgo.github.io/TSP-APIs/shared) in common three endpoints:

- **config**: the list of endpoints that are implemented, similar to [gbfs.json](https://github.com/NABSA/gbfs/blob/v2.0/gbfs.md#gbfsjson)  
- **provider**: the information about the provider, which may include links to mobile apps and deep links (with a pattern); and also the list of modes for the TSP 
- **coverage**: a list of coverage areas of the provider, and for each area, it is possible to define available products and pricing rules    

Config endpoint allows our platform to understand what are the capabilities of the TSP integration of each connector.
Provider information is what our platform will use to attribute results. This will be passed on with any API responses that include results from your TSP connector.
Coverage will allow our platform to know in which areas (i.e., regions) the TSP will be enabled.


### Taxi and TNC

For taxi and TNC providers we defined a [Taxi](https://skedgo.github.io/TSP-APIs/taxi/) API which allows you to:

- add static pricing (in `coverage` endpoint), which will be shown as an estimate cost and used by our routing engine when creating trip alternatives.
- provide realtime ETAs for products
- provide realtime estimated costs based on specific trip details
- enable in-app booking capabilities, so users can directly initiate the booking process through our platform or WLs  


### Shared bikes and scooters 

For shared bikes and scooters, we support GBFS standard, with the addition of the shared endpoints mentioned above (except for `config` which is replaced by `gbfs.json`).
We also support GBFS sources with only one endpoint (just [free_bike_status.json](https://github.com/NABSA/gbfs/blob/v2.0/gbfs.md#free_bike_statusjson) for example)

     
### Info 

To enhance our platform with more information, we defined an [Info](https://skedgo.github.io/TSP-APIs/info/) API, which allows:
 
 - reporting real time events on a given location or area. The model follows GTFS-R standard and will be added to our platform responses accordingly.
 - integrating bike lanes, which will be used by our cycling results to prioritize those paths.


---

## Unlocking regions

To get results for regions with providers that aren't using Open Data, or which we haven't yet been connected to our system, please get in touch with our team [by mail](mailto:api@skedgo.com) or on [Slack](http://slack.tripgo.com/) (by [self-invite](http://slackin.tripgo.com/)).

### Rio de Janeiro (Brazil) 🌎

1. Go to [Fetransport Site](https://www.fetranspor.com.br/) and make sure you agree with the data terms. Contact us if you need help for this.
2. Forward your confirmation mail to [api@skedgo.com](mailto:api@skedgo.com) 
3. We will then unlock the region for your API key. 
