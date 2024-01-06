/*global QUnit*/

sap.ui.define([
	"app/ZBZR_MALZEME/controller/MalzemeAc.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MalzemeAc Controller");

	QUnit.test("I should test the MalzemeAc controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});