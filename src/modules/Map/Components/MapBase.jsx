import Map, {
    NavigationControl,
    Marker,
    FullscreenControl,
    Popup,
    GeolocateControl,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import ControlPanel from './ControlPanel'
import Pin from './Pin'
import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const MapBase = ({
    navigationcontrol = true,
    height = '100%',
    width = '100%',
    fullScreen = true,
    geolocation = true,
    controlPanel = true,
    whithPopup = true,
    markers = false,
    setMarkers = false
}) => {
    const handleDragMarker = (e, marker) => {
        let { lng, lat } = e.lngLat
        const updateMarker = markers.map((mark, index) => {
            if (mark.name === marker.name) {
                return {
                    name: mark.name,
                    latitude: lat,
                    longitude: lng,
                    popupInfo: {
                        lat: lat,
                        lng: lng,
                        name: mark.popupInfo.name,
                    },
                }
            }
            return mark
        })
        setMarkers(updateMarker)
    }
    const [zoomLevel, setZoomLevel] = useState(20)
    const handleZoom = (e) => {
        setZoomLevel(e.viewState.zoom)
    }
    useEffect(() => {
        console.log(markers)
        setMarkers(markers)
    }, [zoomLevel])

    return (
        <div style={{ position: 'relative', width, height }}>
            <Map
                initialViewState={{
                    longitude: -62.005196197872266,
                    latitude: -30.716256365145455,
                    zoom: 20,
                }}
                style={{ width, height }}
                mapStyle="https://api.maptiler.com/maps/streets/style.json?key=mHpRzO9eugI7vKv1drLO"
                onZoom={handleZoom}
            >
                {navigationcontrol && <NavigationControl position="top-left" />}
                {fullScreen && <FullscreenControl position="top-left" />}
                {geolocation && <GeolocateControl position="top-left" />}

                {markers.map((marker, index) => (
                    <>
                        <Marker
                            key={`marker-${index}`}
                            draggable={true}
                            longitude={marker.longitude}
                            latitude={marker.latitude}
                            anchor="bottom-right"
                            onDragEnd={(e) => handleDragMarker(e, marker)}
                        >
                            <Pin label={marker.name} color="#3498db" />
                        </Marker>
                        {marker?.popupInfo && whithPopup &&(
                            <Popup
                                key={`popup-${index}`}
                                anchor="top-left"
                                closeButton={false}
                                latitude={Number(marker.popupInfo.lat)}
                                longitude={Number(marker.popupInfo.lng)}
                                closeOnClick={false}
                            >
                                <Typography variant="h6">
                                    {marker.popupInfo.name}
                                </Typography>
                            </Popup>
                        )}
                    </>
                ))}
            </Map>
            {controlPanel && <ControlPanel addMarker={addMarker} />}
        </div>
    )
}

export default MapBase
