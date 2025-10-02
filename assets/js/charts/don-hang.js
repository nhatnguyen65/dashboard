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

// Biểu đồ trạng thái đơn hàng
new Chart(document.getElementById("chart-order-status"), {
    type: "pie",
    data: {
        labels: [
            "Chờ xác nhận",
            "Đang giao",
            "Hoàn thành",
            "Đã hủy",
            "Hoàn trả",
        ],
        datasets: [
            {
                data: [150, 200, 820, 60, 20],
                backgroundColor: [
                    "#6c757d",
                    "#17a2b8",
                    "#28a745",
                    "#dc3545",
                    "#ffc107",
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
        cutout: "1%",
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
                backgroundColor: (context) => {
                    const dataset = context.tooltip.dataPoints[0].dataset;
                    const index = context.tooltip.dataPoints[0].dataIndex;
                    return dataset.backgroundColor[index];
                },
                displayColors: false,
                callbacks: {
                    title: () => null,
                    label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const total =
                            context.chart._metasets[context.datasetIndex].total;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return ` ${label}: ${value} đơn (${percentage}%) `;
                    },
                },
                bodyFont: { size: 14 },
                padding: 10,
            },
        },
    },
});

// Biểu đồ đơn hàng theo tháng (Line chart)
new Chart(document.getElementById("chart-order-trend"), {
    type: "line",
    data: {
        labels: [
            "Th1",
            "Th2",
            "Th3",
            "Th4",
            "Th5",
            "Th6",
            "Th7",
            "Th8",
            "Th9",
            "Th10",
            "Th11",
            "Th12",
        ],
        datasets: [
            {
                label: "Số đơn hàng",
                data: [
                    100, 120, 150, 180, 200, 250, 300, 280, 270, 320, 310, 350,
                ],
                borderColor: "#007bff",
                backgroundColor: "rgba(0,123,255,0.15)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: "#007bff",
                pointBorderWidth: 2,
                pointHoverBackgroundColor: "#FFF",
                pointHoverRadius: 5,
                pointHoverBorderColor: "#007bff",
                pointHoverBorderWidth: 3,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
            legend: { display: false },
            tooltip: {
                usePointStyle: true,
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
                    labelPointStyle: () => ({
                        pointStyle: "rectRounded",
                        rotation: 0,
                    }),
                    labelColor: (context) => ({
                        borderColor: context.dataset.borderColor,
                        backgroundColor: context.dataset.borderColor,
                        borderWidth: 2,
                        borderRadius: 2,
                    }),
                    label: (ctx) =>
                        ` ${ctx.dataset.label}: ${ctx.formattedValue} đơn`,
                },
                titleMarginBottom: 10,
                bodySpacing: 15,
                bodyFont: { size: 14 },
            },
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
