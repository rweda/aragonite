#!/usr/bin/env node
"use strict";

var machineName = process.argv[2];
var mac = process.argv[3];

var eventToPromise = require("event-to-promise");

var socket = require("socket.io-client")("http://localhost:5720");
socket.on("connect", function() {

  socket.emit("mac", mac);
  socket.on("machine", function(machine) {
    //TODO: write tests.
  });
  socket.on("conf", function(conf) {
    //TODO: write tests.
  });

  Promise
    .all([eventToPromise(socket, "machine"), eventToPromise(socket, "conf")])
    .then(function() {
      //TODO: Emit success/failure
      socket.emit("done");
    });
});
