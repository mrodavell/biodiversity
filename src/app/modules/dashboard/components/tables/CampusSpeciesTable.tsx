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
import Select from "../../../../core/components/select";
import { useSpeciesStore } from "../../../../core/zustand/species";
import TextField from "../../../../core/components/textfield";
import LoadingButton from "../../../../core/components/loadingbutton";
import { Form, FormikProvider, useFormik } from "formik";
import { campusSpeciesSchema } from "../../../../core/schema/campus-species.schema";
import { TfiTarget } from "react-icons/tfi";
import Tooltip from "../../../../core/components/tooltip";
import { TbDatabaseSearch } from "react-icons/tb";
import Autocomplete from "../../../../core/components/autocomplete";


const CampusSpeciesTable = () => {

    const { setCampus, getCampuses, deleteCampus, restoreCampus, searchCampuses } = useCampusStore();
    const processing = useCampusStore(state => state.processing);

    const { getSpeciesByCategory, searchSpeciesByCategory } = useSpeciesStore();
    const categories = useSpeciesStore(state => state.categories);
    const campuses = useCampusStore(state => state.campuses);
    const campusOptions = campuses.map(campus => ({ value: campus.id ?? '', text: campus.campus }));
    const speciesByCategory = useSpeciesStore(state => state.speciesByCategory);

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


    const formik = useFormik({
        initialValues: {
            campus: '',
            category: '',
            species: '',
            longitude: '',
            latitude: '',
            zoom: ''
        },
        validationSchema: campusSpeciesSchema,
        onSubmit: async (values) => {
            console.log(values);
        }
    })

    const handleGetSpeciesByCategory = (category: string) => {
        formik.setFieldValue('category', category);
        getSpeciesByCategory(category);
    }

    const handleSelectedSpecies = (species: string) => {
        console.log(species);
        formik.setFieldValue('species', species);
    }

    const handleChangeAutocomplete = (value: string) => {
        searchSpeciesByCategory(formik.values.category, value);
    }



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


        <div className="flex flex-1 flex-col w-full pt-4">
            <div className="flex flex-1 flex-row w-full gap-2">
                <div className="flex flex-1 flex-col">
                    <FormikProvider value={formik}>
                        <Form>
                            <div className="flex flex-1 flex-col w-full gap-2 border-2 p-2 px-2 rounded justify-center items-center">
                                <span className="text-sm">Please fill in the form for mapping</span>
                                <div className="flex flex-col flex-1 w-full px-2 gap-y-4">
                                    <Select
                                        className="select-sm"
                                        options={campusOptions}
                                        onChange={formik.handleChange}
                                        placeholder="Campus"
                                        name="campus"
                                        error={!!formik.errors.campus && formik.touched.campus}
                                        errorText={formik.errors.campus}
                                        required
                                    />
                                    <Select
                                        className="select-sm"
                                        options={categories}
                                        onChange={e => handleGetSpeciesByCategory(e.target.value)}
                                        placeholder="Category"
                                        name="category"
                                        error={!!formik.errors.category && formik.touched.category}
                                        errorText={formik.errors.category}
                                        required
                                    />
                                    <div className="flex flex-row gap-2 items-center justify-center">
                                        {/* <Select
                                            className="select-sm"
                                            options={speciesByCategory}
                                            onChange={formik.handleChange}
                                            placeholder="Species"
                                            name="species"
                                            error={!!formik.errors.species && formik.touched.species}
                                            errorText={formik.errors.species}
                                            required
                                        /> */}
                                        <Autocomplete
                                            selectedValue={formik.values.species}
                                            options={speciesByCategory}
                                            setSelectedValue={handleSelectedSpecies}
                                            onChange={(value) => handleChangeAutocomplete(value)}
                                            initialize={() => getSpeciesByCategory(formik.values.category)}
                                        />
                                        <Tooltip text="View Specie Details">
                                            <button className="btn btn-sm btn-info text-white">
                                                <TbDatabaseSearch />
                                            </button>
                                        </Tooltip>
                                    </div>
                                    <div className="flex flex-1 flex-col gap-2 px-2 justify-center items-center border-2 p-2 rounded">
                                        <span className="text-sm">Setup Map Coordinates and Zoom Level</span>
                                        <TextField
                                            type="number"
                                            placeholder="Longitude"
                                            className="input-sm"
                                            onChange={formik.handleChange}
                                            name="longitude"
                                            error={!!formik.errors.longitude && formik.touched.longitude}
                                            errorText={formik.errors.longitude}
                                            required
                                        />
                                        <TextField
                                            type="number"
                                            placeholder="Latitude"
                                            className="input-sm"
                                            onChange={formik.handleChange}
                                            name="latitude"
                                            error={!!formik.errors.latitude && formik.touched.latitude}
                                            errorText={formik.errors.latitude}
                                            required
                                        />
                                        <TextField
                                            type="number"
                                            placeholder="Zoom"
                                            className="input-sm"
                                            onChange={formik.handleChange}
                                            name="zoom"
                                            error={!!formik.errors.zoom && formik.touched.zoom}
                                            errorText={formik.errors.zoom}
                                            required
                                        />
                                        <span className="text-sm">or</span>
                                        <button className="btn btn-sm btn-info text-white w-full">
                                            <span className="ml-2">Use Map Location</span>
                                            <TfiTarget />
                                        </button>

                                    </div>
                                    <LoadingButton
                                        isLoading={processing}
                                        className="btn btn-primary btn-sm"
                                        type="submit"
                                    >
                                        Add
                                        <FaPlusCircle />
                                    </LoadingButton>
                                </div>
                            </div>
                        </Form>
                    </FormikProvider>
                </div>
                <div className="flex flex-[3] flex-col">
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
                    </div>
                    <div className="flex flex-1 flex-col w-full">
                        <DataTable
                            style={{ maxHeight: 'calc(100vh - 200px)' }}
                            className="min-w-full h-[450px] border-2 px-2"
                            customStyles={{ rows: { style: { cursor: 'pointer', padding: '10px' } } }}
                            columns={columns}
                            progressPending={processing}
                            progressComponent={<Loader text="Fetching records..." />}
                            data={campuses}
                            pagination
                            fixedHeader
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fragment >
}

export default CampusSpeciesTable;