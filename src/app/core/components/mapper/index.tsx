import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, ZoomControl, Tooltip } from "react-leaflet";
import osmMaptiler from '../../constants/osm-maptiler';
import schoolPin from '../../../../assets/schoolmap-pin.png'
import { ICampus } from '../../interfaces/common.interface';
import { BiMapPin } from 'react-icons/bi';
import { useCampusStore } from '../../zustand/campus';
import React from 'react';

type TSampleData = {
    coordinates: LatLngExpression;
    icon: L.Icon;
    popup: string;
}

type MapComponentProps = {
    campuses: ICampus[];
    coordinates: LatLngExpression;
    zoom: number;
    handleModal?: (data: TSampleData) => void;
};

// Define a custom icon
const schoolIcon = L.icon({
    iconUrl: schoolPin, // URL to your custom icon
    iconSize: [50, 50], // Size of the icon [width, height]
    iconAnchor: [19, 38], // Anchor point of the icon [x, y]
    popupAnchor: [0, -38], // Anchor for the popup [x, y]
    shadowSize: [68, 95], // Size of the shadow
    shadowAnchor: [22, 94] // Anchor point for the shadow
});

const MapperComponent: FC<MapComponentProps> = ({ campuses, zoom }) => {

    const [coordinates, setCoordinates] = React.useState<LatLngExpression>([Number(campuses[0].longitude), Number(campuses[0].latitude)]);
    const { setCampus } = useCampusStore();
    const selectedCampus = useCampusStore(state => state.campus);

    const MoveTo = ({ coordinates }: { coordinates: LatLngExpression }) => {
        const map = useMap();
        map.setView(coordinates, zoom);
        return null;
    }

    const handleChangeCampus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const campus = campuses.find(campus => campus.campus === e.target.value);
        setCampus(campus ?? null);
        setCoordinates([Number(campus?.longitude), Number(campus?.latitude)]);
    }


    return (
        <div className="w-full">
            <div className="flex h-12 flex-row justify-between pr-2 m-4">
                <div className="flex flex-row items-center  bg-white px-2 rounded-lg opacity-80">
                    <BiMapPin color="red" size={20} className="ml-2" />
                    <span className="mx-2">CAMPUS</span>
                    <select value={selectedCampus?.campus} className="select select-md min-w-64 !focus:border-none" onChange={handleChangeCampus}>
                        <option value="0" disabled>USTP Campuses</option>
                        {campuses.map((campus, index) => {
                            return (
                                <option key={index} value={campus.campus}>{campus.campus}</option>
                            )
                        })}
                    </select>
                </div>

            </div>
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
                    <ZoomControl position='bottomright' />
                    <MoveTo coordinates={coordinates} />
                </MapContainer>
            </div>
        </div>
    )
}

export default MapperComponent;