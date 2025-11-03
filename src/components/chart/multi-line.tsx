"use client";
import React from "react";
import dynamic from "next/dynamic";
import {CoffeeConsumption} from "@/types/coffee-consumption";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MultiLineChart = ({ data : rawData }: { data: {teams : CoffeeConsumption[]} }) => {
    const data = rawData.teams;
    const series = data.flatMap(teamData => ([
        {
            name: `${teamData.team} - Bugs`,
            data: teamData.series.map(item => [item.cups, item.bugs]),
            type: 'line',
        },
        {
            name: `${teamData.team} - Productivity`,
            data: teamData.series.map(item => [item.cups, item.productivity]),
            type: 'line',
        }
    ]));


    const options: ApexCharts.ApexOptions = {

        stroke: {
            curve: 'smooth',
            width: [4, 2],
            dashArray: [0, 5]
        },
        yaxis: [
            {
                seriesName: data.map(d => `${d.team} - Bugs`),
                axisTicks: { show: true },
                axisBorder: { show: true},
                title: { text: "버그 수 (Bugs)" },
            },
            {
                seriesName: data.map(d => `${d.team} - Productivity`),
                opposite: true,
                axisTicks: { show: true },
                axisBorder: { show: true },

                title: { text: "생산성 점수 (Productivity)"},
            }
        ],
        xaxis: {
            type: 'numeric',
            title: { text: '커피 섭취량 (잔/일)' },
            labels: { formatter: (val) => Number(val).toFixed(0) + '잔' }
        },
        markers: {
            size: 5,
            hover: { sizeOffset: 2 },
            shape: data.flatMap(() => (['circle', 'square']))
        },


        tooltip: {
            shared: true,
            intersect: false,
            custom: function({ w, dataPointIndex }) {
                const coffeeIntake = w.globals.seriesX[0][dataPointIndex];
                let tooltipContent = `<div class="apexcharts-tooltip-title" style="padding: 6px 10px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ddd;">${coffeeIntake} 잔/일</div>`;
                tooltipContent += '<div class="" style="padding: 5px;">';

                w.globals.seriesNames.forEach((name : string, i:number) => {
                    const value = w.globals.series[i][dataPointIndex];
                    if (value !== null && value !== undefined) {
                        const color = w.globals.colors[i];
                        tooltipContent += `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 4px;">
                                <div style="display: flex; align-items: center; font-size: 13px;">
                                    <span style="display: block; width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; margin-right: 8px;"></span>
                                    <span style="font-weight: 500;">${name}</span>
                                </div>
                                <span style="margin-left:16px;font-weight: bold; color: #333;">${Number(value).toFixed(0)}</span>
                            </div>
                        `;
                    }
                });
                tooltipContent += '</div>';
                return tooltipContent
            }
        },

        colors: data.flatMap((d, index) => {
            const baseColors = ['#008FFB', '#00E396', '#FEB019'];
            const teamColor = baseColors[index % baseColors.length];
            return [teamColor, teamColor];
        })
    };

    return (

            <Chart className={"w-[100%] chart"} options={options} series={series} type="line" />

    );
};

export default MultiLineChart;
