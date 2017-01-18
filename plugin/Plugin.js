"use strict";

/**
 * Describes a modular component that can be added to Aragonite.
*/
class Plugin {

  /**
   * @param {Aragonite} server the parent Aragonite server.
   * @param {Object} opts the options passed to {@link Aragonite#constructor}.
  */
  constructor(server, opts) {
    this.server = server;
    this.opts = opts;
  }

}

module.exports = Plugin;
