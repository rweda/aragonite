"use strict";

/*
 * Tests a complete run of Aragonite.  VBoxManage is stubbed as VirtualBox won't play nicely with testing on Travis CI,
 * and testing also can stub the code that would run inside a virtual machine, reducing dependencies for testing.
*/

var chai = require("chai");
var chaiHTTP = require("chai-http");
chai.use(chaiHTTP);
var should = chai.should();

let conf = {
  vbox: {
    exec: __dirname + "/vbox-stub/VBoxManage.js",
    machines: [
      {
        name: "Browsers on Ubuntu 14.04",
        vbox: "AragoniteUbuntu",
        snap: "ReadyForTesting",
        dist: "Linux",
        version: "14.04"
      }
    ]
  }
};

var eventToPromise = require("event-to-promise");
var Aragonite = require("../Aragonite");

describe("Aragonite Integration", function() {

  var aragon = null;
  beforeEach(function() {
    aragon = new Aragonite(conf);
  });

  afterEach(function() {
    return aragon.stop();
  });

  it("should start the server", function() {
    return aragon.start();
  });

  it("should start a run", function() {
    return aragon
      .start()
      .then(() => {
        return chai
          .request("http://localhost:5717")
          .put("/")
          .then(function(res) {
            res.should.have.status(200);
          });
      });
  });

  it("should get 'start' responses", function() {
    this.slow(1000);
    this.timeout(3000);
    let e = null;
    return aragon
      .start()
      .then(() => {
        let socket = require("socket.io-client")("http://localhost:5727");
        e = eventToPromise(socket, "start");
        return chai
          .request("http://localhost:5717")
          .put("/")
          .then(function(res) {
            res.should.have.status(200);
          });
      })
      .then(() => { return e; });
  });

  it("should get 'finished' responses", function() {
    this.slow(1500);
    this.timeout(4000);
    let e = null;
    return aragon
      .start()
      .then(() => {
        let socket = require("socket.io-client")("http://localhost:5727");
        e = eventToPromise(socket, "finished");
        return chai
          .request("http://localhost:5717")
          .put("/")
          .then(function(res) {
            res.should.have.status(200);
          });
      })
      .then(() => { return e; });
  });

});
