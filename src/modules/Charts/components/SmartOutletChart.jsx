import { useEffect, useRef, useState } from 'react'
import { PowerSettingsNew, RestartAlt } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import Swal from 'sweetalert2'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

const CANT_TOMAS = 5
const POLL_MS = 30000

const isOn = (v) => v === 'ON' || v === 1 || v === '1' || v === true

// Estado visual de cada toma: 'on' | 'off' | 'offline'
const tomaState = (online, status) => {
    if (!online || status === undefined || status === null) return 'offline'
    return isOn(status) ? 'on' : 'off'
}

const COLORS = {
    on: { power: '#10B981', socket: '#0f172a', ring: 'rgba(16,185,129,0.45)' },
    off: { power: '#ef4444', socket: '#0f172a', ring: 'rgba(239,68,68,0.35)' },
    offline: { power: '#94a3b8', socket: '#475569', ring: 'transparent' },
}

const STATE_LABEL = {
    on: { text: 'Encendido', cls: 'text-emerald-600' },
    off: { text: 'Apagado', cls: 'text-red-500' },
    offline: { text: 'Sin datos', cls: 'text-slate-400' },
}

// Toma estilo enchufe argentino (tipo I), versión moderna y limpia.
// Todo el dibujo es simétrico alrededor del centro del viewBox (32,32).
const SocketIcon = ({ color }) => (
    <svg viewBox='0 0 64 64' className='w-full h-auto' preserveAspectRatio='xMidYMid meet' aria-hidden>
        <rect x='3' y='3' width='58' height='58' rx='18' fill={color} />
        <circle cx='32' cy='32' r='18' fill='#f8fafc' />
        {/* dos patas en V (simétricas ±5 del centro) + neutro centrado */}
        <rect x='22.9' y='23' width='4.2' height='12' rx='2.1' transform='rotate(18 27 29)' fill={color} />
        <rect x='36.9' y='23' width='4.2' height='12' rx='2.1' transform='rotate(-18 37 29)' fill={color} />
        <rect x='29.9' y='38' width='4.2' height='9' rx='2.1' fill={color} />
    </svg>
)

// Botón de acción circular, solo ícono, con color por tipo de acción.
const ActionButton = ({ title, color, onClick, disabled, children }) => (
    <Tooltip title={title}>
        <span>
            <button
                type='button'
                aria-label={title}
                onClick={onClick}
                disabled={disabled}
                className='flex items-center justify-center h-9 w-9 rounded-full text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                style={{ backgroundColor: color }}
            >
                {children}
            </button>
        </span>
    </Tooltip>
)

const PowerGlyph = ({ color, size = 14 }) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color}
        strokeWidth='3.75' strokeLinecap='round' strokeLinejoin='round'
        className='transition-all duration-300 ease-out'>
        <path d='M18.36 6.64a9 9 0 1 1-12.73 0' />
        <line x1='12' y1='2' x2='12' y2='12' />
    </svg>
)

export default function SmartOutletChart({ title, topic, location, ...rest }) {
    const [online, setOnline] = useState(false)
    const [statusMap, setStatusMap] = useState({})
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [selected, setSelected] = useState(null)
    const [sending, setSending] = useState(false)
    const intervalRef = useRef(null)

    // Equipo conectado a cada toma (channel1..channel5 vienen en props)
    const channels = Array.from({ length: CANT_TOMAS }, (_, i) => rest[`channel${i + 1}`] || '')

    const fetchStatus = async () => {
        if (!topic) {
            setLoading(false)
            return
        }
        try {
            const { data } = await request(
                `${backend[import.meta.env.VITE_APP_NAME]}/smartoutlet/status`,
                'POST',
                { topic }
            )
            const map = {}
            ;(data.tomas || []).forEach((t) => {
                map[parseInt(t.toma, 10)] = t.status
            })
            setStatusMap(map)
            setOnline(!!data.online)
            setLastUpdate(new Date())
        } catch (error) {
            setOnline(false)
            setStatusMap({})
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStatus()
        intervalRef.current = setInterval(fetchStatus, POLL_MS)
        return () => clearInterval(intervalRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topic])

    // Envía un comando (ON/OFF/RST) a la toma seleccionada por MQTT.
    // Replica el original: toast "Acción en progreso" y refresco a los 10s.
    const sendAction = async (cmd) => {
        if (!selected || sending) return
        setSending(true)
        try {
            await request(
                `${backend[import.meta.env.VITE_APP_NAME]}/smartoutlet/action`,
                'POST',
                { topic, plug: selected, action: cmd }
            )
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Acción en progreso',
                showConfirmButton: false,
                timer: 10000,
                timerProgressBar: true,
            })
            setTimeout(() => {
                fetchStatus()
                setSending(false)
            }, 10000)
        } catch (error) {
            setSending(false)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: `No se pudo enviar la acción. <br> ${error.message || error}`,
            })
        }
    }

    const selectedState = selected ? tomaState(online, statusMap[selected]) : null

    return (
        <div className='flex flex-col w-full h-full min-h-0 py-1.5 px-1 gap-1 overflow-y-auto'>
            {/* Cabecera: ubicación (negrita) + estado online/offline */}
            <div className='flex items-center justify-between gap-2 py-2 shrink-0'>
                <p className='text-sm font-bold text-slate-800 dark:text-gray-100 truncate'>
                    {location || '—'}
                </p>
                <span
                    className={`shrink-0 inline-flex items-center gap-1 rounded-full px-1.5 text-[11px] font-semibold ${
                        online
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-700/40 dark:text-slate-400'
                    }`}
                >
                    <span className={`h-2 w-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {online ? 'Online' : 'Offline'}
                </span>
            </div>

            {/* Grilla de tomas: grandes y centradas cuando no hay panel,
                achicadas cuando hay una toma seleccionada (transición animada) */}
            <div className='flex-1 min-h-0 flex items-center'>
                <div className={`w-full grid grid-cols-5 transition-all duration-300 ease-out`}>
                    {Array.from({ length: CANT_TOMAS }, (_, i) => i + 1).map((n) => {
                        const state = loading ? 'offline' : tomaState(online, statusMap[n])
                        const c = COLORS[state]
                        const isSelected = selected === n
                        return (
                            <button
                                type='button'
                                key={n}
                                onClick={() => setSelected(isSelected ? null : n)}
                                className={`no-drag flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                                    isSelected
                                        ? 'bg-orange-50 dark:bg-orange-500/10'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                                }`}
                            >
                                <PowerGlyph color={c.power} size={selected ? 14 : 16} />
                                <div
                                    className={`w-full rounded-xl transition-all duration-300 ease-out ${
                                        selected ? 'max-w-[38px]' : 'max-w-[180px]'
                                    }`}
                                    style={{ boxShadow: `0 0 0 3px ${isSelected ? '#e36a00' : c.ring}` }}
                                >
                                    <SocketIcon color={c.socket} />
                                </div>
                                <span className={`font-semibold text-slate-500 dark:text-gray-400 leading-none transition-all duration-300 ease-out ${selected ? 'text-[11px]' : 'text-[13px]'}`}>
                                    T n° {n}
                                </span>
                                {/* Equipo conectado bajo cada toma (solo cuando no hay panel abierto) */}
                                {!selected && (
                                    <span
                                        title={channels[n - 1] || 'Sin equipo conectado'}
                                        className='w-full px-1 text-center text-[10px] leading-tight text-slate-400 dark:text-gray-500 truncate'
                                    >
                                        {channels[n - 1] || '—'}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Panel de la toma seleccionada (equipo conectado + estado).
                Siempre montado para animar la apertura/cierre. */}
            <div
                className={`shrink-0 overflow-hidden transition-all duration-300 ease-out ${
                    selected ? 'max-h-44 opacity-100 mb-0' : 'max-h-0 opacity-0 mb-1'
                }`}
            >
                {selected && (
                    <div className='rounded-xl border border-orange-200 dark:border-orange-500/30 bg-orange-50/50 dark:bg-orange-500/5 px-3 py-1'>
                        <div className='flex items-center justify-between gap-1'>
                            <p className='text-[13px] font-semibold text-slate-700 dark:text-gray-100'>
                                Tomacorriente N° {selected}
                            </p>
                            <span className={`text-[12px] font-bold ${STATE_LABEL[selectedState].cls}`}>
                                {STATE_LABEL[selectedState].text}
                            </span>
                        </div>
                        <p className='text-[12px] text-slate-600 dark:text-gray-300 truncate'>
                            {channels[selected - 1] ? (
                                <>Equipo: <b>{channels[selected - 1]}</b></>
                            ) : (
                                <span className='italic text-slate-400'>Sin equipo conectado</span>
                            )}
                        </p>

                        {/* Acciones (solo íconos): encendida -> Apagar + Reiniciar; apagada -> Encender */}
                        <div className='no-drag flex items-center justify-center gap-1'>
                            {selectedState === 'on' ? (
                                <>
                                    <ActionButton
                                        title='Apagar'
                                        color='#ef4444'
                                        disabled={sending}
                                        onClick={() => sendAction('OFF')}
                                    >
                                        <PowerSettingsNew sx={{ fontSize: 20 }} />
                                    </ActionButton>
                                    <ActionButton
                                        title='Reiniciar'
                                        color='#f59e0b'
                                        disabled={sending}
                                        onClick={() => sendAction('RST')}
                                    >
                                        <RestartAlt sx={{ fontSize: 20 }} />
                                    </ActionButton>
                                </>
                            ) : (
                                <ActionButton
                                    title='Encender'
                                    color='#10B981'
                                    disabled={sending}
                                    onClick={() => sendAction('ON')}
                                >
                                    <PowerSettingsNew sx={{ fontSize: 20 }} />
                                </ActionButton>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Pie: última actualización */}
            <div className='shrink-0 mt-auto flex items-center justify-center text-[10px] text-slate-400'>
                {loading
                    ? 'Cargando estado...'
                    : lastUpdate
                    ? `Actualizado ${lastUpdate.toLocaleTimeString()}`
                    : 'Sin datos'}
            </div>
        </div>
    )
}
