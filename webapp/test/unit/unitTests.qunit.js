/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"app/ZBZR_MALZEME/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});