# Trips URLs

Whenever a trip is computed, it will be returned with a list of URLs, including:

- `temporaryURL`: Temporary URL used to retried the trip, which can be used for short-term sharing.
- `saveURL`: Temporary URL used to make the trip persistent.
- `updateURL`: Optional temporary URL used to update the trip with real-time data.
- `hookURL` (beta): Optional temporary URL used to hook the trip with real-time updates.
- `progressURL`: Optional temporary URL used to report progress updates for the trip.
- `plannedURL`: Optional temporary URL used for analytics.
- `logURL` (beta): Optional temporary URL used to log the trip in the user account.
- `shareURL`: Optional persistent of this trip URL, which can be used for sharing trips (web access only)
- `appURL`: Optional persistent of this trip URL, which can be used retrieving them long term (json access only).

## Trip access 

The `temporaryURL` allows access to the trip for a short-term period (maximum of 7 days from the time of creation), while our platform keeps the trip in the server that computed it originally.
If you want a trip to persist forever, you can use the `saveURL` to save it in permanent storage (requires AWS DynamoDB connection). Saving the trip will create a new unique ID, along with two new urls: `shareURL` for web access and `appURL` for app/json access.

## Analytics

The `plannedURL` is meant to be used for analytics purposes, to keep track, from the returned trips, which of them the user actually took, if that is possible to determine or guess at a client/app level.
The `progressURL` goals is to enable apps to report user progress on a specific trip, also for analytics purposes.

## Save trip

It's available for all trips.

`saveURL` makes sure that a trip will be accessible at a later time, beyond what would be a typical user session. Otherwise our API makes no guarantee that a trip  calculated is still available later. 
It is important to mention that the trip saved could change when reconstructing it from our database if there's newer real-time data available. 

## Real-time updates'

Its optional as not all trips would ever get real-time data updates.

If our platforms has real-time information that can be used to update a computed trip, both `updateURL` and `hookURL` will be present in the response.
Both support the same goal of updating the trip with real-time information, one by pulling and the other by pushing.

`updateURL` Allows providing a hash code so that it'll only return trip details if anything about the trip has changed since you last fetched it. This is so that apps can frequently hit that endpoint and only need to parse the response if there's any changes to the trip. [See documentation](/specs/#tag/Trips%2Fpaths%2F~1trip~1update~1%7Bid%7D%2Fget)

### Pulling for changes
 
The `updateURL` can be used to pull our servers for changes in the trip.
This url is meant to be used by the apps to get an updated version of the trip.
This endpoint will return an empty response if there is no change, otherwise, it will return the trip in the requested format.  

As an example, if a service is delayed, the trip will be updated to reflect that change. 
Also, if the trip involves a booking to a TSP, like **Uber** for example, it will be getting updates of the status of the ride, as soon as those are available from the external API.

The expected flow in this case is the following one:

1. A trip is computed and our platform has sources of information for real-time updates for it, and therefore, the `updateURL` is returned.
2. The client checks whether the trip has been updated with real-time changes by doing a GET to the `updateURL`.
3. If the trip has been updated, the new `updateURL` should be used from now on.
4. After two hours of not getting any update, the trip is discarded from memory.

For more details, check our [docs](/specs/#tag/Trips%2Fpaths%2F~1trip~1update~1%7Bid%7D%2Fget)

### Receiving notifications

The `hookURL` can be used to register a callback or web-hook, and our platform will then inform if any change in that trip occurs by POSTing to the registered url the `tripID` along with the `tripURL` for the client to retrieve the updated trip.

The expected flow in this case is the following one:

1. A trip is computed and our platform has sources of information for real-time updates for it, and therefore, the `hookURL` is returned.
2. The client that wants to receive notifications about real-time changes does a POST to the `hookURL` ([docs](/specs/#tag/Trips%2Fpaths%2F~1trip~1hook~1%7Bid%7D%2Fpost)) send the webhook as `url` and any required header (starting with `x-`) as body of the request and obtains a 204 response.
3. At any given time the trip is updated with any real-time change, our platform does a POST to the registered web-hook.
4. After two hours of not getting any update, the trip is discarded from memory and won't receive any more updates.

The client can also remove a web-hook, by doing a DELETE request to `hookURL` ([docs](/specs/#tag/Trips%2Fpaths%2F~1trip~1hook~1%7Bid%7D%2Fdelete)), and can also get the status of the hook (to confirm whether there is a hook already registered), by doing a GET to `hookURL` ([docs](/specs/#tag/Trips%2Fpaths%2F~1trip~1hook~1%7Bid%7D%2Fget)).

Note that only one web-hook per trip can be registered, and multiple calls to `hookURL` to register different web-hooks will override existing ones.

  
