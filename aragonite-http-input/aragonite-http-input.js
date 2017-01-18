"use strict";

var InputPlugin = require("../plugin/InputPlugin");
var express = require("express");
var multer = require("multer");

/**
 * Defines an HTTP API to listen to requests from users, CI, or other automated sources.
 * @extends InputPlugin
*/
class AragoniteHTTPInputPlugin extends InputPlugin {

  get defaults() {
    let opts = {};
    opts.port = 5717;
    opts.storage = path.join(__dirname, "tmp");
    return opts;
  }

  /**
   * Adds additional fields to the program options before calling the standard {@link Plugin#constructor}.
   * @param {Aragonite} server the parent Aragonite server.
   * @param {Object} opts the Aragonite options.
   * @param {Object} opts.httpInput options to configure {@link AragoniteHTTPInputPlugin}
   * @param {number} [opts.httpInput.port=5717] a port to start an HTTP server listening for input commands on.
   * @param {string} [opts.httpInput.storage="./tmp"] a directory to store uploaded files in.
  */
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
    let upload = multer({dest: this.httpInput.storage})
    this.app.put("/", multer.fields(["source"]), (req, res, next) => {
      this.handle(req, res, next);
    });
    return new Promise((resolve, reject) => {
      this.app.listen(this.opts.httpInput.port);
    });
  }

  /**
   * Express/Connect URL handler to start Aragonite runs.
  */
  handle(req, res, next) {
    res.send("Started.");
  }

}

module.exports = AragoniteHTTPInputPlugin;
