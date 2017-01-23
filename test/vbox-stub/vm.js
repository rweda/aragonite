#!/usr/bin/env node
"use strict";

var machineName = process.argv[2];
var mac = process.argv[3];

var eventToPromise = require("event-to-promise");

var socket = require("socket.io-client")("http://localhost:5720/"+mac);
console.log("Attempting to connect to 'http://localhost:5720/"+mac+"'.");
socket.on("connect", function() {
  console.log("Connection opened.");
});

socket.on("machine", function(machine) {
  console.log("Got machine details.");
  //TODO: write tests.
});
socket.on("conf", function(conf) {
  console.log("Got configuration details.");
  //TODO: write tests.
});

Promise
  .all([eventToPromise(socket, "machine"), eventToPromise(socket, "conf")])
  .then(function() {
    //TODO: Emit success/failure
    socket.emit("done");
    console.log("Emitted 'done'.");
  });
