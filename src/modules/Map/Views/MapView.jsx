import { Button, TextField, Typography } from '@mui/material'
import MapBase from '../Components/MapBase'
import SelectVars from '../../Charts/components/SelectVars'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { useState } from 'react'
import { backend } from '../../../utils/routes/app.routes'
import { request } from '../../../utils/js/request'
import { useNavigate, useParams } from 'react-router-dom'

const MapView = ({create = false}) => {
    const {
        register,
        getValues,
        setValue,
        trigger,
        formState: { errors },
    } = useForm()
    const [markers, setMarkers] = useState([])
    const { id = false } = useParams()
    const navigate = useNavigate()
    const generateMarker = (name, lat, lng, idVar) => {
        return {
            name,
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            popupInfo: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                idVar: idVar,
                data: null,
            },
        }
    }
    const saveMarker = async () => {
        const { markerName, markerLat, markerLng, idVar = false } = getValues()
        if (!idVar) {
            await Swal.fire({
                icon: 'error',
                title: 'Atencion!',
                html: '<h3>Debe seleccionar una variable.</h3>',
            })
            return
        }
        const isValid = await trigger()
        if (!isValid) {
            return false
        }
        const marker = generateMarker(markerName, markerLat, markerLng, idVar)
        setMarkers([...markers, marker])
    }

    const [viewState, setViewState] = useState({
        longitude: -62.005196197872266,
        latitude: -30.716256365145455,
        zoom: 14,
        bearing: 0,
        pitch: 0,
    })

    const saveMap = async () => {
        if (!markers || markers.length === 0) {
            await Swal.fire({
                icon: 'error',
                title: 'Atencion!',
                html: '<h3>Debe haber al menos un marcador para guardar el mapa.</h3>',
            })
            return false
        }

        const url = `${backend[import.meta.env.VITE_APP_NAME]}/map`
        const map = {
            viewState,
            markers,
        }

        try {
            const result = await request(url, 'POST', map)
            if (result) {
                await Swal.fire({
                    title: 'Exito:',
                    icon: 'success',
                    html: '<h3>El mapa se guardo con exito</h3>',
                })
                navigate('/')
            }
        } catch (error) {
            console.log(error.message)
            Swal.fire({
                title: 'Atencion',
                icon: 'error',
                html: '<h3>Ocurrio un error al guardar los datos del mapa</h3>',
            })
        }
    }

    return (
        <div className="w-full h-[85vh] flex flex-col gap-3">
            <Typography variant="h4" align="center">
                Presion de red
            </Typography>

            {create && (
                <div className="flex gap-3 max-sm:flex-col justify-center items-center">
                    <TextField
                        className="w-1/5 max-sm:w-full"
                        {...register('markerName', {
                            required: 'Debe dar un nombre al marcador',
                            validate: (value) =>
                                !markers.some(
                                    (marker) => marker.name === value
                                ) || 'El marcador ya existe',
                        })}
                        label={'Nombre'}
                        error={errors?.markerName}
                        helperText={errors?.markerName?.message}
                    />
                    <TextField
                        className="w-1/5 max-sm:w-full"
                        {...register('markerLat', {
                            required: 'Debe asignar una latitud',
                        })}
                        label={'Latitud'}
                        error={errors?.markerLat}
                        helperText={errors?.markerLat?.message}
                    />
                    <TextField
                        className="w-1/5 max-sm:w-full"
                        {...register('markerLng', {
                            required: 'Debe asignar una longitud',
                        })}
                        label={'Longitud'}
                        error={errors?.markerLng}
                        helperText={errors?.markerLng?.message}
                    />
                    <SelectVars
                        className="!w-1/5 !max-sm:w-full"
                        setValue={setValue}
                        label={'Seleccione una variable'}
                    />
                    <Button
                        onClick={saveMarker}
                        className="w-[10%]"
                        variant="contained"
                    >
                        Agregar
                    </Button>
                    <Button
                        onClick={saveMap}
                        className="w-[10%]"
                        color="success"
                        variant="contained"
                    >
                        Guardar Mapa
                    </Button>
                </div>
            )}

            <MapBase
                height={'100%'}
                markers={markers}
                setMarkers={setMarkers}
                viewState={viewState}
                setViewState={setViewState}
                controlPanel={create}
            />
        </div>
    )
}

export default MapView
