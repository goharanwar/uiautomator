const path = require('path');
const fs = require('fs');
const request = require('request');
const url = require('url');
const Setup = require('./setup');

const defaultOptions = {
  hostname: 'localhost',
  commadsExecutionDelay: 10,
  port: 9008,
  devicePort: 9008,
  connectionMaxTries: 5,
  connectionTriesDelay: 1000
};

const getPath = relativePath => path.join(path.dirname(fs.realpathSync(__filename)), relativePath);

class Server {

  constructor (newOptions) {

    this.options = Object.assign({}, defaultOptions, newOptions);
    this.url = url.format({ protocol: 'http', hostname: this.options.hostname, port: this.options.port });
    this.jsonrpc_url = url.resolve(this.url, '/jsonrpc/0');
    this.stop_url = url.resolve(this.url, '/stop');
    this._counter = 0;
    // this._callbacks = {};
    this._setup = new Setup(
      [
        getPath('../libs/app-uiautomator.apk'),
        getPath('../libs/app-uiautomator-test.apk')],
      this.options
    );
    this._connectionTries = 0;

  }

  start () {

    const self = this;
    return self._setup.init()
      .then(() => self.verifyConnection());

  }

  async stop (keepApks) {

    try {

      request.get(this.stop_url, {}, () => {});
      this._setup.process().stdin.pause();
      this._setup.process().kill();
      // Cleanup: Remove the installed apks
      if (!keepApks) {

        this._setup.removeAlreadyInstalledApks();

      }
      return true;

    } catch (error) {

      throw new Error(`uiautomator-server: Failed to stop uiautomator json-prc server on device ${error.message || error}`);

    }

  }

  async verifyConnection () {

    try {

      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      await delay(this.options.connectionTriesDelay);
      const isAlive = await this.isAlive();
      if (isAlive) {

        return this;

      }
      if (this._connectionTries > this.options.connectionMaxTries) {

        throw new Error(`uiautomator-server: Failed to start json-prc server on device`);

      } else {

        this._connectionTries += 1;
        this.verifyConnection();

      }

    } catch (error) {

      throw new Error(`uiautomator-server: Failed to start json-prc server on device ${error.message || error}`);

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
      await delay(this.options.commadsExecutionDelay);
      const response = await this._post({ json: params });
      return response;

    } catch (error) {

      throw new Error(error);

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
