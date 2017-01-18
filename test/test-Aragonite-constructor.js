"use strict";
var chai = require("chai");
var should = chai.should();
var Aragonite = require("../Aragonite");

describe("new Aragonite()", function() {
  it("should set default options if nothing given", function() {
    let aragon = new Aragonite();
    aragon.opts.should.be.an.object;
    aragon.opts.runners.should.be.an.array;
    aragon.opts.should.deep.equal(aragon.defaults);
  });

  it("should insert new options", function() {
    let aragon = new Aragonite({forTestingOnly: true});
    aragon.opts.forTestingOnly.should.equal(true);
    let defaults = aragon.defaults;
    defaults.forTestingOnly = true;
    aragon.opts.should.deep.equal(defaults);
  });

  it("should overwrite existing options", function() {
    let aragon = new Aragonite({runners: ["Test"]});
    aragon.opts.runners.should.deep.equal(["Test"]);
  });
});
