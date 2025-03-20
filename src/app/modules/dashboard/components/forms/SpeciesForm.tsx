import { Form, FormikProvider, useFormik } from "formik";
import { FC, useState } from "react";
import { FaMapLocation } from "react-icons/fa6";
import { LuMapPin } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { speciesSchema } from "../../../../core/schema/species.schema";
import { ISpecies } from "../../../../core/interfaces/common.interface";
import TextField from "../../../../core/components/textfield";
import ErrorText from "../../../../core/components/errortext";
import Attachments from "../../../../core/components/attachments";

type NewSpeciesFormProps = {
    toggleModal: () => void;
}

const NewSpeciesForm: FC<NewSpeciesFormProps> = ({ toggleModal }) => {

    const [files, setFiles] = useState<File[]>([]);

    const handleFiles = (newfiles: File[]) => {
        console.log(newfiles);
        const prevState = files;
        prevState.push(...newfiles);
        setFiles(prevState);
    }

    const formik = useFormik({
        initialValues: {
            avatar: '',
            species: '',
            commonName: '',
            scientificName: '',
            family: '',
            description: '',
            foodDiet: '',
            habitats: '',
            distribution: '',
            iucnStatus: '',
            ecologicalImportance: '',
            longitude: 0,
            latitude: 0,
        },
        validationSchema: speciesSchema,
        onSubmit: (values: ISpecies) => {
            console.log(values);
            toggleModal();
        }
    });

    return (
        <div>
            <FormikProvider value={formik}>
                <Form>
                    <div className="flex flex-1 flex-col">
                        <div className="flex flex-row flex-1 gap-4">
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
                                    placeholder="Family"
                                    name="family"
                                    value={formik.values.family}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.family && formik.touched.family}
                                    required
                                />
                                <TextField
                                    placeholder="Food diet"
                                    name="foodDiet"
                                    value={formik.values.foodDiet}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.foodDiet && formik.touched.foodDiet}
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
                                    placeholder="Distribution"
                                    name="distribution"
                                    value={formik.values.distribution}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.distribution && formik.touched.distribution}
                                    required
                                />
                                <TextField
                                    placeholder="IUCN Status"
                                    name="iucnStatus"
                                    value={formik.values.iucnStatus}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.iucnStatus && formik.touched.iucnStatus}
                                    required
                                />
                            </div>
                            <div className="flex flex-col flex-1 gap-2 border-[1px] p-4 rounded-md">
                                <div className="flex flex-col justify-center items-center">
                                    <img src="" alt="Avatar" width={150} height={150} className="rounded-full text-center border-2" />
                                    <input type="file" name="avatar" onChange={formik.handleChange} />
                                </div>
                                <textarea
                                    className="textarea textarea-bordered"
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
                                <div className="flex flex-col gap-4 mt-6">
                                    <div className="flex flex-1 flex-row items-center justify-center">
                                        <FaMapLocation className="text-lg mr-2" />
                                        <span>
                                            Location Coordinates
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex flex-row flex-1 gap-3 justify-between">
                                            <div className="flex flex-row flex-1 gap-2 items-center">
                                                <div className="flex flex-row items-center">
                                                    <LuMapPin className="mr-2" />
                                                    <span>Latitude</span>
                                                </div>
                                                <TextField
                                                    type="number"
                                                    placeholder="latitude"
                                                    name="latitude"
                                                    value={formik.values.latitude}
                                                    onChange={formik.handleChange}
                                                    error={!!formik.errors.latitude && formik.touched.latitude}
                                                    size="sm"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-row flex-1 gap-2 items-center">
                                                <div className="flex flex-row items-center">
                                                    <LuMapPin className="mr-2" />
                                                    <span>Longitude</span>
                                                </div>
                                                <TextField
                                                    type="number"
                                                    placeholder="Longitude"
                                                    name="longitude"
                                                    value={formik.values.longitude}
                                                    onChange={formik.handleChange}
                                                    error={!!formik.errors.longitude && formik.touched.longitude}
                                                    size="sm"
                                                    required
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col mt-4  w-full ">
                            <span>Images</span>
                            <div className="flex flex-1 justify-center border-2 p-4  w-full border-dashed border-slate-200 rounded-md">
                                <Attachments
                                    setFiles={handleFiles}
                                    files={files}
                                    maxFiles={0}
                                />
                            </div>
                        </div>
                        <div className="flex flex-1 flex-row justify-end mt-10">
                            <button type="submit" className="btn btn-md min-w-32 btn-primary">
                                Submit
                                <FaCheckCircle size={12} />
                            </button>
                        </div>
                    </div>
                </Form>
            </FormikProvider>
        </div>
    )
}

export default NewSpeciesForm;