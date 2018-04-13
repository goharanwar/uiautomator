# uiautomator

Light weight and robust NodeJS wrapper for UiAutomator with builtin server for device.
It works on Android 4.1+ simply with Android device attached via adb, no need to install anything on Android device.

## Installation

```cli
npm install uiautomator-server
```

## Usage

```javascript
const UIAutomator = require('uiautomator-server');

const myDevice = new UIAutomator((error, device) => {
    device.click({description: 'Apps'}, (error, result) => {
        //Handle result
        device.info((error, info) => {
            console.log(error, info);
        })
    });
});
```

## Device setup

```javascript
const UIAutomator = require('uiautomator-server');
const options = {
    serial: '192.168.57.101:5555'
}

new UIAutomator((error, device) => {
    /* ... */
}, options);
```

Default options:

```javascript
{
    hostname: 'localhost',
    commandsDelay: 10, //delay between commands in milli seconds
    port: 9008,
    devicePort: 9008,
    connectionMaxTries: 5,
    connectionTriesDelay: 1000, // In ms
    serial: undefined //Not necessary if there is only one device available
}

```

### API

* Device info

    ```javascript
    device.info((error, info) => {})
    ```
* UI heirarchy Dump

    ```javascript
    /* @param {Boolean} compressed - Whether you want compressed xml
     * @param {Function} - Callback function
     */
    device.dump(false, (error, xmlString) => {
      console.log(`XML Dump : ${xmlString}`)
    })
    ```

* Take Screenshot

    ```javascript
    /* @param {String} fileName - Target file name with extension
     * @param {Number} Scale - Image scale factor
     * @param {Number} ImageQuality
     * @param {Function} - Callback function
     */
    device.screenshot('screenshot.png', 1, 100, (error, filePath) => {
      console.log(`Screenshot save at : ${filePath}`);
      //You will have to pull the file manually using adb
    })
* Key events
    ```javascript
    //Press home
    device.home(callback)
    //Press back
    device.back(callback)
    ```
  * All key functions:

    * `home`
    * `back`
    * `left`
    * `right`
    * `up`
    * `down`
    * `center`
    * `menu`
    * `search`
    * `enter`
    * `delete`
    * `recent`(recent apps)
    * `volumeUp`
    * `volumeDown`
    * `volumeMute`
    * `camera`
    * `power`

* Selectors
    ```javascript
    device.click({description: 'Apps'}, callback);
    ```
  * Supported Selectors:
    * `text`
    * `textContains`
    * `textMatches`
    * `textStartsWith`
    * `className`
    * `classNameMatches`
    * `description`
    * `descriptionContains`
    * `descriptionMatches`
    * `descriptionStartsWith`
    * `checkable`
    * `checked`
    * `clickable`
    * `longClickable`
    * `scrollable`
    * `enabled`
    * `focusable`
    * `focused`
    * `selected`
    * `packageName`
    * `packageNameMatches`
    * `resourceId`
    * `resourceIdMatches`
    * `index`
    * `instance`

## Notes

* More functions coming soon. Create ticket on github if you want some functionality on priority basis. You are welcome if you want to make contributions!
* Android [uiautomator](https://developer.android.com/training/testing/ui-testing/index.html) works on Android 4.1+, so before using it, make sure your device is Android4.1+.
* Some methods are only working on Android 4.2/4.3, so you'd better read detailed [java documentation of uiautomator](http://developer.android.com/tools/help/uiautomator/index.html) before using it.
* The module uses [uiautomator-jsonrpc-server](https://github.com/xiaocong/android-uiautomator-server) as its daemon to communicate with devices.

### Acknowledgement

This package is inspired by [xiaocong/uiautomator](https://github.com/xiaocong/uiautomator) python library, even using its [android-uiautomator-server](https://github.com/xiaocong/android-uiautomator-server).