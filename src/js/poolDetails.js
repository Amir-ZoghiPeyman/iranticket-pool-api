import $ from "jquery";

const poolDetail = $("#pool-detail");

export default function poolDetails(poolId, pools = []) {
    poolDetail.empty();

    const pool = pools.find(p => p.id == poolId);

    if (!pool) {
        poolDetail.append("<p>استخر پیدا نشد</p>");
        return;
    }

    const detailCard = $(`
        <div class="card">
            <img src="https://iranticket.co/${pool.poolImg[0]?.src}" alt="${pool.title}" />
            <div>
                <h2>${pool.title}</h2>
                <p>${pool.add}</p>
                <p>حداقل قیمت: ${pool.minPrice}</p>
                <p>تخفیف: ${pool.takhfif || "ندارد"}%</p>
                <p>جنسیت: ${pool.sex === 1 ? "آقایان" : pool.sex === 2 ? "بانوان" : "مختلط"}</p>
                <p>تلفن: ${pool.tell || "-"}</p>
                <a href="${pool.link}">
                    <button>رزرو</button>
                </a>
            </div>
        </div>
    `);

    poolDetail.append(detailCard);
}
