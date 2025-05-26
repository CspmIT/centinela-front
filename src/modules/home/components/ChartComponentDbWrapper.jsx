import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import PumpControl from '../../Charts/views/ConfigBombs'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

export const ChartComponentDbWrapper = ({
    chartId,
    ChartComponent,
    initialProps,
    initialData,
}) => {
    const [chartData, setChartData] = useState(initialData)
    const [loading, setLoading] = useState(true) // Estado para controlar la carga

    // Función para obtener los datos de las bombas o estados desde la API
    // const fetchPumpOrStateValues = async (items) => {
    //     const updatedItems = await Promise.all(
    //         items.map(async (item) => {
    //             try {
    //                 const influxVar = item.value
    //                 const { data } = await request(
    //                     `${backend['Mas Agua']}/dataInflux`,
    //                     'POST',
    //                     influxVar.varsInflux // Ajusta el payload según lo que la API necesite
    //                 )
    //                 const accessKey = Object.values(item.value).shift()
    //                 return {
    //                     ...item,
    //                     value:
    //                         data?.[accessKey.calc_field]?.value ?? 'Sin datos',
    //                 }
    //             } catch (error) {
    //                 console.error(error)
    //                 return { ...item, value: 'Error' } // Devuelve el item con un estado de error
    //             }
    //         })
    //     )
    //     return updatedItems
    // }

    // Función para obtener los datos de gráficos y actualizarlos
    const fetchChartData = async (influxVar) => {
        try {
            console.log(influxVar)
            if (influxVar?.calc) {
                const influx = Object.entries(influxVar.varsInflux).map(
                    async ([varName, varConfig]) => {
                        const sendData = { [varName]: varConfig }
                        const { data } = await request(
                            `${backend['Mas Agua']}/dataInflux`,
                            'POST',
                            sendData
                        )
                        console.log(data)
                    }
                )
            } else {
                const { data } = await request(
                    `${backend['Mas Agua']}/dataInflux`,
                    'POST',
                    influxVar.varsInflux
                )
                // console.log(influxVar.varsInflux)

                const accessKey = Object.values(
                    initialData.value.varsInflux
                ).shift()
                return {
                    value: data?.[accessKey.calc_field]?.value,
                }
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (ChartComponent === PumpControl) {
                // Si el componente es PumpControl, actualiza bombas y estados
                const { initialPumps, initialStates } = initialData

                // Actualiza valores de bombas (pumps)
                const updatedPumps = await fetchPumpOrStateValues(initialPumps)

                // Actualiza valores de estados
                const updatedStates = await fetchPumpOrStateValues(
                    initialStates
                )

                // Actualiza el estado del chartData con los valores obtenidos
                setChartData((prevData) => {
                    return {
                        ...prevData,
                        initialPumps: updatedPumps,
                        initialStates: updatedStates,
                    }
                })
            }

            if (initialData?.value) {
                const data = await fetchChartData(initialData.value)

                if (data) {
                    setChartData((prevData) => ({
                        ...prevData,
                        value: data.value, // Actualizamos el valor correctamente
                    }))
                }
            }

            // Cuando los datos estén listos, setLoading a false
            setLoading(false)
        }

        fetchData()
        const intervalId = setInterval(fetchData, 15000) // Refresca los datos cada 15 segundos
        return () => clearInterval(intervalId)
    }, [chartId, ChartComponent, initialData]) // Dependencias ajustadas para asegurar la actualización

    // Si los datos aún no están listos, muestra un mensaje de carga
    if (loading) {
        return (
            <Typography variant="h6" align="center">
                Cargando datos...
            </Typography>
        )
    }

    return <ChartComponent {...initialProps} {...chartData} />
}
