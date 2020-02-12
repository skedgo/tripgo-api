# TripGo API

The TripGo API allows you to plan **door-to-door trips** using a large variety of **public and private transport.** It integrates **real-time** information and, for selected providers, allows users to **book and pay** for transport.
![All-transports](img/tripgo-api-all-trasport@2x-100.jpg)

---

## Getting started

### 1. Getting an API key

[Get an API key](https://tripgo.3scale.net/signup?plan_ids[]=2357355863999). You can try it out for free for as long as you like, as you stay below a threshold of API calls - no credit card required. For limits on the free tier and pricing, see the [SkedGo website](https://skedgo.com/en/tripgo-api/pricing/).

It may take up to 5 minutes for your key to be active.

Once you have an API key, send it along with every request as the `X-TripGo-Key` header.

### 2. Make a request

Our API can do a lot more than just [directions](/#tag/Routing%2Fpaths%2F~1routing.json%2Fget), but if that is what you are interested in, then try something like:

```
curl 'https://api.tripgo.com/v1/routing.json?from=(-33.859,151.207)&to=(-33.863,151.208)&departAfter=1532799914&modes[]=wa_wal&v=11&locale=en' -H 'Accept: application/json' --compressed -H "X-TripGo-Key: $tripgoKey" -g
```

or 

```
curl 'https://api.tripgo.com/v1/routing.json?from=(-33.859,151.207)&to=(-33.891,151.209)&modes[]=pt_pub&v=11&locale=en' -H 'Accept: application/json' --compressed -H "X-TripGo-Key: $tripgoKey" -g
```

Keep in mind that this API is optimised to return a large number of trip results while maintaining small response sizes. This has a number of complications. Notably, to get a trip's segments you need to combine the segment references with the segment templates. This is explained further [in the F.A.Q.](faq/#trips-groups-frequencies-and-templates).

### 3. Where to go from here?

1. If you're an app developer, take a look at our open source TripKit **SDKs for [iOS, macOS](https://ios.developer.tripgo.com) and [Android](android.developer.tripgo.com)**.

2. If you're a web developer, take a look at [our **sample app** "FastGo"](https://github.com/skedgo/fastgo-react-native) and its accompanying [blog post series](https://skedgo.com/en/fastgo-tripgo-api-sample-app-using-react-native-part-1/), or check out our [Leaflet Plugin](https://github.com/skedgo/leaflet.tripgo.routing) (see [Demo](https://skedgo.github.io/leaflet.tripgo.routing/)).

3. If you're a backend developer, dive into the [**API specs**](/specs), which are available in OpenAPI (formerly Swagger) format. <!-- 4. Continue reading with our [in-depth **guides**](guides). -->

4. If you know how to debug a web app, look at the network activity for [our web app](https://tripgo.com/) to get an idea of which API calls to use when.  (Filter for "satapp".)

5. To talk to us and other developers using our API, join our [Slack team](http://slack.tripgo.com/) by [self-invite](http://slackin.tripgo.com/).
