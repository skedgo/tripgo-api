# Push Notifications

**Note: Enterprise customers-only**

**Note: Beta-only**

![Notification](/img/tripgo-api-notification@2x-100.jpg)

We support Push Notifications for both Android (using [Firebase](https://firebase.google.com/docs/notifications/?hl=es)) and iOS (using [APN](https://developer.apple.com/notifications/)) devices. In order to enable and use Push Notifications, the following steps are required:

- Register (only once) in SkedGo backend the corresponding credentials/certificates for each platform (See sections below for details).
- Each app instance should register itself in the corresponding platform and save the obtained token in SkedGo database, using [data/user/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint.
- To send PN to your user, you need to know the user ID on our database and use [data/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint, which is filtered by IP address (check with us whether your IP address is whitelisted). 


## Android

You need to create your own project in [Firebase](https://console.firebase.google.com) and send to us the `Server Key` in your `project settings > cloud messaging` tab.

For instructions on how to implement Push Notifications in Android, go to [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging).

In short, your app needs to register into FCM to get a token and save it into our database for later usage (see [data/user/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint). Note that this token may change, any time that happens you need to save it again in the database.


## iOS

You need to configure your app for APN, follow instructions [from Apple](http://help.apple.com/xcode/mac/current/#/dev11b059073) or [use fastlane](https://docs.fastlane.tools/actions/pem/), and then send us both the P12 file, containing the [Apple Push Notification Authentication Key](http://help.apple.com/xcode/mac/current/#/dev11b059073?sub=dev1eb5dfe65), and the password to unlock it.

For instructions on how to implement Push Notifications in iOS, go to [Configuring Remote Notification](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/HandlingRemoteNotifications.html#//apple_ref/doc/uid/TP40008194-CH6-SW4).

In short, your app needs to register into APN to get a token and save it into our database for later usage (see [data/user/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint). Note that this token may change, any time that happens you need to save it again in the database. The token returned by the iOS SDK will be a binary data object, while our backend expends a string. To turn the data into a string, use this snipped:

```swift
let tokenString = tokenData.reduce(into: "") { $0.append(String(format: "%02X", $1)) }
```

When receiving push notifications, additional fields that were provide in the `data` part when sending the notification, will be accessible to your app via the `userInfo` that's attached to the content of the notification. The `clickAction` will end up in the notification's content's `categoryIdentifier`.


## Sending PN

If you want to send PN to your users, you first need to have your server/s IP/s address/es whitelisted in our platform. Then, you can use [data/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint to send notifications to a list of users (by their userID).

Notifications that we send support a title, message, sound and badge, with a ttl (time to live) value, as well as custom `data` which will be passed on to your apps. Be mindful of size limits imposed by Firebase or APN.