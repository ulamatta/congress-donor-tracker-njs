'use client'

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type Tick,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import type { Donor } from "@/types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface DonorChartProps {
  donors: Donor[]
}

export function DonorChart({ donors }: DonorChartProps) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    if (!donors || donors.length === 0) {
      setChartData({
        labels: ["No data available"],
        datasets: [
          {
            label: "Donation Amount",
            data: [0],
            backgroundColor: "rgba(200, 200, 200, 0.5)",
          },
        ],
      })
      return
    }

    // Employer labels (truncate at 30 chars)
    const labels = donors.map(d => {
      const n = d.employer || "Unknown"
      return n.length > 30 ? n.slice(0, 30) + "…" : n
    })

    // Use raw totals in dollars
    const dataValues = donors.map(d => d.total_amt)

    setChartData({
      labels,
      datasets: [
        {
          label: "Donations",
          data: dataValues,
          backgroundColor: "rgba(37, 99, 235, 0.5)",
          borderColor: "rgba(37, 99, 235, 1)",
          borderWidth: 1,
        },
      ],
    })
  }, [donors])

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Top Donors by Employer",
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const v = ctx.raw as number
            // Format tooltip as $###K or $#.##M
            if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
            if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`
            return `$${v}`
          },
        },
      },
    },
    scales: {
      x: {
        // From 0 → 1.1×max so you see the smallest bars
        min: 0,
        max: chartData
          ? Math.max(...chartData.datasets[0].data) * 1.1
          : undefined,
        ticks: {
          callback: (value: string | number | Tick) => {
            const v = Number(value)
            if (isNaN(v)) return ""
            if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`
            if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`
            return v.toString()
          },
        },
      },
    },
  }

  if (!chartData) {
    return (
      <div className="flex h-80 items-center justify-center">
        Loading chart…
      </div>
    )
  }

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  )
}
