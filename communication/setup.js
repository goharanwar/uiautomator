const proc = require('child_process');

class Setup {

  constructor (apks, options) {

    this._apks = apks;
    this._port = options.port;
    this._devicePort = options.devicePort;
    this._serial = options.serial;

  }

  async init (keepApks) {

    this._installIfNecessary(keepApks);
    this._forward();
    this._start();
    return true;

  }

  _installIfNecessary (keepApks) {

    const installedApps = this.getInstalledApks();

    if (!keepApks) {

      this.removeAlreadyInstalledApks(installedApps.app, installedApps.testApp);
      this.installApks();

    } else if (!installedApps.app || !installedApps.testApp) {

      this.installApks();

    }

  }

  installApks () {

    try {

      for (const index in this._apks) {

        proc.execSync(['adb']
          .concat(this._serialArr())
          .concat(['install -t -r'])
          .concat([this._apks[index]]).join(' '));

      }

    } catch (error) {

      throw new Error(`uiautomator-server: Error occured while installing APKs on device ${error.message || error}`);

    }

  }

  getInstalledApks () {

    try {

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
      const appStatus = {
        app: hasApp,
        testApp: hasTestApp

      };
      return appStatus;

    } catch (error) {

      throw new Error(`uiautomator-server: Error occured while getting installed APKs ${error.message || error}`);

    }

  }

  removeAlreadyInstalledApks (app, testApp) {

    try {

      if (app) {

        proc.execSync(['adb']
          .concat(this._serialArr())
          .concat(['shell pm uninstall com.github.uiautomator'])
          .join(' '));

      }

      if (testApp) {

        proc.execSync(['adb']
          .concat(this._serialArr())
          .concat(['shell pm uninstall com.github.uiautomator.test'])
          .join(' '));

      }

      return true;

    } catch (error) {

      throw new Error(`uiautomator-server: Error occured while uninstalling APKs from device ${error.message || error}`);

    }

  }

  _forward () {

    try {

      proc.execSync(['adb']
        .concat(this._serialArr())
        .concat(['forward', `tcp:${this._port}`, `tcp:${this._devicePort}`]).join(' '));

    } catch (error) {

      throw new Error(`uiautomator-server: Error occured while forwarding tcp port ${error.message || error}`);

    }

  }

  _start () {

    try {

      this._uiautomator_process = proc.spawn('adb', this._serialArr().concat(['shell', 'am', 'instrument', '-w',
        'com.github.uiautomator.test/android.support.test.runner.AndroidJUnitRunner'
      ]));

    } catch (error) {

      throw new Error(`uiautomator-server: Error occured while starting test app ${error.message || error}`);

    }

  }

  _serialArr () {

    return this._serial ? ['-s', this._serial] : [];

  }

  process () {

    return this._uiautomator_process;

  }

}

module.exports = Setup;
