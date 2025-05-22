"use client"

import { useEffect, useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface DonationChartProps {
  committees: any[]
}

export function DonationChart({ committees }: DonationChartProps) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    if (!committees || committees.length === 0) return

    try {
      // Extract committee names and cycles
      const committeeNames = committees.map((committee) => {
        const name = committee.name || "Unknown Committee"
        return name.length > 30 ? name.substring(0, 30) + "..." : name
      })

      // Get cycles safely
      const cycles = committees.flatMap((committee) => committee.cycles || [])
      const uniqueCycles = [...new Set(cycles)].sort()

      // Create datasets
      const datasets = uniqueCycles.map((cycle) => {
        return {
          label: `${cycle} Cycle`,
          data: committees.map((committee) => ((committee.cycles || []).includes(cycle) ? 1 : 0)),
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
        }
      })

      setChartData({
        labels: committeeNames,
        datasets,
      })
    } catch (error) {
      console.error("Error preparing chart data:", error)
      setChartData({
        labels: ["Error loading data"],
        datasets: [
          {
            label: "Error",
            data: [0],
            backgroundColor: "rgba(255, 0, 0, 0.6)",
          },
        ],
      })
    }
  }, [committees])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Committee Activity by Election Cycle",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  if (!chartData) {
    return <div className="flex h-full items-center justify-center">Loading chart data...</div>
  }

  return <Bar data={chartData} options={options} />
}
