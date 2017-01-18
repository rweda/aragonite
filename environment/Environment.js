"use strict";

/**
 * Defines a specific environment to run tests inside.
*/
class Environment {

  /**
   * @param {Object} env options to configure this environment.
   * @param {boolean} [env.async=false] if `true`, this environment can be run at the same time as other environments.
   * @param {number} [env.cost=0] limits the number of environments running in parallel to prevent system resources from
   *   being over-allocated, e.g. the amount of RAM that this machine needs to run properly.
  */
  constructor(env) {
    this.async = env.async;
    this.cost = env.cost;
    this.finished = false;
  }

  /**
   * Run this environment.
   * @abstract
   * @return {Promise} resolves once the test has finished and reported its data.
  */
  run() {
    Promise.resolve();
  }

}

module.exports = Environment;
