"use strict";

/**
 * Runs one or more environments in a bundled run.
*/
class EnvironmentRunner {

  /**
   * Configures the Aragonite run and starts running environments.
   * @param {Aragonite} server the Aragonite server.
   * @param {Object} opts the Aragonite options.  See {@link Aragonite#constructor}.
   * @param {Object} conf run-specific configuration.  See {@link Aragonite#run}.
   * @param {Environment[]} environments the environments that are part of this run.
  */
  constructor(server, opts, conf, environments) {
    this.server = server;
    this.opts = opts;
    this.conf = conf;
    if(!environments) {
      environments = [];
    }
    this.environments = environments;
    this.finished = [];
    this.running = [];
    this.runAsync = true;
    this.totalCost = opts && opts.totalCost ? opts.totalCost : null;
    if(this.environments.length > 0) {
      this.start();
    }
  }

  /**
   * @return {boolean} `true` if all environments have been run.
  */
  get isFinished() {
    return this.finished.length === this.environments.length;
  }

  /**
   * Determine the total cost of all running environments.
   * @return {number} the sum of the cost of all running environments
  */
  get runningCost() {
    return this.running.map((e) => e.cost).reduce((a, b) => a + b, 0);
  }

  /**
   * Starts additional environments, if possible.
   * First starts all environments that can be run in parallel, and then starts each environment that needs to be run in
   * isolation.
  */
  start() {
    if(this.isFinished) {
      return;
    }
    for(const environment of this.environments) {
      if(!this.canStart(environment)) {
        continue;
      }
      this.run(environment);
      if(!this.runAsync) {
        break;
      }
    }
    // If comparing parallel environments and none were started, switch to checking isolated environments.
    if(this.runAsync && this.running.length < 1) {
      this.runAsync = false;
      this.start();
    }
  }

  /**
   * Starts the given environment.
   * @param {Environment} environment the environment to start.
  */
  run(environment) {
    this.running.push(environment);
    environment
      .run()
      .then(() => {
        this.finished.push(environment);
        this.running.splice(this.running.indexOf(environment), 1);
        this.start();
      });
  }

  /**
   * Checks if an environment should be started.
   * @param {Environment} environment the environment to check
   * @return {boolean} `true` if the environment should be started
  */
  canStart(environment) {
    // Don't start environments that are have finished or are already running.
    if(this.finished.indexOf(environment) > -1 || this.running.indexOf(environment) > -1) {
      return false;
    }
    /* Don't start isolated environments if there are still unisolated environments to run, or an environment is
       already running */
    if(environment.async !== true && (this.runAsync || this.running.length > 0)) {
      return false;
    }
    // Don't start parallel environments if they would max out the available resources
    if(environment.async === true && environment.cost > 0 && this.runningCost + environment.cost > this.totalCost) {
      return false;
    }
    return true;
  }

}

module.exports = EnvironmentRunner;
