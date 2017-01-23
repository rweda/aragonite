"use strict";

var Plugin = require("./Plugin");

/**
 * A reporter plugin relays test results to outputs.
 * @extends Plugin
*/
class ReporterPlugin extends Plugin {

  /**
   * Prepares this plugin to handle input.  Requires all Aragonite plugins to be loaded.
   * @abstract
   * @return {Promise} resolves once the plugin is ready to handle input.
  */
  activate() {
    Promise.resolve();
  }

  /**
   * Anounce that an environment has started.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run
   * @param {string} identifier.runner the name of the runner plugin that created this environment.
   * @param {string} identifier.os the name of the environment's operating system
   * @param {string} identifier.version the version of the environment's operating system
   * @param {Object} identifier.extra additional details specific to a type of environment
   * @abstract
   * @return {Promise} resolves once all reports have been sent.
  */
  start(conf, identifier) {
    return Promise.resolve();
  }

  /**
   * Anounce that an environment has finished.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link ReporterPlugin#start}.
   * @abstract
   * @return {Promise} resolves once all reports have been sent.
  */
  finish(conf, identifier) {
    return Promise.resolve();
  }

  /**
   * Anounce that an environment encountered an error.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link ReporterPlugin#start}.
   * @param {Error} err the error that was encountered.
   * @abstract
   * @return {Promise} resolves once all reports have been sent.
  */
  error(conf, identifier, err) {
    return Promise.resolve();
  }

}

module.exports = ReporterPlugin;
