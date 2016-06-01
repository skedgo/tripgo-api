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

For a TSP that provides a different authentication method, the AuthForm will include the required field to be filled by the user and also any extra information that need to be shown to the user in the same field format. This will follow the same flow approach as for [Regular Booking Flow](#regular-booking-flow).

The end of this flow will depending on how it was started.
If was started to link an account, the flow will end with an empty 204 response, when successfuly linked.
If it was started in a booking flow, the flow will automatically continue with it, attempting to do the booking and returning the status, as in step 4 of [Regular Booking Flow](#regular-booking-flow).


---

## Getting available TSP for a trip

If there are available TSPs for a trip segment, this will be indicated by the presence of the booking object in the segment.

The booking object in the segment may include:

- a `quickBookingUrl`, indicating that the quick booking flow is available.
- a `bookingUrl`, indicating that the regular booking flow is available.

---

## Booking a segment

To book a segment, either use the [Regular Booking Flow](#regular-booking-flow) with the `bookingURL` either directly from the segment reference, or the [Quick Booking Flow](#quick-booking-flow) from the data returned after hitting `quickBookingUrl`.


### Regular Booking Flow

If regular booking flow is available for a segment, the `bookingUrl` will return a [Booking Form](#booking-form-specs) object with instructions to start the booking flow.  
A regular booking flow will possible include the following steps:

1) return the available TSP products to allow the user choose one of them, 
2) check whether we have user credentials to do the booking, if it does, skip 3,
3) start [Auth flow](#auth-flow),
4) attempt to do the booking and return the Status Form.


### Quick Booking Flow

Getting available TSP products for a trip

If quick booking flow is available for a segment, the available TSP products can be browsed for it without providing any authentication details. 

As part of the quick booking flow, the quickBookingUrl will then return a list of available TSP products, which notably each come:

- `tripUpdateURL`: A URL for fetching the trip, updated for this TSP product.
- `bookingURL`: A URL for initiating the booking flow for this TSP product (step 2 of [regular booking flow](#regular-booking-flow))
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

---

## Booking Form Specs

Both the booking flow and the auth flow use an ad-hoc format to handle the communication of data between the backend and the apps.

There exists three different forms:

- Booking Form
- Auth Form
- Status Form

All three share the same structure, while Auth and Status are specialized versions of the Booking Form with some extra data.

A Booking Form may include:

- a title
- a subtitle
- a value
- a `BookingAction`, which may include:
	- a `URL`, to go to the next step in the flow
    - a `title`
    - a `hudText`, with a human readable string describing the action (meant to be shown while waiting the response from the backend)
    - a boolean `finalStep`, meaning that the next step is the one that will actually do the booking.
    - a boolean `done`, indicating that there are no more steps in the flow.
- a list of `FormGroups`.

A `FormGroup` is a lisf of `FormFields` with a title and an optional footer.
A `FormField` is a structure that represents the data, either to show to the user or required in the backend for the next step. Each FormField will include:

- a (unique) `id`, to identify the field
- a `title`
- a `subtitle`
- a `sidetitle`
- a `value`, that will depend on the FormField type
- a boolean `required`, indicating that this is a required field to be POSTed,
- a boolean `readOnly`, indicating that this is information to be shown to the user but can not be edited.
- a boolean `hidden`, indicating that this field should NOT be shown to the user.

There are several types of FormFields:

- `string`, which adds the following values: placeHolder and KeyboardType {TEXT, EMAIL, PHONE, NUMBER}
- `text`, for long non-editable strings
- `switch`, for boolean values
- `option`, for a list of values, will include the list and the default value
- `address`, for locations, value with the following format {lat, lng, address, name}
- `datetime`, including the time value in long and an extra field with the timezone id 
- `stepper`, for int values, with extra max and min values
- `time`, for seconds since midnight
- `password`
- `link`, for urls, with an extra field called `method` with the following possible values:
	+ `refresh` meaning that this url will return the same step form,
	+ `post` meaning that the backend expects a POST on that url,
	+ `external` meaning that this will go to an external site, so, no BookingForm will be returned.

- `bookingForm`, this recursive case is used for showing multiple options, to show one item and allowing to navigate to the details without an extra backend request.
For example, it is possible that one bookingForm will include a list of BookingForms, one for each alternative TSP product. The idea is that the user can select one alternative and the app will show this nested BookingForm, which will have a BookingAction for the app to use, in order to continue the booking for that particular TSP product.

---

# Bookings in the TripKit SDKs

The TripKit SDKs implement support for bookings:

- [Bookings in TripKit Android](android.md)
- [Bookings in TripKit iOS](ios.md)