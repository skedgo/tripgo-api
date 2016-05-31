# Bookings in TripKit iOS

**Note: Enterprise customers-only**

**Note: Beta-only**

TripKit iOS supports all the booking API endpoints, including handling the OAuth process. OAuth credentials are stored securely in the device's keychain and, optionally, linked to the user's account.

## Preparations

To get started, configured your project as follows:

1. Include `BookingKit` from `shared-ios`, including all its dependencies.
2. Include `tripkit-ios` as a dependency, including its `Bookings` add-on.
3. Add the `OAuthCallbackURL` to your `Config.plist` configuration file.
4. Make sure your app has the URL scheme from that callback URL registered.

Next, you need to respond to calls to that `OAuthCallbackURL` in your application delegate by implementing `application(openURL:options)` (or its deprecated precursors), and handling the calls similar to this:

```swift
let OAuthCallbackURL = SGKConfig.sharedIntance().oauthCallbackURL()
if (URL.absoluteString.hasPrefix(OAuthCallbackURL.absoluteString)) {
  OAuthSwift.handleOpenURL(URL)
  return true
}
```

---

## Linking and unlinking accounts

You can then which accounts are available for linking for a given region:

```swift
let region = SVKRegionManager.sharedInstance().regionWithName(...)
region.linkedAccounts() { auths in
  for auth in auths {
    if auth.isConnected {
      // Update UI and allow unlinking
    } else {
      // Update UI and allow linking
    }
  }
}
```

This both checks which modes can be associated with an account, and also whether the credentials are already available. Credentials are available when they are either stored locally or associated with the user's account, **and** they have not expired.

To kick of linking, which saves the credentials locally and to the user's account (if the user is logged in), there's a helper based on `RxSwift`:

```swift
region.rx_linkAccount(mode, remoteURL: auth.actionURL)
  .subscribe { event in
    switch event {
    case .Next(let success):
      // Account has been linked. Update the UI.
    case .Error(let error):
      // Account could not get linked. Handle error.
      print(error)
    case .Completed:
      break // Nothing to do
    }
  }
  .addDisposableTo(disposeBag)
```

Note that this helper requires the `actionURL` as this is used to fetch what information is necessary for the OAuth flow for the provider servicing the specified `mode`:

These credentials will then be used automatically later on when bookings are made. To check, whether credentials are currently stored and still valid (they can expire), you can use the `region.linkedAccounts()` helper above.

For unlinking an account again there's another helper:

```swift
region.unlinkAccount(mode, remoteURL: auth.actionURL) { success in
  // Do something
}
```

Note that the helper for unlinking, only requires the `actionURL` when the OAuth credentials have been associated with the user's account. Unlinking removes credentials stored locally and those associated with the user's account.


---

## Getting available TSP products for a trip

Available TSP products for a trip are associated with a segment. The information about these products is not included in the standard routing responses, but needs to be fetched separately.

Whether such TSP products are available, is indicated by the segment having a `bookingQuickInternalURL`. If that URL exists, the `TKQuickBookingHelper` can then fetch all the available products:

```swift
TKQuickBookingHelper.fetchQuickBookings(forSegment: segment) { quickBookings in
  // Update UI
}
```

**Note**: Fetching this information does typically not require the user to have linked their account with the TSP of that segment.

Each of these come with a variety of information about the product, possibly including information on the price or ETA.

The two main actions that you can take with these details are:

1. Update the trip with the product, using the `tripUpdateURL` (see below for details). This is useful if you need the trip's properties to reflect the price and ETA of the selected product.
2. Book the product, the using `bookingURL` (see below for details).


---

## Booking a segment

Users can book trip on a segment-by-segment basis. The booking requires the `bookingURL` for the specific product that the user wants to book as mentioned in the previous section.

TripKit iOS has a helper method `BPKOperator.makeBookingToURL/2` which then initiates the booking:

```swift
let mode = segment.modeIdentifier()
BPKOperator.makeBookingToURL(mode, URL: bookingURL)
  .subscribe { event in
    switch event {
    case .Next(.UpdateTrip(let url)):
      // Booking went through. Update the trip (see below).
    case .Next(.LoadForm(let form)):
      // More information required.
      // Display booking form using `BPKBookingViewController`
    case .Next(.ShowAgreement(let displayUrl, let discardUrl))
      // User confirmation required.
    case .Error(let error):
      // Handle error
    case .Completed:
      break // Nothing to do
    }
  }
  .addDisposableTo(disposeBag)
}
```

This method does a handful of things:

1. It checks whether the user has already linked their account for the provider of the segment (the credentials are linked to the segment's mode, which is why the method takes the `mode` parameter).
    - If the user's account has not been linked, the `BPKOperator` will start the OAuth process described [in the section on linking accounts](#linking-and-unlinking-accounts).
    - If the user's account has already been linked, those credentials will be used.
    - If there's an error during this process, then observable aborts with an error.
2. An attempt to make the booking is performed, which can have the following outcomes:
    - The booking was successful and `BookingResult.UpdateTrip` is returned with a URL to update the trip, which will then include the confirmation details.
    - The booking can be made, but more information is required by the user. This is the case `BookingResult.LoadTrip` which returns a booking form, which can be then be displayed using the `BPKBookingViewController`.
    - The booking can be made, but the user first need to accept an agreement. This is the case ``BookingResult.UpdateTrip` which returns two URLs. The first URL should be displayed to the user, and the user has accepted the terms once the user gets to the second URL. If the user accepted, you should then kick off the initial call to `BPKOperator.makeBookingToURL` again.
    - If there's an error, the observable aborts with an error.

---

## Updating trip with booking details / confirmation

As described above, the booking process provides URLs to fetch an update of the trip. This can be used to update a trip with a selected TSP process, and also to fetch the booking status of a trip.

This process is the same as updating a trip with real-time data, e.g.:

```swift
let router = TKBuzzRouter()
let context = TKTripKit.sharedInstance().tripKitContext
router.downloadTrip(url, intoTripKitContext: context) { updatedTrip in
  if let updatedTrip = updatedTrip {
    let request = originalTrip.request
    originalTrip.removeFromRequest()
    updatedTrip.moveToRequest(request, markAsPreferred: true)
  }
}
```

Noteworthy is here, the `segment.bookingConfirmation` property provided by `TKQuickBookingHelper` which returns a `TKBookingConfirmation` struct after a booking has been made. This struct includes:

- `status`: A title and optional description describing the current status of the trip.
- Information on the `provider` and `vehicle` servicing this booking. Note that these can be missing; typically while the booking is still being processed by the TSP, in the cast that it has been cancelled, or also after the trip has been completed.
- A list of actions, such as calling the provider or cancelling the booking.
