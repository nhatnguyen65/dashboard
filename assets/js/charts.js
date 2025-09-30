async function getDataChart() {
    // mock API
    // const res = await fetch(
    //     "https://4dbc39fd-e5d2-40c6-ba3b-06b5aa4ddc4d.mock.pstmn.io/getData"
    // );
    const res = await fetch(
        "https://4f5af295-a225-4967-8707-341318739941.mock.pstmn.io/getData"
    );
    return await res.json();
}

const glowPlugin = {
    id: "glow",
    beforeDatasetsDraw(chart) {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                ctx.save();
                ctx.shadowColor = dataset.borderColor;
                ctx.shadowBlur = 15;
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = dataset.borderWidth;
                ctx.strokeStyle = dataset.borderColor;
                ctx.beginPath();
                meta.dataset.draw(ctx);
                ctx.stroke();
                ctx.restore();
            }
        });
    },
};
const crosshairPlugin = {
    id: "crosshair",
    beforeDatasetsDraw: (chart) => {
        // đổi từ afterDraw sang beforeDatasetsDraw
        if (chart.tooltip._active && chart.tooltip._active.length) {
            const ctx = chart.ctx;
            const activePoint = chart.tooltip._active[0];
            const x = activePoint.element.x;
            const topY = chart.scales.y.top;
            const bottomY = chart.scales.y.bottom;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#aaa";
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.restore();
        }
    },
};
function renderChart(data) {
    const viewLabels = [];
    const viewValues = [];
    data.views.forEach((element) => {
        viewLabels.push(element.label);
        viewValues.push(element.value);
    });
    const ctx = document.getElementById("chart-bars").getContext("2d");
    // const data = Array.from(
    //     { length: 7 },
    //     () => Math.floor(Math.random() * 500) + 50
    // );
    new Chart(ctx, {
        type: "bar",
        data: {
            // labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
            labels: viewLabels,
            datasets: [
                {
                    label: "Lượt xem",
                    tension: 0.4,
                    borderWidth: 0,
                    backgroundColor: "#43A047",
                    borderSkipped: false,
                    borderRadius: {
                        topLeft: 10,
                        topRight: 10,
                        bottomLeft: 5,
                        bottomRight: 5,
                    },
                    hoverBackgroundColor: "#1E88E5",
                    maxBarThickness: 50,
                    // categoryPercentage: 0.7, // Giảm tỷ lệ category (mặc định 0.8)
                    // barPercentage: 0.7, // Giảm tỷ lệ chiều rộng cột trong category (mặc định 0.9)
                    // barThickness: "flex",
                    // data: [50, 45, 22, 28, 50, 60, 76],
                    // data: data.views,
                    data: viewValues,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            const weekDays = [
                                "Thứ 2",
                                "Thứ 3",
                                "Thứ 4",
                                "Thứ 5",
                                "Thứ 6",
                                "Thứ 7",
                                "Chủ Nhật",
                            ];
                            return weekDays[context[0].dataIndex];
                        },
                    },
                    displayColors: false, // ⬅ tắt ô màu ở tooltip
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5],
                        color: "#e5e5e5",
                    },
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 500,
                        beginAtZero: true,
                        padding: 10,
                        font: {
                            size: 14,
                            lineHeight: 2,
                        },
                        color: "#737373",
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                        borderDash: [5, 5],
                    },
                    ticks: {
                        display: true,
                        color: "#737373",
                        padding: 10,
                        font: {
                            size: 14,
                            lineHeight: 2,
                        },
                    },
                },
            },
        },
    });

    const revenueLabels = [];
    const revenueValues = [];
    data.revenue.forEach((element) => {
        revenueLabels.push(element.label);
        revenueValues.push(element.value);
    });
    const ctx2 = document.getElementById("chart-line").getContext("2d");
    // const data2 = Array.from(
    //     { length: 7 },
    //     () => Math.floor(Math.random() * 5000) + 500
    // );
    new Chart(ctx2, {
        type: "line",
        data: {
            // labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
            labels: revenueLabels,
            datasets: [
                {
                    label: "Doanh thu",
                    tension: 0,
                    borderWidth: 3,
                    pointRadius: 2,
                    pointBorderColor: "#43A047",
                    pointHoverRadius: 5,
                    pointBorderWidth: 5,
                    pointHoverBorderWidth: 3,
                    pointHoverBorderColor: "#1E88E5",
                    pointHoverBackgroundColor: "#FFF",
                    borderColor: "#43A047",
                    backgroundColor: "transparent",
                    fill: true,
                    maxBarThickness: 6,
                    // data: [120, 230, 130, 440, 250, 360, 270, 180, 90, 300, 310, 220],
                    // data: data.revenue,
                    data: revenueValues,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            const weekDays = [
                                "Thứ 2",
                                "Thứ 3",
                                "Thứ 4",
                                "Thứ 5",
                                "Thứ 6",
                                "Thứ 7",
                                "Chủ Nhật",
                            ];
                            return weekDays[context[0].dataIndex];
                        },
                    },
                    displayColors: false, // ⬅ tắt ô màu ở tooltip
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [4, 4],
                        color: "#e5e5e5",
                    },
                    ticks: {
                        display: true,
                        color: "#737373",
                        padding: 10,
                        font: {
                            size: 12,
                            lineHeight: 2,
                        },
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                        borderDash: [5, 5],
                    },
                    ticks: {
                        display: true,
                        color: "#737373",
                        padding: 10,
                        font: {
                            size: 12,
                            lineHeight: 2,
                        },
                    },
                },
            },
        },
        plugins: [glowPlugin],
    });

    const ordersLabels = [];
    const ordersCompleteds = [];
    const ordersTotals = [];
    data.orders.forEach((element) => {
        ordersLabels.push(element.label);
        ordersCompleteds.push(element.valueCompleted);
        ordersTotals.push(element.valueTotal);
    });
    const ctx3 = document.getElementById("chart-line-tasks").getContext("2d");
    // const data3 = Array.from(
    //     { length: 12 },
    //     () => Math.floor(Math.random() * 500) + 50
    // );
    // const dataTotal = Array.from(
    //     { length: 12 },
    //     () => Math.floor(Math.random() * 500) + 50
    // );
    new Chart(ctx3, {
        type: "line",
        data: {
            // labels: [
            //     "T1",
            //     "T2",
            //     "T3",
            //     "T4",
            //     "T5",
            //     "T6",
            //     "T7",
            //     "T8",
            //     "T9",
            //     "T10",
            //     "T11",
            //     "T12",
            // ],
            labels: ordersLabels,
            datasets: [
                {
                    label: " Tổng đơn hàng",
                    tension: 0.4,
                    borderWidth: 4,
                    pointRadius: 0,
                    pointHoverBackgroundColor: "#fff",
                    pointBorderColor: "#43a",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBorderWidth: 3,
                    borderColor: "#1E88E5",
                    backgroundColor: "transparent",
                    fill: false,
                    // data: data.ordersTotal, // mảng số liệu tổng đơn
                    data: ordersTotals,
                },
                {
                    label: " Đơn hoàn thành",
                    tension: 0.4,
                    borderWidth: 4,
                    pointRadius: 0,
                    // pointBackgroundColor: "#43A047",  // xanh lá
                    // pointBackgroundColor: "#fff",   // nền trắng
                    pointHoverBackgroundColor: "#fff",
                    pointBorderColor: "#43a", // viền = màu line
                    pointHoverRadius: 5, // to hơn khi hover
                    pointBorderWidth: 5,
                    pointHoverBorderWidth: 3,
                    // pointBorderColor: "transparent",
                    borderColor: "#43A047",
                    backgroundColor: "transparent",
                    fill: false,
                    // data: data.ordersCompleted, // mảng số liệu đơn hoàn thành
                    data: ordersCompleteds,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    usePointStyle: true, // 🔹 bắt buộc để thay style
                    callbacks: {
                        title: function (context) {
                            const months = [
                                "Tháng 1",
                                "Tháng 2",
                                "Tháng 3",
                                "Tháng 4",
                                "Tháng 5",
                                "Tháng 6",
                                "Tháng 7",
                                "Tháng 8",
                                "Tháng 9",
                                "Tháng 10",
                                "Tháng 11",
                                "Tháng 12",
                            ];
                            return months[context[0].dataIndex];
                        },
                        labelPointStyle: function (context) {
                            return {
                                pointStyle: "rectRounded", // có thể là 'circle', 'rectRounded', 'rectRot', 'triangle', ...
                                rotation: 0,
                            };
                        },
                        labelColor: function (context) {
                            return {
                                borderColor: context.dataset.borderColor,
                                backgroundColor: context.dataset.borderColor,
                                borderWidth: 2,
                                borderRadius: 2,
                            };
                        },
                    },
                },
                legend: {
                    display: false, // bật legend để phân biệt 2 line
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [4, 4],
                        color: "#e5e5e5",
                    },
                    ticks: {
                        display: true,
                        padding: 10,
                        color: "#737373",
                        font: {
                            size: 14,
                            lineHeight: 2,
                        },
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                        borderDash: [4, 4],
                    },
                    ticks: {
                        display: true,
                        color: "#737373",
                        padding: 10,
                        font: {
                            size: 14,
                            lineHeight: 2,
                        },
                    },
                },
            },
        },
        plugins: [crosshairPlugin, glowPlugin],
    });

    // const brandLabels = ["iPhone", "Samsung", "Xiaomi", "Oppo", "Khác"];
    // const data4 = Array.from(
    //     { length: 5 },
    //     () => Math.floor(Math.random() * 500) + 50
    // );
    const brandNames = [];
    const brandOrders = [];
    data.brands.forEach((element) => {
        brandNames.push(element.name);
        brandOrders.push(element.orders);
    });
    const ctx4 = document.getElementById("chart-pie").getContext("2d");
    new Chart(ctx4, {
        type: "pie",
        data: {
            labels: brandNames,
            datasets: [
                {
                    label: "Đơn hàng",
                    data: brandOrders,
                    backgroundColor: [
                        "#E53935", // iPhone
                        "#1E88E5", // Samsung
                        "#FB8C00", // Xiaomi
                        "#43A047", // Oppo
                        "#8E24AA", // Khác
                    ],
                    hoverBackgroundColor: [
                        "#EF5350", // đỏ sáng hơn
                        "#42A5F5", // xanh nước sáng hơn
                        "#FFB74D", // cam sáng hơn
                        "#66BB6A", // xanh lá sáng hơn
                        "#BA68C8", // tím sáng hơn
                    ],
                    borderWidth: 3,
                    borderColor: "#FFF", // viền trắng để nhìn rõ
                    hoverBorderColor: "#FFF",
                    hoverOffset: 7,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "left", // hoặc "left"
                    align: "center",
                    labels: {
                        boxWidth: 0, // bỏ ô màu
                        usePointStyle: false,
                        padding: 25,
                        font: {
                            size: 14,
                        },
                        generateLabels(chart) {
                            const datasets = chart.data.datasets;
                            const labels = chart.data.labels;
                            return labels.map((label, i) => {
                                return {
                                    text: label, // chỉ hiển thị tên
                                    fillStyle: datasets[0].backgroundColor[i], // vẫn giữ màu để click toggle
                                    fontColor: datasets[0].backgroundColor[i], // đổi màu chữ theo màu slice
                                    hidden: !chart.getDataVisibility(i),
                                    index: i,
                                };
                            });
                        },
                    },
                    onClick(evt, legendItem, legend) {
                        const index = legendItem.index;
                        const ci = legend.chart;
                        // toggle hiển thị
                        ci.toggleDataVisibility(index);
                        ci.update();
                    },
                },
                tooltip: {
                    backgroundColor: (context) => {
                        // lấy đúng màu slice hiện tại
                        const dataset = context.tooltip.dataPoints[0].dataset;
                        const index = context.tooltip.dataPoints[0].dataIndex;
                        return dataset.backgroundColor[index];
                    },
                    titleColor: "#fff", // màu chữ tiêu đề
                    bodyColor: "#fff", // màu chữ nội dung
                    displayColors: false, // bỏ ô vuông mặc định
                    callbacks: {
                        title: function (context) {
                            // không cần title riêng, trả về rỗng
                            return "";
                        },
                        label: function (context) {
                            const label = context.label || "";
                            const value = context.raw || 0;
                            const total =
                                context.chart._metasets[context.datasetIndex]
                                    .total;
                            const percentage = ((value / total) * 100).toFixed(
                                1
                            ); // làm tròn 1 số thập phân
                            return `${label}: ${percentage}% (${value} đơn)`;
                        },
                    },
                },
            },
        },
    });
}

// getDataChart().then((data) => renderChart(data.stats));
getDataChart()
    .then((data) => renderChart(data.stats))
    .catch((error) => console.log(error));

// Biểu đồ Doanh thu & Lợi nhuận theo tháng
new Chart(document.getElementById("chartRevenueTrend"), {
    type: "line",
    data: {
        labels: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6"],
        datasets: [
            {
                label: " Doanh thu",
                data: [120, 150, 180, 160, 200, 220],
                borderColor: "#43A047",
                backgroundColor: "rgba(67,160,71,0.15)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: "#43A047",
                pointBorderWidth: 2,
                pointHoverBackgroundColor: "#FFF",
                pointHoverRadius: 5,
                pointHoverBorderColor: "#43a",
                pointHoverBorderWidth: 3,
            },
            {
                label: " Lợi nhuận",
                data: [45, 60, 70, 65, 90, 100],
                borderColor: "#1E88E5",
                backgroundColor: "rgba(30,136,229,0.15)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: "#1E88E5",
                pointBorderWidth: 2,
                pointHoverBackgroundColor: "#FFF",
                pointHoverRadius: 5,
                pointHoverBorderColor: "#43a",
                pointHoverBorderWidth: 3,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            // legend: {
            //     position: "top",
            //     labels: {
            //         usePointStyle: true,
            //         pointStyle: "circle",
            //         padding: 20,
            //         font: { size: 14 }
            //     }
            // },
            tooltip: {
                usePointStyle: true, // 🔹 bắt buộc để thay style
                callbacks: {
                    title: function (context) {
                        const months = [
                            "Tháng 1",
                            "Tháng 2",
                            "Tháng 3",
                            "Tháng 4",
                            "Tháng 5",
                            "Tháng 6",
                            "Tháng 7",
                            "Tháng 8",
                            "Tháng 9",
                            "Tháng 10",
                            "Tháng 11",
                            "Tháng 12",
                        ];
                        return ` ${months[context[0].dataIndex]}`;
                    },
                    labelPointStyle: function (context) {
                        return {
                            pointStyle: "rectRounded", // có thể là 'circle', 'rectRounded', 'rectRot', 'triangle', ...
                            rotation: 0,
                        };
                    },
                    labelColor: function (context) {
                        return {
                            borderColor: context.dataset.borderColor,
                            backgroundColor: context.dataset.borderColor,
                            borderWidth: 2,
                            borderRadius: 2,
                        };
                    },
                    label: (ctx) =>
                        `${ctx.dataset.label}: ${ctx.formattedValue} triệu ₫`,
                },
                titleMarginBottom: 10,
                titleMarginLeft: 10,
                titleFont: {
                    size: 14,
                },
                bodySpacing: 20, // tăng khoảng cách giữa các dòng
                bodyFont: {
                    size: 14, // chỉnh chữ to hơn
                },
            },
            legend: {
                display: false,
            },
        },
        interaction: {
            intersect: false,
            mode: "index",
        },
        scales: {
            y: {
                ticks: { color: "#555", font: { size: 13 } },
                grid: { color: "#eee", borderDash: [5, 5] },
            },
            x: {
                ticks: { color: "#555", font: { size: 13 } },
                grid: { display: false },
            },
        },
    },
    plugins: [crosshairPlugin, glowPlugin],
});

// Biểu đồ Cơ cấu doanh thu theo thương hiệu
new Chart(document.getElementById("chartRevenuePie"), {
    type: "doughnut",
    data: {
        labels: ["iPhone", "Samsung", "Xiaomi", "Oppo", "Khác"],
        datasets: [
            {
                data: [320000, 280000, 190000, 150000, 100000],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFBE56",
                    "#4CAF50",
                    "#9C27B0",
                ],
                borderWidth: 3,
                borderColor: "#FFF",
                hoverBorderColor: "#FFF",
                hoverOffset: 7,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
            legend: {
                position: "right",
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: { size: 14 },
                },
            },
            tooltip: {
                backgroundColor: (context) => {
                    // lấy đúng màu slice hiện tại
                    const dataset = context.tooltip.dataPoints[0].dataset;
                    const index = context.tooltip.dataPoints[0].dataIndex;
                    return dataset.backgroundColor[index];
                },
                displayColors: false, // bỏ ô vuông mặc định
                callbacks: {
                    title: function (context) {
                        // không cần title riêng, trả về rỗng
                        return null;
                    },
                    label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const total =
                            context.chart._metasets[context.datasetIndex].total;
                        const percentage = ((value / total) * 100).toFixed(1); // làm tròn 1 số thập phân
                        return ` ${label}: ${value}₫ (${percentage}%) `;
                    },
                },
                bodyFont: {
                    size: 14,
                },
                padding: 8,
            },
        },
    },
});

// Biểu đồ Tăng trưởng doanh thu theo tuần (Bar chart)
new Chart(document.getElementById("chartRevenueGrowth"), {
    type: "bar",
    data: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        datasets: [
            {
                label: "Doanh thu",
                data: [1200, 1500, 1800, 2000],
                backgroundColor: "#FF9800",
                borderRadius: { topLeft: 10, topRight: 10 },
                maxBarThickness: 60,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.formattedValue} triệu ₫`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: "#555", font: { size: 13 } },
                grid: { color: "#eee", borderDash: [5, 5] },
            },
            x: {
                ticks: { color: "#555", font: { size: 13 } },
                grid: { display: false },
            },
        },
    },
});
