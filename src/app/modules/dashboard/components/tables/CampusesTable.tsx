import DataTable, { TableColumn } from "react-data-table-component";
import { IActions, ICampus } from "../../../../core/interfaces/common.interface";
import { FaArchive, FaCog, FaMapMarkerAlt, FaPlusCircle, FaRegEdit, FaSearch, FaTrashRestore, FaUniversity } from "react-icons/fa";
import { Fragment, useEffect, useState } from "react";
import { useCampusStore } from "../../../../core/zustand/campus";
import Loader from "../../../../core/components/loader";
import CampusForm from "../forms/CampusForm";
import Modal from "../../../../core/components/modal";
import { FaMapLocation } from "react-icons/fa6";
import { useDebounce } from "use-debounce";
import ActionDropdown from "../../../../core/components/actiondropdown";


const CampusesTable = () => {

    const { setCampus, getCampuses, deleteCampus, restoreCampus, searchCampuses } = useCampusStore();
    const campuses = useCampusStore(state => state.campuses);
    const processing = useCampusStore(state => state.processing);

    const [campusModal, setCampusModal] = useState<boolean>(false);
    const toggleCampusModal = () => setCampusModal(!campusModal);
    const [modalTitle, setModalTitle] = useState<string>('New Campus');
    const [action, setAction] = useState<string>('add');
    const [isIncludeArchived, setIsIncludeArchived] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const commonSetting = {};

    const getActionEvents = (species: ICampus): IActions<ICampus>[] => {
        // check if allowed to edit with stepper     
        const actions: IActions<ICampus>[] = [
            {
                name: "View",
                event: (data: ICampus, index: number) => {
                    handleView(data, index)
                },
                icon: <FaMapMarkerAlt className="text-red-500" />,
                color: "primary",
            },
            {
                name: "Edit",
                event: (data: ICampus) => {
                    handleEdit(data)
                },
                icon: <FaRegEdit className="text-blue-500" />,
                color: "primary",
            },
            ...(species.deleted_at === null ? [
                {
                    name: "Archive",
                    event: (data: ICampus) => {
                        handleArchive(data)
                    },
                    icon: <FaArchive className="text-red-500" />,
                    color: "danger",
                }
            ] : []),
            ...(species.deleted_at !== null ? [
                {
                    name: "Restore",
                    event: (data: ICampus) => {
                        handleRestore(data)
                    },
                    icon: <FaTrashRestore className="text-info" />,
                    color: "info",
                }
            ] : []),
        ];

        return actions;
    };

    const columns: TableColumn<ICampus>[] = [
        {
            name: <span className="flex flex-row"><FaUniversity className="mr-2" /> Campus</span>,
            cell: (row) => row.campus,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><FaMapMarkerAlt className="mr-2" /> Address</span>,
            cell: (row) => row.address,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><FaMapLocation className="mr-2" /> Coordinates</span>,
            cell: (row) => `Long: ${row.latitude}, Lat: ${row.longitude}`,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-1 justify-center"><FaCog className="mr-2" />Actions</span>,
            cell: (row, index) => {
                return <div className="flex flex-1 justify-center">
                    <ActionDropdown<ICampus>
                        actions={getActionEvents(row)}
                        rowIndex={index}
                        data={row}
                    />
                </div>

            }
        }
    ];

    const getCampus = async (isIncludeArchived = false) => {
        getCampuses(isIncludeArchived);
    }

    const handleAdd = () => {
        setCampus(null);
        setModalTitle('New Campus');
        setAction('add');
        toggleCampusModal();
    }

    const handleView = (row: ICampus, index: number) => {
        const updateRow = { ...row, index };
        window.localStorage.setItem('campus', JSON.stringify(updateRow));
        window.open(`/`, '_blank');
    }

    const handleEdit = (row: ICampus) => {
        setCampus(row);
        setModalTitle('Edit Campus');
        setAction('edit');
        toggleCampusModal();
    }

    const handleArchive = async (row: ICampus) => {
        deleteCampus(row);
    }

    const handleRestore = async (row: ICampus) => {
        restoreCampus(row);
    }

    const handleModal = () => {
        toggleCampusModal();
    }

    const handleIsIncludeArchived = (checked: boolean) => {
        setIsIncludeArchived(checked);
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            searchCampuses(debouncedSearchTerm);
        } else {
            getData();
        }
    }, [debouncedSearchTerm]);

    const getData = async (isIncludeArchived = false) => {
        await getCampus(isIncludeArchived);
    }

    useEffect(() => {
        const fetchData = async () => {
            getData();
        };
        fetchData();
    }, [])

    useEffect(() => {
        getCampus(isIncludeArchived);
    }, [isIncludeArchived])

    return <Fragment>
        {
            campusModal && (
                <Modal title={modalTitle} isOpen={campusModal} onClose={toggleCampusModal} modalContainerClassName="max-w-4xl">
                    <div>
                        <CampusForm action={action} toggleModal={handleModal} />
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
                            placeholder="Search"
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
                        <FaPlusCircle className="mr-2" /> Add Campus
                    </button>
                </div>
            </div>
            <div className="flex flex-1 flex-col w-full">
                <DataTable
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                    className="min-w-full h-[400px] border-2 px-2"
                    customStyles={{ rows: { style: { cursor: 'pointer', padding: '10px' } } }}
                    columns={columns}
                    progressPending={processing}
                    progressComponent={<div className="flex flex-1 h-[400px]"><Loader text="Fetching records..." /></div>}
                    data={campuses}
                    pagination
                    fixedHeader
                />
            </div>
        </div>
    </Fragment>
}

export default CampusesTable;