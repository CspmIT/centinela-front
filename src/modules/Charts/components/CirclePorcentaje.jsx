import React from 'react';
import EChart from './EChart';

const CirclePorcentaje = ({ data }) => {
    const options = {
        series: [
            {
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                pointer: {
                    show: false
                },
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#464646'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 25
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                data: [
                    {
                        value: data.percentage,
                        title: {
                            offsetCenter: ['0%', '-30%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '0%']
                        }
                    }
                ],
                title: {
                    fontSize: 22
                },
                detail: {
                    width: 50,
                    height: 14,
                    fontSize: 24,
                    color: 'inherit',
                    formatter: '{value} %'
                }
            }
        ]
    };

    return (
        <EChart config={options} />
    );
};

export default CirclePorcentaje;