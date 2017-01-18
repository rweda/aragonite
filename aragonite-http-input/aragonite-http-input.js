"use strict";

var InputPlugin = require("../plugin/InputPlugin");
var express = require("express");

/**
 * Defines an HTTP API to listen to requests from users, CI, or other automated sources.
 * @extends InputPlugin
*/
class AragoniteHTTPInputPlugin extends InputPlugin {

  get defaults() {
    let opts = {};
    opts.port = 5717;
    return opts;
  }

  constructor(server, opts) {
    opts.httpInput = Object.assign({}, this.defaults, opts.httpInput);
    super(server, opts);
  }

  /**
   * Starts an HTTP server listening for input commands.
   * @return {Promise} resolves once the server is listening.
  */
  activate() {
    this.app = express();
    return new Promise((resolve, reject) => {
      this.app.listen(this.opts.httpInput.port);
    });
  }

}

module.exports = AragoniteHTTPInputPlugin;
