# Extensions

Right after signing up, the API will serve results for regions and transport providers that publish their data as Open Data and which have already been connected to our system.

The TripGo API can be extended in the following ways:

1. Unlock transport modes, regions and real-time data from services that require you to first accept their terms or acquire API credentials.
2. Add new transport modes through our TSP Connectors (coming soon).
3. Add new regions through our Region Connectors (coming soon).


---

## Unlocking transport modes

To get results for providers who aren't using Open Data, follow the instructions for the provider below. If you want to use a provider that hasn't yet been connected to our system, please get in touch with our team [by mail](mailto:api@skedgo.com) or on Slack.


### BlaBlaCar 🌍

*Integrations*: Routing, Real-time

1. Read the [terms of use of BlaBlaCar's API](https://dev.blablacar.com/terms) and make sure you comply with them in your app.
2. Sign up to [BlaBlaCar's API](https://dev.blablacar.com).
3. Enter your `BlaBlaCar auth key` in your [application credentials](https://tripgo.3scale.net/admin/applications).
4. BlaBlaCar results will start coming through the TripGo API for your API key (after at most 5 minutes).


### Car2go 🌏

*Integrations*: Locations, Routing, Real-time, Bookings

1. Read the [terms of use of the car2go API](https://www.car2go.com/api/tou.htm) and make sure you comply with them in your app.
2. [Mail openapi@car2go.com](mailto:openapi@car2go.com) as described in there.
4. Enter your `Car2go consumerKey` in your [application credentials](https://tripgo.3scale.net/admin/applications).
5. Car2go results will start coming through the TripGo API for your API key (after at most 5 minutes).

<!-- 
for in app booking, see https://redmine.buzzhives.com/issues/8952
3. Use `https://api.tripgo.com/data/booking/car2go/<user_account_id>` as your callback url for the verification tokens. 
4. Enter your `Car2go consumerKey` and `Car2go sharedSecret` in your [application credentials](https://tripgo.3scale.net/admin/applications).
-->


### Flinkster 🇪🇺

*Integrations*: Locations, Routing, Real-time

1. Sign up to [Deutsche Bahn's Flinkster API](https://developer.deutschebahn.com/store/apis/info?name=Flinkster_API_NG&version=v1&provider=DBOpenData)
2. Login to Deutsche Bahn's developer website, select "My Subscriptions" and generate an "Access Token"
3. Enter this as your `Flinkster access token` in your [application credentials](https://tripgo.3scale.net/admin/applications).
4. Flinkster results will start coming through the TripGo API for your API key (after at most 5 minutes).


### FlitWays 🇺🇸

*Integrations*: Routing, Real-time

1. Get in touch with FlitWays and get access to [their API](https://flitways.com/api).
2. Enter your `Flitways api key` in your [application credentials](https://tripgo.3scale.net/admin/applications).
3. FlitWays results will start coming through the TripGo API for your API key (after at most 5 minutes).


### MyDriver 🌎

*Integrations*: Routing, Real-time

1. Get in touch with [MyDriver](https://www.mydriver.com)'s sales team and get access to their API.
2. Enter your `MyDriver username` and `MyDriver password` in your [application credentials](https://tripgo.3scale.net/admin/applications).
3. MyDriver results will start coming through the TripGo API for your API key (after at most 5 minutes).


### Lyft 🇺🇸

*Integrations*: Routing, Real-time, Bookings

1. Read the [terms of use of Lyft's API](https://developer.lyft.com/docs/lyft-developer-platform-terms-of-use) and make sure you comply with them in your app.
2. Sign up to [Lyft's API](http://developer.lyft.com).
3. Enter your `Lyft Client ID` and `Lyft Client Secret` in your [application credentials](https://tripgo.3scale.net/admin/applications).
4. Lyft results will start coming through the TripGo API for your API key (after at most 5 minutes).


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

### GoGet 🇦🇺

*Integrations*: Locations, Routing, Real-time

1. Get in touch with [GoGet](https://www.goget.com.au/)'s sales team and get access to their API.
2. Enter your `GoGet ConsumerKey` and `GoGet ConsumerSecret` in your [application credentials](https://tripgo.3scale.net/admin/applications).
3. GoGet results will start coming through the TripGo API for your API key (after at most 5 minutes).


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

## Unlocking regions

To get results for regions with providers that aren't using Open Data, or which we haven't yet been connected to our system, please get in touch with our team [by mail](mailto:api@skedgo.com) or on [Slack](http://slack.tripgo.com/) (by [self-invite](http://slackin.tripgo.com/)).
