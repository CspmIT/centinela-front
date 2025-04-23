import { useNavigate, useParams } from 'react-router-dom'
import VarsProvider from '../../../components/DataGenerator/ProviderVars'
import { Button, Card, IconButton, TextField, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import BooleanChart from '../components/BooleanChart'
import SelectVars from '../components/SelectVars'
import { zodResolver } from '@hookform/resolvers/zod'
import { BooleanChartSchema } from '../schemas/BooleanChartSchema'

const ConfigBooleanChart = () => {
    const { id = false } = useParams()
    const [chart, setChart] = useState()
    const [influxVar, setInfluxVar] = useState(null)
    const [title, setTitle] = useState('')
    const navigate = useNavigate()

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(BooleanChartSchema),
        mode: 'onChange'
    })

    const send = (data) => {
        console.log(data)
    }
    const error = (error) => {
        console.log(error)
    }

    useEffect(() => {
        if (id) {
            console.log('editando')
        }
    }, [id])
    return (
        <VarsProvider>
            <div className="w-full bg-white p-5 rounded-lg shadow-md h-fit">
                <div className="flex justify-end">
                    <IconButton
                        sx={{
                            color: 'black',
                            marginRight: 2,
                            padding: '8px',
                        }}
                        aria-label="volver atrás"
                        onClick={() => {
                            id
                                ? navigate('/config/allGraphic')
                                : navigate('/config/graphic')
                        }}
                    >
                        <ArrowBack sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                </div>
                <Typography className="text-center !mb-5" variant="h3">
                    {id
                        ? `Edición del gráfico "${chart?.name || ''}"`
                        : 'Configuración de gráfico'}
                </Typography>
                <form
                    onSubmit={handleSubmit(send, error)}
                    className="flex max-sm:flex-col w-full gap-3"
                >
                    <Card className="flex flex-col w-full max-sm:w-full p-3 mb-4 gap-3">
                        <TextField
                            type="text"
                            className="w-full"
                            label="Titulo del grafico"
                            {...register('title')}
                            error={errors.title}
                            helperText={errors.title && errors.title.message}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            className="w-full"
                            {...register('textOn')}
                            label={'Texto On'}
                            error={errors.textOn}
                            helperText={errors.textOn && errors.textOn.message}
                        />
                        <TextField
                            className="w-full"
                            {...register('textOff')}
                            label={'Texto Off'}
                            error={errors.textOff}
                            helperText={errors.textOff && errors.textOff.message}
                        />
                        <TextField
                            type="color"
                            className="w-full"
                            label="Color del grafico cuando esta en ON"
                            {...register('colorOn', {
                                required: 'Este campo es requerido',
                            })}
                            error={errors.colorOn}
                            helperText={
                                errors.colorOn && errors.colorOn.message
                            }
                        />
                        <TextField
                            type="color"
                            className="w-full"
                            label="Color del grafico cuando esta en OFF"
                            {...register('colorOff', {
                                required: 'Este campo es requerido',
                            })}
                            error={errors.colorOff}
                            helperText={
                                errors.colorOff && errors.colorOff.message
                            }
                        />
                        <SelectVars
                            setValue={setValue}
                            label={'Seleccione una variable para el grafico'}
                            initialVar={influxVar}
                        />
                        <Button type='submit' variant='contained' color='primary'>Guardar</Button>
                    </Card>

                    <Card className="w-full max-sm:w-full p-3 mb-4">
                        <Typography variant="h4" component="div" align="center">
                            {title}
                        </Typography>
                        <BooleanChart estado={true} />
                    </Card>
                </form>
            </div>
        </VarsProvider>
    )
}

export default ConfigBooleanChart
