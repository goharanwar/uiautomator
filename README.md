# uiautomator

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e8d1f9375650459eaf91d889f2183a4e)](https://app.codacy.com/app/goharanwar/uiautomator?utm_source=github.com&utm_medium=referral&utm_content=goharanwar/uiautomator&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/goharanwar/uiautomator.svg?branch=master)](https://travis-ci.org/goharanwar/uiautomator)
[![npm version](https://badge.fury.io/js/uiautomator-server.svg)](https://badge.fury.io/js/uiautomator-server)
[![GitHub issues](https://img.shields.io/github/issues/goharanwar/uiautomator.svg)](https://github.com/goharanwar/uiautomator/issues)
[![GitHub stars](https://img.shields.io/github/stars/goharanwar/uiautomator.svg)](https://github.com/goharanwar/uiautomator/stargazers)
[![GitHub license](https://img.shields.io/github/license/goharanwar/uiautomator.svg)](https://github.com/goharanwar/uiautomator/blob/master/LICENSE) [![Greenkeeper badge](https://badges.greenkeeper.io/goharanwar/uiautomator.svg)](https://greenkeeper.io/)

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

### Default options

These are the default options. You can override them as needed

```javascript
{
    hostname: 'localhost',
    commandsExecutionDelay: 10, //Delay between commands in ms
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

-   Methods that work with Selectors:

    -   clickAndWaitForNewWindow

        Performs a click at the center of the visible bounds of the UI element represented by this UiObject and waits for window transitions. This method differ from click() only in that this method waits for a a new window transition as a result of the click.
        Some examples of a window transition:

        -   launching a new activity
        -   bringing up a pop-up menu
        -   bringing up a dialog
              


        ```javascript
        /*
        *
        * @params selectorObject
        * @params timeout (in milliseconds)
        * @returns true if the event was triggered, else false
        */
        waitForExists(selectorObject, timeout)

        // Example:
        await device.clickAndWaitForNewWindow(
            {
                className: "android.widget.CheckBox",
                instance: 0
            });
        ```


    -   waitForExists

        Waits a specified length of time for a view to become visible. This method waits until the view becomes visible on the display, or until the timeout has elapsed. You can use this method in situations where the content that you want to select is not immediately displayed.

        ```javascript
        /*
        *
        * @params selectorObject
        * @params timeout
        * @returns true or false
        */
        waitForExists(selectorObject, timeout)

        // Example:
        await device.waitForExists(
            {
                description: 'Back',
                className: "android.widget.ImageView",
                package: "com.android.systemui",
                resourceId: "com.android.systemui:id/back"
            });
        ```

    -   waitForIdle

        Waits for the current application to idle.

        ```javascript
        /*
        *
        * @param timeout in milliseconds
        */
        waitForIdle(timeout)

        // Example:
        await device.waitForIdle( 1000 );
        ```

    -   waitUntilGone

        Waits a specified length of time for a view to become undetectable. This method waits until a view is no longer matchable, or until the timeout has elapsed. A view becomes undetectable when the Selector of the object is unable to find a match because the element has either changed its state or is no longer displayed. You can use this method when attempting to wait for some long operation to complete, such as downloading a large file or connecting to a remote server.

        ```javascript
        /*
        * @param selectorObject the target ui object
        * @param timeout time to wait (in milliseconds)
        * @return true if the element is gone before timeout elapsed, else false if timeout elapsed but a matching element is still found.
        */
        waitUntilGone(selectorObject, timeout)

        // Example:
        await device.waitUntilGone(
            {
               text: "Open menu" 
            }, 5000);
        ```

    -   scrollTo

        Perform a scroll forward action to move through the scrollable layout element until a visible item that matches the selector is found.

        ```javascript
        /*
        * @param scrollableObject        the selector of the scrollable object
        * @param targetObj  the item matches the selector to be found.
        * @param isVertical vertical or horizontal
        * @return true on scrolled, else false
        */
        scrollTo (scrollableObject, targetObj, isVertical)

        // Example:
        await device.scrollTo(
            {
                description: 'My Scroll View',
                
            },{
                text: 'My text element'
            },
            true
            );
        ```

    -   clearTextField

        Clears the existing text contents in an editable field. The selector of this object must reference a UI element that is editable. When you call this method, the method first sets focus at the start edge of the field. The method then simulates a long-press to select the existing text, and deletes the selected text. If a "Select-All" option is displayed, the method will automatically attempt to use it to ensure full text selection. Note that it is possible that not all the text in the field is selected; for example, if the text contains separators such as spaces, slashes, at symbol etc. Also, not all editable fields support the long-press functionality.

        ```javascript
        /*
        *
        * @param selectorObject the selector JSON object containing element properties
        */
        clearTextField (selectorObject)

        // Example:
        await device.clearTextField(
            {
                text: 'Enter email here'
            });
        ```

    -   exist

        Check if view exists. This methods performs a waitForExists(timeout) with zero timeout. This basically returns immediately whether the view represented by this UiObject exists or not.

        ```javascript
        /*
        *
        * @params selectorObject
        * @params timeout
        * @returns true or false
        */
        exist (selectorObject)

        // Example:
        await device.exist(
            {
                description: 'Back',
                className: "android.widget.ImageView",
                package: "com.android.systemui",
                resourceId: "com.android.systemui:id/back"
            });
        ```

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
