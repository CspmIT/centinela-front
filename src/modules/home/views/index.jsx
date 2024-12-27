import { Grid, Typography, useMediaQuery } from '@mui/material'
import LiquidFill from '../../Charts/components/LiquidFillPorcentaje'
import CardCustom from '../../../components/CardCustom'
import Chart from '../../Charts/components/Chart'
import CirclePorcentaje from '../../Charts/components/CirclePorcentaje'
import BarDataSet from '../../Charts/components/BarDataSet'
import StackedAreaChart from '../../Charts/components/StackedAreaChart'
import Surface from '../../Charts/components/Surface'

const chartData = [
    {
        title: 'Ingreso de Agua por Hora',
        component: LiquidFill,
        props: {
            data: [{ name: 'bar', value: 0.79 }],
        },
    },
    {
        title: 'Cantidad de Cloro T1(%)',
        component: LiquidFill,
        props: {
            type: 'circle',
            data: [{ name: '%', value: 0.65 }],
            porcentage: true,
            color: '#FFEB59',
        },
    },
    {
        title: 'Cantidad de Cloro T2 (%)',
        component: LiquidFill,
        props: {
            data: [{ value: 0.36 }],
            porcentage: true,
            color: '#FFEB59',
        },
    },
    {
        title: 'Cloro libre',
        component: LiquidFill,
        props: {
            data: [{ name: 'ppm', value: 0.35 }],
            color: '#eefd01',
        },
    },
    {
        title: 'Nivel de Cisterna (%)',
        component: LiquidFill,
        props: {
            data: [{ value: 0.75 }, { value: 0.7 }],
            color: '#FFEB59',
            porcentage: true,
            type: 'rectCircle',
            border: false,
        },
    },
    {
        title: 'Nivel de Tanque (%)',
        component: CirclePorcentaje,
        props: {
            data: { percentage: 64.29 },
        },
    },
    {
        title: 'Grafico de barras',
        component: BarDataSet,
        props: {},
    },
    {
        title: 'Grafico de area',
        component: StackedAreaChart,
        props: {},
    },
    {
        title: 'Grafico de navegable',
        component: Surface,
        props: {},
    },
]

const Home = () => {
    return (
        <Grid container spacing={3}>
            {chartData.map((chart, index) => {
                const ChartComponent = chart.component
                return (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                        <CardCustom
                            className={'flex flex-col h-80 items-center'}
                        >
                            <Typography
                                variant="h5"
                                className="text-center pt-9"
                            >
                                {chart.title}
                            </Typography>
                            <ChartComponent {...chart.props} />
                        </CardCustom>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default Home
