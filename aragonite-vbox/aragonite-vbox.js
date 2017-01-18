"use strict";
var RunnerPlugin = require("../plugin/RunnerPlugin");
var VBoxEnvironment = require("./VBoxEnvironment");
var express = require("express");
var shortid = require("shortid");

/**
 * Uses VirtualBox to run projects on different platforms.
 * @extends RunnerPlugin
*/
class AragoniteVBoxPlugin extends RunnerPlugin {

  /**
   * Additional options to add to the Aragonite options.
   * @return {Object} defaults for the additional options.
  */
  static get defaults() {
    let opts = {};
    opts.exec = "VBoxManage";
    opts.port = 5720;
    opts.prefix = "aragonite-";
    opts.machines = [];
    return opts;
  }

  /**
   * Adds additional fields to Aragonite options and calls {@link Plugin#constructor}.
   * @param {Aragonite} server the parent Aragonite server.
   * @param {Object} opts the Aragonite options.
   * @param {string} [opts.vbox.exec=VBoxManage] the command to execute to communicate with "VBoxManage"
   * @param {integer} [opts.vbox.port=5730] a port that VirtualBox machines will communicate with
   * @param {string} [opts.prefix="aragonite-"] a prefix to insert before created VirtualBox machines
   * @param {Object[]} opts.vbox.machines the machine templates that can be used to test projects
   * @param {string} opts.vbox.machines[].name a human-readable description of the machine.
   * @param {string} opts.vbox.machines[].vbox the VirtualBox identifier of the machine.
   * @param {string} opts.vbox.machines[].snap a VirtualBox snapshot of the given machine to clone
   * @param {string} opts.vbox.machines[].dist the platform the machine is running, e.g. "OSX", "Windows", "Ubuntu"
   * @param {string} opts.vbox.machines[].version the OS version, e.g. Ubuntu: "14.04", Windows: "XP", OSX: "10.11"
   * @param {boolean} opts.vbox.machines[].async if `true`, other environments can run at the same time.
   * @param {number} opts.vbox.machines[].cost the relative cost to run the machine, to prevent over-usage.  If the cost
   *   is greater than the machine's total cost, the machine will be converted to be isolated (non-async).
  */
  constructor(server, opts) {
    opts.vbox = Object.assign({}, AragoniteVBoxPlugin.defaults, opts.vbox);
    super(server, opts);
    this.app = express();
    this.io = require("socket.io")(this.app);
    this.app.get("/connect", (req, res, next) => {
      let image = req.query.image;
      if(this.listeners[image]) {
        let socket = shortid.generate();
        this.listeners[image](socket);
        delete this.listeners[image];
        res.send(socket);
      }
    });
    this.io.on("connection", function(socket) {
      socket.on("join", function(id) {
        socket.join(id);
      });
    });
  }

  /**
   * Request a new Socket.io namespace to be assigned to a machine with the given VirtualBox name.
   * @param {string} vbox the name of a VirtualBox machine
  */
  register(vbox) {
    if(!this.listeners) {
      this.listeners = {};
    }
    return new Promise((resolve, reject) => {
      this.listeners[vbox] = (id) => {
        resolve(this.io.namespace(id));
      }
    });
  }

  /**
   * Determines what VirtualBox machines should be included in a new Aragonite run.
   * @param {Object} opts See `opts` in {@link Aragonite#start}
   * @return {Promise<Environment[]>} resolve an array of {@link Environment} items.
  */
  start(opts) {
    if(!this.server) {
      this.server = this.app.listen(this.opts.vbox.port);
    }
    return Promise.resolve(this.opts.vbox.machines
      .map((machine) => new VBoxEnvironment(this, this.server, this.opts, opts, machine))
    );
  }

}

module.exports = AragoniteVBoxPlugin;
