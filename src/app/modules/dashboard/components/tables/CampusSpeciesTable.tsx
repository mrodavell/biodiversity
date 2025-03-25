import DataTable, { TableColumn } from "react-data-table-component";
import { IActions, ICampusSpecies } from "../../../../core/interfaces/common.interface";
import { FaArchive, FaCheckCircle, FaCog, FaMapMarkerAlt, FaPlusCircle, FaRegEdit, FaTrashRestore, FaUniversity } from "react-icons/fa";
import { Fragment, useEffect, useState } from "react";
import { useCampusStore } from "../../../../core/zustand/campus";
import Loader from "../../../../core/components/loader";
import Modal from "../../../../core/components/modal";
import { FaMapLocation } from "react-icons/fa6";
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
import MapModalComponent from "../../../../core/components/mapmodal";
import { toast } from "react-toastify";
import { useCampusSpeciesStore } from "../../../../core/zustand/campus-species";
import Species from "../../../../core/components/speciesdetails";


const CampusSpeciesTable = () => {

    const { getCampuses } = useCampusStore();
    const { getSpeciesByCategory, searchSpeciesByCategory, getSpecie } = useSpeciesStore();
    const { getCampusSpecies, createCampusSpecie, editCampusSpecie, deleteCampusSpecie, restoreCampusSpecie } = useCampusSpeciesStore();
    const processing = useCampusStore(state => state.processing);
    const categories = useSpeciesStore(state => state.categories);
    const campuses = useCampusStore(state => state.campuses);
    const campusSpecies = useCampusSpeciesStore(state => state.campusSpecies);
    const campusSpeciesProcessing = useCampusSpeciesStore(state => state.processing);
    const specie = useSpeciesStore(state => state.specie);
    const specieProcessing = useSpeciesStore(state => state.processing);

    const campusOptions = campuses.map(campus => ({ value: campus.id ?? '', text: campus.campus }));
    const speciesByCategory = useSpeciesStore(state => state.speciesByCategory);

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [mapModal, setMapModal] = useState<boolean>(false);
    const toggleMapModal = () => setMapModal(!mapModal);
    const [speciesModal, setSpeciesModal] = useState<boolean>(false);
    const toggleSpeciesModal = () => setSpeciesModal(!speciesModal);
    const [initialAutocompleteText, setInitialAutocompleteText] = useState<string>('');
    const [action, setAction] = useState<string>('add');
    const [isIncludeArchived, setIsIncludeArchived] = useState<boolean>(false);
    const [sortedCampus, setSortedCampus] = useState<string | null>(null);

    const getData = async (isIncludeArchived = false) => {
        getCampuses(isIncludeArchived);
        getCampusSpecies(isIncludeArchived, sortedCampus);
    }


    useEffect(() => {
        const fetchData = async () => {
            getData();
        };
        fetchData();
    }, [])

    const handleMapLocation = () => {
        if (formik.values.campus === '') {
            toast.info('Please select a campus first');
            return;
        }
        toggleMapModal();
    }

    const handleGetSpeciesByCategory = (category: string) => {
        setSelectedCategory(category);
        getSpeciesByCategory(category);
    }

    const handleSelectedSpecies = (species: string) => {
        formik.setFieldValue('species', species);
    }

    const handleChangeAutocomplete = (value: string) => {
        searchSpeciesByCategory(selectedCategory, value);
    }

    const handleLongLat = (coordinates: number[]) => {
        formik.setFieldValue('latitude', coordinates[0].toString());
        formik.setFieldValue('longitude', coordinates[1].toString());
    }

    const handleSelectedSpeciesDetails = () => {
        if (formik.values.species === '') {
            toast.info('Please select a species first');
            return;
        }

        getSpecie(formik.values.species);
        toggleSpeciesModal();
    }

    const handleClearForm = () => {
        setAction('add');
        setSelectedCategory('');
        setInitialAutocompleteText('');
        formik.resetForm();
    }

    const handleSortByCampus = (campus: string) => {
        setSortedCampus(campus);
        getCampusSpecies(isIncludeArchived, campus);
    }

    useEffect(() => {
        getData(isIncludeArchived);
    }, [isIncludeArchived])


    const formik = useFormik({
        initialValues: {
            campus: '',
            species: '',
            longitude: '',
            latitude: '',
        },
        validationSchema: campusSpeciesSchema,
        onSubmit: async (values) => {
            if (action === 'edit') {
                editCampusSpecie(values);
            } else {
                createCampusSpecie(values);
                formik.resetForm();
            }
        }
    })


    const commonSetting = {};

    const getActionEvents = (species: ICampusSpecies): IActions<ICampusSpecies>[] => {
        // check if allowed to edit with stepper     
        const actions: IActions<ICampusSpecies>[] = [
            {
                name: "Edit",
                event: (data: ICampusSpecies) => {
                    const dataToEdit = {
                        id: data.id,
                        campus: data.campus,
                        species: data.species,
                        latitude: data.latitude as string,
                        longitude: data.longitude as string,
                    }

                    setSelectedCategory(data.speciesData?.category ?? '');
                    setInitialAutocompleteText(data.speciesData?.commonName ?? '');
                    setAction('edit');
                    formik.setValues(dataToEdit);
                },
                icon: <FaRegEdit className="text-blue-500" />,
                color: "primary",
            },
            ...(species.deleted_at === null ? [
                {
                    name: "Archive",
                    event: (data: ICampusSpecies) => {
                        deleteCampusSpecie(data)
                    },
                    icon: <FaArchive className="text-red-500" />,
                    color: "danger",
                }
            ] : []),
            ...(species.deleted_at !== null ? [
                {
                    name: "Restore",
                    event: (data: ICampusSpecies) => {
                        restoreCampusSpecie(data)
                    },
                    icon: <FaTrashRestore className="text-info" />,
                    color: "info",
                }
            ] : []),
        ];

        return actions;
    };

    const columns: TableColumn<ICampusSpecies>[] = [
        {
            name: <span className="flex flex-row"><FaUniversity className="mr-2" /> Campus</span>,
            cell: (row) => <div>{row.campusData?.campus}</div>,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><FaMapMarkerAlt className="mr-2" /> Species</span>,
            cell: (row) => <div>{row.deleted_at !== null ? <span className="text-red-500">(Archived) </span> : ""}{row.speciesData?.commonName}</div>,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-row"><FaMapLocation className="mr-2" /> Coordinates</span>,
            cell: (row) => `Lat: ${row.latitude}, Lng: ${row.longitude}`,
            ...commonSetting,
        },
        {
            name: <span className="flex flex-1 justify-center"><FaCog className="mr-2" />Actions</span>,
            cell: (row, index) => {
                return <div className="flex flex-1 justify-center">
                    <ActionDropdown<ICampusSpecies>
                        actions={getActionEvents(row)}
                        rowIndex={index}
                        data={row}
                    />
                </div>

            }
        }
    ];

    return <Fragment>
        {
            mapModal && (
                <Modal title="Map" isOpen={mapModal} onClose={toggleMapModal} modalContainerClassName="max-w-7xl">
                    <MapModalComponent
                        campuses={campuses}
                        initialCampus={formik.values.campus}
                        initialCoordinates={[Number(formik.values.latitude), Number(formik.values.longitude)]}
                        getLongLat={handleLongLat}
                    />
                    <div className="flex flex-1 flex-col justify-end items-end">
                        <button onClick={toggleMapModal} className="btn btn-success text-white w-44">Apply</button>
                    </div>
                </Modal>
            )
        }

        {
            speciesModal && (
                <Modal title={`${specie?.commonName}`} isOpen={speciesModal} onClose={toggleSpeciesModal} modalContainerClassName="max-w-5xl" titleClass="text-xl font-medium text-gray-900 ml-5">
                    <Species specie={specie ?? undefined} />
                </Modal>
            )
        }

        <div className="flex flex-1 flex-col w-full pt-4">
            <div className="grid grid-cols-8 gap-2">
                <div className="col-span-2">
                    <div className="flex flex-1 flex-col">
                        <FormikProvider value={formik}>
                            <Form>
                                <div className="flex flex-1 flex-col w-full gap-2 border-2 p-2 px-2 rounded justify-center items-center">
                                    <span className="text-sm">Please fill in the form for mapping</span>
                                    <div className="flex flex-col flex-1 w-full px-2 gap-y-4">
                                        <Select
                                            className="select-sm"
                                            value={formik.values.campus}
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
                                            value={selectedCategory}
                                            options={categories}
                                            onChange={e => handleGetSpeciesByCategory(e.target.value)}
                                            placeholder="Category"
                                            name="category"
                                            required
                                        />
                                        <div className="flex flex-row gap-2 items-center justify-center">
                                            <Autocomplete
                                                selectedValue={formik.values.species}
                                                initialSelectedText={initialAutocompleteText}
                                                options={speciesByCategory}
                                                setSelectedValue={handleSelectedSpecies}
                                                onChange={(value) => handleChangeAutocomplete(value)}
                                                initialize={() => getSpeciesByCategory(selectedCategory)}
                                            />
                                            <Tooltip text="View Specie Details">
                                                <LoadingButton
                                                    type="button"
                                                    isLoading={specieProcessing}
                                                    onClick={handleSelectedSpeciesDetails}
                                                    className="btn btn-sm btn-info text-white"
                                                >
                                                    <TbDatabaseSearch />
                                                </LoadingButton>
                                            </Tooltip>
                                        </div>
                                        <div className="flex flex-1 flex-col gap-2 px-2 justify-center items-center border-2 p-2 rounded">
                                            <span className="text-sm">Setup Map Coordinates and Zoom Level</span>
                                            <TextField
                                                type="number"
                                                placeholder="Latitude"
                                                className="input-sm"
                                                name="latitude"
                                                onChange={formik.handleChange}
                                                value={formik.values.latitude}
                                                error={!!formik.errors.latitude && formik.touched.latitude}
                                                errorText={formik.errors.latitude}
                                                required
                                            />
                                            <TextField
                                                type="number"
                                                placeholder="Longitude"
                                                className="input-sm"
                                                name="longitude"
                                                onChange={formik.handleChange}
                                                value={formik.values.longitude}
                                                error={!!formik.errors.longitude && formik.touched.longitude}
                                                errorText={formik.errors.longitude}
                                                required
                                            />
                                            {formik.values.longitude !== '' && formik.values.latitude !== '' && (
                                                <button onClick={handleMapLocation} type="button" className="btn btn-sm btn-success text-white w-full">
                                                    <span className="ml-2">Preview with Map</span>
                                                    <TfiTarget />
                                                </button>
                                            )}

                                            <span className="text-sm">or</span>
                                            <button onClick={handleMapLocation} type="button" className="btn btn-sm btn-info text-white w-full">
                                                <span className="ml-2">Set Coordinates with Map</span>
                                                <TfiTarget />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-8">
                                            <LoadingButton
                                                isLoading={campusSpeciesProcessing}
                                                className="btn bg-red-700 btn-sm"
                                                type="button"
                                                onClick={handleClearForm}
                                            >
                                                Clear
                                            </LoadingButton>
                                            <LoadingButton
                                                isLoading={campusSpeciesProcessing}
                                                className="btn bg-blue-700 btn-sm"
                                                type="submit"
                                            >
                                                {action === 'add' ? 'Add' : 'Update'}
                                                {action === 'add' ? <FaPlusCircle className="ml-2" /> : <FaCheckCircle className="ml-2" />}
                                            </LoadingButton>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                </div>
                <div className="col-span-6">
                    <div className="flex flex-[3] flex-col">
                        <div className="flex flex-row justify-between mb-4">
                            <div className="flex flex-row w-[40%] justify-start items-center">
                                <div className="flex flex-row flex-1 items-center w-full mr-4">
                                    <Select
                                        placeholder="Sort by Campus"
                                        className="select-sm"
                                        options={campusOptions}
                                        onChange={e => handleSortByCampus(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-row flex-1 w-full items-center">
                                    <input type="checkbox" checked={isIncludeArchived} onChange={e => setIsIncludeArchived(e.target.checked)} className="checkbox checkbox-primary checkbox-sm" />
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
                                progressComponent={<div className="flex flex-1 h-[400px]"><Loader text="Fetching records..." /></div>}
                                data={campusSpecies}
                                pagination
                                fixedHeader
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fragment >
}

export default CampusSpeciesTable;