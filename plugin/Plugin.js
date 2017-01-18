"use strict";

/**
 * Describes a modular component that can be added to Aragonite.
*/
class Plugin {

  /**
   * @param {Object} opts the options passed to {@link Aragonite#constructor}.
  */
  constructor: (opts) {
    this.opts = opts;
  }

}

module.exports = Plugin;
