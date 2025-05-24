import React, { Fragment } from 'react';
import { ISpecies } from '../../../core/interfaces/common.interface';
import { SpeciesCategory } from '../../../core/enums/species';
import { TPlantsDetails } from '../../../core/types/common.types';

interface Props {
    specie?: ISpecies<TPlantsDetails>;
}

const PlantsDetails: React.FC<Props> = ({ specie }) => {


    return <Fragment>
        <div className="flex flex-col flex-wrap gap-2">
            {
                specie?.category?.toLowerCase() === SpeciesCategory.TREES &&
                <div className="flex flex-col flex-wrap">
                    <div className="flex flex-col mt-4 mb-2">
                        <span className="font-semibold text-sm">Economical Importance :</span>
                        <span className='text-sm'>{specie?.details?.economicalImportance}</span>
                    </div>
                    <div className="flex flex-row justify-evenly flex-wrap flex-shrink gap-2">
                        <div className="border-[1px] rounded-md p-2 flex flex-col flex-1 min-w-64">
                            <span className="font-semibold text-sm">Endemism</span>
                            <span className='pl-2 mb-2 text-sm'>{specie?.details?.endemism}</span>
                        </div>
                        <div className="border-[1px] rounded-md p-2 flex flex-col flex-1 min-w-64">
                            <span className="font-semibold text-sm">Distribution:</span>
                            <span className='text-sm'>{specie?.details?.distribution}</span>
                        </div>
                        <div className="border-[1px] rounded-md p-2 flex flex-col flex-1 min-w-64">
                            <span className="font-semibold text-sm">Conservation Status:</span>
                            <span className='text-sm'>{specie?.details?.conservationStatus}</span>
                        </div>
                    </div>
                </div>
            }
        </div>
    </Fragment>
};

export default PlantsDetails;