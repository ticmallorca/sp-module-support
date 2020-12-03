/**
 * dashboardInfo
 * Copyright(c) 2019 Alejandro Villén
 * MIT Licensed
 */

console.log("TicmSupport DashboardInfo library");

var baseURL_ticmSupport = "/api/ticmSupport";

var apiURL = `${baseURL_ticmSupport}/get/ticket/count`;
$.ajax({
    type: "GET",
    url: apiURL

}).done(function (response) {
    if (response.status && response.size === 1) {
        var data = response.data[0];
        $("#ticmSupport-pending").html(data.pending);
        $("#ticmSupport-inprogress").html(data.inprogress);
        $("#ticmSupport-done").html(data.done);
    } else {
        doNotify("error", response.status, response.message);
    }
});
