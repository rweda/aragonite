"use strict";

class AragoniteReportInterface {

  /**
   * @param {Aragonite} server the main server.
  */
  constructor(server) {
    this.server = server;
  }

  /**
   * Anounce that an environment has started.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run
   * @param {string} identifier.runner the name of the runner plugin that created this environment.
   * @param {string} identifier.os the name of the environment's operating system
   * @param {string} identifier.version the version of the environment's operating system
   * @param {Object} identifier.extra additional details specific to a type of environment
  */
  start(conf, identifier) {
    for(const reporter of this.server.reporters) {
      reporter.start(conf, identifier);
    }
  }

  /**
   * Anounce that an environment has finished successfully.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link AragoniteReportInterface#start}.
  */
  success(conf, identifier) {
    for(const reporter of this.server.reporters) {
      reporter.success(conf, identifier);
    }
  }

  /**
   * Anounce that an environment encountered an error.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link AragoniteReportInterface#start}.
   * @param {Error} err the error that was encountered.
  */
  error(conf, identifier, err) {
    for(const reporter of this.server.reporters) {
      reporter.error(conf, identifier, err);
    }
  }

}

module.exports = AragoniteReportInterface;
