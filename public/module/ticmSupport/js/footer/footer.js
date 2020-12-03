/**
 * sideBar
 * Copyright(c) 2019 Alejandro Villén
 * MIT Licensed
 */

$("#ticmSupport_ButtonForm").click(function () {

	var description = $("#ticmSupport_descriptionField").val();

	if ($("#ticmSupport_phoneField").val() !== "") {
		description += ` Telf. ${$("#ticmSupport_phoneField").val()}`;
	}


	var struct = {
		category: $("#ticmSupport_categoryField").val(),
		description: description
	};
	ticmSupport_widget_setIssue(struct);
});