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
    opts.runners = ["aragonite-vbox"];
    return opts;
  }

  /**
   * Prepare a testing server to be started with {@link Aragonite#start}.
   * @param {Object} opts options to configure the usage of Aragonite.
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
    let tasks = [];
    this.runners = [];
    for(const plugin of this.opts.runners) {
      tasks.push(this
        .loadPlugin(plugin)
        .then((runner) => {
          this.runners.push(runner);
        })
      );
    }
    return Promise.all(tasks);
  }

  /**
   * Loads a plugin by name.
   * Searches for plugins bundled with Aragonite, as well as `require`-able plugins
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
        new Plugin(this.opts);
      });
  }

}

module.exports = Aragonite;
