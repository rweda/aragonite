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
    exec: __dirname + "/vbox-stub/VBoxManage.js"
  }
};

var Aragonite = require("../Aragonite");

describe("Aragonite Integration", function() {

  var aragon = null;
  beforeEach(function() {
    aragon = new Aragonite();
  });

  afterEach(function() {
    aragon.stop();
  });

  it("should start the server", function() {
    aragon.start();
  });

  it("should start a run", function() {
    aragon.start();
    chai
      .request("http://localhost:5717")
      .put("/")
      .then(function(res) {
        res.should.have.status(200);
      });
  });

});
