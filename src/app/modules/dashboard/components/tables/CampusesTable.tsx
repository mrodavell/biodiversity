import DataTable, { TableColumn } from "react-data-table-component";
import { ICampus } from "../../../../core/interfaces/common.interface";
import { FaArchive, FaCog, FaMapMarkerAlt, FaPlusCircle, FaRegEdit, FaSearch, FaTrashRestore, FaUniversity } from "react-icons/fa";
import { Fragment, useEffect, useState } from "react";
import { useSystemStore } from "../../../../core/zustand/system";
import { supabase } from "../../../../core/lib/supabase";
import { toast } from "react-toastify";
import Loader from "../../../../core/components/loader";
import CampusForm from "../forms/CampusForm";
import Modal from "../../../../core/components/modal";
import { getTimestamp } from "../../../../core/helpers/date";
import Tooltip from "../../../../core/components/tooltip";
import { confirmArchive, confirmRestore } from "../../../../core/helpers/alerts";
import { FaMapLocation } from "react-icons/fa6";


const CampusesTable = () => {

    const { setCampus, getCampuses } = useSystemStore();
    const campuses = useSystemStore(state => state.campuses);
    const fetching = useSystemStore(state => state.fetchingCampuses);

    const [campusModal, setCampusModal] = useState<boolean>(false);
    const toggleCampusModal = () => setCampusModal(!campusModal);
    const [modalTitle, setModalTitle] = useState<string>('New Campus');
    const [action, setAction] = useState<string>('add');
    const [isIncludeArchived, setIsIncludeArchived] = useState<boolean>(false);

    const commonSetting = {
        sortable: true,
        reorder: true,
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
            name: <span className="flex flex-1 justify-center"><FaCog className="mr-2" /> Actions</span>,
            cell: (row, index) => <div className="flex flex-1 flex-row justify-center gap-x-2">
                <Tooltip text='View Campus Location'>
                    <button onClick={() => handleView(row, index)} className="btn btn-sm bg-zinc-300 text-center">
                        <FaMapMarkerAlt className="text-red-500" />
                    </button>
                </Tooltip>
                <Tooltip text='Edit Campus'>
                    <button onClick={() => handleEdit(row)} className="btn btn-sm btn-primary text-center">
                        <FaRegEdit />
                    </button>
                </Tooltip>
                {row.deleted_at === null &&
                    <Tooltip text='Archive Campus'>
                        <button onClick={() => handleDelete(row)} className="btn btn-sm btn-error text-white">
                            <FaArchive />
                        </button>
                    </Tooltip>
                }
                {row.deleted_at !== null &&
                    <Tooltip text='Restore Campus'>
                        <button onClick={() => handleRestore(row)} className="btn btn-sm btn-info text-white">
                            <FaTrashRestore />
                        </button>
                    </Tooltip>
                }
            </div>,
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

    const handleDelete = async (row: ICampus) => {
        try {

            const confirm = await confirmArchive(`${row.campus} Campus`);

            if (!confirm.isConfirmed) {
                return;
            }

            const { error } = await supabase.from('campus').update({ deleted_at: getTimestamp() }).eq('id', row.id);
            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success('Campus deleted successfully!');
            getCampus(isIncludeArchived);
        } catch (error: unknown) {
            toast.error(error as string)
        }
    }

    const handleRestore = async (row: ICampus) => {
        try {
            const confirm = await confirmRestore(`${row.campus} Campus`);

            if (!confirm.isConfirmed) {
                return;
            }

            const { error } = await supabase.from('campus').update({ deleted_at: null }).eq('id', row.id);
            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success('Campus restored successfully!');
            getCampus(isIncludeArchived);
        } catch (error: unknown) {
            toast.error(error as string)
        }
    }

    const handleModal = () => {
        toggleCampusModal();
    }

    const handleIsIncludeArchived = (checked: boolean) => {
        setIsIncludeArchived(checked);
    }

    useEffect(() => {
        const fetchData = async () => {
            await getCampus();
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
                    className="min-w-full border-2 p-2"
                    columns={columns}
                    progressPending={fetching}
                    progressComponent={<Loader text="Fetching records..." />}
                    data={campuses}
                    pagination
                    fixedHeader
                />
            </div>
        </div>
    </Fragment>
}

export default CampusesTable;