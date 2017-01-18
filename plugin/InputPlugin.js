"use strict";

var Plugin = require("./Plugin");

/**
 * An input plugin triggers Aragonite runs.  Input plugins could listen to CI machines via an HTTP API, offer a CLI, or
 * setup scheduled runs.
 * @extends Plugin
*/
class InputPlugin extends Plugin {

  /**
   * Prepares this plugin to handle input.  Requires all Aragonite plugins to be loaded.
   * @abstract
   * @return {Promise} resolves once the plugin is ready to handle input.
  */
  activate() {
    Promise.resolve();
  }

}

module.exports = InputPlugin;
