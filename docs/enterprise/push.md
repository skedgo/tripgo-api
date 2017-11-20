# Push Notifications

**Note: Enterprise customers-only**

**Note: Beta-only**

![Notification](/img/tripgo-api-notification@2x-100.jpg)

We support Push Notifications for both Android (using [Firebase](https://firebase.google.com/docs/notifications/?hl=es)) and iOS (using [APN](https://developer.apple.com/notifications/)) devices. In order to enable and use Push Notifications, the following steps are required:

- Register (only once) in SkedGo backend the corresponding credentials/certificates for each platform (See sections below for details).
- Each app instance should register itself in the corresponding platform and save the obtained token in SkedGo database, using [/api/user/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint.
- To send PN to your user, you need to know the user ID on our database and use [/api/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint, which is filtered by IP address (check with us whether your IP address is whitelisted). 

## Android

You need to create your own project in [Firebase](https://console.firebase.google.com) and send to us the `Server Key` in your `project settings > cloud messaging` tab.

For instructions on how to implement Push Notifications in Android, go to [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging).

In short, your app needs to register into FCM to get a token and save it into our database for later usage (see [/user/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint). Note that this token may change, any time that happens you need to save it again in the database.


## iOS

You need to configure your app for APN, follow instructions [here](http://help.apple.com/xcode/mac/current/#/dev11b059073) and send us the [Apple Push Notification Authentication Key](http://help.apple.com/xcode/mac/current/#/dev11b059073?sub=dev1eb5dfe65) and its password.

For instructions on how to implement Push Notifications in iOS, go to [Configuring Remote Notification](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/HandlingRemoteNotifications.html#//apple_ref/doc/uid/TP40008194-CH6-SW4).

In short, your app needs to register into APN to get a token and save it into our database for later usage (see [/api/user/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint). Note that this token may change, any time that happens you need to save it again in the database.

## Sending PN

If you want to send PN to your users, you first need to have your server/s IP/s address/es whitelisted in our platform. Then, you can use [/api/push](https://developer.tripgo.com/swagger/?url=https://raw.githubusercontent.com/skedgo/tripgo-api/gh-pages/specs/pn.swagger.yaml) endpoint to send notifications to a list of users (by their userID).

Currently, we only support a simple notification that includes a message, a sound and a badge, with a ttl (time to live) value. If you need other kinds of notifications, please contact us.



