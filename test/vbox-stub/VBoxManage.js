#!/usr/bin/env node
"use strict";

let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs.extra"));
let shortid = require("shortid");

let cli = require("commander");

let machines = null;
try {
  machines = require(__dirname + "/machines.json");
}
catch (e) {
  machines = {};
}

/**
 * Write the machines file.
*/
function write() {
  fs.writeFileSync(__dirname + "/machines.json", JSON.stringify(machines, null, 2));
}

cli
  .command("clonevm <machine>")
  .description("Clone a virtual machine.")
  .option("--name <name>", "The new name to assign the virtual machine")
  .option("--mode <mode>", "Ignored.")
  .option("--register", "Ignored.")
  .option("--snapshot", "Ignored.")
  .action(function(machine, opts) {
    machines[opts.name] = {
      mac: shortid()
    };
    write();
  });

cli
  .command("showvminfo <machine>")
  .description("Return machine information, including MAC address.")
  .option("--machinereadable", "Ignored.")
  .action(function(machine, opts) {
    console.log('other_value=1.0');
    console.log('macaddress1="'+machines[machine].mac+'"');
    console.log('another_value="Testing, ignore this"');
  });

cli
  .command("startvm <machine>")
  .description("Start a virtual machine running in the background.")
  .option("--type <type>", "Ignored.")
  .action(function(machine, opts) {
    let stdout = fs.openSync(__dirname + "/" + machine + "-out.log", "a");
    let stderr = fs.openSync(__dirname + "/" + machine + "-out.log", "a");
    let vm = require("child_process").spawn(__dirname+"/vm.js", [machine, machines[machine].mac], {
      detached: true,
      stdio: ["ignore", stdout, stderr]
    });
    vm.unref();
  });

cli
  .command("controlvm <machine> <command>")
  .description("Control a running VM.  (empty stub)")
  .action(function() {});

cli
  .command("unregistervm <machine>")
  .description("Delete a VM.")
  .option("--delete", "Ignored.")
  .action(function(machine, opts) {
    delete machines[machine];
    write();
    fs.rmrfAsync(__dirname + "/" + machine + "-out.log");
  });

cli.parse(process.argv);
