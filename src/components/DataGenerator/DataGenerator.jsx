import { Button, FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Calculadora from './Calculator'
import CalculatorVars from './ClculatorVars'
import { useForm } from 'react-hook-form'
import { useVars } from './ProviderVars'
import Swal from 'sweetalert2'
import { request } from '../../utils/js/request'
import { backend } from '../../utils/routes/app.routes'
const DataGenerator = ({ handleClose, data = null }) => {
	const [requireCalc, setRequireCalc] = useState(false)
	const [display, setDisplay] = useState([])
	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm()

	const handleRquiredCalc = () => {
		setRequireCalc(!requireCalc)
	}

	useEffect(() => {
		if (requireCalc) {
			setValue('topic', '')
			setValue('field', '')
			setValue('time', '')
			setValue('unit_topic', '')
		}
	}, [requireCalc, setValue])
	const [state, dispatch] = useVars()
	const isValidFormula = display.length
	const onSubmit = async (data) => {
		try {
			if (requireCalc) {
				if (state.calcVars.length === 0) {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Debe generar la formula de la variable para poder guardarla',
					})
					return false
				}
				// Valido que display tenga la variable del calculo
				if (!isValidFormula) {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Debe existir al menos una variable en la formula',
					})
					return false
				}
			}

			const dataConsult = requireCalc
				? state.calcVars.reduce((acc, val) => {
						if (!acc?.[val.calc_name_var]) acc[val.calc_name_var] = {}
						acc[val.calc_name_var] = {
							calc_topic: val.calc_topic,
							calc_field: val.calc_field,
							calc_time: val.calc_time,
							calc_unit: val.calc_unit,
						}
						return acc
				  }, {})
				: {
						[data.name_var]: {
							calc_topic: data.topic,
							calc_field: data.field,
							calc_time: data.time,
							calc_unit: data.unit_topic,
						},
				  }
			const dataReturn = {
				name: data.name_var,
				unit: data.unit,
				type: data.type_var,
				calc: requireCalc,
				varsInflux: dataConsult,
				equation: state?.equation || null,
			}
			await request(`${backend[import.meta.env.VITE_APP_NAME]}/saveVariable`, 'POST', dataReturn)
			if (handleClose) {
				handleClose()
			}
			// guardar
		} catch (error) {
			console.error(error)
			Swal.fire({
				icon: 'warning',
				title: 'Atención!',
				text: `Hubo un problema al guardar.`,
			})
		}
	}
	useEffect(() => {
		if (data) {
			setValue('name_var', data?.name)
			setValue('unit', data?.unit)
			setValue('type_var', data?.type)
			if (data?.calc) {
				handleRquiredCalc()
			}
			if (!data.calc) {
				setValue('topic', data?.varsInflux?.[data.name]?.calc_topic)
				setValue('field', data?.varsInflux?.[data.name]?.calc_field)
				setValue('time', data?.varsInflux?.[data.name]?.calc_time)
				setValue('unit_topic', data?.varsInflux?.[data.name]?.calc_unit)
			} else {
				const vars = Object.keys(data?.varsInflux).reduce((acc, val) => {
					acc.push({
						calc_name_var: val,
						calc_topic: data?.varsInflux[val].calc_topic,
						calc_field: data?.varsInflux[val].calc_field,
						calc_time: data?.varsInflux[val].calc_time,
						calc_unit: data?.varsInflux[val].calc_unit,
					})
					return acc
				}, [])
				dispatch({ type: 'SET_CALC_VAR', payload: vars })
				dispatch({ type: 'SET_EQUATION', payload: data?.equation })
			}
		}
	}, [data])
	return (
		<div className='p-5 flex flex-col gap-2 justify-start items-center min-w-[90vw] max-w-[94vw]'>
			<Typography variant='h5' className='text-center'>
				Configuracion de variables
			</Typography>
			<div className='flex w-full justify-center gap-3'>
				<TextField
					type='text'
					className='w-1/3'
					label='Nombre de variable'
					{...register('name_var', {
						required: 'Este campo es requerido',
					})}
					error={!!errors.name_var}
					helperText={errors.name_var && errors.name_var.message}
				/>
				<TextField
					type='text'
					className='w-1/8'
					label='Unidad de medida'
					{...register('unit', {
						required: 'Este campo es requerido',
					})}
					error={!!errors.unit}
					helperText={errors.unit && errors.unit.message}
				/>
				<TextField
					select
					label='tipo de variable'
					{...register('type_var', {
						required: 'Este campo es requerido',
					})}
					className='w-2/12'
					error={!!errors.type_var}
					helperText={errors.type_var && errors.type_var.message}
					defaultValue={''}
				>
					<MenuItem value=''>
						<em>Seleccione un tipo de Variable</em>
					</MenuItem>
					<MenuItem value='last'>Instantánea</MenuItem>
					<MenuItem value='history'>Histórico</MenuItem>
				</TextField>
			</div>
			<div className='flex w-full justify-center gap-3'>
				<FormControlLabel
					control={<Switch checked={requireCalc} />}
					label='¿La variable requiere un calculo?'
					onChange={handleRquiredCalc}
				/>
			</div>

			{!requireCalc ? (
				<div className='flex w-full justify-center gap-3 '>
					<TextField
						type='text'
						className='w-1/3'
						label='Topico'
						{...register('topic', {
							required: 'Este campo es requerido',
						})}
						error={!!errors.topic}
						helperText={errors.topic && errors.topic.message}
					/>
					<TextField
						type='text'
						className='w-1/5'
						label='Field'
						{...register('field', {
							required: 'Este campo es requerido',
						})}
						error={!!errors.field}
						helperText={errors.field && errors.field.message}
					/>
					<TextField
						type='number'
						className='w-1/12'
						label='Tiempo'
						{...register('time', {
							required: 'Este campo es requerido',
							pattern: {
								value: /^[0-9]+$/,
								message: 'Solo se permiten números',
							},
						})}
						error={!!errors.time}
						helperText={errors.time && errors.time.message}
					/>
					<TextField
						select
						label='Unidad'
						{...register('unit_topic', {
							required: 'Este campo es requerido',
						})}
						className='w-2/12'
						error={!!errors.unit_topic}
						helperText={errors.unit_topic && errors.unit_topic.message}
						defaultValue={'ms'}
					>
						<MenuItem value='ms'>Milisegundos</MenuItem>
						<MenuItem value='s'>Segundos</MenuItem>
						<MenuItem value='m'>Minutos</MenuItem>
						<MenuItem value='h'>Horas</MenuItem>
						<MenuItem value='d'>Días</MenuItem>
						<MenuItem value='mo'>Mes</MenuItem>
						<MenuItem value='y'>Año</MenuItem>
					</TextField>
				</div>
			) : null}

			<div
				className={`transition-all duration-500 ease-in-out overflow-hidden ${
					requireCalc ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
				}`}
			>
				{requireCalc ? (
					<div className={`flex flex-col gap-4 items-center justify-center `}>
						<CalculatorVars />
						<Calculadora setDisplay={setDisplay} display={display} showNumbers={true} />
					</div>
				) : null}
			</div>
			<div className='flex flex-col gap-4 items-center mt-3'>
				<Button variant='contained' color='secondary' onClick={handleSubmit(onSubmit)}>
					Guardar variable
				</Button>
			</div>
		</div>
	)
}

export default DataGenerator
