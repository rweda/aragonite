"use strict";

/**
 * Report formats document the data that can be sent from the client to a reporter.
 *
 * @prop {string}  format    **Required** an identifier of the used report format.
 * @prop {boolean} passed    **Required** `true` if the tests were fully successful.
 *
 * @abstract
*/
class Report {

}

module.exports = Report;
