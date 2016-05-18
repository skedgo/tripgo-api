# Overview

**Note: Enterprise customers-only**

**Note: Beta-only**

The TripGo API allows making bookings for a handful of transport service providers (TSPs).

This enables your users to:

- Link their TSP accounts and keep credentials either stored on the client or server-side.
- Get a list of available TSP products for a trip.
- Book a specific TSP product for a single segment.
- Update the trip with the details of the booked TSP product.
- Update the trip with real-time data specific to that booking.

Coming soon:

- Book a complete trip consisting of multiple products from multiple TSPs.

In order to enable bookings for your TripGo API key, please [get in touch with our team](mailto:api@skedgo.com). For most TSPs, you will need to provide us with additional information of your API credentials.


---

# API Endpoints

## Linking and unlinking accounts

Before you can do any bookings, you will need to provide the relevant authentication details to the server.

If the user has an account (as per the `userToken` header), then this is only necessary once. If the user does not have an account, this is necessary for each session. Typically, the endpoints which do the bookings will tell you, if the session hasn't been authenticated yet.

- `auth/{region}?mode={mode}`: Endpoint to get the available providers for a specific region, with the information to signin/logout if a `userToken` is provided in the headers. If `mode` is provided, only information for that mode is returned.
- `auth/{provider}/signin`: Endpoint to link an account for the specified provider.
- `auth/{provider}/logout`: Endpoint to unlink an account for the specified provider.


---

## Getting available TSP products for a trip

Available TSP products can be browsed for a trip without providing any authentication details. If there are available products for a trip segment, this will be indicated by the presence of the `quickBookingUrl` in the segment reference's `booking` object.

This then returns a list of available TSP products, which notably each come:

- `tripUpdateURL`: A URL for fetching the trip, updated for this TSP product.
- `bookingURL`: A URL for initiating the booking flow.


---

## Booking a segment

To book a segment, either use the `bookingURL` either directly from the segment reference, or from the data returned after hitting `quickBookingUrl`.


---

## Updating trip with booking details

At the end of the booking flow, you will get a `refreshURLForSourceObject`. Hit this URL with a GET request, to get the updated trip.

Note that these trips can be eligible for real-time updates even if the original trip was not eligible as there might now be additional real-time information based on the booking.

---

# Bookings in the TripKit SDKs

The TripKit SDKs implement support for bookings:

- [Bookings in TripKit Android](android.md)
- [Bookings in TripKit iOS](ios.md)