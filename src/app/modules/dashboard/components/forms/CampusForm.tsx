import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ICampus } from "../../../../core/interfaces/common.interface";
import TextField from "../../../../core/components/textfield";
import { campusSchema } from "../../../../core/schema/campus.schema";
import LoadingButton from "../../../../core/components/loadingbutton";
import { useCampusStore } from "../../../../core/zustand/campus";

type NewCampusFormProps = {
    action: string;
    toggleModal: () => void;
}

const NewCampusForm: FC<NewCampusFormProps> = ({ toggleModal, action = 'add' }) => {


    const { createCampus, editCampus } = useCampusStore();
    const campus = useCampusStore(state => state.campus);
    const submitting = useCampusStore(state => state.processing);

    const formik = useFormik({
        initialValues: campus || {
            campus: '',
            address: '',
            longitude: '',
            latitude: '',
            zoom: 17
        },
        validationSchema: campusSchema,
        onSubmit: async (values: ICampus) => {
            try {
                if (action === 'edit') {
                    editCampus(values, toggleModal);
                } else {
                    createCampus(values, toggleModal);
                }
            } catch (error: unknown) {
                console.error(error);
            }
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
                                    placeholder="Campus"
                                    name="campus"
                                    value={formik.values.campus}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.campus && formik.touched.campus}
                                    required
                                />
                                <TextField
                                    placeholder="Address"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.address && formik.touched.address}
                                    required
                                />
                                <div className="flex flex-col">
                                    <span>Coordinates</span>
                                    <div className="flex flex-row flex-1 gap-4 mt-2">
                                        <TextField
                                            placeholder="Longitude"
                                            name="longitude"
                                            value={formik.values.longitude}
                                            onChange={formik.handleChange}
                                            error={!!formik.errors.longitude && formik.touched.longitude}
                                            required
                                        />
                                        <TextField
                                            placeholder="Latitude"
                                            name="latitude"
                                            value={formik.values.latitude}
                                            onChange={formik.handleChange}
                                            error={!!formik.errors.latitude && formik.touched.latitude}
                                            required
                                        />
                                        <TextField
                                            type="number"
                                            placeholder="Zoom Level"
                                            name="zoom"
                                            value={formik.values.zoom}
                                            onChange={formik.handleChange}
                                            error={!!formik.errors.zoom && formik.touched.zoom}
                                            required
                                        />
                                    </div>
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

export default NewCampusForm;