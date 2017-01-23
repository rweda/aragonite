"use strict";

var pkg = require("../package");
var Aragonite = require("../Aragonite");

/**
 * Collect inputs into an array, creating an empty array if default is null;
*/
function collect(val, collection) {
  if(!collection) { collection = []; }
  collection.push(val);
}

opts = require("commander");
opts.version(pkg.version);

opts.option("-I, --input [plugin]",
  "[Repeatable] Input plugin that can trigger builds. Defaults to 'aragonite-http-input'.", collect, null);
opts.option("-r, --runner [plugin]",
  "[Repeatable] Runner plugin that can start test environments. Defaults to 'aragonite-vbox'.", collect, null);
opts.option("-R, --reporter [plugin]",
  "[Repeatable] Reporter plugin that can relay results. Defaults to 'aragonite-socket-reporter'.", collect, null);

opts.option("-C, --cost [cost]",
  "The total cost of the machine, to prevent over-utilization. Defaults to '0', no limiting.");

opts.parse(process.argv);
new Aragonite(opts);
