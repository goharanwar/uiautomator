const humps = require('humps');
const Server = require('../communication');
const Selector = require('./selector');

const pressKeyMethods = ['home', 'volumeUp', 'volumeDown', 'volumeMute', 'back', 'right', 'left',
  'up', 'down', 'menu', 'search', 'center', 'enter', 'delete', 'recent', 'camera', 'power'
];
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

  swipe (startX, startY, endX, endY, steps) {

    return this._server.send('swipe', [startX, startY, endX, endY, (steps || 100)]);

  }

  drag (startX, startY, endX, endY, steps) {

    return this._server.send('drag', [startX, startY, endX, endY, (steps || 100)]);

  }

  info () {

    return this._server.send('deviceInfo', []);

  }

  dump (compressed) {

    return this._server.send('dumpWindowHierarchy', [compressed]);

  }

  screenshot (filename, scale, quality, saveInExternalStorage) {

    return this._server.send('takeScreenshot', [filename, scale, quality, (saveInExternalStorage || false)]);

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
