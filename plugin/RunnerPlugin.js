"use strict";

var Plugin = require("./Plugin");

/**
 * A Runner plugin defines a method of running programs in different environments.
 * Runners might connect with VirtualBox or Docker to run in different operating systems or Linux distributions,
 * or simply run on the local machine.
 * @extends Plugin
*/
class RunnerPlugin extends Plugin {

}

module.exports = RunnerPlugin;
