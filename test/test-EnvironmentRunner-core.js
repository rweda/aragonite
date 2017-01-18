"use strict";
var chai = require("chai");
var should = chai.should();
var EnvironmentRunner = require("../environment/EnvironmentRunner");

describe("EnvironmentRunner.isFinished", function() {

  let runner = null;

  beforeEach(function() {
    runner = new EnvironmentRunner();
  });

  it("should return 'true' if no environments", function() {
    runner.isFinished.should.equal(true);
  });

  it("should return 'true' if all environments are finished", function() {
    let environment = {};
    runner.environments.push(environment);
    runner.finished.push(environment);
    runner.isFinished.should.equal(true);
  });

  it("should return 'false' if environments aren't started", function() {
    let environment = {};
    runner.environments.push(environment);
    runner.isFinished.should.equal(false);
  });

  it("should return 'false' if environments are started, but not finished", function() {
    let environment = {};
    runner.environments.push(environment);
    runner.running.push(environment);
    runner.isFinished.should.equal(false);
  });

});

describe("EnvironmentRunner.runningCost", function() {

  let runner = null;

  beforeEach(function() {
    runner = new EnvironmentRunner();
  });

  it("should work with no running environments", function() {
    runner.runningCost.should.equal(0);
  });

  it("should work with one environment", function() {
    runner.running = [{cost: 5}];
    runner.runningCost.should.equal(5);
  });

  it("should work if cost is 0", function() {
    runner.running = [{cost: 0}];
    runner.runningCost.should.equal(0);
  });

  it("should work with multiple environments", function() {
    runner.running = [{cost: 5}, {cost: 15}, {cost: 10}];
    runner.runningCost.should.equal(30);
  });

  it("should work if multiple costs are 0", function() {
    runner.running = [{cost: 0}, {cost: 5}, {cost: 0}, {cost: 20}];
    runner.runningCost.should.equal(25);
  });

});

describe("EnvironmentRunner.canStart", function() {

  let runner = null;

  beforeEach(function() {
    runner = new EnvironmentRunner();
  });

  it("should refuse finished environments", function() {
    let environment = {};
    runner.finished = [environment];
    runner.canStart(environment).should.equal(false);
  });

  it("should refuse started environments", function() {
    let environment = {};
    runner.running = [environment];
    runner.canStart(environment).should.equal(false);
  });

  it("should refuse non-parallel environments if runAsync = true", function() {
    let environment = {};
    runner.canStart(environment).should.equal(false);
  });

  it("should refuse non-parallel environments if another is running", function() {
    let environment = {};
    runner.running = [{}];
    runner.runAsync = false;
    runner.canStart(environment).should.equal(false);
  });

  it("should accept non-parallel environments if runAsync = false", function() {
    let environment = {};
    runner.runAsync = false;
    runner.canStart(environment).should.equal(true);
  });

  it("should refuse environments with costs too large", function() {
    let environment = {cost: 20, async: true};
    runner.totalCost = 10;
    runner.canStart(environment).should.equal(false);
  });

  it("should refuse environments that would exceed the cost", function() {
    let environment = {cost: 6, async: true};
    runner.running = [{cost: 5, async: true}];
    runner.totalCost = 10;
    runner.canStart(environment).should.equal(false);
  });

  it("should accept environments that are under the total cost", function() {
    let environment = {cost: 2, async: true};
    runner.totalCost = 10;
    runner.canStart(environment).should.equal(true);
    runner.running = [{cost: 1, async: true}, {cost: 2, async: true}];
    runner.canStart(environment).should.equal(true);
  });

});
