"use strict";

class AragoniteReportInterface {

  /**
   * @param {Aragonite} server the main server.
  */
  constructor(server) {
    this.server = server;
  }

  _send(method, data) {
    var tasks = [];
    for(const reporter of this.server.reporters) {
      tasks.push(reporter[method].apply(reporter, data));
    }
    return Promise.all(tasks);
  }

  /**
   * Anounce that an environment has started.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See See {@link ReporterPlugin#start}.
   * @return {Promise} resolves once all reports have been sent.
  */
  start(conf, identifier) {
    return this._send("start", [conf, identifier]);
  }

  /**
   * Anounce that an environment has finished successfully.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link ReporterPlugin#start}.
  */
  success(conf, identifier) {
    return this._send("success", [conf, identifier]);
  }

  /**
   * Anounce that an environment encountered an error.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link ReporterPlugin#start}.
   * @param {Error} err the error that was encountered.
  */
  error(conf, identifier, err) {
    return this._send("error", [conf, identifier, err]);
  }

}

module.exports = AragoniteReportInterface;
