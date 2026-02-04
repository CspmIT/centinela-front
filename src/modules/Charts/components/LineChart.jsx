import { memo, useMemo, useCallback } from 'react'
import EChart from './EChart'

const LineChart = memo(({ yType, xSeries, ySeries, onZoomRange, onRestore }) => {
  const isMobile = useMemo(
    () => window.matchMedia('(max-width: 768px)').matches,
    []
  )

  const memoizedXSeries = useMemo(() => [...(xSeries || [])], [xSeries])

  // Convertimos series data a formato [timeMs, value]
  const memoizedYSeries = useMemo(() => {
    return (ySeries || []).map((series) => {
      const data = (series.data || []).map((v, i) => {
        const t = memoizedXSeries[i]
        return [t, v]
      })

      return {
        ...series,
        type: 'line',
        data,
        connectNulls: true,
        showSymbol: true,
        showAllSymbol: 'auto',
        symbolSize: 2,
        sampling: 'none',
        ...(series.areaStyle && {
          areaStyle: { opacity: 0.15 },
        }),
      }
    })
  }, [ySeries, memoizedXSeries])

  const formatDateTime = useCallback((valueMs) => {
    const d = new Date(valueMs)

    const date = d.toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
    })

    const time = d.toLocaleTimeString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    return `${time}\n${date}`
  }, [])

  const options = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: (params) => {
          if (!params?.length) return ''

          const timeMs = params[0]?.value?.[0]
          const title = Number.isFinite(timeMs)
            ? new Date(timeMs).toLocaleString('es-AR', {
              timeZone: 'America/Argentina/Buenos_Aires',
            })
            : ''

          let html = `<div style="font-weight:600;margin-bottom:4px;">${title}</div>`

          params.forEach((p) => {
            const rawValue = p?.value?.[1]

            const valueText =
              rawValue === null ||
                rawValue === undefined ||
                rawValue === '-' ||
                Number.isNaN(rawValue)
                ? 'Sin datos'
                : rawValue

            html += `
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color};"></span>
                <span>${p.seriesName}:</span>
                <b>${valueText}</b>
              </div>
            `
          })

          return html
        },
      },

      legend: {
        data: memoizedYSeries.map((s) => s.name),
      },

      grid: {
        left: '3%',
        right: '4%',
        top: '8%',
        bottom: isMobile ? '10%' : '6%',
        containLabel: true,
      },

      toolbox: {
        feature: {
          dataZoom: { yAxisIndex: 'none' },
          dataView: {
            readOnly: true,
            title: 'Tabla',
            optionToContent: (opt) => {
              const formatDateTime = (ms) => {
                if (!Number.isFinite(ms)) return '-'
                return new Date(ms).toLocaleString('es-AR', {
                  timeZone: 'America/Argentina/Buenos_Aires',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              }

              const series = opt.series || []
              if (!series.length) return `<div style="padding:12px;">Sin datos</div>`

              // Tomamos como base el eje X desde la primer serie
              const baseData = series[0]?.data || []

              let html = `
                <div style="padding:10px;max-height:60vh;font-family:Arial;">
                  <table style="width:100%;border-collapse:collapse;">
                    <thead>
                      <tr>
                        <th style="text-align:left;border-bottom:1px solid #ddd;padding:6px;">Fecha</th>
              `

              // headers por serie
              series.forEach((s) => {
                html += `<th style="text-align:left;border-bottom:1px solid #ddd;padding:6px;">${s.name}</th>`
              })

              html += `
                      </tr>
                    </thead>
                    <tbody>
              `

              // filas
              for (let i = 0; i < baseData.length; i++) {
                const rowTime = baseData[i]?.[0]
                html += `<tr>`
                html += `<td style="border-bottom:1px solid #eee;padding:6px;white-space:nowrap;">${formatDateTime(rowTime)}</td>`

                series.forEach((s) => {
                  const v = s.data?.[i]?.[1]
                  const valueText =
                    v === null || v === undefined || v === '-' || Number.isNaN(v)
                      ? 'Sin datos'
                      : v

                  html += `<td style="border-bottom:1px solid #eee;padding:6px;">${valueText}</td>`
                })

                html += `</tr>`
              }

              html += `
                    </tbody>
                  </table>
                </div>
              `

              return html
            },
          },
          restore: {},
          saveAsImage: {},
        },
      },

      xAxis: {
        type: 'time',
        axisLabel: {
          show: !isMobile,
          rotate: 25,
          formatter: formatDateTime,
        },
      },

      yAxis: {
        type: yType || 'value',
        scale: true,
      },

      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          throttle: 80,
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
          filterMode: 'none',
          minValueSpan: 2 * 60 * 1000,
          start: 0,
          end: 100,
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          height: 28,
          bottom: 0,
          filterMode: 'none',
          minValueSpan: 2 * 60 * 1000,
          showDetail: true,
          handleSize: 16,
          left: '8%',
          right: '8%',
          showDataShadow: true,
          brushSelect: false,
          labelFormatter: formatDateTime,
          start: 0,
          end: 100,
        },
      ],

      series: memoizedYSeries,
    }
  }, [memoizedYSeries, yType, isMobile, formatDateTime])

  return <EChart config={options} onZoomRange={onZoomRange} onRestore={onRestore} />
})

export default LineChart
