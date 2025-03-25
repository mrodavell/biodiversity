import 'leaflet/dist/leaflet.css';
import { FC, useEffect } from 'react';
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, ZoomControl, Tooltip, useMapEvents, useMap } from "react-leaflet";
import osmMaptiler from '../../constants/osm-maptiler';
import schoolPin from '../../../../assets/schoolmap-pin.png'
import mapPin from '../../../../assets/map-pin.png'
import { ICampus } from '../../interfaces/common.interface';
import { useCampusStore } from '../../zustand/campus';
import React from 'react';


type MapComponentProps = {
    initialCampus: string;
    campuses: ICampus[];
    initialCoordinates?: LatLngExpression | null;
    getLongLat?: (latlang: number[]) => void;
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

const MapModalComponent: FC<MapComponentProps> = ({ initialCampus, campuses, initialCoordinates, getLongLat }) => {

    const [coordinates, setCoordinates] = React.useState<LatLngExpression>([Number(campuses[0].longitude), Number(campuses[0].latitude)]);
    const { setCampus } = useCampusStore();
    const [pinLocation, setPinLocation] = React.useState<LatLngExpression | null>(initialCoordinates ?? null);

    useEffect(() => {
        const campus = campuses.find(campus => {
            return campus.id?.toString() === initialCampus.toString();
        });
        setCampus(campus ?? null);
        setCoordinates([Number(campus?.longitude), Number(campus?.latitude)]);
    }, []);

    const MoveTo = ({ coordinates }: { coordinates: LatLngExpression }) => {
        const map = useMap();
        map.setView(coordinates, 17);
        return null;
    }


    const LongLatGetter = () => {
        useMapEvents({
            click: (e) => {
                if (getLongLat) {
                    getLongLat([e.latlng.lat, e.latlng.lng]);
                }
                setPinLocation([e.latlng.lat, e.latlng.lng]);
            }
        })
        return null;
    }

    return (
        <div className="w-full">
            <div className='w-full !h-[550px] overflow-hidden overflow-y-auto'>
                <MapContainer center={coordinates} zoom={17} scrollWheelZoom={true} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url={osmMaptiler.maptiler.url}
                        attribution={osmMaptiler.maptiler.attribution}
                    />
                    {
                        campuses.map((campus, index) => (
                            <Marker
                                key={index}
                                position={[Number(campus.longitude), Number(campus.latitude)]}
                                icon={schoolIcon}
                            >
                                <Tooltip>
                                    <div>
                                        <strong>{campus.campus} Campus</strong>
                                    </div>
                                </Tooltip>
                            </Marker>
                        ))
                    }
                    {
                        pinLocation && (
                            <Marker
                                position={pinLocation}
                                icon={customIcon}
                            >
                                <Tooltip>
                                    <div>
                                        <strong>Selected Location</strong>
                                    </div>
                                </Tooltip>
                            </Marker>
                        )
                    }
                    <ZoomControl position='bottomright' />
                    <MoveTo coordinates={coordinates} />
                    <LongLatGetter />
                </MapContainer>
            </div>
        </div>
    )
}

export default MapModalComponent;