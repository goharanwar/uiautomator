const humps = require('humps');
const Server = require('../communication');
const Selector = require('./selector');

class Device {

  constructor (cb, options) {

    const pressKeyMethods = ['home', 'volumeUp', 'volumeDown', 'volumeMute', 'back', 'right', 'left',
      'up', 'down', 'menu', 'search', 'center', 'enter', 'delete', 'recent', 'camera', 'power'
    ];
    const aloneMethods = ['wakeUp', 'sleep', 'openNotification', 'openQuickSettings', 'isScreenOn'];
    this._register(pressKeyMethods, 'pressKey');
    this._register(aloneMethods);
    const self = this;
    this._server = new Server((err, data) => {

      cb(err, self);

    }, options);

  }

  stop (cb) {

    this._server.stop(cb);

  }

  isConnected (cb) {

    this._server.isAlive(cb);

  }

  click (selector, cb) {

    const preparedSelector = new Selector(selector);
    this._server.send('click', [preparedSelector], cb);

  }

  info (cb) {

    this._server.send('deviceInfo', [], cb);

  }

  dump (compressed, cb) {

    this._server.send('dumpWindowHierarchy', [compressed], cb);

  }

  screenshot (filename, scale, quality, cb) {

    this._server.send('takeScreenshot', [filename, scale, quality], cb);

  }

  _register (methods, prefix) {

    for (const index in methods) {

      const methodName = methods[index];
      const decamelizedMethodName = humps.decamelize(methodName);
      if (prefix) {

        this[methodName] = function createMethodWithPrefix (cb) {

          this._server.send(prefix, [decamelizedMethodName], cb);

        };

      } else {

        this[methodName] = function createMethod (cb) {

          this._server.send(methodName, [], cb);

        };

      }

    }

  }

}

exports.Device = Device;
