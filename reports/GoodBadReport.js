"use strict";
var Report = require("./Report");

/**
 * Good/Bad reports provide a very brief summary of the run results.
 * @extends Report
 *
 * @prop {string}  format    Must be `goodbad`.
 * @prop {boolean} passed    **Required** `true` if the tests were fully successful.
 * @prop {number}  good      **Required** The number of successful tests.
 * @prop {number}  bad       **Optional** The number of failed tests.
 * @prop {number}  skipped   **Optional** A number of tests that were skipped.
 * @prop {number}  duration  **Optional** The total time (in ms) it took to test the elements, not counting time spent
     setting up the environment.
*/
class GoodBadReport extends Report {

}

module.exports = GoodBadReport;
