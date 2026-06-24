import { useNavigate, useParams } from 'react-router-dom'
import VarsProvider from '../../../components/DataGenerator/ProviderVars'
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState, Suspense, lazy } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import SelectVars from '../components/SelectVars.jsx'
import HeaderForms from '../components/HeaderForms'

const BoardChart = lazy(() => import('../components/BoardChart.jsx'))

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

const subCardSx = {
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(15, 42, 68, 0.08)',
  borderLeft: '3px solid #e36a00',
  p: 1.5,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  'body.dark &': {
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderLeft: '3px solid #e36a00',
  },
}

const previewCardSx = {
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(15, 42, 68, 0.08)',
  boxShadow:
    '0 2px 6px rgba(15, 42, 68, 0.05), 0 12px 32px -12px rgba(15, 42, 68, 0.14)',
  backgroundColor: '#ffffff',
  'body.dark &': {
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
}

const submitPillSx = {
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

const ConfigBoardChart = () => {
  const { id = false } = useParams()
  const navigate = useNavigate()

  const [loader, setLoader] = useState(true)
  const [charts, setCharts] = useState([])

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      order: '',

      topLeftChartId: '',
      topRightChartId: '',

      // BOMBEO
      pumpingStatusLabel: 'Estado',
      pumpingRuntimeLabel: 'Tiempo de funcionamiento',
      pumpingStartsLabel: 'Cantidad de arranques',
      pumpingCurrentL1Label: 'I_L1',
      pumpingCurrentL2Label: 'I_L2',
      pumpingCurrentL3Label: 'I_L3',
      pumpingStatusVarId: null,
      pumpingRuntimeVarId: null,
      pumpingStartsVarId: null,
      pumpingCurrentL1VarId: null,
      pumpingCurrentL2VarId: null,
      pumpingCurrentL3VarId: null,

      // SALA (4 items)
      roomItem0Label: 'Status electricidad',
      roomItem0VarId: null,
      roomItem1Label: 'Status internet',
      roomItem1VarId: null,
      roomItem2Label: 'Temperatura',
      roomItem2VarId: null,
      roomItem3Label: 'Humedad',
      roomItem3VarId: null,
    },
  })

  const safeGet = (fn, fallback = null) => {
    try {
      const v = fn()
      return v ?? fallback
    } catch {
      return fallback
    }
  }

  const getConfigValue = (configArr, key, fallback = '') =>
    safeGet(() => configArr.find((c) => c.key === key)?.value, fallback)

  const getDataItem = (dataArr, key) =>
    dataArr?.find((d) => d.key === key) ?? null

  const getVarIdFromData = (dataArr, key, fallback = null) =>
    getDataItem(dataArr, key)?.InfluxVars ?? fallback

  const getLabelFromData = (dataArr, key, fallback = '') =>
    getDataItem(dataArr, key)?.label ?? fallback

  const buildChartConfig = () => {
    const d = getValues()
    const cfg = []

    const push = (key, value, type = 'string') =>
      cfg.push({ key, value, type })
    // ===== GRAFICOS =====
    push('board.top.leftChartId', d.topLeftChartId ?? '', 'number')
    push('board.top.rightChartId', d.topRightChartId ?? '', 'number')
    // ===== BOMBEO =====
    push('board.pumping.runtime.label', d.pumpingRuntimeLabel)
    push('board.pumping.starts.label', d.pumpingStartsLabel)
    push('board.pumping.currentL1.label', d.pumpingCurrentL1Label)
    push('board.pumping.currentL2.label', d.pumpingCurrentL2Label)
    push('board.pumping.currentL3.label', d.pumpingCurrentL3Label)
    push('board.pumping.status.key', d.pumpingStatusVarId)
    push('board.pumping.runtime.key', d.pumpingRuntimeVarId)
    push('board.pumping.starts.key', d.pumpingStartsVarId)
    push('board.pumping.currentL1.key', d.pumpingCurrentL1VarId)
    push('board.pumping.currentL2.key', d.pumpingCurrentL2VarId)
    push('board.pumping.currentL3.key', d.pumpingCurrentL3VarId)
    // ===== SALA =====
    push('board.room.item0.label', d.roomItem0Label)
    push('board.room.item0.key', d.roomItem0VarId)
    push('board.room.item1.label', d.roomItem1Label)
    push('board.room.item1.key', d.roomItem1VarId)
    push('board.room.item2.label', d.roomItem2Label)
    push('board.room.item2.key', d.roomItem2VarId)
    push('board.room.item3.label', d.roomItem3Label)
    push('board.room.item3.key', d.roomItem3VarId)

    return cfg
  }

  const previewChartData = useMemo(() => {
    const items = []

    // ===== BOMBEO =====
    if (watch('pumpingStatusVarId')) {
      items.push({
        key: 'board.pumping.status',
        value: null,
        InfluxVars: {
          id: watch('pumpingStatusVarId'),
        },
      })
    }

    if (watch('pumpingRuntimeVarId')) {
      items.push({
        key: 'board.pumping.runtime',
        value: null,
        label: watch('pumpingRuntimeLabel'),
        InfluxVars: {
          id: watch('pumpingRuntimeVarId'),
        },
      })
    }

    if (watch('pumpingStartsVarId')) {
      items.push({
        key: 'board.pumping.starts',
        value: null,
        label: watch('pumpingStartsLabel'),
        InfluxVars: {
          id: watch('pumpingStartsVarId'),
        },
      })
    }

    if (watch('pumpingCurrentL1VarId')) {
      items.push({
        key: 'board.pumping.currentL1',
        value: null,
        label: watch('pumpingCurrentL1Label'),
        InfluxVars: {
          id: watch('pumpingCurrentL1VarId'),
        },
      })
    }

    if (watch('pumpingCurrentL2VarId')) {
      items.push({
        key: 'board.pumping.currentL2',
        value: null,
        label: watch('pumpingCurrentL2Label'),
        InfluxVars: {
          id: watch('pumpingCurrentL2VarId'),
        },
      })
    }

    if (watch('pumpingCurrentL3VarId')) {
      items.push({
        key: 'board.pumping.currentL3',
        value: null,
        label: watch('pumpingCurrentL3Label'),
        InfluxVars: {
          id: watch('pumpingCurrentL3VarId'),
        },
      })
    }

    // ===== SALA =====
    if (watch('roomItem0VarId')) {
      items.push({
        key: 'board.room.item0',
        value: null,
        label: watch('roomItem0Label'),
        InfluxVars: {
          id: watch('roomItem0VarId'),
        },
      })
    }

    if (watch('roomItem1VarId')) {
      items.push({
        key: 'board.room.item1',
        value: null,
        label: watch('roomItem1Label'),
        InfluxVars: {
          id: watch('roomItem1VarId'),
        },
      })
    }

    if (watch('roomItem2VarId')) {
      items.push({
        key: 'board.room.item2',
        value: null,
        label: watch('roomItem2Label'),
        InfluxVars: {
          id: watch('roomItem2VarId'),
        },
      })
    }

    if (watch('roomItem3VarId')) {
      items.push({
        key: 'board.room.item3',
        value: null,
        label: watch('roomItem3Label'),
        InfluxVars: {
          id: watch('roomItem3VarId'),
        },
      })
    }
    return items
  }, [watch()])

  const send = async () => {
    const data = getValues()

    if (!data.title) {
      await Swal.fire('Error', 'Debe ingresar un título', 'error')
      return
    }

    const payload = {
      title: data.title,
      order: data.order,
      type: 'BoardChart',
      chartConfig: buildChartConfig(),
    }

    try {
      await request(
        `${backend[import.meta.env.VITE_APP_NAME]}/charts${id ? `/${id}` : ''}`,
        'POST',
        payload
      )

      await Swal.fire(
        'OK',
        id ? 'Tablero editado' : 'Tablero creado',
        'success'
      )

      navigate('/config/allGraphic')
    } catch {
      await Swal.fire('Error', 'No se pudo guardar el tablero', 'error')
    }
  }

  const previewInflValues = useMemo(() => {
    const data = {}

    previewChartData.forEach((item) => {
      const id = item?.InfluxVars?.id
      if (!id) return
      data[id] = 'Sin Datos'
    })

    charts.forEach((c) => {
      c?.ChartData?.forEach((d) => {
        const id = d?.InfluxVars?.id
        if (id && data[id] === undefined) {
          data[id] = 'Sin Datos'
        }
      })
    })

    return data
  }, [previewChartData, charts])


  const fetchAllCharts = async () => {
    try {
      const { data } = await request(
        `${backend[import.meta.env.VITE_APP_NAME]}/indicatorCharts`,
        'GET'
      )

      const filtered = (data || []).filter(
        (c) => c.type === 'LiquidFillPorcentaje' || c.type === 'CirclePorcentaje'
      )

      setCharts(filtered)
    } catch (e) {
      console.error(e)
      await Swal.fire('Error', 'No se pudieron cargar los gráficos', 'error')
    }
  }

  const fetchChartData = async () => {
    if (!id) return

    try {
      const { data } = await request(
        `${backend[import.meta.env.VITE_APP_NAME]}/charts/${id}`,
        'GET'
      )
      const cfg = data.ChartConfig || []
      const chartData = data.ChartData || []
      reset({
        title: data.name || '',
        order: data.order ?? '',

        // ===== TOP =====
        topLeftChartId: getConfigValue(cfg, 'board.top.leftChartId', ''),
        topRightChartId: getConfigValue(cfg, 'board.top.rightChartId', ''),

        // ===== BOMBEO =====
        pumpingStatusVarId: getVarIdFromData(chartData, 'board.pumping.status'),
        pumpingRuntimeVarId: getVarIdFromData(chartData, 'board.pumping.runtime'),
        pumpingStartsVarId: getVarIdFromData(chartData, 'board.pumping.starts'),
        pumpingCurrentL1VarId: getVarIdFromData(chartData, 'board.pumping.currentL1'),
        pumpingCurrentL2VarId: getVarIdFromData(chartData, 'board.pumping.currentL2'),
        pumpingCurrentL3VarId: getVarIdFromData(chartData, 'board.pumping.currentL3'),

        pumpingStatusLabel: getLabelFromData(
          chartData,
          'board.pumping.status',
          'Estado'
        ),
        pumpingRuntimeLabel: getLabelFromData(
          chartData,
          'board.pumping.runtime',
          'Tiempo de funcionamiento'
        ),
        pumpingStartsLabel: getLabelFromData(
          chartData,
          'board.pumping.starts',
          'Cantidad de arranques'
        ),
        pumpingCurrentL1Label: getLabelFromData(
          chartData,
          'board.pumping.currentL1',
          'I_L1'
        ),
        pumpingCurrentL2Label: getLabelFromData(
          chartData,
          'board.pumping.currentL2',
          'I_L2'
        ),
        pumpingCurrentL3Label: getLabelFromData(
          chartData,
          'board.pumping.currentL3',
          'I_L3'
        ),

        // ===== SALA =====
        roomItem0Label: getLabelFromData(chartData, 'board.room.item0', 'Normal'),
        roomItem0VarId: getVarIdFromData(chartData, 'board.room.item0'),

        roomItem1Label: getLabelFromData(chartData, 'board.room.item1', 'Online'),
        roomItem1VarId: getVarIdFromData(chartData, 'board.room.item1'),

        roomItem2Label: getLabelFromData(chartData, 'board.room.item2', '°C'),
        roomItem2VarId: getVarIdFromData(chartData, 'board.room.item2'),

        roomItem3Label: getLabelFromData(chartData, 'board.room.item3', '%'),
        roomItem3VarId: getVarIdFromData(chartData, 'board.room.item3'),
      })


    } catch (e) {
      await Swal.fire('Error', 'Error al cargar el tablero', 'error')
    } finally {
      setLoader(false)
    }
  }


  useEffect(() => {
    fetchAllCharts()
    if (id) fetchChartData()
    else setLoader(false)
  }, [id])

  if (loader) {
    return (
      <Container maxWidth={false} disableGutters className='w-full px-3 sm:px-5 pt-2 pb-4'>
        <Box sx={shellSx}>
          <Typography variant='body1' align='center' color='textSecondary'>
            Cargando...
          </Typography>
        </Box>
      </Container>
    )
  }

  const selectedLeftChart =
    charts.find((c) => String(c.id) === String(watch('topLeftChartId'))) || null
  const selectedRightChart =
    charts.find((c) => String(c.id) === String(watch('topRightChartId'))) || null

  const PumpingSlot = ({ label, varField, labelField }) => (
    <Box sx={subCardSx}>
      <TextField
        label={label}
        size='small'
        {...register(labelField)}
        fullWidth
      />
      <SelectVars
        initialVar={watch(varField)}
        setValue={(v) => setValue(varField, v?.id ?? null)}
        label='-Seleccionar variable-'
      />
    </Box>
  )

  return (
    <VarsProvider>
      <Container maxWidth={false} disableGutters className='w-full px-3 sm:px-5 pt-2 pb-4'>
        <HeaderForms
          idChart={id}
          chart={{ name: watch('title') }}
          backTo='/config/allGraphic'
        />

        <Box sx={shellSx}>
          <form
            onSubmit={handleSubmit(send)}
            className='flex flex-col lg:flex-row gap-4 w-full'
          >
            <div className='flex flex-col gap-3 w-full lg:w-7/12'>
              <Box sx={sectionSx}>
                <SectionTitle>Información</SectionTitle>
                <div className='flex flex-wrap gap-2'>
                  <div style={{ flex: '2 1 260px' }}>
                    <TextField
                      fullWidth
                      size='small'
                      label='Título del tablero'
                      {...register('title')}
                    />
                  </div>
                  <div style={{ flex: '1 1 140px' }}>
                    <TextField
                      fullWidth
                      size='small'
                      label='Orden'
                      {...register('order')}
                    />
                  </div>
                </div>
              </Box>

              <Box sx={sectionSx}>
                <SectionTitle>Gráficos superiores</SectionTitle>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  <FormControl size='small' fullWidth>
                    <InputLabel>Gráfico superior izquierdo</InputLabel>
                    <Select
                      label='Gráfico superior izquierdo'
                      value={watch('topLeftChartId')}
                      onChange={(e) => setValue('topLeftChartId', e.target.value)}
                    >
                      <MenuItem value=''><em>Ninguno</em></MenuItem>
                      {charts.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size='small' fullWidth>
                    <InputLabel>Gráfico superior derecho</InputLabel>
                    <Select
                      label='Gráfico superior derecho'
                      value={watch('topRightChartId')}
                      onChange={(e) => setValue('topRightChartId', e.target.value)}
                    >
                      <MenuItem value=''><em>Ninguno</em></MenuItem>
                      {charts.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Box>

              <Box sx={sectionSx}>
                <SectionTitle>Bombeo</SectionTitle>
                <div>
                  <SelectVars
                    initialVar={watch('pumpingStatusVarId')}
                    setValue={(v) => setValue('pumpingStatusVarId', v?.id ?? null)}
                    label='Variable de estado'
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  <PumpingSlot label='Label tiempo' varField='pumpingRuntimeVarId' labelField='pumpingRuntimeLabel' />
                  <PumpingSlot label='Label arranques' varField='pumpingStartsVarId' labelField='pumpingStartsLabel' />
                  <PumpingSlot label='Label I_L1' varField='pumpingCurrentL1VarId' labelField='pumpingCurrentL1Label' />
                  <PumpingSlot label='Label I_L2' varField='pumpingCurrentL2VarId' labelField='pumpingCurrentL2Label' />
                  <PumpingSlot label='Label I_L3' varField='pumpingCurrentL3VarId' labelField='pumpingCurrentL3Label' />
                </div>
              </Box>

              <Box sx={sectionSx}>
                <SectionTitle>Sala</SectionTitle>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <TextField
                      label={`Label item ${i + 1}`}
                      size='small'
                      {...register(`roomItem${i}Label`)}
                    />
                    <SelectVars
                      initialVar={watch(`roomItem${i}VarId`)}
                      setValue={(v) => setValue(`roomItem${i}VarId`, v?.id ?? null)}
                      label='-Seleccionar variable-'
                    />
                  </div>
                ))}
              </Box>

              <div className='flex justify-end pt-1'>
                <Button type='submit' variant='contained' disableElevation sx={submitPillSx}>
                  Guardar
                </Button>
              </div>
            </div>

            <div className='w-full lg:w-5/12'>
              <Box sx={previewCardSx}>
                <Suspense fallback={<div className='p-3 text-sm text-slate-500'>Cargando preview...</div>}>
                  <BoardChart
                    title={getValues('title')}
                    ChartData={previewChartData}
                    ChartConfig={buildChartConfig()}
                    topLeftChart={selectedLeftChart}
                    topRightChart={selectedRightChart}
                    inflValues={previewInflValues}
                  />
                </Suspense>
              </Box>
            </div>
          </form>
        </Box>
      </Container>
    </VarsProvider>
  )
}

export default ConfigBoardChart
