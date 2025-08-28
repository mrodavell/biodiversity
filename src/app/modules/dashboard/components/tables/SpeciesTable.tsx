import DataTable, { TableColumn } from "react-data-table-component";
import { IActions, ISpecies } from "../../../../core/interfaces/common.interface";
import { FaArchive, FaCog, FaFileCsv, FaImage, FaImages, FaListAlt, FaPlusCircle, FaRegEdit, FaSearch, FaTrashRestore } from "react-icons/fa";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useSpeciesStore } from "../../../../core/zustand/species";
import Loader from "../../../../core/components/loader";
import Modal from "../../../../core/components/modal";
import Avatar from "../../../../core/components/avatar";
import SpeciesForm from "../forms/SpeciesForm";
import ActionDropdown from "../../../../core/components/actiondropdown";
import { useDebounce } from 'use-debounce';
import { TbHierarchy2 } from "react-icons/tb";
import SpeciesDetails from "../../../../core/components/speciesdetails";
import CapturedImagesForm from "../forms/CapturedImagesForm";
import Select from "../../../../core/components/select";
import BulkUploadForm from "../forms/BulkUploadForm";

const SpeciesTable = () => {

    const { setCategory, setSpecie, getSpecies, deleteSpecie, restoreSpecie, searchSpecies, filterSpeciesByCategory } = useSpeciesStore();
    const species = useSpeciesStore(state => state.species);
    const specie = useSpeciesStore(state => state.specie);
    const categories = useSpeciesStore(state => state.categories);
    const processing = useSpeciesStore(state => state.processing);

    const [speciesModal, setCampusModal] = useState<boolean>(false);
    const toggleSpeciesModal = () => setCampusModal(!speciesModal);
    const [modalTitle, setModalTitle] = useState<string>('New Campus');
    const [action, setAction] = useState<string>('add');
    const [isIncludeArchived, setIsIncludeArchived] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [addImagesModal, setAddImagesModal] = useState<boolean>(false);
    const toggleAddImagesModal = () => setAddImagesModal(!addImagesModal);
    const [speciesDetailsModal, setSpeciesDetailsModal] = useState<boolean>(false);
    const toggleSpeciesDetailsModal = () => setSpeciesDetailsModal(!speciesDetailsModal);
    const [bulkModal, setBulkModal] = useState<boolean>(false);
    const toggleBulkModal = () => setBulkModal(!bulkModal);

    const commonSetting = {
    };

    const getActionEvents = (species: ISpecies): IActions<ISpecies>[] => {
        // check if allowed to edit with stepper     
        const actions: IActions<ISpecies>[] = [
            {
                name: "View Details",
                event: (data) => {
                    setSpecie(data as ISpecies);
                    toggleSpeciesDetailsModal();
                },
                icon: <FaListAlt className="text-info" />,
                color: "primary",
            },
            {
                name: "Add Images",
                event: (data) => {
                    setSpecie(data as ISpecies);
                    toggleAddImagesModal();
                },
                icon: <FaImages className="text-green-500" />,
                color: "primary",
            },
            {
                name: "Edit",
                event: (data) => {
                    handleEdit(data as ISpecies)
                },
                icon: <FaRegEdit className="text-blue-500" />,
                color: "primary",
            },
            ...(species.deleted_at === null ? [
                {
                    name: "Archive",
                    event: (data: unknown) => {
                        handleArchive(data as ISpecies)
                    },
                    icon: <FaArchive className="text-red-500" />,
                    color: "danger",
                }
            ] : []),
            ...(species.deleted_at !== null ? [
                {
                    name: "Restore",
                    event: (data: unknown) => {
                        handleRestore(data as ISpecies)
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
                <Avatar
                    avatar={`https://drive.google.com/thumbnail?id=${row.gdriveid}&sz=w1000`}
                    name={row.commonName ?? ''}
                />
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
            cell: (row) => <span className="text-justify text-ellipsis max-h-20 min-h-20 overflow-clip">{row.description}</span>,
            width: "20%",
        },
        {
            name: <span className="flex flex-1 justify-center"><FaCog className="mr-2" />Actions</span>,
            cell: (row, index) => {
                return <ActionDropdown<ISpecies>
                    actions={getActionEvents(row as ISpecies)}
                    rowIndex={index}
                    data={row as ISpecies}
                />
            }
        }
    ];

    const getNewData = useMemo(() => async (isIncludeArchived = false) => {
        await getData(isIncludeArchived);
    }, []);

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

    const handleChangeCategory = (category: string) => {
        setCategory(category);
        filterSpeciesByCategory(category);
    }

    useEffect(() => {
        if (debouncedSearchTerm) {
            searchSpecies(debouncedSearchTerm);
        } else {
            getData();
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            await getNewData();
        };
        fetchData();
    }, [])

    useEffect(() => {
        getNewData(isIncludeArchived);
    }, [isIncludeArchived])


    return <Fragment>
        {
            speciesModal && (
                <Modal title={modalTitle} isOpen={speciesModal} onClose={toggleSpeciesModal} modalContainerClassName="max-w-5xl">
                    <div>
                        <SpeciesForm action={action} toggleModal={handleModal} />
                    </div>
                </Modal>
            )
        }
        {
            speciesDetailsModal && (
                <Modal title={`${specie?.commonName}`} isOpen={speciesDetailsModal} onClose={toggleSpeciesDetailsModal} modalContainerClassName="max-w-5xl" titleClass="text-xl font-medium text-gray-900 ml-5">
                    <SpeciesDetails specie={specie ?? undefined} />
                </Modal>
            )
        }

        {
            addImagesModal && (
                <Modal title={`Manage Captured Images for ${specie?.commonName}`} isOpen={addImagesModal} onClose={toggleAddImagesModal} modalContainerClassName="max-w-3xl">
                    <CapturedImagesForm specie={specie ?? undefined} />
                </Modal>
            )
        }
        {
            bulkModal && (
                <Modal title={`Bulk Upload Species`} isOpen={bulkModal} onClose={toggleBulkModal} modalContainerClassName="max-w-3xl">
                    <BulkUploadForm toggleModal={toggleBulkModal} />
                </Modal>
            )
        }
        <div className="flex flex-1 flex-col w-full px-10 pt-4">
            <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-row w-[80%] justify-start items-center">
                    <div className="flex flex-row flex-1 items-center input input-bordered input-sm w-full mr-4">
                        <input
                            type="search"
                            className="input input-sm w-full focus-within:border-none"
                            placeholder="Search"
                            onChange={handleSearchChange}
                        />
                        <span>
                            <FaSearch />
                        </span>
                    </div>
                    <div className="flex flex-row flex-1 items-center w-full mr-4">
                        <Select
                            placeholder="Filter by Category"
                            className="select-sm"
                            options={categories}
                            onChange={(e) => handleChangeCategory(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-row flex-1 w-full items-center">
                        <input type="checkbox" checked={isIncludeArchived} onChange={e => handleIsIncludeArchived(e.target.checked)} className="checkbox checkbox-primary checkbox-sm" />
                        <span className="ml-2">Include Archived</span>
                    </div>
                </div>
                <div className="w-[25%] flex justify-end gap-x-2">
                    <button
                        className="btn btn-success btn-sm text-white"
                        onClick={handleAdd}
                    >
                        <FaPlusCircle className="mr-2" /> Add Specie
                    </button>
                    <button
                        className="btn btn-success btn-sm text-white"
                        onClick={toggleBulkModal}
                    >
                        <FaFileCsv className="mr-2" /> Bulk Upload
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
                    progressComponent={<div className="flex flex-1 h-[400px]"><Loader text="Fetching records..." /></div>}
                    data={species}
                    pagination
                    fixedHeader
                />
            </div>
        </div>
    </Fragment>
}

export default SpeciesTable;