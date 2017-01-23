"use strict";

var InputPlugin = require("../plugin/InputPlugin");
var express = require("express");
var multer = require("multer");
var path = require("path");

/**
 * Defines an HTTP API to listen to requests from users, CI, or other automated sources.
 * @extends InputPlugin
*/
class AragoniteHTTPInputPlugin extends InputPlugin {

  static get defaults() {
    let opts = {};
    opts.port = 5717;
    opts.storage = path.join(__dirname, "tmp");
    return opts;
  }

  /**
   * Adds additional fields to the program options, calls {@link Plugin#constructor}, and prepares HTTP routing.
   * @param {Aragonite} server the parent Aragonite server.
   * @param {Object} opts the Aragonite options.
   * @param {Object} opts.httpInput options to configure {@link AragoniteHTTPInputPlugin}
   * @param {number} [opts.httpInput.port=5717] a port to start an HTTP server listening for input commands on.
   * @param {string} [opts.httpInput.storage="./tmp"] a directory to store uploaded files in.
  */
  constructor(server, opts) {
    opts.httpInput = Object.assign({}, AragoniteHTTPInputPlugin.defaults, opts.httpInput);
    super(server, opts);
    this.app = express();
    let upload = multer({dest: this.opts.httpInput.storage}).fields(["source"]);
    this.app.put("/", (req, res, next) => {
      upload(req, res, (err) => {
        this.handle(req, res, next);
      });
    });
  }

  /**
   * Starts an HTTP server listening for input commands.
   * @return {Promise} resolves once the server is listening.
  */
  activate() {
    return new Promise((resolve, reject) => {
      this.http = this.app.listen(this.opts.httpInput.port, function() {
        resolve();
      });
    });
  }

  /**
   * Stops the HTTP server.
   * @return {Promise} resolves once the server has terminated.
  */
  stop() {
    return new Promise((resolve, reject) => {
      if(!this.http || !this.http.close) { return resolve(); }
      this.http.close(function() {
        resolve();
      });
    });
  }

  /**
   * Express/Connect URL handler to start Aragonite runs.
  */
  handle(req, res, next) {
    if(!this.server || !this.server.run) {
      console.error(new ReferenceError("Improperly configured AragoniteHTTPInputPlugin: no server"));
      res.status(500);
      return res.send("Improperly configured AragoniteHTTPInputPlugin.");
    }
    this.server
      .run(req.body)
      .then(() => {
        res.send("Started.");
      })
      .catch(err => {
        console.error(err);
        res.status(500);
        res.send("Internal Server Error.");
        throw err;
      });
  }

}

module.exports = AragoniteHTTPInputPlugin;
