"use strict";

var ReporterPlugin = require("../plugin/ReporterPlugin");
var express = require("express");

/**
 * Sends test results over Sockets.
 * @extends ReporterPlugin
*/
class AragoniteSocketReporter extends ReporterPlugin {

  static get defaults() {
    let opts = {};
    opts.port = 5727;
    return opts;
  }

  /**
   * Adds additional fields to the program options, calls {@link Plugin#constructor}, and prepares routing.
   * @param {Aragonite} server the parent Aragonite server.
   * @param {Object} opts the Aragonite options.
   * @param {Object} opts.socketReporter options to configure {@link AragoniteHTTPInputPlugin}
   * @param {number} [opts.socketReporter.port=5727] a port to start an HTTP server listening for input commands on.
  */
  constructor(server, opts) {
    opts.socketReporter = Object.assign({}, AragoniteSocketReporter.defaults, opts.socketReporter);
    super(server, opts);
    this.app = express();
    this.http = require("http").Server(this.app);
    this.io = require("socket.io")(this.http);
    this.sockets = [];
    this.io.on("connection", (socket) => {
      this.sockets.push(socket);
    });
  }

  /**
   * Starts an HTTP server listening for input commands.
   * @return {Promise} resolves once the server is listening.
  */
  activate() {
    return new Promise((resolve, reject) => {
      this.http.listen(this.opts.socketReporter.port, () => {
        resolve();
      });
    });
  }

  /**
   * Sends a Socket message.
   * @return {Promise} resolves when the message is sent.
  */
  _send(message, data) {
    return new Promise((resolve, reject) => {
      this.io.emit(message, data);
      resolve();
    });
  }

  /**
   * Anounce that an environment has started.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link ReporterPlugin#start}.
   * @return {Promise} resolves once all reports have been sent.
  */
  start(conf, identifier) {
    return this._send("start", [conf, identifier]);
  }

  /**
   * Provide a report of testing generated inside the environment.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link ReporterPlugin#start}.
   * @param {Report} report the report to transmit.
   * @return {Promise} resolves once all reports have been sent.
  */
  report(conf, identifier, report) {
    return this._send("report", [conf, identifier, report]);
  }

  /**
   * Anounce that an environment has finished.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link ReporterPlugin#start}.
   * @return {Promise} resolves once all reports have been sent.
  */
  finished(conf, identifier) {
    return this._send("finished", [conf, identifier]);
  }

  /**
   * Anounce that an environment encountered an error.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#start}.
   * @param {Object} identifier unique details to this run.  See {@link ReporterPlugin#start}.
   * @param {Error} err the error that was encountered.
   * @return {Promise} resolves once all reports have been sent.
  */
  error(conf, identifier, err) {
    return this._send("error", [conf, identifier, err]);
  }

  /**
   * Terminates this reporter.
   * @return {Promise} resolves when the reporter is fully shut down.
  */
  stop() {
    return new Promise((resolve, reject) => {
      if(!this.http || !this.http.address()) { return resolve(); }
      this.http.close(function() {
        resolve();
      });
      if(this.sockets) {
        for(const socket of this.sockets) { socket.disconnect(true); }
      }
    });
  }

}

module.exports = AragoniteSocketReporter;
