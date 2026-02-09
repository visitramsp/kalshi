"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { prepareSeries } from "@/utils/Content";
import { RawSeries } from "@/utils/typesInterface";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StackedAreaChartProps {
  data?: RawSeries[];
  timeIntervalValue: string;
  setTimeIntervalValue: (value: string) => void;
}
const BASE_COLORS = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#3F51B5",
  "#546E7A",
  "#D4526E",
  "#8D5B4C",
  "#F86624",
];

const StackedAreaChart = ({
  data = [],
  timeIntervalValue = "all",
  setTimeIntervalValue,
}: StackedAreaChartProps) => {
  const { theme } = useTheme();
  const series = prepareSeries(data);
  const colors = series.map(
    (_, index) => BASE_COLORS[index % BASE_COLORS.length],
  );
  const options: ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },

    colors: colors,

    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
      width: 2,
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.8,
        stops: [0, 90, 100],
      },
    },

    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
      floating: true,
      offsetY: -10,
      offsetX: 0,
      labels: {
        colors: theme === "dark" ? "#fff" : "#000",
      },
    },

    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#6b7280",
        },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
        },
      },
      tickPlacement: "on",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
    },

    yaxis: {
      min: 0,
      max: 1,
      labels: {
        style: {
          colors: "#6b7280",
        },
        formatter: (val: number) => val.toFixed(2),
      },
      title: {
        text: undefined,
      },
    },

    grid: {
      borderColor: "#7A85F5",
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },

    tooltip: {
      shared: true, // ❌ sabka data ek sath nahi
      intersect: false,
      x: {
        format: "dd MMM yyyy HH:mm",
      },
      y: {
        formatter: (val: number) => `${val.toFixed(3)}`,
      },
    },
  };

  const timeInterval = ["5m", "15m", "30m", "1h", "24h", "7d", "all"];

  return (
    <div className="w-full flex  relative -mx-4 sm:mx-0">
      <div
        className="absolute right-0 -top-1 flex items-center gap-1
  dark:bg-[#2B394D] bg-gray-200 rounded-lg px-1 py-1
"
      >
        {timeInterval.map((item) => (
          <button
            key={item}
            onClick={() => setTimeIntervalValue(item)}
            className={`
        px-3 py-1 text-xs font-medium rounded-md
        transition-all
        ${
          item === timeIntervalValue
            ? "dark:bg-[#1D293D] bg-gray-50 dark:text-white text-black"
            : "dark:text-gray-400 text-gray-600 hover:text-white cursor-pointer hover:bg-white/5"
        }
      `}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="mt-4  w-full">
        {Number(data?.length) > 0 ? (
          <ApexChart
            type="area"
            height={230}
            // width={800}
            series={series}
            options={options}
          />
        ) : (
          <div className="bg-cyan-100/80 rounded-lg h-56 mt-6 flex items-center justify-center">
            <span className="text-gray-500">[Chart Placeholder]</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StackedAreaChart;
