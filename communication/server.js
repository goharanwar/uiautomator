const path = require('path');
const fs = require('fs');
const request = require('request');
const url = require('url');
const Setup = require('./setup');

const defaultOptions = {
  hostname: 'localhost',
  commandsExecutionDelay: 10,
  port: 9008,
  devicePort: 9008,
  connectionMaxTries: 5,
  connectionTriesDelay: 1000,
  unicodeKeyboard: false,
  resetKeyboard: false

};

const getPath = relativePath => path.join(path.dirname(fs.realpathSync(__filename)), relativePath);

class Server {

  constructor (newOptions) {

    this.options = Object.assign({}, defaultOptions, newOptions);
    this.url = url.format({
      protocol: 'http',
      hostname: this.options.hostname,
      port: this.options.port
    });
    this.jsonrpc_url = url.resolve(this.url, '/jsonrpc/0');
    this.stop_url = url.resolve(this.url, '/stop');
    this._counter = 0;
    this._setup = new Setup(
      [
        getPath('../libs/app-uiautomator.apk'),
        getPath('../libs/app-uiautomator-test.apk')
      ],
      this.options,
      getPath('../libs/UnicodeIME-debug.apk')
    );
    this._connectionTries = 0;

  }

  start (keepApks) {

    const self = this;
    return self._setup.init(keepApks)
      .then(() => self.verifyConnection());

  }

  async stop (keepApks) {

    try {

      request.get(this.stop_url, {}, () => {});
      this._setup.process().stdin.pause();
      this._setup.process().kill();
      if (!keepApks) {

        const installedApps = this._setup.getInstalledApks();

        this._setup.removeAlreadyInstalledApks(installedApps.app, installedApps.testApp, installedApps.keyboardApp);

      }

      if (this.options.resetKeyboard) {

        await this._setup.disableUnicodeKeyboard();

      }
      return true;

    } catch (error) {

      throw new Error(`uiautomator-server: Failed to stop uiautomator json-rpc server on device ${error.message || error}`);

    }

  }

  async enableKeyboard () {

    try {

      await this._setup.disableUnicodeKeyboard();

    } catch (error) {

      throw new Error(`Failed to enable keyboard: ${error}`);

    }

  }

  async disableKeyboard () {

    try {

      await this._setup.enableUnicodeKeyboard();

    } catch (error) {

      throw new Error(`Failed to disable keyboard: ${error}`);

    }

  }

  async verifyConnection () {

    try {

      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      await delay(this.options.connectionTriesDelay);
      let isAlive = false;
      try {

        isAlive = await this.isAlive();

      } catch (error) {

        throw new Error(`uiautomator-server: Verify Connection - > Error occured while checking if connection is alive ${error.message || error}`);

      }
      if (isAlive) {

        this._connectionTries = 0;
        return this;

      }
      if (this._connectionTries > this.options.connectionMaxTries) {

        this._connectionTries = 0;
        throw new Error(`uiautomator-server: Failed to start json - rpc server on device.Maximum connection retries limit reached `);

      } else {

        this._connectionTries += 1;
        await this.verifyConnection();

      }

    } catch (error) {

      throw new Error(error.message || error);

    }

  }

  isAlive () {

    return new Promise((resolve) => {

      request.post(this.jsonrpc_url, {
        json: {
          jsonrpc: '2.0',
          method: 'ping',
          params: [],
          id: '1'
        }
      }, (err, res, body) => resolve(!err && body && body.result === 'pong'));

    });

  }

  async send (method, extraParams) {

    try {

      this._counter = this._counter + 1;
      const params = {
        jsonrpc: '2.0',
        method,
        params: extraParams,
        id: this._counter
      };
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      await delay(this.options.commandsExecutionDelay);
      const response = await this._post({
        json: params
      });
      return response;

    } catch (error) {

      throw new Error(`Error occured while sending post command to server on device ${error.message || error}`);

    }

  }

  _post (object) {

    return new Promise((resolve, reject) => {

      request.post(
        this.jsonrpc_url, object,
        (err, res, body) => {

          if (err) return reject(err);
          if (body.error) return reject(body.error);
          return resolve(body.result);

        }
      );

    });

  }

}

module.exports = Server;
