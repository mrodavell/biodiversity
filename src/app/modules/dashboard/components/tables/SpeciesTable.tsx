import DataTable, { TableColumn } from "react-data-table-component";
import { IActions, ISpecies } from "../../../../core/interfaces/common.interface";
import { FaArchive, FaCog, FaImage, FaListAlt, FaPlusCircle, FaRegEdit, FaSearch, FaTrashRestore } from "react-icons/fa";
import { Fragment, useEffect, useState } from "react";
import { useSpeciesStore } from "../../../../core/zustand/species";
import Loader from "../../../../core/components/loader";
import Modal from "../../../../core/components/modal";
import Avatar from "../../../../core/components/avatar";
import SpeciesForm from "../forms/SpeciesForm";
import ActionDropdown from "../../../../core/components/actiondropdown";
import { useDebounce } from 'use-debounce';
import { TbHierarchy2 } from "react-icons/tb";


const SpeciesTable = () => {

    const { setSpecie, getSpecies, deleteSpecie, restoreSpecie, searchSpecies } = useSpeciesStore();
    const species = useSpeciesStore(state => state.species);
    const processing = useSpeciesStore(state => state.processing);

    const [campusModal, setCampusModal] = useState<boolean>(false);
    const toggleSpeciesModal = () => setCampusModal(!campusModal);
    const [modalTitle, setModalTitle] = useState<string>('New Campus');
    const [action, setAction] = useState<string>('add');
    const [isIncludeArchived, setIsIncludeArchived] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const commonSetting = {
    };

    const getActionEvents = (species: ISpecies): IActions<ISpecies>[] => {
        // check if allowed to edit with stepper     
        const actions: IActions<ISpecies>[] = [
            {
                name: "Edit",
                event: (data: ISpecies) => {
                    handleEdit(data)
                },
                icon: <FaRegEdit className="text-blue-500" />,
                color: "primary",
            },
            ...(species.deleted_at === null ? [
                {
                    name: "Archive",
                    event: (data: ISpecies) => {
                        handleArchive(data)
                    },
                    icon: <FaArchive className="text-red-500" />,
                    color: "danger",
                }
            ] : []),
            ...(species.deleted_at !== null ? [
                {
                    name: "Restore",
                    event: (data: ISpecies) => {
                        handleRestore(data)
                    },
                    icon: <FaTrashRestore className="text-info" />,
                    color: "info",
                }
            ] : []),
        ];

        return actions;
    };

    const columns: TableColumn<ISpecies>[] = [
        {
            name: <span className="flex flex-1 justify-center"><FaImage className="mr-2" /> Image</span>,
            cell: (row) => <div className="flex flex-1 justify-center">
                <Avatar avatar={`https://drive.google.com/thumbnail?id=${row.gdriveid}&sz=w1000`} name={row.commonName ?? ''} />
            </div>,
            style: {
                textAlign: 'center'
            },
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><TbHierarchy2 className="mr-2" /> Common Name</span>,
            cell: (row) => row.commonName,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><TbHierarchy2 className="mr-2" /> Scientific Name</span>,
            cell: (row) => row.scientificName,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><TbHierarchy2 className="mr-2" /> Kingdom</span>,
            cell: (row) => row.kingdom,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><TbHierarchy2 className="mr-2" /> Phylum</span>,
            cell: (row) => row.phylum,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><TbHierarchy2 className="mr-2" /> Family</span>,
            cell: (row) => row.family,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><FaListAlt className="mr-2" /> Description</span>,
            cell: (row) => row.description,
            width: "20%",
        },
        {
            name: <span className="flex flex-1 justify-center"><FaCog className="mr-2" />Actions</span>,
            cell: (row, index) => {
                return <ActionDropdown<ISpecies>
                    actions={getActionEvents(row)}
                    rowIndex={index}
                    data={row}
                />
            }
        }
    ];

    const getData = async (isIncludeArchived = false) => {
        getSpecies(isIncludeArchived);
    }

    const handleAdd = () => {
        setSpecie(null);
        setModalTitle('New Specie');
        setAction('add');
        toggleSpeciesModal();
    }

    const handleEdit = (row: ISpecies) => {
        setSpecie(row);
        setModalTitle('Edit Species');
        setAction('edit');
        toggleSpeciesModal();
    }

    const handleArchive = async (row: ISpecies) => {
        deleteSpecie(row);
    }

    const handleRestore = async (row: ISpecies) => {
        restoreSpecie(row);
    }

    const handleModal = () => {
        toggleSpeciesModal();
    }

    const handleIsIncludeArchived = (checked: boolean) => {
        setIsIncludeArchived(checked);
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            searchSpecies(debouncedSearchTerm);
        } else {
            getData();
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            await getData();
        };
        fetchData();
    }, [])

    useEffect(() => {
        getSpecies(isIncludeArchived);
    }, [isIncludeArchived])


    return <Fragment>
        {
            campusModal && (
                <Modal title={modalTitle} isOpen={campusModal} onClose={toggleSpeciesModal} modalContainerClassName="max-w-5xl">
                    <div>
                        <SpeciesForm action={action} toggleModal={handleModal} />
                    </div>
                </Modal>
            )
        }
        <div className="flex flex-1 flex-col w-full px-10 pt-4">
            <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-row w-[40%] justify-start items-center">
                    <div className="flex flex-row flex-1 items-center input input-bordered input-sm w-full mr-4">
                        <input
                            type="search"
                            className="input input-sm w-full focus-within:border-none"
                            placeholder="Search Common Name"
                            onChange={handleSearchChange}
                        />
                        <span>
                            <FaSearch />
                        </span>
                    </div>
                    <div className="flex flex-row flex-1 w-full items-center">
                        <input type="checkbox" checked={isIncludeArchived} onChange={e => handleIsIncludeArchived(e.target.checked)} className="checkbox checkbox-primary checkbox-sm" />
                        <span className="ml-2">Include Archived</span>
                    </div>
                </div>
                <div className="w-[25%] flex justify-end">
                    <button
                        className="btn btn-success btn-sm text-white"
                        onClick={handleAdd}
                    >
                        <FaPlusCircle className="mr-2" /> Add Specie
                    </button>
                </div>
            </div>
            <div className="flex flex-1 flex-col w-full">
                <DataTable
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                    className="min-w-full h-[400px] border-2 px-2"
                    customStyles={{ rows: { style: { cursor: 'pointer', padding: '15px' } } }}
                    columns={columns}
                    progressPending={processing}
                    progressComponent={<Loader text="Fetching records..." />}
                    data={species}
                    pagination
                    fixedHeader
                />
            </div>
        </div>
    </Fragment>
}

export default SpeciesTable;