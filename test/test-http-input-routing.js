"use strict";
var chai = require("chai");
var chaiHTTP = require("chai-http");
chai.use(chaiHTTP);
var should = chai.should();
var Aragonite = require("../Aragonite");
var HTTPInput = require("../aragonite-http-input/aragonite-http-input");
var fs = require("fs.extra");
var tmp = require("tmp");

describe("aragonite.loadPlugin()", function() {

  let aragon = null;
  let input = null;
  let dir = null;

  beforeEach(function() {
    dir = tmp.dirSync().name;
    aragon = new Aragonite();
    input = new HTTPInput(aragon, {httpInput: {storage: dir}});
  });

  afterEach(function (done) {
    fs.rmrf(dir, function() {
      done();
    });
  });

  describe("PUT /", function() {

    it("should work if no data given", function() {
      chai
        .request(input.app)
        .put("/")
        .set("Content-Type", "multipart/form-data")
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.text;
          res.body.should.equal("Started.");
        });
    });

    it("should work if fields given", function() {
      chai
        .request(input.app)
        .put("/")
        .field("name", "Test")
        .set("Content-Type", "multipart/form-data")
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.text;
          res.body.should.equal("Started.");
        });
    });

    it("should work if file given", function() {
      chai
        .request(input.app)
        .put("/")
        .attach("archive", "Testing", "archive.zip")
        .set("Content-Type", "multipart/form-data")
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.text;
          res.body.should.equal("Started.");
          let file = fs.readFileSync(dir+"/archive.zip", "utf8");
          file.should.equal("Testing");
        });
    });

  });

});
