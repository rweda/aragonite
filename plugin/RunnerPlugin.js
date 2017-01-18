"use strict";

var Plugin = require("./Plugin");

/**
 * A Runner plugin defines a method of running programs in different environments.
 * Runners might connect with VirtualBox or Docker to run in different operating systems or Linux distributions,
 * or simply run on the local machine.
 * @extends Plugin
*/
class RunnerPlugin extends Plugin {

  /**
   * Determines what environments should be included in a new Aragonite run.
   * @abstract
   * @param {Object} opts See `opts` in {@link Aragonite#start}
   * @return {Promise<Environment[]>} resolve an array of {@link Environment} items.
  */
  start(opts) {
    return Promise.resolve([]);
  }

}

module.exports = RunnerPlugin;
