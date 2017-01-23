"use strict";
let path = require("path");

var AragoniteReportInterface = require("./AragoniteReportInterface");
var EnvironmentRunner = require("./environment/EnvironmentRunner");

/**
 * An entrypoint for the testing server.
*/
class Aragonite {

  /**
   * Default options to Aragonite.
  */
  get defaults() {
    let opts = {};
    opts.inputs = ["aragonite-http-input"];
    opts.runners = ["aragonite-vbox"];
    opts.reporters = ["aragonite-socket-reporter"];
    opts.totalCost = 0;
    return opts;
  }

  /**
   * Prepare a testing server to be started with {@link Aragonite#start}.
   * @param {Object} opts options to configure the usage of Aragonite.
   * @param {string[]} [opts.inputs=["aragonite-http-input"]] plugins used to trigger Aragonite runs.
   * @param {string[]} [opts.runners=["aragonite-vbox"]] plugins used to start testing environments
   * @param {number} [opts.totalCost=0] allows multiple environments to be run at the same time, without over-using the
   *   system.  Each environment can be assigned a cost, and Aragonite will ensure that machines don't exceed the total.
  */
  constructor(opts) {
    this.opts = Object.assign({}, this.defaults, opts);
    this._reportInterface = new AragoniteReportInterface(this);
    this.inputs = [];
    this.runners = [];
    this.reporters = [];
  }

  /**
   * Loads the plugins specified in the configuration, and starts the testing server.
   * @return {Promise} resolves when the testing server is running.
  */
  start() {
    return Promise
      .all([
        this.loadPlugins(this.opts.inputs, this.inputs),
        this.loadPlugins(this.opts.runners, this.runners),
        this.loadPlugins(this.opts.reporters, this.reporters)
      ])
      .then((plugins) => {
        let tasks = [];
        for(const input of this.inputs) {
          tasks.push(input.activate());
        }
        for(const reporter of this.reporters) {
          tasks.push(reporter.activate());
        }
        return Promise.all(tasks);
      });
  }

  /**
   * Stops all plugins and shuts down Aragonite.
   * @return {Promise} resolves when all plugins have stopped.
  */
  stop() {
    let tasks = [];
    for(const plugins of [this.inputs, this.runners, this.reporters]) {
      for (const plugin of plugins) {
        tasks.push(plugin.stop());
      }
    }
    return Promise
      .all(tasks)
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  /**
   * Start an Aragonite run.
   * @param {Object} opts configuration to pass to runners.  Several generic fields are defined, but additional fields
   *   will also be passed along.
   * @param {string} opts.name a human-readable name for the Aragonite run.
   * @param {string} opts.repo a project repository to test
   * @param {string} opts.commit a specific commit in the project repository to test
   * @param {Object} opts.archive an archived directory of the project to test
   * @param {string} opts.archive.path the full path to the uploaded file
   * @param {string} opts.archive.originalname the name of the file at the time of upload (might have changed on server)
  */
  run(opts) {
    let collect = [];
    for(const runner of this.runners) {
      collect.push(runner.start(opts));
    }
    return Promise
      .all(collect)
      .then((collections) => {
        let environments = collections.reduce((a, b) => { return a.concat(b); }, []);
        new EnvironmentRunner(this, this.opts, opts, environments);
      });
  }

  /**
   * Provides a clean reporting interface to abstract the different reporters.
   * @return {AragoniteReportInterface}
  */
  get report() {
    return this._reportInterface;
  }

  /**
   * Loads a set of plugins by name.  See {@link Aragonite#loadPlugin} for loading methods.
   * @param {string[]} plugins the name of plugins to load
   * @param {Plugin[]} output an array to insert plugins into.
   * @return {Promise} resolves when all plugins have loaded.
  */
  loadPlugins(plugins, output) {
    let tasks = [];
    for(const name of plugins) {
      tasks.push(this
        .loadPlugin(name)
        .then ((plugin) => {
          output.push(plugin);
        })
      );
    }
    return Promise.all(tasks);
  }

  /**
   * Loads a plugin by name.
   * Searches for plugins bundled with Aragonite, as well as `require`-able plugins from NPM.
   * @param {string} name the name of a plugin to load.
   * @return {Promise<Plugin>} resolves to a Plugin instance.
  */
  loadPlugin(name) {
    return Promise
      .resolve()
      .then(() => {
        return require(path.join(__dirname, name, name));
      })
      .catch(() => {
        return require(path.join(__dirname, name));
      })
      .catch(() => {
        return require(name);
      })
      .then((Plugin) => {
        return new Plugin(this, this.opts);
      });
  }

}

module.exports = Aragonite;
