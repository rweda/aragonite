"use strict";
var chai = require("chai");
var should = chai.should();
var Aragonite = require("../Aragonite");

describe("aragonite.loadPlugin()", function() {

  let aragon = null;

  beforeEach(function() {
    aragon = new Aragonite();
  });

  describe("given 'aragonite-vbox' (bundled plugin)", function() {
    it("should find the plugin", function() {
      aragon
        .loadPlugin('aragonite-vbox')
        .then(function(AragoniteVBoxPlugin) {
          AragoniteVBoxPlugin.should.be.a.function;
        });
    });
  });

  describe("given 'mocha' (NPM package)", function() {
    it("should find the plugin", function() {
      aragon
        .loadPlugin("chai")
        .then(function(c) {
          c.should.be.an.object;
          c.should.have.property("should");
        });
    });
  });

  describe("given 'not-a-package' (non-existent package)", function() {
    it("shouldn't find the plugin", function() {
      aragon
        .loadPlugin("not-a-package")
        .then(function() {
          should.fail();
        })
        .catch(function() {
          return true;
        });
    });
  });

});
