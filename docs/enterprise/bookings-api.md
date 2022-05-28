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

### Auth Flow

This flow will depend on the TSP and can be started in two separate ways:

- When [linking accounts](#linking-and-unlinking-accounts) to a user.
- When doing a [booking](#booking-a-segment) for that particular TSP and the user has no account already linked.

This flow will use the Auth Forms to provide the apps the information to show to the user and also the information required to be POSTed to continue the flow.

For a TSP that allows OAuth2, the Auth Form will include the fields with the information for the apps to do OAuth, including `clientId`, `clientSecret`, `scope`, `authUrl`, `tokenUrl`; and also the required field to be POSTed, including `accessToken`, `refreshToken` and `expiration`.

For a TSP that provides a different authentication method, the AuthForm will include the required field to be filled by the user and also any extra information that need to be shown to the user in the same field format. This will follow the same flow approach as for [Form-based Booking Flow](#form-based-booking-flow).

The end of this flow will depending on how it was started.
If was started to link an account, the flow will end with an empty 204 response, when successfuly linked.
If it was started in a booking flow, the flow will automatically continue with it, attempting to do the booking and returning the status, as in step 4 of [Form-based Booking Flow](#form-based-booking-flow).


---

## Getting available TSP for a trip

If there are available TSPs for a trip segment, this will be indicated by the presence of the booking object in the segment.

The booking object in the segment may include:

- a `quickBookingUrl`, indicating that the quick booking flow is available.

---

## Booking a segment

Getting available TSP products for a trip

If quick booking flow is available for a segment, the available TSP products can be browsed for it without providing any authentication details. 

As part of the quick booking flow, the quickBookingUrl will then return a list of available TSP products, which notably each come:

- `tripUpdateURL`: A URL for fetching the trip, updated for this TSP product.
- `bookingURL`: A URL for initiating the booking flow for this TSP product (step 2 of [form-based booking flow](#form-based-booking-flow))
- title
- subtitle
- bookingTitle
- priceString
- price
- USDPrice
- surgeString
- surgeImageURL
- ETA
- imageURL

---

## Updating trip with booking details

At the end of the booking flow, you will get a `refreshURLForSourceObject`. Hit this URL with a GET request, to get the updated trip.

Note that these trips can be eligible for real-time updates even if the original trip was not eligible as there might now be additional real-time information based on the booking.

Trips with a confirmed booking will also have extra information about the confirmed booking in a field called `confirmation` in the `booking` field of the segment.

This `confirmation` object may include detailed information about the `provider`, `vehicle` and `status` for the booking, with the following possible fields:

- a `title`
- a `subtitle`
- a `valueUrl`
- a `value`

And also a list of possible actions depending on the status of the booking, with the following fields:

- a `title`
- a boolean `isDestructive`, indicating whether this action will cancel the booking.
- a `internalUrl` indicating the action of the url is a call to the same server and will return a `bookingForm`.
- a `externalUrl` indicating that the action must be handled by the app accordingly.

Examples of actions with `internalUrl` fields are `cancel booking`, which will have the `isDestructive` field in true, and `rate booking`.

Examples of actions with `externalUrl` fields are `qrcode` values, for showing a ticket to the user, and phone numbers, starting with `tel:`.

---

## Rating and Tipping

Whenever available, the confirmation information will include the `rate booking` action, which will include an `internalUrl` which will return the following fields:

- `rate`, an int value with min and max accepted values.
- `feedback`, a string to send an appropriate msg.
- `tip`, an int value indicating the amount to be paid as tip, in local currency.
