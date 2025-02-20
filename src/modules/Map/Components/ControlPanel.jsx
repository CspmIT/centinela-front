import '../Style/ControlPanel.css'
import { IconButton } from '@mui/material'
import Pin from './Pin'

const ControlPanel = ({ addMarker }) => {
    return (
        <div className="control-panel">
            <h3>Agregar datos al mapa</h3>
            <hr />
            <IconButton draggable onDrag={addMarker}>
                <Pin label="x" />
            </IconButton>
        </div>
    )
}

export default ControlPanel
