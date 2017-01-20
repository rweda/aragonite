#!/usr/bin/env node
"use strict";

cli = require("commander");

let machines = {};

cli
  .command("clonevm <machine>")
  .description("Clone a virtual machine.")
  .option("--name <name>", "The new name to assign the virtual machine")
  .action(function(machine, opts) {
    machines[opts.name] = {
      mac: shortid()
    };
  });

cli
  .command("showvminfo <machine>")
  .description("Return machine information, including MAC address.")
  .action(function(machine, opts) {
    console.log('"other_value=1.0"');
    console.log('"macaddress1="'+machines[machine].mac+'"');
    console.log('"another_value=Testing, ignore this"');
  });

cli
  .command("startvm <machine>")
  .description("Start a virtual machine running in the background.")
  .action(function(machine, opts) {
    let vm = require("child_process").spawn(__dirname+"/vm.js", [machine, machines[opts.name].mac], {
      detached: true,
      stdio: ["ignore", "ignore", "ignore"];
    });
    vm.unref();
  });

cli
  .command("controlvm <machine> <command>")
  .description("Control a running VM.  (empty stub)")
  .action(function() {});

cli
  .command("unregistervm <machine>")
  .description("Delete a VM.  (empty stub)")
  .action(function() {});

cli.parse(process.argv);
