import $ from "jquery";
import { BASE_API } from "./config";

// empty JWT token / it's only for learning purposes
let JWT_TOKEN = {}

// error texts
function ajaxError(xhr, status) {
    if (status === "timeout") return "Connection timed out";
    if (xhr.status === 401) return "Session expired. Please log in again.";
    if (xhr.status === 403) return "You don't have permission for this action.";
    if (xhr.status === 404) return "Resource not found";
    if (xhr.status >= 500) return "Server error. Please try again later.";
    return "An unexpected error occurred";
}

// ajax wrapper (api template)
async function apiTemplate(endpoint, params = {}, retries = 3) {
    // auto retry logic
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // main ajax template
            const result = await new Promise((resolve, reject) => {
                $.ajax({
                    url: `${BASE_API}${endpoint}`,
                    method: "GET",
                    dataType: "json",
                    timeout: 15000,
                    data: params,
                    headers: {
                        "Authorization": `Bearer ${JWT_TOKEN}`,
                    },
                })
                    .done(resolve)
                    // error handler
                    .fail((xhr, status) => {
                        const message = ajaxError(xhr, status);
                        console.error(`API Error (Attempt ${attempt}):`, { endpoint, xhr, status, message });
                        reject(new Error(message));
                    });
            });
            return result;
            // rest of the auto retry logic
        } catch (err) {
            if (attempt === retries) {
                throw err;
            }
            await new Promise(res => setTimeout(res, 500));
        }
    }
}

// entrypoint for creating api's
// pool list api
export async function poolList(page = 1) {
    return await apiTemplate("/poolList", { page });
}

// pool details api
export async function fetchPool(link) {
    return await apiTemplate("/pool/", { link });
}

// this kind of structural pattern of api calling is useful in bigger projects
// i used it for learning purposes