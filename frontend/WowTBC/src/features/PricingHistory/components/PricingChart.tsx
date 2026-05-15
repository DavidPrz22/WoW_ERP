import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import type { PricingChartProps } from "../types";
import { SERIES_COLORS } from "@/data/ItemsColors";
import { Button } from "@/components/ui/button";

Chart.register(zoomPlugin);

type Metric = "marketValue" | "minBuyout" | "historical" | "numAuctions";

const METRICS: { label: string; value: Metric }[] = [
  { label: "Market Value", value: "marketValue" },
  { label: "Min Buyout", value: "minBuyout" },
  { label: "Historical", value: "historical" },
  { label: "Num Auctions", value: "numAuctions" },
];

export function PricingChart({ compareItems = [] }: PricingChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [activeMetric, setActiveMetric] = useState<Metric>("minBuyout");

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    const isComparing = compareItems.length > 0;

    const allDates = new Set<string>();
    compareItems.forEach(item => {
      item.chartData.forEach(d => allDates.add(d.date));
    });
    const sortedDates = Array.from(allDates).sort();
    const labels = sortedDates.map(date => date.slice(5));

    const datasets = compareItems.map((item, idx) => {
      const dataMap = new Map<string, number>();
      item.chartData.forEach(d => {
        dataMap.set(d.date, (d)[activeMetric]);
      });

      const data = sortedDates.map(date => dataMap.has(date) ? dataMap.get(date) : null);

      return {
        label: item.name,
        data: data,
        borderColor: SERIES_COLORS[idx % SERIES_COLORS.length],
        backgroundColor: SERIES_COLORS[idx % SERIES_COLORS.length].replace("hsl", "hsla").replace(")", ", 0.1)"),
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: SERIES_COLORS[idx % SERIES_COLORS.length],
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        pointHitRadius: 10,
        spanGaps: true,
      };
    });

    const crosshairPlugin = {
      id: "crosshair",
      beforeDraw: (chart: any) => {
        if (chart.tooltip?._active?.length) {
          const { ctx } = chart;
          const activePoint = chart.tooltip._active[0].element;
          const { x, y } = activePoint;
          const { top, bottom, left, right } = chart.chartArea;

          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";

          // Vertical line
          ctx.beginPath();
          ctx.moveTo(x, top);
          ctx.lineTo(x, bottom);
          ctx.stroke();

          // Horizontal line (highlight Y axis)
          ctx.beginPath();
          ctx.moveTo(left, y);
          ctx.lineTo(right, y);
          ctx.stroke();

          ctx.restore();
        }
      },
    };

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          zoom: {
            pan: { enabled: true, mode: "x" },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: "x",
            }
          },
          tooltip: {
            backgroundColor: "rgba(13, 11, 9, 0.95)",
            borderColor: "hsl(36, 28%, 35%)",
            borderWidth: 1,
            titleColor: "hsl(40, 35%, 88%)",
            bodyColor: "hsl(40, 35%, 88%)",
            padding: 12,
            cornerRadius: 8,
            usePointStyle: true,
            boxPadding: 8,
            position: "nearest",
            caretSize: 6,
            caretPadding: 6,
            callbacks: {
              labelColor: function (context) {
                const color = context.dataset.borderColor as string;
                return {
                  borderColor: color,
                  backgroundColor: color,
                  borderWidth: 0,
                  borderRadius: 2,
                };
              },
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  const val = context.parsed.y;
                  if (activeMetric === "numAuctions") {
                      label += val;
                  } else {
                    const g = Math.floor(val / 10000);
                    const s = Math.floor((val % 10000) / 100);
                    const c = Math.floor(val % 100);
                    label += `${g}g ${s}s ${c}c`;
                  }
                }
                return label;
              },
            },
          },
          legend: {
            display: isComparing,
            labels: { color: "hsl(40, 15%, 65%)" }
          }
        },
        scales: {
          x: {
            grid: { color: "hsl(36, 28%, 22%)" },
            ticks: { color: "hsl(40, 15%, 65%)" }
          },
          y: {
            grid: { color: "hsl(36, 28%, 22%)" },
            ticks: {
              color: "hsl(40, 15%, 65%)",
              callback: function (value) {
                if (activeMetric === "numAuctions") return value;
                return Math.round(Number(value) / 10000) + "g";
              },
            },
          },
        },
      },
      plugins: [crosshairPlugin],
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [compareItems, activeMetric]);

  return (
    <Card className="bg-card/60 border-border shadow-panel">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
            <CardTitle className="font-display text-gold">Trend — 30 day</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Comparing {compareItems.length > 0 ? `${compareItems.length} items` : "current selection"}</p>
        </div>
        <div className="flex gap-2">
            {METRICS.map(m => (
                <Button 
                    key={m.value}
                    variant={activeMetric === m.value ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setActiveMetric(m.value)}
                >
                    {m.label}
                </Button>
            ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[60vh]">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
}
