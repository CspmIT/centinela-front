import { useEffect, useState } from "react"
import { Autocomplete, TextField, Avatar, Chip, Typography } from "@mui/material"
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import Home from '../views/index'

export default function AdminDashboardPage() {

    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        try {
            const { data } = await request(`${backend['Centinela']}/admin/users`, 'GET')
            setUsers(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ width: "100%", padding: 5, boxSizing: "border-box" }}>
            <Typography className='w-full text-center !mb-2' variant="h5" align="center">
                Administrador de Dashboard
            </Typography>

            <div style={{
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                padding: "8px 10px",
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                paddingLeft: 24,
                paddingRight: 24,
                boxShadow: "0 2px 14px 0 rgba(208,94,0,0.10)",  // ← cambiado
            }}>
                <Autocomplete
                    options={users}
                    loading={loading}
                    value={selectedUser}
                    onChange={(_, newValue) => setSelectedUser(newValue)}
                    getOptionLabel={(user) => `${user.name} — ${user.email}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{ width: "33%" }}
                    renderOption={(props, user) => (
                        <li {...props} key={user.id}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Avatar sx={{ width: 28, height: 28, fontSize: 12, background: "#d05e00" }}>  {/* ← cambiado */}
                                    {user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                                        {user.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#64748b" }}>
                                        {user.email}
                                    </div>
                                </div>
                                <Chip
                                    label={`${user.widgetCount} widgets`}
                                    size="small"
                                    sx={{ fontSize: 10, height: 18, marginLeft: "auto" }}
                                />
                            </div>
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Buscar usuario"
                            size="small"
                            placeholder="Nombre o email..."
                        />
                    )}
                />

                {selectedUser && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar sx={{ width: 34, height: 34, background: "#d05e00", fontSize: 14 }}>  {/* ← cambiado */}
                            {selectedUser.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
                                {selectedUser.name}
                            </div>
                            <div style={{ fontSize: 14, color: "#64748b" }}>
                                {selectedUser.email} · {selectedUser.widgetCount} widgets
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedUser ? (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <Home key={selectedUser.id} targetUserId={selectedUser.id} />
                </div>
            ) : (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "80px 0",
                    gap: 16,
                }}>
                    <div style={{
                        width: 77,
                        height: 77,
                        borderRadius: "50%",
                        background: "#d05e00",  // ← cambiado
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 18px 0 rgba(208,94,0,0.10)",  // ← cambiado
                        marginBottom: 4,
                    }}>
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Silueta de usuario */}
                            <circle cx="22" cy="16" r="7" fill="#f5c4a0" opacity="0.5" />  {/* ← cambiado */}
                            <ellipse cx="22" cy="33" rx="12" ry="7" fill="#f5c4a0" opacity="0.5" />  {/* ← cambiado */}
                            {/* Pequeños cuadraditos de "widgets" */}
                            <rect x="30" y="28" width="5" height="5" rx="1.2" fill="#f5c4a0" opacity="0.7" />  {/* ← cambiado */}
                            <rect x="36" y="28" width="5" height="5" rx="1.2" fill="#f5c4a0" opacity="0.4" />  {/* ← cambiado */}
                            <rect x="30" y="34" width="5" height="5" rx="1.2" fill="#f5c4a0" opacity="0.4" />  {/* ← cambiado */}
                            <rect x="36" y="34" width="5" height="5" rx="1.2" fill="#f5c4a0" opacity="0.25" />  {/* ← cambiado */}
                        </svg>
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                            Ningún usuario seleccionado
                        </div>
                        <div style={{ fontSize: 14, color: "#94a3b8", maxWidth: 350 }}>
                            Seleccione un usuario para visualizar y editar su dashboard personalizado
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}