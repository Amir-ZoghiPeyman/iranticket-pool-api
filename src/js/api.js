import $ from "jquery";
import { BASE_API } from "./config";

// pool list api
export function poolList(page = 1) {
    return $.ajax({
        url: `${BASE_API}/poolList`,
        method: "GET",
        dataType: "json",
        timeout: 15000,
        data: { page },

        beforeSend: function () {
            console.log("Loading pool list...");
        },

        success: function (res) {
            console.log("API Response:", res);
        },

        error: function (xhr, status, error) {
            console.error("PoolList API Error:", { xhr, status, error });

            let message = "Error fetching data from the server";

            if (status === "timeout") {
                message = "Connection to the server timed out";
            } else if (xhr.status === 404) {
                message = "Requested URL not found (404)";
            } else if (xhr.status === 500) {
                message = "Server encountered an error (500)";
            }
        }
    });
}

// pool details api
export function fetchPool(link) {
    return $.ajax({
        url: `${BASE_API}/pool/`,
        method: "GET",
        dataType: "json",
        timeout: 15000,
        data: { link },

        beforeSend: function () {
            console.log("Loading pool detail...");
        },

        success: function (res) {
            console.log("API Response:", res);
        },

        error: function (xhr, status, error) {
            console.error("PoolDetail API Error:", { xhr, status, error });

            let message = "Error fetching data from the server";

            if (status === "timeout") {
                message = "Connection to the server timed out";
            } else if (xhr.status === 404) {
                message = "Requested URL not found (404)";
            } else if (xhr.status === 500) {
                message = "Server encountered an error (500)";
            }
        }
    });
}