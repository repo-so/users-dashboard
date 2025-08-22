import React, { useState, useRef, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MAX_VALUE = 600;
const LABELS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const InteractiveLineChart: React.FC = () => {
  const [spendingData, setSpendingData] = useState([
    310, 300, 370, 295, 350, 300, 230, 290,
  ]);
  const [emergencyData, setEmergencyData] = useState([
    150, 230, 195, 260, 220, 300, 320, 490,
  ]);

  const spendingValue = spendingData.at(-1) ?? 0;
  const emergencyValue = emergencyData.at(-1) ?? 0;

  const chartRef = useRef(null);

  const updateLastValue = (
    data: number[],
    setData: React.Dispatch<React.SetStateAction<number[]>>,
    value: number
  ) => {
    setData((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = value;
      return updated;
    });
  };

  const addRandomDataPoint = () => {
    setSpendingData((prev) => [...prev.slice(1), Math.floor(Math.random() * 200) + 200]);
    setEmergencyData((prev) => [...prev.slice(1), Math.floor(Math.random() * 300) + 150]);
  };

  const data = useMemo(() => {
    const gradientFill = (ctx: CanvasRenderingContext2D, color: string, alpha: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      return gradient;
    };

    return {
      labels: LABELS,
      datasets: [
        {
          label: "Spending",
          data: spendingData,
          borderColor: "#c371ef",
          backgroundColor: (context: any) =>
            gradientFill(context.chart.ctx, "195, 113, 239", 0.15),
          fill: "start",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderWidth: 4,
          pointBackgroundColor: "#c371ef",
        },
        {
          label: "Emergency",
          data: emergencyData,
          borderColor: "#33a9f7",
          backgroundColor: (context: any) =>
            gradientFill(context.chart.ctx, "51, 169, 247", 0.3),
          fill: "start",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderWidth: 4,
          pointBackgroundColor: "#33a9f7",
        },
      ],
    };
  }, [spendingData, emergencyData]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 750, easing: "easeInOutQuart" },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, family: "system-ui" },
          color: "#64748b",
        },
      },
      tooltip: {
        backgroundColor: "rgba(53, 27, 92, 0.8)",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        usePointStyle: true,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `$${val}`,
          stepSize: 100,
          color: "#64748b",
          font: { size: 11 },
        },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border m-5">
      <h2 className="text-xl font-semibold text-gray-800 font-poppins text-center">Financial Overview</h2>
      <p className="text-sm text-gray-500 mb-6 font-poppins text-center">
        Interactive Line Chart by <a href="https://github.com/repo-so" target="_blank">Younes</a>
      </p>

      {/* actual chart */}
      <div className="h-80 mb-10">
        <Line ref={chartRef} data={data} options={options} />
      </div>

      {/* spending and emenrgenxy controls */}
      <div className="space-y-6 flex flex-row gap-x-10 w-full ">
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-2 font-poppins">
            Spending (December)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min={0} 
              max={MAX_VALUE}
              value={spendingValue}
              onChange={(e) =>
                updateLastValue(spendingData, setSpendingData, Number(e.target.value))
              }
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #c371ef 0%, #c371ef ${
                  (spendingValue / MAX_VALUE) * 100
                }%, #e9d5ff ${(spendingValue / MAX_VALUE) * 100}%, #e9d5ff 100%)`,
              }}
            />
            <span className="text-gray-700 font-medium">${spendingValue}</span>
          </div>
          <input
            type="number"
            value={spendingValue}
            onChange={(e) =>
              updateLastValue(spendingData, setSpendingData, Number(e.target.value))
            }
            className="mt-3 w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Enter value"
          />
        </div>

        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-2 font-poppins">
            Emergency (December)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min={0}
              max={MAX_VALUE}
              value={emergencyValue}
              onChange={(e) =>
                updateLastValue(emergencyData, setEmergencyData, Number(e.target.value))
              }
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #33a9f7 0%, #33a9f7 ${
                  (emergencyValue / MAX_VALUE) * 100
                }%, #dbeafe ${(emergencyValue / MAX_VALUE) * 100}%, #dbeafe 100%)`,
              }}
            />
            <span className="text-gray-700 font-medium">${emergencyValue}</span>
          </div>
          <input
            type="number"
            value={emergencyValue}
            onChange={(e) =>
              updateLastValue(emergencyData, setEmergencyData, Number(e.target.value))
            }
            className="mt-3 w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
          />
        </div>
      </div>

      <button
        onClick={addRandomDataPoint}
        className="mt-6 md:mt-1 px-5 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition"
      >
        Shift to Next
      </button>
    </div>
  );
};

export default InteractiveLineChart;
