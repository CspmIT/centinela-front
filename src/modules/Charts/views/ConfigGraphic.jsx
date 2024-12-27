import {
    Button,
    FormControlLabel,
    Switch,
    TextField,
    Typography,
} from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import DataGenerator from '../../../components/DataGenerator/DataGenerator'
import VarsProvider from '../../../components/DataGenerator/ProviderVars'

const ConfigGraphic = () => {
    const { id } = useParams()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    const onSubmit = (data) => {
        console.log(data)
    }
    const onError = (errors) => console.log(errors)

    return (
        <VarsProvider>
            <div className="w-full bg-white p-5 rounded-lg shadow-md h-fit">
                <Typography className="text-center !mb-5" variant="h3">
                    Configuracion del grafico {id}
                </Typography>
                <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    className="flex flex-col gap-4 "
                >
                    <div className="flex w-full justify-center">
                        <TextField
                            className="w-1/3"
                            label="Titulo del grafico"
                            {...register('title', {
                                required: 'Este campo es requerido',
                            })}
                            error={errors.title}
                            helperText={errors.title && errors.title.message}
                        />
                    </div>

                    {/* COMPONENTE DE VARIABLES */}
                    <DataGenerator register={register} errors={errors} />
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </VarsProvider>
    )
}

export default ConfigGraphic
