import $ from "jquery";
import { BASE_API } from "./config";

// pool list api
export function poolList(page = 1) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${BASE_API}/poolList`,
            method: "GET",
            dataType: "json",
            timeout: 15000,
            data: { page },
        })
            .done(res => resolve(res))
            .fail((xhr, status, error) => {
                let message = "Error fetching data from the server";

                if (status === "timeout") {
                    message = "Connection to the server timed out";
                } else if (xhr.status === 404) {
                    message = "Requested URL not found (404)";
                } else if (xhr.status === 500) {
                    message = "Server encountered an error (500)";
                }

                console.error("PoolList API Error:", { xhr, status, error, message });
                reject(new Error(message));
            });
    });
}

// pool details api
export function fetchPool(link) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${BASE_API}/pool/`,
            method: "GET",
            dataType: "json",
            timeout: 15000,
            data: { link },
        })
            .done(res => resolve(res))
            .fail((xhr, status, error) => {
                let message = "Error fetching data from the server";

                if (status === "timeout") {
                    message = "Connection to the server timed out";
                } else if (xhr.status === 404) {
                    message = "Requested URL not found (404)";
                } else if (xhr.status === 500) {
                    message = "Server encountered an error (500)";
                }

                console.error("PoolDetail API Error:", { xhr, status, error, message });
                reject(new Error(message));
            });
    });
}
