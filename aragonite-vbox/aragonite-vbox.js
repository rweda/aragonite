"use strict";
var RunnerPlugin = require("../plugin/RunnerPlugin");
var VBoxEnvironment = require("./VBoxEnvironment");

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
    opts.prefix = "aragonite-";
    opts.machines = [];
    return opts;
  }

  /**
   * Adds additional fields to Aragonite options and calls {@link Plugin#constructor}.
   * @param {Aragonite} server the parent Aragonite server.
   * @param {Object} opts the Aragonite options.
   * @param {string} [opts.vbox.exec=VBoxManage] the command to execute to communicate with "VBoxManage"
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
  }

  /**
   * Determines what VirtualBox machines should be included in a new Aragonite run.
   * @param {Object} opts See `opts` in {@link Aragonite#start}
   * @return {Promise<Environment[]>} resolve an array of {@link Environment} items.
  */
  start(opts) {
    return Promise.resolve(this.opts.vbox.machines
      .map((machine) => new VBoxEnvironment(this.server, this.opts, opts, machine))
    );
  }

}

module.exports = AragoniteVBoxPlugin;
