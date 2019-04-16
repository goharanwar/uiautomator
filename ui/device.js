const humps = require('humps');
const Server = require('../communication');
const Selector = require('./selector');

const pressKeyMethods = ['home', 'volumeUp', 'volumeDown', 'volumeMute', 'back', 'right', 'left', 'up', 'down', 'menu', 'search', 'center', 'enter', 'delete', 'recent', 'camera', 'power'];
const aloneMethods = ['wakeUp', 'sleep', 'openNotification', 'openQuickSettings', 'isScreenOn'];

class Device {

  constructor (options) {

    this._register(pressKeyMethods, 'pressKey');
    this._register(aloneMethods);
    this._server = new Server(options);

  }

  connect (keepApks) {

    return this._server.start(keepApks);

  }

  stop (keepApks) {

    return this._server.stop(keepApks);

  }

  disableKeyboard () {

    return this._server.disableKeyboard();

  }

  enableKeyboard () {

    return this._server.enableKeyboard();

  }

  isConnected () {

    return this._server.isAlive();

  }

  click (selector, y) {

    // If we have two paramenters that means we want to tap on coordinates
    if (y) {

      return this._server.send('click', [selector, y]);

    }
    const preparedSelector = new Selector(selector);
    return this._server.send('click', [preparedSelector]);

  }

  /**
   * Performs a click at the center of the visible bounds of the UI element represented by this UiObject and waits for window transitions. This method differ from click() only in that this method waits for a a new window transition as a result of the click.
   * Some examples of a window transition:
   * - launching a new activity
   * - bringing up a pop-up menu
   * - bringing up a dialog
   * @param selectorObject - The target ui object
   * @param timeout - time to wait (in milliseconds)
   * @return true if the event was triggered, else false
   */
  clickAndWaitForNewWindow (selectorObject, timeout) {

    return this._server.send('clickAndWaitForNewWindow', [selectorObject, timeout]);

  }

  swipe (startX, startY, endX, endY, steps) {

    return this._server.send('swipe', [startX, startY, endX, endY, steps || 100]);

  }

  drag (startX, startY, endX, endY, steps) {

    return this._server.send('drag', [startX, startY, endX, endY, steps || 100]);

  }

  info () {

    return this._server.send('deviceInfo', []);

  }

  dump (compressed) {

    return this._server.send('dumpWindowHierarchy', [compressed]);

  }

  screenshot (filename, scale, quality, saveInExternalStorage) {

    return this._server.send('takeScreenshot', [filename, scale, quality, saveInExternalStorage || false]);

  }

  /**
   * Waits a specified length of time for a view to become visible. This method waits until the view becomes visible on the display, or until the timeout has elapsed. You can use this method in situations where the content that you want to select is not immediately displayed.
   *
   * @param selectorObject - The target ui object
   * @param timeout - time to wait (in milliseconds)
   * @return true if the view is displayed, else false if timeout elapsed while waiting
   */
  waitForExists (selectorObject, timeout) {

    return this._server.send('waitForExists', [selectorObject, timeout]);

  }

  /**
   * Waits for the current application to idle.
   *
   * @param timeout in milliseconds
   */
  waitForIdle (timeout) {

    return this._server.send('waitForIdle', [timeout]);

  }

  /**
   * Waits a specified length of time for a view to become undetectable. This method waits until a view is no longer matchable, or until the timeout has elapsed. A view becomes undetectable when the Selector of the object is unable to find a match because the element has either changed its state or is no longer displayed. You can use this method when attempting to wait for some long operation to complete, such as downloading a large file or connecting to a remote server.
   *
   * @param selectorObject     the target ui object
   * @param timeout time to wait (in milliseconds)
   * @return true if the element is gone before timeout elapsed, else false if timeout elapsed but a matching element is still found.
   */

  waitUntilGone (selectorObject, timeout) {

    return this._server.send('waitUntilGone', [selectorObject, timeout]);

  }

  /**
   * Perform a scroll forward action to move through the scrollable layout element until a visible item that matches the selector is found.
   *
   * @param scrollableObject        the selector of the scrollable object
   * @param targetObj  the item matches the selector to be found.
   * @param isVertical vertical or horizontal
   * @return true on scrolled, else false
   *
   */
  scrollTo (scrollableObject, targetObj, isVertical) {

    return this._server.send('scrollTo', [scrollableObject, targetObj, isVertical]);

  }

  /**
   * Clears the existing text contents in an editable field. The selector of this object must reference a UI element that is editable. When you call this method, the method first sets focus at the start edge of the field. The method then simulates a long-press to select the existing text, and deletes the selected text. If a "Select-All" option is displayed, the method will automatically attempt to use it to ensure full text selection. Note that it is possible that not all the text in the field is selected; for example, if the text contains separators such as spaces, slashes, at symbol etc. Also, not all editable fields support the long-press functionality.
   *
   * @param selectorObject the selector JSON object containing element properties
   *
   */
  clearTextField (selectorObject) {

    return this._server.send('clearTextField', [selectorObject]);

  }

  /**
   * Check if view exists. This methods performs a waitForExists(timeout) with zero timeout. This basically returns immediately whether the view represented by this UiObject exists or not.
   *
   * @param selectorObject the ui object/element.
   * @return true if the view represented by this selector object/element does exist
   */

  exist (selectorObject) {

    return this._server.send('exist', [selectorObject]);

  }

  /**
   * Simulates orienting the device to the left/right/natural and also freezes rotation by disabling the sensors.
   *
   * @param orientationDirection Left or l, Right or r, Natural or n, case insensitive
   *
   */
  setOrientation (orientationDirection) {

    return this._server.send('setOrientation', [orientationDirection]);

  }

  /**
   * Disables the sensors and freezes the device rotation at its current rotation state, or enable it.
   *
   * @param freeze true to freeze the rotation, false to unfreeze the rotation.
   *
   */
  freezeRotation (freeze) {

    return this._server.send('freezeRotation', [freeze]);

  }

  /**
   * Simulates a short press using a key code. See Android KeyEvent.
   *
   * @param keyCode the key code of the event.
   * @param metaState an integer in which each bit set to 1 represents a pressed meta key
   * @return true if successful, else return false
   */
  pressKeyCode (keyCode, metaState) {

    if (metaState) {

      return this._server.send('pressKeyCode', [keyCode, metaState]);

    }

    return this._server.send('pressKeyCode', [keyCode]);

  }

  _register (methods, prefix) {

    for (const method of methods) {

      const decamelizedMethodName = humps.decamelize(method);
      if (prefix) {

        this[method] = () => this._server.send(prefix, [decamelizedMethodName]);

      } else {

        this[method] = () => this._server.send(method, []);

      }

    }

  }

}

exports.Device = Device;
