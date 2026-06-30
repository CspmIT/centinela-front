import { useEffect, useState } from 'react'
import { AutoFixHigh, Bolt } from '@mui/icons-material'
import { Box, Button, Container, InputAdornment, TextField, Tooltip } from '@mui/material'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'
import { backend } from '../../../utils/routes/app.routes'
import { request } from '../../../utils/js/request'
import HeaderForms from '../components/HeaderForms'
import LoaderComponent from '../../../components/Loader'

const shellSx = {
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(15, 42, 68, 0.06)',
    boxShadow:
        '0 2px 6px rgba(15, 42, 68, 0.05), 0 12px 32px -12px rgba(15, 42, 68, 0.12)',
    p: { xs: 2, sm: 2.5 },
    'body.dark &': {
        backgroundColor: 'rgba(17, 24, 39, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
    },
}

const sectionSx = {
    borderRadius: '14px',
    border: '1px solid rgba(15, 42, 68, 0.06)',
    backgroundColor: 'transparent',
    p: { xs: 1.75, sm: 2 },
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    'body.dark &': { border: '1px solid rgba(255, 255, 255, 0.06)' },
}

const primaryPillSx = {
    borderRadius: '999px',
    textTransform: 'none',
    fontWeight: 500,
    px: 3,
    py: 1,
    minHeight: 0,
    background: 'linear-gradient(135deg, #e36a00 0%, #a14b00 100%)',
    boxShadow: '0 4px 14px rgba(227, 106, 0, 0.35)',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #e36a00 0%, #a14b00 100%)',
        boxShadow: '0 8px 24px rgba(227, 106, 0, 0.45)',
        transform: 'translateY(-1px)',
    },
}

const SectionTitle = ({ children }) => (
    <div className='text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-gray-400 px-1 -mt-0.5'>
        {children}
    </div>
)

export default function ConfigSmartOutlet() {
    const { id } = useParams()
    const isEdit = !!id
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [topic, setTopic] = useState('')
    const [channels, setChannels] = useState(['', '', '', '', ''])
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(isEdit)
    const navigate = useNavigate()

    const setChannel = (i, value) =>
        setChannels((prev) => prev.map((c, idx) => (idx === i ? value : c)))

    // Modo edición: carga la configuración existente de la zapatilla
    useEffect(() => {
        if (!isEdit) return
        ;(async () => {
            try {
                const { data } = await request(
                    `${backend[import.meta.env.VITE_APP_NAME]}/charts/${id}`,
                    'GET'
                )
                const cfg = (data?.ChartConfig || []).reduce((acc, c) => {
                    acc[c.key] = c.value
                    return acc
                }, {})
                setTitle(cfg.title ?? data?.name ?? '')
                setLocation(cfg.location ?? '')
                setTopic(cfg.topic ?? '')
                setChannels([1, 2, 3, 4, 5].map((n) => cfg[`channel${n}`] ?? ''))
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    html: `No se pudo cargar la zapatilla. <br> ${error.message || error}`,
                })
            } finally {
                setLoading(false)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    // Replica del autocompletado del módulo original:
    // escribiendo "canal50,1" se arma coop/canal50/tomacorrientes/0001/neighbor
    const autofillTopic = () => {
        const partes = topic.split(',')
        const base = (partes[0] || '').trim()
        if (!base) return
        const number = (partes[1] || '').toString().trim().padStart(4, '0')
        setTopic(`coop/${base}/tomacorrientes/${number}/neighbor`)
    }

    const handleSave = async () => {
        if (!title.trim() || !location.trim() || !topic.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Atención',
                html: 'Complete el nombre, la ubicación y el tópico.',
            })
            return
        }
        setSaving(true)
        try {
            const base = backend[import.meta.env.VITE_APP_NAME]
            const url = isEdit ? `${base}/smartoutlet/${id}` : `${base}/smartoutlet`
            await request(url, 'POST', { title, location, topic, channels })
            await Swal.fire({
                icon: 'success',
                title: 'Éxito',
                html: isEdit
                    ? `Se actualizó la zapatilla ${title}.`
                    : `Se cargó con éxito la zapatilla ${title}.`,
            })
            navigate(isEdit ? '/config/allGraphic' : '/')
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: `Ocurrió un error al guardar la zapatilla. <br> ${error.message || error}`,
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <LoaderComponent />

    return (
        <Container maxWidth={false} disableGutters className='w-full px-3 sm:px-5 pt-2 pb-4'>
            <HeaderForms idChart={id || false} chart={{ name: title }} />

            <Box sx={shellSx}>
                <div className='flex flex-col gap-3'>
                    <Box sx={sectionSx}>
                        <SectionTitle>Datos de la zapatilla</SectionTitle>

                        <TextField
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            label='Nombre'
                            placeholder='Ej: SO-0001'
                            size='small'
                            fullWidth
                        />

                        <TextField
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            label='Ubicación'
                            placeholder='Ej: Cabezal de TV'
                            size='small'
                            fullWidth
                        />

                        <TextField
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') autofillTopic()
                            }}
                            label='Tópico'
                            placeholder='Ej: canal50,1  →  autocompletar'
                            size='small'
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <Tooltip title='Autocompletar tópico'>
                                            <Button
                                                onClick={autofillTopic}
                                                size='small'
                                                sx={{ minWidth: 0, color: '#e36a00' }}
                                            >
                                                <AutoFixHigh fontSize='small' />
                                            </Button>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <p className='text-[11px] text-slate-500 dark:text-gray-400 px-1'>
                            Cada zapatilla tiene 5 tomas (TOMA_1 a TOMA_5). El estado de cada
                            toma se lee de Influx a partir de este tópico.
                        </p>
                    </Box>

                    <Box sx={sectionSx}>
                        <SectionTitle>Equipos conectados (opcional)</SectionTitle>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
                            {channels.map((ch, i) => (
                                <TextField
                                    key={i}
                                    value={ch}
                                    onChange={(e) => setChannel(i, e.target.value)}
                                    label={`Toma N° ${i + 1}`}
                                    placeholder='Ej: Encoder HDMI x8'
                                    size='small'
                                    fullWidth
                                />
                            ))}
                        </div>
                        <p className='text-[11px] text-slate-500 dark:text-gray-400 px-1'>
                            Equipo conectado a cada toma. Se muestra al seleccionar la toma en el tablero.
                        </p>
                    </Box>

                    <div className='flex items-center justify-end pt-1'>
                        <Button
                            variant='contained'
                            disableElevation
                            startIcon={<Bolt sx={{ fontSize: 18 }} />}
                            sx={primaryPillSx}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </div>
            </Box>
        </Container>
    )
}
