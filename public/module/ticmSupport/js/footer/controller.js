/**
 * controller
 * Copyright(c) 2019 Alejandro Villén
 * MIT Licensed
 */

console.log("TicmSupport Widget controller library");

var baseURL_ticmSupport = "/api/ticmSupport";

function ticmSupport_widget_setIssue(jsonData) {

	var apiURL = `${baseURL_ticmSupport}/set`;
	$.ajax({
		type: "POST",
		url: apiURL,
		data: jsonData

	}).done(function (response) {
		if (response.status) {
			doNotify("success", response.status, response.message);
			$("#modal_ticmSupport").modal("toggle");

		} else {
			// Message sended
			doNotify("error", response.status, response.message);
		}
	});
}