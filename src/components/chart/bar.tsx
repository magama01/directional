"use client";
import React from "react";
import dynamic from "next/dynamic";
import {TopCoffeeBrand} from "@/types/top-coffee-brand";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = ({  data }: { data : TopCoffeeBrand[]} ) => {
    const series = [
        {
            name: 'Popularity',
            data: data.map(item => item.popularity)
        },
    ];
    const categories = data.map(item => item.brand);
    const options = {
        xaxis: {
            categories
        },
    };
    return (

            <Chart className={"w-[100%] chart"} options={options} series={series} type="bar" />

    );
};

export default BarChart;
