import 'leaflet/dist/leaflet.css';
import { FC, Fragment, useEffect, useState } from 'react';
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, ZoomControl, Tooltip } from "react-leaflet";
import osmMaptiler from '../../constants/osm-maptiler';
import mapPin from '../../../../assets/pin2.png'
import schoolPin from '../../../../assets/schoolmap-pin.png'
import activePin from '../../../../assets/animated-map-pin.gif'
import { ICampus, ICampusSpecies } from '../../interfaces/common.interface';
import { useSearchParams } from 'react-router-dom';

type MapComponentProps = {
    campuses: ICampus[];
    campusSpecies: ICampusSpecies[];
    handleModal: (data: ICampusSpecies) => void;
};

// Define a custom icon
const customIcon = L.icon({
    iconUrl: mapPin, // URL to your custom icon
    iconSize: [30, 30], // Size of the icon [width, height]
    iconAnchor: [19, 38], // Anchor point of the icon [x, y]
    popupAnchor: [0, -38], // Anchor for the popup [x, y]
    shadowSize: [68, 95], // Size of the shadow
    shadowAnchor: [22, 94] // Anchor point for the shadow
});

// Define a custom icon
const customIconActive = L.icon({
    iconUrl: activePin, // URL to your custom icon
    iconSize: [60, 60], // Size of the icon [width, height]
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

const MapComponent: FC<MapComponentProps> = ({ campuses, campusSpecies, handleModal }) => {

    const [searchParams] = useSearchParams();
    const campusId = searchParams.get('campusId');
    const coordinatesParams = searchParams.get('coordinates');
    const [coordinates, setCoordinates] = useState<LatLngExpression>([0, 0]);

    useEffect(() => {
        if (campusId && coordinatesParams) {
            const coordinates = coordinatesParams.split(',').map((coordinate) => Number(coordinate));
            setCoordinates([coordinates[1], coordinates[0]]);
        } else {
            const campus = campuses[0];
            setCoordinates([Number(campus.longitude), Number(campus.latitude)]);
        }
    }, [campusId, coordinatesParams]);


    const MoveTo = ({ coordinates }: { coordinates: LatLngExpression }) => {
        const map = useMap();
        map.setView(coordinates, 17);
        return null;
    }

    const handleMarkerClick = (data: ICampusSpecies) => {
        handleModal(data);
    }



    return (
        <Fragment>

            <div className="w-full h-screen">
                <MapContainer center={coordinates} zoom={17} scrollWheelZoom={true} zoomControl={false}>
                    <TileLayer
                        url={osmMaptiler.maptiler.url}
                        attribution={osmMaptiler.maptiler.attribution}
                    />
                    {
                        campusSpecies.map((data, index) => {
                            const currentCoordinates = [Number(data.latitude), Number(data.longitude)];
                            const isActiveMark = JSON.stringify(coordinates) === JSON.stringify(currentCoordinates);
                            return <Marker
                                key={index}
                                position={[Number(data.latitude), Number(data.longitude)]}
                                icon={isActiveMark ? customIconActive : customIcon}
                                eventHandlers={{
                                    click: () => handleMarkerClick(data)
                                }}
                            >
                                <Tooltip>
                                    <div>
                                        <strong>{data.speciesData?.commonName}</strong>
                                    </div>
                                </Tooltip>
                            </Marker>
                        })
                    }
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
                    <ZoomControl position='bottomright' />
                    <MoveTo coordinates={coordinates} />
                </MapContainer>
            </div>
        </Fragment>

    )
}

export default MapComponent;