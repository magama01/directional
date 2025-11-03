"use client";
import React from "react";
import dynamic from "next/dynamic";
import {WeeklyMoodTrend} from "@/types/weekly-mood-trend";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const StackedBarChart = ({  data }: { data : WeeklyMoodTrend[]} ) => {
    const series = [
        {
            name: 'Happy',
            data: data.map(item => item.happy)
        },
        {
            name: 'Tired',
            data: data.map(item => item.tired)
        },
        {
            name: 'Stressed',
            data: data.map(item => item.stressed)
        },
    ];
    const categories = data.map(item => item.week);

    const options = {
        chart: {
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        yaxis : {
          max : 100
        },
        xaxis: {
            categories
        },

    };
    return (
            <Chart className={"w-[100%] chart"} options={options} series={series} type="bar" />
    );
};

export default StackedBarChart;
