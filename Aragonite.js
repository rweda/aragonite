"use strict";
let path = require("path");

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
    return opts;
  }

  /**
   * Prepare a testing server to be started with {@link Aragonite#start}.
   * @param {Object} opts options to configure the usage of Aragonite.
   * @param {string[]} [opts.inputs=["aragonite-http-input"]] plugins used to trigger Aragonite runs.
   * @param {string[]} [opts.runners=["aragonite-vbox"]] plugins used to start testing environments
  */
  constructor(opts) {
    this.opts = Object.assign({}, this.defaults, opts);
  }

  /**
   * Loads the plugins specified in the configuration, and starts the testing server.
   * @return {Promise} resolves when the testing server is running.
  */
  start() {
    this.inputs = [];
    this.runners = [];
    return Promise
      .all([
        this.loadPlugins(this.opts.inputs, this.inputs),
        this.loadPlugins(this.opts.runners, this.runners)
      ])
      .then((plugins) => {
        let tasks = [];
        for(input in this.inputs) {
          tasks.push(input.activate());
        }
        return Promise.all(tasks);
      });
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
      .then(function() {
        require(path.join(__dirname, name, name));
      })
      .catch(function() {
        require(path.join(__dirname, name));
      })
      .catch(function() {
        require(name)
      })
      .then((Plugin) => {
        new Plugin(this, this.opts);
      });
  }

}

module.exports = Aragonite;
