# uiautomator

[![Build Status](https://travis-ci.org/goharanwar/uiautomator.svg?branch=master)](https://travis-ci.org/goharanwar/uiautomator)
[![npm version](https://badge.fury.io/js/uiautomator-server.svg)](https://badge.fury.io/js/uiautomator-server)
[![GitHub issues](https://img.shields.io/github/issues/goharanwar/uiautomator.svg)](https://github.com/goharanwar/uiautomator/issues)
[![GitHub stars](https://img.shields.io/github/stars/goharanwar/uiautomator.svg)](https://github.com/goharanwar/uiautomator/stargazers)
[![GitHub license](https://img.shields.io/github/license/goharanwar/uiautomator.svg)](https://github.com/goharanwar/uiautomator/blob/master/LICENSE)

Light weight and robust NodeJS wrapper for UIAutomator2 with builtin server for device.
It works on Android 4.1+ simply with Android device attached via adb, no need to install anything on Android device.

_Note: This module is using UIAutomator version 2.1.3_

## Installation

```cli
npm install uiautomator-server
```

## Usage

```javascript
const UIAutomator = require('uiautomator-server');

const device = new UIAutomator();
await device.connect();
await device.click({description: 'Apps'});
const deviceInfo = await device.info();
console.log(deviceInfo);
```

## Device setup

```javascript
const UIAutomator = require('uiautomator-server');
const options = {
    serial: '192.168.57.101:5555'
}

const device = new UIAutomator(options);
await device.connect(); // This will start the uiautomator server on device. Now you can continue calling the api
```

**Default options:**

These are the default options. You can override them as needed

```javascript
{
    hostname: 'localhost',
    commadsExecutionDelay: 10, //Delay between commands in ms
    port: 9008,
    devicePort: 9008,
    connectionMaxTries: 5,
    connectionTriesDelay: 1000, // In ms
    serial: undefined //Not necessary if there is only one device available
}
```

### API

-   Device connect

    ```javascript
    /* @param {Boolean} keepApks - Optional. Send true if you dont want to uninstall existing uiautomator-server apks on device. Default value is false. If false, it will remove the existing uiautomator-server apks (if any) and reinstall them
     * @returns {Promise}
     */
    device.connect(keepApks);
    ```

-   Device info

    ```javascript
    /*
     * @returns {Promise} - resolves with device info object
     */
    device.info();
    ```

-   Stop UIAutomator on device

    ```javascript
    /* Kills the uiautomator process on device
     * @param {Boolean} keepApks - Optional. Send true if you dont want to uninstall existing uiautomator-server apks on device. Default value is false. If false, it will remove the existing uiautomator-server apks (if any) on stop.
     * @returns {Promise}
     */
    device.stop(keepApks);
    ```

-   UI Heirarchy Dump

    ```javascript
    /* @param {Boolean} compressed - Whether you want compressed xml
     * @returns {Promise} - resolves with ui heirarchy dump as a string
     */
    device.dump(false);

    <!-- Example: -->
    const xmlDumpString = await device.dump(false);
    ```

-   Take Screenshot

    ```javascript
    /* @param {String} fileName - Target file name with extension
     * @param {Number} Scale - Image scale factor
     * @param {Number} ImageQuality
     * @param {Boolean} saveInExternalStorage - should save screenshot in external storage or not. Useful for phones (e.g Samsung S8, S6 - 7.0 API 24) which have permission issues
     * @returns {Promise} - resolves with screenshot filepath on device
     */
    device.screenshot('screenshot.png', 1, 100, saveInExternalStorage);
    //You will have to pull the screenshot file manually using adb
    ```

-   Key events

    ```javascript
    //Press home
    device.home()
    //Press back
    device.back()
    ```

    -   All key functions:

        -   `home`
        -   `back`
        -   `left`
        -   `right`
        -   `up`
        -   `down`
        -   `center`
        -   `menu`
        -   `search`
        -   `enter`
        -   `delete`
        -   `recent`(recent apps)
        -   `volumeUp`
        -   `volumeDown`
        -   `volumeMute`
        -   `camera`
        -   `power`

-   Click the screen

    ```javascript
    // click (x, y) on screen
    device.click(x, y);
    ```

-   Swipe

    ```javascript
    // swipe from (startX, startY) to (endX, endY)
    device.swipe(startX, startY, endX, endY)
    // swipe from (startX, startY) to (endX, endY) with 10 steps
    const steps = 10
    device.swipe(startX, startY, endX, endY, steps)
    ```

-   Drag

    ```javascript
    // drag from (startX, startY) to (endX, endY)
    device.drag(startX, startY, endX, endY)
    // drag from (startX, startY) to (endX, endY) with 10 steps
    const steps = 10
    device.drag(startX, startY, endX, endY, steps)
    ```

-   Selectors
    ```javascript
    device.click({description: 'Apps'});
    ```
    -   Supported Selectors:
        -   `text`
        -   `textContains`
        -   `textMatches`
        -   `textStartsWith`
        -   `className`
        -   `classNameMatches`
        -   `description`
        -   `descriptionContains`
        -   `descriptionMatches`
        -   `descriptionStartsWith`
        -   `checkable`
        -   `checked`
        -   `clickable`
        -   `longClickable`
        -   `scrollable`
        -   `enabled`
        -   `focusable`
        -   `focused`
        -   `selected`
        -   `packageName`
        -   `packageNameMatches`
        -   `resourceId`
        -   `resourceIdMatches`
        -   `index`
        -   `instance`
-   Methods
    ```javascript
    device.openNotification();
    ```
    -   Supported Methods:
        -   `wakeUp`
        -   `sleep`
        -   `openNotification`
        -   `openQuickSettings`
        -   `isScreenOn`

## Notes

-   More functions coming soon. Create ticket on github if you want some functionality on priority basis. You are welcome if you want to make contributions!
-   Android [uiautomator](https://developer.android.com/training/testing/ui-testing/index.html) works on Android 4.1+, so before using it, make sure your device is Android4.1+.
-   Some methods are only working on Android 4.2/4.3, so you'd better read detailed [java documentation of uiautomator](http://developer.android.com/tools/help/uiautomator/index.html) before using it.
-   The package uses [uiautomator-jsonrpc-server](https://github.com/goharanwar/android-uiautomator-server) as its daemon to communicate with devices.

### Acknowledgement

This package is inspired by [xiaocong/uiautomator](https://github.com/xiaocong/uiautomator).
