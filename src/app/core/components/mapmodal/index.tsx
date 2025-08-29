import 'leaflet/dist/leaflet.css';
import { FC, useEffect } from 'react';
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, ZoomControl, Tooltip, useMapEvents, useMap } from "react-leaflet";
import osmMaptiler from '../../constants/osm-maptiler';
import schoolPin from '../../../../assets/schoolmap-pin.png'
import mapPin from '../../../../assets/pin2.png'
import targetPin from '../../../../assets/location-add.gif'
import { ICampus } from '../../interfaces/common.interface';
import { useCampusStore } from '../../zustand/campus';
import React from 'react';
import { supabase } from '../../lib/supabase';


type MapComponentProps = {
    initialCampus: string;
    campuses: ICampus[];
    initialCoordinates?: LatLngExpression | null;
    getLongLat?: (latlang: number[]) => void;
};

type CampusSpeciesData = {
    id: number;
    campus: string;
    species: {
        id: number;
        commonName: string;
        scientificName: string;
        category: string;
    } | null;
    latitude: number;
    longitude: number;
    created_at: string;
    // Add other fields as needed based on your schema
};

// Define a custom icon
const customIcon = L.icon({
    iconUrl: targetPin, // URL to your custom icon
    iconSize: [50, 50], // Size of the icon [width, height]
    iconAnchor: [19, 38], // Anchor point of the icon [x, y]
    popupAnchor: [0, -38], // Anchor for the popup [x, y]
    shadowSize: [68, 95], // Size of the shadow
    shadowAnchor: [22, 94] // Anchor point for the shadow
});


// Define a school icon
const schoolIcon = L.icon({
    iconUrl: schoolPin, // URL to your custom icon
    iconSize: [50, 50], // Size of the icon [width, height]
    iconAnchor: [19, 38], // Anchor point of the icon [x, y]
    popupAnchor: [0, -38], // Anchor for the popup [x, y]
    shadowSize: [68, 95], // Size of the shadow
    shadowAnchor: [22, 94] // Anchor point for the shadow
});

// Define a species icon
const speciesIcon = L.icon({
    iconUrl: mapPin, // You'll need to add this icon
    iconSize: [30, 30],
    iconAnchor: [12, 40],
    popupAnchor: [0, -40],
    shadowSize: [41, 41],
    shadowAnchor: [10, 40]
});

const MapModalComponent: FC<MapComponentProps> = ({ initialCampus, campuses, initialCoordinates, getLongLat }) => {

    const [coordinates, setCoordinates] = React.useState<LatLngExpression>([Number(campuses[0].longitude), Number(campuses[0].latitude)]);
    const { setCampus } = useCampusStore();
    const [pinLocation, setPinLocation] = React.useState<LatLngExpression | null>(initialCoordinates ?? null);
    const [campusSpecies, setCampusSpecies] = React.useState<CampusSpeciesData[]>([]);

    const getAllCampusSpecies = async () => {
        try {
            const { data, error } = await supabase
                .from('campus_species')
                .select(`
                    *,
                    species:species(
                        id,
                        commonName,
                        scientificName,
                        category
                    ),
                    campus:campus(
                        id,
                        campus
                    )
                `)
                .eq('campus', initialCampus)
                .not('latitude', 'is', null)
                .not('longitude', 'is', null);

            if (error) {
                console.error('Error fetching campus species:', error);
                return;
            }

            console.log('Campus species data:', data);
            setCampusSpecies(data || []);
        } catch (error) {
            console.error('Error in getAllCampusSpecies:', error);
        }
    }

    useEffect(() => {
        getAllCampusSpecies();
    }, [initialCampus]);

    useEffect(() => {
        const campus = campuses.find(campus => {
            return campus.id?.toString() === initialCampus.toString();
        });
        setCampus(campus ?? null);
        setCoordinates([Number(campus?.longitude), Number(campus?.latitude)]);
    }, [initialCampus]);

    const MoveTo = ({ coordinates }: { coordinates: LatLngExpression }) => {
        const map = useMap();
        map.setView(coordinates, 40);
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
                <MapContainer center={coordinates} zoom={40} scrollWheelZoom={true} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url={osmMaptiler.maptiler.url}
                        attribution={osmMaptiler.maptiler.attribution}
                    />

                    {/* Campus markers */}
                    {campuses.map((campus, index) => (
                        <Marker
                            key={`campus-${index}`}
                            position={[Number(campus.longitude), Number(campus.latitude)]}
                            icon={schoolIcon}
                        >
                            <Tooltip>
                                <div>
                                    <strong>{campus.campus} Campus</strong>
                                </div>
                            </Tooltip>
                        </Marker>
                    ))}

                    {/* Species markers */}
                    {campusSpecies.map((speciesData, index) => (
                        <Marker
                            key={`species-${index}`}
                            position={[Number(speciesData.latitude), Number(speciesData.longitude)]}
                            icon={speciesIcon}
                        >
                            <Tooltip>
                                <div className="text-sm">
                                    <strong>{speciesData.species?.commonName || 'Unknown Species'}</strong>
                                    <br />
                                    <em>{speciesData.species?.scientificName}</em>
                                    <br />
                                    <span className="text-xs text-gray-600">
                                        Category: {speciesData.species?.category}
                                    </span>
                                    <br />
                                    <span className="text-xs text-gray-500">
                                        Lat: {Number(speciesData.latitude).toFixed(6)},
                                        Lng: {Number(speciesData.longitude).toFixed(6)}
                                    </span>
                                </div>
                            </Tooltip>
                        </Marker>
                    ))}

                    {/* Selected location marker */}
                    {pinLocation && (
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
                    )}

                    <ZoomControl position='bottomright' />
                    <MoveTo coordinates={coordinates} />
                    <LongLatGetter />
                </MapContainer>
            </div>

            {/* Species count info */}
            <div className="mt-2 text-sm text-gray-600">
                Showing {campusSpecies.length} species locations on the map
            </div>
        </div>
    )
}

export default MapModalComponent;