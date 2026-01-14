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
}

const StackedAreaChart = ({ data = [] }: StackedAreaChartProps) => {
  const { theme } = useTheme();
  const series = prepareSeries(data);
  const options: ApexOptions = {
    chart: {
      type: "area",
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    colors: ["#008FFB", "#00E396"],

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
        show: false,
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
      x: {
        format: "dd MMM yyyy HH:mm",
      },
      y: {
        formatter: (val: number) => `${val.toFixed(3)}`,
      },
    },
  };

  console.log(series, "series");

  return (
    <div className="w-full -mx-4 sm:mx-0">
      <ApexChart
        type="area"
        height={230}
        width={800}
        series={series}
        options={options}
      />
    </div>
  );
};

export default StackedAreaChart;
