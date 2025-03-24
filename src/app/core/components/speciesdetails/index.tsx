import React from 'react';
import { ISpecies } from '../../interfaces/common.interface';
import SliderComponent from '../slider';
import fallbackImage from "../../../../assets/fallback-image.jpg";

interface SpeciesProps {
    specie?: ISpecies;
}

const SpeciesDetails: React.FC<SpeciesProps> = ({ specie }) => {

    const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-4 gap-4">
                <div className="p-3 flex flex-col">
                    {!imageLoaded && <div className="w-full bg-gray-200 animate-pulse">
                        <div className="flex justify-center items-center min-h-52">
                            <span className="text-gray-400">Loading...</span>
                        </div>
                    </div>
                    }
                    {specie?.gdriveid &&
                        <img
                            src={`https://drive.google.com/thumbnail?id=${specie?.gdriveid}&sz=w1000`}
                            alt={specie?.commonName ?? ''}
                            onLoad={() => setImageLoaded(true)}
                            className={`hover:cursor-pointer hover:opacity-90 ${imageLoaded ? 'block' : 'hidden'}`}
                            onError={e => e.currentTarget.src = fallbackImage}
                        />
                    }
                    {
                        !specie?.gdriveid &&
                        <div className="flex justify-center">
                            <img
                                src={`https://drive.google.com/thumbnail?id=${specie?.gdriveid}&sz=w1000`}
                                alt={specie?.commonName ?? ''}
                                onLoad={() => setImageLoaded(true)}
                                className={`hover:cursor-pointer hover:opacity-90 ${imageLoaded ? 'block' : 'hidden'}`}
                                onError={e => e.currentTarget.src = fallbackImage}
                            />
                        </div>
                    }
                    <div className="flex flex-col justify-start mt-2 gap-y-1 border-[1px] rounded-md p-2">
                        <div className="flex flex-row gap-x-2 border-b-[1px] pb-2">
                            <span className="font-semibold">Kingdom: </span>
                            <h5 className="text-md">{specie?.kingdom}</h5>
                        </div>
                        <div className="flex flex-row gap-x-2 border-b-[1px] pb-2">
                            <span className="font-semibold">Phylum: </span>
                            <h5 className="text-md">{specie?.phylum}</h5>
                        </div>
                        <div className="flex flex-row gap-x-2 border-b-[1px] pb-2">
                            <span className="font-semibold">Class: </span>
                            <h5 className="text-md">{specie?.class}</h5>
                        </div>
                        <div className="flex flex-row gap-x-2 border-b-[1px] pb-2">
                            <span className="font-semibold">Order: </span>
                            <h5 className="text-md">{specie?.order}</h5>
                        </div>
                        <div className="flex flex-row gap-x-2 border-b-[1px] pb-2">
                            <span className="font-semibold">Family: </span>
                            <h5 className="text-md">{specie?.family}</h5>
                        </div>
                        <div className="flex flex-row gap-x-2 pb-2">
                            <span className="font-semibold">Genus: </span>
                            <h5 className="text-md">{specie?.genus}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="flex flex-col">
                        <span className='text-xs'>Scientific name</span>
                        <h5 className="card-title italic text-lg">{specie?.scientificName}</h5>
                    </div>
                    <p className="card-text text-justify pl-2 mt-2 text-sm">{specie?.description}</p>
                    <div className="flex flex-col flex-wrap gap-2">
                        <div className="flex flex-col mt-4">
                            <span className="font-semibold text-sm">Habitats</span>
                            <span className='pl-2 mb-2 text-sm'>{specie?.habitats}</span>
                        </div>
                        <div className="flex flex-row justify-evenly flex-wrap flex-shrink gap-2">
                            <div className="border-[1px] rounded-md p-2 flex flex-col flex-1 min-w-64">
                                <span className="font-semibold text-sm">Distribution:</span>
                                <span className='text-sm'>{specie?.distribution}</span>
                            </div>
                            <div className="border-[1px] rounded-md p-2 flex flex-col flex-1 min-w-64">
                                <span className="font-semibold text-sm">Conservation Status:</span>
                                <span className='text-sm'>{specie?.conservationStatus}</span>
                            </div>
                            <div className="border-[1px] rounded-md p-2 flex flex-col flex-1 min-w-64">
                                <span className="font-semibold text-sm">Diet:</span>
                                <span className='text-sm'>{specie?.diet}</span>
                            </div>
                            <div className="border-[1px] rounded-md p-2 flex flex-col flex-1 min-w-64">
                                <span className="font-semibold text-sm">Ecological Importance :</span>
                                <span className='text-sm'>{specie?.ecologicalImportance}</span>
                            </div>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="flex flex-1 flex-col">
                        <span className='text-lg font-semibold'>Captured Images</span>
                        <SliderComponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeciesDetails;