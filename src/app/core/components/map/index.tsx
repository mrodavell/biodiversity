import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, ZoomControl, Tooltip } from "react-leaflet";
import osmMaptiler from '../../constants/osm-maptiler';
import mapPin from '../../../../assets/map-pin.png'
import schoolPin from '../../../../assets/schoolmap-pin.png'
import { campuses } from '../../constants/campuses';

type TSampleData = {
    coordinates: LatLngExpression;
    icon: L.Icon;
    popup: string;
}

type MapComponentProps = {
    coordinates: LatLngExpression;
    zoom: number;
    handleModal?: (data: TSampleData) => void;
};

// Define a custom icon
const customIcon = L.icon({
    iconUrl: mapPin, // URL to your custom icon
    iconSize: [30, 50], // Size of the icon [width, height]
    iconAnchor: [19, 38], // Anchor point of the icon [x, y]
    popupAnchor: [0, -38], // Anchor for the popup [x, y]
    shadowSize: [68, 95], // Size of the shadow
    shadowAnchor: [22, 94] // Anchor point for the shadow
});

// Define a custom icon
const schoolIcon = L.icon({
    iconUrl: schoolPin, // URL to your custom icon
    iconSize: [50, 50], // Size of the icon [width, height]
    iconAnchor: [19, 38], // Anchor point of the icon [x, y]
    popupAnchor: [0, -38], // Anchor for the popup [x, y]
    shadowSize: [68, 95], // Size of the shadow
    shadowAnchor: [22, 94] // Anchor point for the shadow
});

const MapComponent: FC<MapComponentProps> = ({ coordinates, zoom, handleModal }) => {

    const MoveTo = ({ coordinates }: { coordinates: LatLngExpression }) => {
        const map = useMap();
        map.setView(coordinates, zoom);
        return null;
    }

    const handleMarkerClick = (data: TSampleData) => {
        if (handleModal) {
            handleModal(data);
        }
    }

    const sampleData: TSampleData[] = [
        {
            coordinates: [8.485833, 124.657950],
            icon: customIcon,
            popup: 'Crab-eating Frog'
        },
        {
            coordinates: [8.486464, 124.657043],
            icon: customIcon,
            popup: 'Banded bullfrog'
        },
        {
            coordinates: [8.487902, 124.656479],
            icon: customIcon,
            popup: 'Lesser Grass Blue'
        },
        {
            coordinates: [8.610100, 124.887058],
            icon: customIcon,
            popup: 'Metallic Cerulean'
        },
        {
            coordinates: [8.610200, 124.889158],
            icon: customIcon,
            popup: 'Brown Pansy'
        },
        {
            coordinates: [8.609300, 124.889278],
            icon: customIcon,
            popup: 'Alingatong'
        }
    ]

    return (
        <div className="w-full h-screen">
            <MapContainer center={coordinates} zoom={17} scrollWheelZoom={true} zoomControl={false}>
                <TileLayer
                    url={osmMaptiler.maptiler.url}
                    attribution={osmMaptiler.maptiler.attribution}
                />
                {
                    sampleData.map((data, index) => {
                        return <Marker
                            key={index}
                            position={data.coordinates}
                            icon={data.icon}
                            eventHandlers={{
                                click: () => handleMarkerClick(data)
                            }}
                        >
                            <Tooltip>
                                <div>
                                    <strong>{data.popup}</strong>
                                </div>
                            </Tooltip>
                        </Marker>
                    })
                }
                {
                    campuses.map((campus, index) => (
                        <Marker
                            key={index}
                            position={[campus.coordinates[0], campus.coordinates[1]]}
                            icon={schoolIcon}
                        >
                            <Tooltip>
                                <div>
                                    <strong>{campus.school}</strong>
                                </div>
                            </Tooltip>
                        </Marker>
                    ))
                }
                <ZoomControl position='bottomright' />
                <MoveTo coordinates={coordinates} />
            </MapContainer>
        </div>
    )
}

export default MapComponent;