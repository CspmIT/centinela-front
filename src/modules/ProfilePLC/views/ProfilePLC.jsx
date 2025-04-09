import { Box, Button, Container, Typography } from "@mui/material"
import TableCustom from "../../../components/TableCustom"
import ModalVarPLC from "../../ConfigVars/components/ModalVarPLC"
import { useEffect, useState } from "react"

const ProfilePLC = () => {
    const [loading, setLoading] = useState(true)
    const [modalPLC, setModalPLC] = useState(false)
    const [plcProfile, setPlcProfile] = useState([])
    const columns = [
        {header: 'ID', accessorKey: 'id' },
        {header: 'Nombre del servicio', accessorKey: 'serviceName'},
        {header: 'IP', accessorKey: 'ipPLC'},
        {header: 'Acciones', accessorKey: 'actions', Cell: ({ row }) => {
                return (
                    <div className='flex gap-2'>
                        <Button
                            size="small"
                            color="success"
                            variant="contained"
                            onClick={() => {
                                setModalPLC(true)
                            }}
                        >
                            <FaPencil className="me-2" /> Editar
                        </Button>
                        <Button
                            size="small"
                            color="error"
                            variant="contained"
                            onClick={() => {
                                setModalPLC(true)
                            }}
                        >
                            <FaTrash className="me-2" /> Eliminar 
                        </Button>
                    </div>
                )
            }}
    ]

    const getProfilePLC = () => {
        setLoading(false)
    }
    
    useEffect(() => {
        getProfilePLC()
    }, [])
    return (
        <Container>
            <Box
                display="flex"
                justifyContent={'space-between'}
                alignItems={'center'}
                mb={3}
                gap={3}
            >
                <Typography variant="h3" align="center" flexGrow={1}>
                    Perfil PLC
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        setModalPLC(true)
                    }}
                >
                    Crear Perfil de PLC
                </Button>
            </Box>
            {!loading ? (
                <TableCustom
                    data={plcProfile.length > 0 ? plcProfile : []}
                    columns={columns}
                />
            ) : (
                <>Cargando...</>
            )}
            <ModalVarPLC open={modalPLC} setOpen={setModalPLC} />
        </Container>
    )
}

export default ProfilePLC
