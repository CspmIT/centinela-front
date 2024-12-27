import { useEffect, useRef } from 'react'
import * as echarts from 'echarts';

const EChart = ({ config }) => {
    const chartRef = useRef(null)

    useEffect(() => {
        let chartInstance = echarts.init(chartRef.current)
        chartInstance.setOption(config)

        const resizeObserver = new ResizeObserver(() => {
            chartInstance.resize()
        })

        resizeObserver.observe(chartRef.current)

        return () => {
            resizeObserver.disconnect()
            chartInstance.dispose()
        }
    }, [config])

    return <div ref={chartRef} style={{ height: '100%', width: '100%' }}></div>
}

export default EChart