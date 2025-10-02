// Plugin Glow
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
// Plugin Crosshair (line dọc khi hover)
const crosshairPlugin = {
    id: "crosshair",
    beforeDatasetsDraw(chart) {
        if (chart.tooltip._active && chart.tooltip._active.length) {
            const ctx = chart.ctx;
            const activePoint = chart.tooltip._active[0];
            const x = activePoint.element.x;
            const topY = chart.scales.y?.top ?? chart.chartArea.top;
            const bottomY = chart.scales.y?.bottom ?? chart.chartArea.bottom;

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

// 🔹 Biểu đồ Top 5 sản phẩm bán chạy
new Chart(document.getElementById("chart-top-products"), {
    type: "bar",
    data: {
        labels: [
            "iPhone 15 Pro",
            "Galaxy Z Flip 6",
            "AirPods Pro 2",
            "MacBook Air M3",
            "iPad Air M2",
        ],
        datasets: [
            {
                label: "Số lượng bán",
                data: [1200, 950, 780, 650, 500],
                backgroundColor: "#4e73df",
                borderRadius: 8,
                maxBarThickness: 40,
                // barPercentage: 0.7,
                categoryPercentage: 0.7,
            },
        ],
    },
    options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                displayColors: false,
                callbacks: {
                    label: (ctx) => ` ${ctx.formattedValue} sản phẩm`,
                },
                bodyFont: { size: 14 },
                padding: 8,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { color: "#555", font: { size: 13 } },
                grid: { color: "#eee", borderDash: [5, 5] },
            },
            y: {
                ticks: { color: "#555", font: { size: 13 } },
                grid: { display: false },
            },
        },
    },
});

// 🔹 Biểu đồ Xu hướng doanh số theo tháng
new Chart(document.getElementById("chart-sales-trend"), {
    type: "line",
    data: {
        labels: [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ],
        datasets: [
            {
                label: " Doanh số",
                data: [
                    120, 150, 180, 200, 250, 270, 320, 300, 280, 350, 400, 420,
                ],
                borderColor: "#1cc88a",
                backgroundColor: "rgba(28,200,138,0.15)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: "#1cc88a",
                pointBorderWidth: 2,
                pointHoverBackgroundColor: "#FFF",
                pointHoverRadius: 5,
                pointHoverBorderColor: "#1cc88a",
                pointHoverBorderWidth: 3,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                usePointStyle: true,
                callbacks: {
                    title: (ctx) => `Tháng ${ctx[0].label}`,
                    label: (ctx) =>
                        ` ${ctx.dataset.label}: ${ctx.formattedValue} triệu ₫`,
                    labelPointStyle: () => ({
                        pointStyle: "rectRounded",
                        rotation: 0,
                    }),
                },
                bodyFont: { size: 14 },
                padding: 10,
            },
        },
        interaction: { intersect: false, mode: "index" },
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
    plugins: [glowPlugin, crosshairPlugin],
});

// 🔹 Biểu đồ Cơ cấu tồn kho theo danh mục
new Chart(document.getElementById("chart-inventory-structure"), {
    type: "doughnut",
    data: {
        labels: ["Điện thoại", "Laptop", "Tablet", "Phụ kiện"],
        datasets: [
            {
                data: [1200, 800, 500, 950],
                backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
                borderWidth: 3,
                borderColor: "#fff",
                hoverBorderColor: "#fff",
                hoverOffset: 8,
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
                    pointStyle: "rectRounded",
                    padding: 20,
                    font: { size: 14 },
                },
            },
            tooltip: {
                displayColors: false,
                callbacks: {
                    label: (ctx) => {
                        const total =
                            ctx.chart._metasets[ctx.datasetIndex].total;
                        const value = ctx.raw;
                        const percent = ((value / total) * 100).toFixed(1);
                        return ` ${ctx.label}: ${value} (${percent}%)`;
                    },
                },
                bodyFont: { size: 14 },
                padding: 8,
            },
        },
    },
});
