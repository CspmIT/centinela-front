import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { FilterAltOutlined, RestartAltOutlined } from '@mui/icons-material'
import TableCustom from '../../../components/TableCustom'
import { ActionsRow, DeleteChip, EditChip } from '../../../components/TableActions'
import { useEffect, useState } from 'react'
import { getVarsInflux } from '../../DrawDiagram/components/Fields/actions'
import ModalVar from '../../../components/DataGenerator/ModalVar'
import { backend } from '../../../utils/routes/app.routes'
import { request } from '../../../utils/js/request'
import Swal from 'sweetalert2'
import { Controller, useForm } from 'react-hook-form'
import LoaderComponent from '../../../components/Loader'
import PageHeader from '../../../components/PageHeader'

const filtersShellSx = {
    borderRadius: '12px',
    border: '1px solid rgba(15, 42, 68, 0.06)',
    backgroundColor: '#ffffff',
    p: 1,
    mb: 1.5,
    'body.dark &': {
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: 'rgba(17, 24, 39, 0.6)',
    },
}

const filterPillSx = {
    borderRadius: '999px',
    textTransform: 'none',
    fontWeight: 500,
    px: 1.75,
    py: 0.5,
    minHeight: 0,
    fontSize: '0.78rem',
    background: 'linear-gradient(135deg, #e36a00 0%, #a14b00 100%)',
    boxShadow: '0 4px 14px rgba(227, 106, 0, 0.35)',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #e36a00 0%, #a14b00 100%)',
        boxShadow: '0 8px 24px rgba(227, 106, 0, 0.45)',
        transform: 'translateY(-1px)',
    },
    '&:active': { transform: 'translateY(0)' },
}

const ghostPillSx = {
    borderRadius: '999px',
    textTransform: 'none',
    fontWeight: 500,
    px: 1.75,
    py: 0.5,
    minHeight: 0,
    fontSize: '0.78rem',
    borderColor: 'rgba(15, 42, 68, 0.14)',
    color: '#475569',
    '&:hover': {
        borderColor: '#e36a00',
        backgroundColor: 'rgba(227, 106, 0, 0.06)',
    },
    'body.dark &': {
        borderColor: 'rgba(255,255,255,0.14)',
        color: '#cbd5e1',
    },
}

const Vars = () => {
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [detailVar, setDetailVar] = useState(null)
    const [vars, setVars] = useState([])
    const [varsOriginal, setVarsOriginal] = useState([]);
    const [processList, setProcessList] = useState([]);
    const [unitList, setUnitList] = useState([]);
    const { control, handleSubmit, reset } = useForm({ defaultValues: { process: '', calc: '', unit: '' } });

    const onResetFilters = () => {
        reset({ process: '', calc: '', unit: '' })
        setVars(varsOriginal)
    }
    const deleteVar = async (id) => {
        const url = `${backend[import.meta.env.VITE_APP_NAME]}/deleteVar/${id}`
        const aprovationUser = await Swal.fire({
            icon: 'warning',
            title: 'Atencion!',
            html: 'Esta seguro que desea eliminar esta variable?',
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        })
        if (!aprovationUser.isConfirmed) {
            return false
        }
        try {
            const { data } = await request(url, 'POST')
            if (data.influxVar) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Exito!',
                    html: 'La variable fue eliminada con exito.',
                })
                getVars()
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                html: 'Ocurrio un error al actualizar la variable',
            })
        }
    }
    const [columns, setColumns] = useState([
        { header: 'ID', accessorKey: 'id', size: 50 },
        { header: 'Nombre', accessorKey: 'name', size: 350 },
        { header: 'Unidad', accessorKey: 'unit' },
        {
            header: 'Cálculo',
            accessorKey: 'calc',
            Cell: ({ row }) => (row.original.calc ? 'Si' : 'No'),
        },
        {
            header: 'Proceso',
            accessorKey: 'process',
            Cell: ({ row }) => (row.original.process ? row.original.process : '-'),
        },
        {
            header: 'Acciones',
            accessorKey: 'options',
            Cell: ({ row }) => (
                <ActionsRow>
                    <EditChip
                        onClick={() => {
                            setDetailVar(row.original)
                            setModal(true)
                        }}
                    />
                    <DeleteChip onClick={() => deleteVar(row.original.id)} />
                </ActionsRow>
            ),
        },
    ])

    const getVars = async () => {
        const varsDB = await getVarsInflux();

        setVars(varsDB);
        setVarsOriginal(varsDB);

        const processUniques = Array.from(
            new Set(varsDB.map(v => v.process).filter(Boolean))
        );

        const unitUniques = Array.from(
            new Set(varsDB.map(v => v.unit).filter(Boolean))
        );

        setProcessList(processUniques);
        setUnitList(unitUniques);
        setLoading(false);
    };


    // FUNCION PARA SETEAR FILTROS
    const onSubmit = ({ process, calc, unit }) => {
        let filtered = [...varsOriginal];

        // Filtro por process
        if (process) {
            filtered = filtered.filter(v => v.process === process);
        }

        // Filtro por calc (convertimos string → boolean)
        if (calc === "true") {
            filtered = filtered.filter(v => v.calc === true);
        } else if (calc === "false") {
            filtered = filtered.filter(v => v.calc === false);
        }

        // Filtro por unit
        if (unit) {
            filtered = filtered.filter(v => v.unit === unit);
        }

        setVars(filtered);
    };



    useEffect(() => {
        getVars()
    }, [])

    return (
        <Container maxWidth={false} disableGutters className='w-full px-3 sm:px-5 pt-2 pb-4'>
            <PageHeader
                title='Variables'
                createLabel='Crear variable'
                onCreate={() => {
                    setDetailVar(null)
                    setModal(true)
                }}
            />

            {!loading ? (
                <>
                    <Box sx={filtersShellSx}>
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-wrap items-center gap-1.5'>
                            <div className='flex-1 min-w-[180px]'>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="unit_label">Unidad</InputLabel>
                                    <Controller
                                        name="unit"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} labelId="unit_label" label="Unidad">
                                                <MenuItem value="">Todos</MenuItem>
                                                {unitList.map((p, i) => (
                                                    <MenuItem key={i} value={p}>
                                                        {p}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </div>
                            <div className='flex-1 min-w-[180px]'>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="calc_label">Cálculo</InputLabel>
                                    <Controller
                                        name="calc"
                                        control={control}
                                        render={({ field }) => (
                                            <Select labelId="calc_label" label="Cálculo" {...field}>
                                                <MenuItem value="">Todas</MenuItem>
                                                <MenuItem value="true">Sí</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </div>
                            <div className='flex-1 min-w-[180px]'>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="process_label">Proceso</InputLabel>
                                    <Controller
                                        name="process"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} labelId="process_label" label="Proceso">
                                                <MenuItem value="">Todos</MenuItem>
                                                {processList.map((p, i) => (
                                                    <MenuItem key={i} value={p}>
                                                        {p}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </div>

                            <div className='flex gap-1.5 w-full justify-center sm:w-auto sm:justify-start shrink-0'>
                                <Button
                                    type='submit'
                                    variant='contained'
                                    disableElevation
                                    startIcon={<FilterAltOutlined sx={{ fontSize: 15 }} />}
                                    sx={filterPillSx}
                                >
                                    Filtrar
                                </Button>
                                <Button
                                    variant='outlined'
                                    startIcon={<RestartAltOutlined sx={{ fontSize: 15 }} />}
                                    sx={ghostPillSx}
                                    onClick={onResetFilters}
                                >
                                    Limpiar
                                </Button>
                            </div>
                        </form>
                    </Box>
                    <TableCustom
                        data={vars.length > 0 ? vars : []}
                        columns={columns}
                        pagination={true}
                        pageSize={10}
                        topToolbar={true}
                    />
                </>
            ) : (
                <LoaderComponent />
            )}
            <ModalVar
                openModal={modal}
                setOpenModal={setModal}
                data={detailVar}
                onSaved={() => getVars()}
            />
        </Container>
    )
}

export default Vars
