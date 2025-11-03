"use client";
import React from "react";
import dynamic from "next/dynamic";
import {TopCoffeeBrand} from "@/types/top-coffee-brand";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DonutChart = ({  data }: { data : TopCoffeeBrand[]} ) => {
    const series = data.map(item => item.popularity);
    const labels = data.map(item => item.brand);
    const options = {
        labels
    };
    return (
            <Chart className={"w-[100%] chart"} options={options} series={series} type="donut" />
    );
};

export default DonutChart;
