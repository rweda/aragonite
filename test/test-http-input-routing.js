"use strict";
var chai = require("chai");
var chaiHTTP = require("chai-http");
chai.use(chaiHTTP);
var should = chai.should();
var Aragonite = require("../Aragonite");
var HTTPInput = require("../aragonite-http-input/aragonite-http-input");
var fs = require("fs.extra");
var tmp = require("tmp");

describe("aragonite-http-input routing", function() {

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
      return chai
        .request(input.app)
        .put("/")
        .set("Content-Type", "multipart/form-data")
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.equal("Started.");
        });
    });

    it("should work if fields given", function() {
      return chai
        .request(input.app)
        .put("/")
        .field("name", "Test")
        .set("Content-Type", "multipart/form-data")
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.equal("Started.");
        });
    });

    it.skip("should work if file given", function() {
      return chai
        .request(input.app)
        .put("/")
        .attach("archive", fs.readFileSync(__dirname+"/test-http-input-routing.js"), "archive.zip")
        .set("Content-Type", "multipart/form-data")
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.equal("Started.");
          let file = fs.readFileSync(dir+"/archive.zip", "utf8");
          file.should.equal(fs.readFileSync(__dirname+"/test-http-input-routing.js", "utf8"));
        });
    });

  });

});
