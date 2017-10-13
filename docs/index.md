# TripGo API

The TripGo API allows you to plan **door-to-door trips** using a large variety of **public and private transport.** It integrates **real-time** information and, for selected providers, allows users to **book and pay** for transport.

---

## Getting started

### 1. Getting an API key

[Get an API key](https://tripgo.3scale.net/signup?plan_ids[]=2357355863999). You can try it out for free for as long as you like, as you stay below a threshold of API calls - no credit card required. For limits on the free tier and pricing, see the [SkedGo website](https://skedgo.com/home/partnerships/tripgo-api/).

Once you have an API key, send it along with every request as the `X-TripGo-Key` header.

### 2. Getting the base URL

Unfortunately we don't yet have a unified URL for all areas, as failover is expected to be done client-side.  You can get a list of regions and URLs with something like:

```
curl 'https://tripgo.skedgo.com/satapp/regions.json' -H 'Accept: application/json' --compressed -H "X-TripGo-Key: $tripgoKey" -d '{"v":2}'
```

Keep in mind that this API is powered by multiple servers, not all of which cover every region. **You have to use the correct host names for the region that you query**. You get those host names by first querying [`regions.json`](https://skedgo.github.io/tripgo-api/#tag/Configuration%2Fpaths%2F~1regions.json%2Fpost) and looking up the `urls` for that region. You should only cache this information short term as those URLs can change without notice.

### 3. Make a request

Our API can do a lot more than just [directions](https://skedgo.github.io/tripgo-api/#tag/Routing%2Fpaths%2F~1routing.json%2Fget), but if that is what you are interested in, then try something like:

```
curl 'https://granduni-au-nsw-sydney-tripgo.skedgo.com/satapp/routing.json?from=(-33.859,151.207)&to=(-33.863,151.208)&departAfter=1532799914&modes[]=wa_wal&v=11&locale=en' -H 'Accept: application/json' --compressed -H "X-TripGo-Key: $tripgoKey" -g
```

or 

```
curl 'https://granduni-au-nsw-sydney-tripgo.skedgo.com/satapp/routing.json?from=(-33.859,151.207)&to=(-33.891,151.209)&modes[]=pt_pub&v=11&locale=en' -H 'Accept: application/json' --compressed -H "X-TripGo-Key: $tripgoKey" -g
```

Keep in mind that this API is optimised to return a large number of trip results while maintaining small response sizes. This has a number of complications. Notably, to get a trip's segments you need to combine the segment references with the segment templates. This is explained further [in the F.A.Q.](faq/#trips-groups-frequencies-and-templates).

### 3. Where to go from here?

1. If you're an app developer, take a look at our open source TripKit **SDKs for [iOS, macOS](https://github.com/skedgo/tripkit-ios) and [Android](https://github.com/skedgo/tripkit-android)**.

2. If you're a web developer, take a look at [our **sample app** "FastGo"](https://github.com/skedgo/fastgo-react-native) and its accompanying [blog post series](https://skedgo.com/en/fastgo-tripgo-api-sample-app-using-react-native-part-1/).

3. If you're a backend developer, dive into the [**API specs**](https://skedgo.github.io/tripgo-api/), which are available in OpenAPI (formerly Swagger) format.

4. Continue reading with our [in-depth **guides**](guides).

5. If you know how to debug a web app, look at the network activity for [our web app](https://tripgo.com/) to get an idea of which API calls to use when.  (Filter for "satapp".)

6. To talk to us and other developers using our API, join our Slack team.
