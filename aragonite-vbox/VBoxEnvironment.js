"use strict";

var shortid = require("shortid");
var spawnAsync = require("child-process-promise").spawn;
var Environment = require("../environment/Environment");

/**
 * Defines a VirtualBox instance to run.
 * @extends Environment
*/
class VBoxEnvironment extends Environment {

  /**
   * Adds additional fields to Aragonite options and calls {@link Plugin#constructor}.
   * @param {AragoniteVBoxPlugin} vbox the plugin that created this instance.
   * @param {Aragonite} server the parent Aragonite server.
   * @param {Object} opts the Aragonite options.  See {@link AragoniteVBoxPlugin#constructor} for added properties.
   * @param {Object} conf standard options passed to runners.  See {@link Aragonite#run}.
   * @param {Object} machine the machine templates that can be used to test projects
   * @param {string} machine.name a human-readable description of the machine.
   * @param {string} machine.vbox the VirtualBox identifier of the machine.
   * @param {string} machine.snap a VirtualBox snapshot of the given machine to clone
   * @param {string} machine.dist the platform the machine is running, e.g. "OSX", "Windows", "Linux"
   * @param {string} machine.version the OS version, e.g. Ubuntu: "14.04", Windows: "XP", OSX: "10.11"
   * @param {boolean} machine.async if `true`, other environments can run at the same time.
   * @param {number} machine.cost the relative cost to run the machine, to prevent over-usage.
  */
  constructor(vbox, server, opts, conf, machine) {
    let env = {
      async: machine.async && opts.totalCost >= machine.cost,
      cost: machine.cost && machine.cost <= opts.totalCost ? machine.cost : 0
    };
    super(env);
    this.vbox = vbox;
    this.server = server;
    this.opts = opts;
    this.conf = conf;
    this.machine = machine;
  }

  /**
   * Provides the information to distingiush this environment from others.
   * @return {Object} {@see Aragonite#report}
  */
  get identifier() {
    let ident = {};
    ident.runner = "aragonite-vbox";
    ident.os = this.machine.dist;
    ident.version = this.machine.version;
    ident.extra = {
      vbox: this.machine.vbox
    };
    return ident;
  }

  /**
   * Run this environment.
   * @return {Promise} resolves once the test has finished and reported its data.
  */
  run() {
    let instance = null;
    let error = null;
    return this
      .provision()
      .then((i) => {
        instance = i;
        this.namespace = this.vbox.io.of("/"+instance.mac);
        this.namespace.on("connection", (socket) => {
          this.vbox.sockets.push(socket);
          socket.emit("machine", this.machine);
          socket.emit("conf", this.conf);
        });
        return this.start(instance.name);
      })
      .catch((err) => {
        error = error;
        this.success = false;
        return true;
      })
      .then(() => {
        if(instance) {
          return this.cleanup(instance.name);
        }
      })
      .then(() => {
        if(error) {
          return this.server.report.error(this.conf, this.identifier, error);
        }
        else {
          return this.server.report.success(this.conf, this.identifier);
        }
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  /**
   * Clone the specfied VirtualBox image.
   * @return {Promise<Object>} resolves `{name, mac}` once the machine is cloned.
  */
  provision() {
    let name = this.opts.vbox.prefix + this.machine.vbox + "-" + shortid.generate();
    let opts = ["clonevm", this.machine.vbox, "--mode", "machine", "--register", "--name", name];
    if(this.machine.snap) {
      opts = opts.concat("--snapshot", this.machine.snap);
    }
    return spawnAsync(this.opts.vbox.exec, opts)
      .then(() => {
        return spawnAsync(this.opts.vbox.exec, ["showvminfo", "--machinereadable", name], {capture: ['stdout']});
      })
      .then((res) => {
        let mac = res.stdout.toString().match(/macaddress1="([^"]+)"/)[1];
        return {name: name, mac: mac};
      });
  }

  /**
   * Start the specified VirtualBox instance, and listen to responses.
   * @param {string} instance the name of the VirtualBox machine to start.
   * @return {Promise} resolves once the machine has run all commands, and is ready to be shut down.
  */
  start(instance) {
    let finished = new Promise((resolve, reject) => {
      this.namespace.on("connection", (socket) => {
        socket.on("done", () => {
          resolve();
        });
      });
    });
    return startup = spawnAsync(this.opts.vbox.exec, ["startvm", instance, "--type", "headless"])
      .then(() => {
        return this.server.report.start(this.conf, this.identifier);
      })
      .then(() => {
        return finished;
      });
  }

  /**
   * Stop the specified VirtualBox instance, and delete the machine.
   * @param {string} instance the name of the VirtualBox machine to stop.
   * @return {Promise} resolves once the machine has been deleted.
  */
  cleanup(instance) {
    return spawnAsync(this.opts.vbox.exec, ["controlvm", instance, "poweroff"])
      .then(() => {
        return spawnAsync(this.opts.vbox.exec, ["unregistervm", instance, "--delete"]);
      });
  }

}

module.exports = VBoxEnvironment;
