import $ from "jquery";
import { BASE_API } from "./config";

export default function poolList(page = 1) {
    $.ajax({
        url: `${BASE_API}/poolList/`,
        method: "GET",
        data: {
            page
        },
        success: function (res) {
            console.log(res);
        }
    })
}