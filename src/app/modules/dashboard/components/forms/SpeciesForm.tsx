import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { speciesSchema } from "../../../../core/schema/species.schema";
import { ISpecies } from "../../../../core/interfaces/common.interface";
import TextField from "../../../../core/components/textfield";
import ErrorText from "../../../../core/components/errortext";
import { toast } from "react-toastify";
import Select from "../../../../core/components/select";
import { useSpeciesStore } from "../../../../core/zustand/species";
import LoadingButton from "../../../../core/components/loadingbutton";

type NewSpeciesFormProps = {
    action: string;
    toggleModal: () => void;
}

const SpeciesForm: FC<NewSpeciesFormProps> = ({ action = 'add', toggleModal }) => {

    const { createSpecie, editSpecie } = useSpeciesStore();
    const specie = useSpeciesStore(state => state.specie);
    const categories = useSpeciesStore(state => state.categories);
    const submitting = useSpeciesStore(state => state.processing);
    const [gDriveId, setGdriveId] = useState<string>('');
    const [imgUrl, setImgUrl] = useState<string>('');

    const handleLoadImage = () => {
        if (gDriveId !== '') {
            setImgUrl(`https://drive.google.com/thumbnail?id=${gDriveId}&sz=w1000`);
        } else {
            toast.info('Please provide a Google Drive ID');
        }
    }

    const handleClearImage = () => {
        setGdriveId('');
        setImgUrl('');
    }

    const formik = useFormik({
        initialValues: specie || {
            category: '',
            commonName: '',
            scientificName: '',
            kingdom: '',
            phylum: '',
            class: '',
            order: '',
            family: '',
            genus: '',
            description: '',
            diet: '',
            habitats: '',
            distribution: '',
            iucnStatus: '',
            conservationStatus: '',
            ecologicalImportance: '',

        },
        validationSchema: speciesSchema,
        onSubmit: (values: ISpecies) => {
            const updated = { ...values, gdriveid: gDriveId };
            if (action === 'edit') {
                editSpecie(updated, toggleModal);
            } else {
                createSpecie(updated, toggleModal);
            }
        }
    });

    useEffect(() => {
        if (action === 'edit') {
            setGdriveId(specie?.gdriveid ?? '');
            setImgUrl(`https://drive.google.com/thumbnail?id=${specie?.gdriveid}&sz=w1000`);
        }
    }, []);

    return (
        <div>
            <FormikProvider value={formik}>
                <Form>
                    <div className="flex flex-1 flex-col">
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col flex-1 gap-2 rounded-md">
                                <div className="flex flex-col gap-2 border-[1px] p-4 justify-center items-center">
                                    <img src={imgUrl} alt="Avatar" width={150} height={150} className="border-2 max-h-[150px]" />
                                    <TextField
                                        value={gDriveId}
                                        placeholder="Google Drive ID"
                                        name="goodleDriveId"
                                        onChange={e => setGdriveId(e.target.value)}
                                    />
                                    <div className="flex flex-row gap-2">
                                        <button type="button" className="btn btn-sm  btn-success text-white" onClick={handleLoadImage}>
                                            Load Image
                                        </button>
                                        <button type="button" className="btn btn-sm  btn-info text-white" onClick={handleClearImage}>
                                            Clear Image
                                        </button>
                                    </div>
                                </div>
                                <Select
                                    options={categories}
                                    placeholder="Category"
                                    name="category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.category && formik.touched.category}
                                    required
                                />
                                <textarea
                                    className="textarea textarea-bordered w-full min-h-[100px]"
                                    placeholder="Description"
                                    maxLength={200}
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    required
                                ></textarea>
                                {!!formik.errors.description && formik.touched.description &&
                                    <ErrorText text={formik.errors.description} />
                                }
                            </div>
                            <div className="flex flex-row flex-[2] gap-4">
                                <div className="flex flex-col flex-1 gap-4">

                                    <TextField
                                        placeholder="Common name"
                                        name="commonName"
                                        value={formik.values.commonName}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.commonName && formik.touched.commonName}
                                        required
                                    />
                                    <TextField
                                        placeholder="Scientific name"
                                        name="scientificName"
                                        value={formik.values.scientificName}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.scientificName && formik.touched.scientificName}
                                        required
                                    />
                                    <TextField
                                        placeholder="Kingdom"
                                        name="kingdom"
                                        value={formik.values.kingdom}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.kingdom && formik.touched.kingdom}
                                        required
                                    />
                                    <TextField
                                        placeholder="Phylum"
                                        name="phylum"
                                        value={formik.values.phylum}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.phylum && formik.touched.phylum}
                                        required
                                    />
                                    <TextField
                                        placeholder="Class"
                                        name="class"
                                        value={formik.values.class}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.class && formik.touched.class}
                                        required
                                    />
                                    <TextField
                                        placeholder="Order"
                                        name="order"
                                        value={formik.values.order}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.order && formik.touched.order}
                                        required
                                    />
                                    <TextField
                                        placeholder="Family"
                                        name="family"
                                        value={formik.values.family}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.family && formik.touched.family}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col flex-1 gap-4">
                                    <TextField
                                        placeholder="Genus"
                                        name="genus"
                                        value={formik.values.genus}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.genus && formik.touched.genus}
                                        required
                                    />
                                    <TextField
                                        placeholder="Diet"
                                        name="diet"
                                        value={formik.values.diet}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.diet && formik.touched.diet}
                                        required
                                    />
                                    <TextField
                                        placeholder="Distribution"
                                        name="distribution"
                                        value={formik.values.distribution}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.distribution && formik.touched.distribution}
                                        required
                                    />
                                    <TextField
                                        placeholder="Habitats"
                                        name="habitats"
                                        value={formik.values.habitats}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.habitats && formik.touched.habitats}
                                        required
                                    />
                                    <TextField
                                        placeholder="Conservation Status"
                                        name="conservationStatus"
                                        value={formik.values.conservationStatus}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.conservationStatus && formik.touched.conservationStatus}
                                        required
                                    />
                                    <TextField
                                        placeholder="Ecological Importance"
                                        name="ecologicalImportance"
                                        value={formik.values.ecologicalImportance}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.ecologicalImportance && formik.touched.ecologicalImportance}
                                        required
                                    />
                                    <TextField
                                        placeholder="IUCN Status"
                                        name="iucnStatus"
                                        value={formik.values.iucnStatus}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.iucnStatus && formik.touched.iucnStatus}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-row justify-end mt-10 gap-x-4">
                            <LoadingButton type="submit" isLoading={submitting} className="btn btn-md !w-48 bg-red-500" onClick={toggleModal}>
                                Cancel
                                <FaTimesCircle size={12} />
                            </LoadingButton>
                            <LoadingButton type="submit" isLoading={submitting} className="btn btn-md !w-48 btn-primary">
                                Submit
                                <FaCheckCircle size={12} />
                            </LoadingButton>
                        </div>
                    </div>
                </Form>
            </FormikProvider>
        </div>
    )
}

export default SpeciesForm;