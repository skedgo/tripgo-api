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

`// TODO`

```swift
TKQuickBookingHelper.fetchQuickBookings(forSegment: segment) { quickBookings in
  // Update UI
}
```

---

## Booking a segment

`// TODO`

```swift
let mode = segment.modeIdentifier()
BPKOperator.makeBookingToURL(mode, URL: bookingURL)
  .subscribe { event in
    switch event {
    case .Next(let result):
      switch result {
      case .UpdateTrip(let url):
        // Booking went through. Update the trip (see below).
      case .LoadForm(let form):
        // More information required.
        // Display booking form using `BPKBookingViewController`
      }
    case .Error(let error):
      // Handle error
    case .Completed:
      break // Nothing to do
    }
  }
  .addDisposableTo(disposeBag)
}

```

---

## Updating trip with booking details


`// TODO`

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

