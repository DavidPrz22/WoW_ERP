import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import type { PricingChartProps } from "../types";

Chart.register(zoomPlugin);

export function PricingChart({ history }: PricingChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: history.map((d) => d.date.slice(5)),
        datasets: [
          {
            label: "Market Value",
            data: history.map((d) => d.marketValue),
            borderColor: "hsl(42, 78%, 55%)",
            backgroundColor: "hsla(42, 78%, 55%, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: "Min Buyout",
            data: history.map((d) => d.minBuyout),
            borderColor: "hsl(120, 60%, 45%)",
            tension: 0.4,
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: "Historical",
            data: history.map((d) => d.historical),
            borderColor: "hsl(217, 100%, 50%)",
            borderDash: [5, 5],
            tension: 0.4,
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
          }
        ],
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
            pan: {
              enabled: true,
              mode: "x",
            },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: "x",
            }
          },
          tooltip: {
            backgroundColor: "hsl(30, 22%, 9%)",
            borderColor: "hsl(36, 28%, 22%)",
            borderWidth: 1,
            titleColor: "hsl(40, 35%, 88%)",
            bodyColor: "hsl(40, 35%, 88%)",
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  const copper = context.parsed.y;
                  const g = Math.floor(copper / 10000);
                  const s = Math.floor((copper % 10000) / 100);
                  const c = Math.floor(copper % 100);
                  label += `${g}g ${s}s ${c}c`;
                }
                return label;
              },
            },
          },
          legend: {
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
                return Math.round(Number(value) / 10000) + "g";
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [history]);

  return (
    <Card className="bg-card/60 border-border shadow-panel lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-display text-gold">Trend — 30 day</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] relative w-full">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
}
