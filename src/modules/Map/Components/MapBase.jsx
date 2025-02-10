import { useEffect, useState } from 'react'
import Map, { NavigationControl, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import '../Styles/Map.css'

const MapBase = ({
    navigationcontrol = true,
    marker = true,
    height = 600,
    width = 800,
}) => {
    const [latitude, setLatitude] = useState(-30.716256365145455)
    const [longitude, setLongitude] = useState(-62.005196197872266)

    const handleDrag = (e) => {
        const { lng, lat } = e.lngLat
        setLatitude(lat)
        setLongitude(lng)
    }

    return (
        <Map
            initialViewState={{
                longitude: -62.005196197872266,
                latitude: -30.716256365145455,
                zoom: 14,
            }}
            style={{ width, height }}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=mHpRzO9eugI7vKv1drLO"
        >
            {navigationcontrol && <NavigationControl position="top-left" />}
            {marker && (
                <Marker
                    draggable={true}
                    longitude={longitude}
                    latitude={latitude}
                    color={'#f04'}
                    onDragEnd={handleDrag}
                    popup={''}
                > 

                </Marker>
            )}
        </Map>
    )
}

export default MapBase
