import DataTable, { TableColumn } from "react-data-table-component";
import { ISpecies } from "../../../core/interfaces/common.interface";
import { FaPlusCircle, FaRegEdit, FaSearch, FaTrashAlt } from "react-icons/fa";
import { FC } from "react";

type SpeciesTableProps = {
    toggleModal: () => void;
}

const AvatarPlaceholder = (value: ISpecies) => {
    return <div className="text-sm text-center text-black  bg-slate-400 h-max p-2 min-w-9 rounded-full">
        {(value.commonName ?? '')[0]}
    </div>
}

const Avatar = (value: ISpecies) => {
    return <img src={value.avatar} alt={value.commonName} className="w-14 h-14 rounded-full avatar" />
}

const SpeciesTable: FC<SpeciesTableProps> = ({
    toggleModal
}) => {

    const commonSetting = {
        sortable: true,
        reorder: true,
    };

    const handleEdit = (row: ISpecies) => {
        console.log(row);
    }

    const handleDelete = (row: ISpecies) => {
        console.log(row);
    }


    const columns: TableColumn<ISpecies>[] = [
        {
            name: <span className="flex flex-1 justify-center">Image</span>,
            cell: (row) => <div className="flex flex-1 justify-center">
                {row.avatar ? Avatar(row) : AvatarPlaceholder(row)}
            </div>,
            style: {
                textAlign: 'center'
            },
            ...commonSetting,
        },
        {
            name: "Common Name",
            cell: (row) => row.commonName,
            ...commonSetting,
        },
        {
            name: "Scientific Name",
            cell: (row) => row.scientificName,
            ...commonSetting,
        },
        {
            name: "Family",
            cell: (row) => row.family,
            ...commonSetting,
        },

        {
            name: "Description",
            cell: (row) => row.description,
            width: "20%",
        },
        {
            name: "Distribution",
            cell: (row) => row.distribution,
        },
        {
            name: "IUCN Status",
            cell: (row) => row.iucnStatus,
        },
        {
            name: "Ecological Importance",
            cell: (row) => row.ecologicalImportance,
        },
        {
            name: "Actions",
            cell: (row) => <div className="flex flex-row justify-center gap-x-2">
                <button onClick={() => handleEdit(row)} className="btn btn-sm btn-primary text-center">
                    <FaRegEdit />
                </button>
                <button onClick={() => handleDelete(row)} className="btn btn-sm btn-error text-white">
                    <FaTrashAlt />
                </button>
            </div>,
        }
    ];

    const sampleData: ISpecies[] = [
        {
            commonName: "Philippine Eagle",
            species: "Pithecophaga jefferyi",
            scientificName: "Pithecophaga jefferyi",
            family: "Accipitridae",
            description: "The Philippine eagle (Pithecophaga jefferyi), also known as the monkey-eating eagle or great Philippine eagle, is an endangered species of eagle of the family Accipitridae which is endemic to forests in the Philippines.",
            foodDiet: "Monkeys, snakes, and flying lemurs",
            habitats: "Tropical forests",
            distribution: "Philippines",
            iucnStatus: "Critically Endangered",
            ecologicalImportance: "Top predator in the Philippine forest ecosystem"
        },
        {
            commonName: "Philippine Tarsier",
            species: "Carlito syrichta",
            scientificName: "Carlito syrichta",
            family: "Tarsiidae",
            description: "The Philippine tarsier (Carlito syrichta), known locally as mawumag in Cebuano/Visayan and mamag in Luzon, is a species of tarsier endemic to the Philippines.",
            foodDiet: "Insects",
            habitats: "Tropical forests",
            distribution: "Philippines",
            iucnStatus: "Near Threatened",
            ecologicalImportance: "Keystone species in the Philippine forest ecosystem"
        }
    ]

    return <div className="flex flex-1 flex-col w-full px-10 pt-4">
        <div className="flex flex-row justify-between mb-4">
            <div className="flex flex-row  w-1/3 justify-start">
                <div className="flex flex-row items-center input input-bordered input-sm w-full">
                    <input
                        type="search"
                        className="input input-sm w-full focus-within:border-none"
                        placeholder="Search"
                    />
                    <span>
                        <FaSearch />
                    </span>
                </div>
            </div>
            <div className="w-[25%] flex justify-end">
                <button
                    className="btn btn-primary btn-sm"
                    onClick={toggleModal}
                >
                    <FaPlusCircle className="mr-2" /> Add Species
                </button>
            </div>
        </div>
        <div className="border-[2px] px-4">
            <DataTable
                style={{ maxHeight: 'calc(100vh - 200px)' }}
                columns={columns}
                data={sampleData}
                pagination
            />
        </div>
    </div>

}

export default SpeciesTable;