
const proc = require('child_process');

class Setup {

  constructor (apks, options) {

    this._apks = apks;
    this._port = options.port;
    this._devicePort = options.devicePort;
    this._serial = options.serial;

  }

  init (cb) {

    this._installIfNecessary();
    this._forward();
    this._start();
    cb();

  }

  _installIfNecessary () {

    const packages = new String(proc.execSync(['adb']
      .concat(this._serialArr())
      .concat(['shell pm list packages'])
      .join(' ')))
      .split('\n');

    let hasApp = false;
    let hasTestApp = false;
    for (const i in packages) {

      const pkg = packages[i];
      hasApp |= pkg.indexOf('com.github.uiautomator') >= 0;
      hasTestApp |= pkg.indexOf('com.github.uiautomator.test') >= 0;

    }

    if (!hasApp || !hasTestApp) {

      for (const index in this._apks) {

        proc.execSync(['adb']
          .concat(this._serialArr())
          .concat(['install -t -r'])
          .concat([this._apks[index]]).join(' '));

      }

    }

  }

  _forward () {

    proc.execSync(['adb']
      .concat(this._serialArr())
      .concat(['forward', `tcp:${this._port}`, `tcp:${this._devicePort}`]).join(' '));

  }

  _start () {

    this._uiautomator_process = proc.spawn('adb', this._serialArr().concat(['shell', 'am', 'instrument', '-w',
      'com.github.uiautomator.test/android.support.test.runner.AndroidJUnitRunner']));

  }

  _serialArr () {

    return this._serial ? ['-s', this._serial] : [];

  }

  process () {

    return this._uiautomator_process;

  }

}

module.exports = Setup;
