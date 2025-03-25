import { FC, useEffect, useState } from "react"
import { IImages, ISpecies } from "../../../../core/interfaces/common.interface"
import TextField from "../../../../core/components/textfield"
import Select from "../../../../core/components/select"
import fallbackUrl from "../../../../../assets/fallback-image.jpg"
import SliderComponent from "../../../../core/components/slider"
import { toast } from "react-toastify"
import { supabase } from "../../../../core/lib/supabase"
import LoadingButton from "../../../../core/components/loadingbutton"
import { FormikProvider, useFormik, Form } from "formik"
import { speciesImagesSchema } from "../../../../core/schema/species-images.schema"

type CapturedImagesFormProps = {
    specie?: ISpecies
}

const CapturedImagesForm: FC<CapturedImagesFormProps> = ({ specie }) => {

    const [images, setImages] = useState<IImages[]>([])
    const [processing, setProcessing] = useState<boolean>(false)

    const sourceTypeOptions = [
        { text: "Google Drive", value: "gdrive" },
        { text: "Others", value: "others" }
    ]

    const createSpecieImage = async (values: IImages) => {
        const table = 'species_images';
        try {
            setProcessing(true)
            const { error } = await supabase
                .from(table)
                .insert(values);

            if (error) {
                throw new Error(error.message)
            } else {
                toast.success("Image added successfully")
                getSpecieImages();
                formik.resetForm();
            }
        } catch (error: unknown) {
            toast.error((error as Error).message)
        } finally {
            setProcessing(false)
        }
    }

    const getSpecieImages = async () => {
        const table = 'species_images';
        try {
            const response = await supabase
                .from(table)
                .select("*, speciesData:species(*)")
                .eq("species", specie?.id)
                .order("id", { ascending: true })
                .is("deleted_at", null);

            if (response.error) {
                toast.error(response.error.message);
                return;
            }

            setImages(response.data);
        } catch (error: unknown) {
            toast.error((error as Error).message);
            return null;
        }
    }

    const deleteSpecieImage = async (values: IImages) => {
        const table = 'species_images';
        try {
            setProcessing(true)
            const { error } = await supabase
                .from(table)
                .delete()
                .eq("id", values.id)

            if (error) {
                throw new Error(error.message)
            } else {
                toast.success("Image removed successfully")
                getSpecieImages();
                formik.resetForm();
            }
        } catch (error: unknown) {
            toast.error((error as Error).message)
        } finally {
            setProcessing(false)
        }
    }

    const formik = useFormik({
        initialValues: {
            species: specie?.id,
            imageUrl: "",
            sourceType: ""
        },
        validationSchema: speciesImagesSchema,
        onSubmit: async (values) => {
            await createSpecieImage(values);
        }
    })

    useEffect(() => {
        getSpecieImages();
    }, [])

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="grid col-span-2 gap-2">
                <FormikProvider value={formik}>
                    <Form>
                        <div className="flex flex-1 flex-col gap-4">
                            <Select
                                placeholder="Select Source Type"
                                options={sourceTypeOptions}
                                name="sourceType"
                                value={formik.values.sourceType}
                                onChange={formik.handleChange}
                                error={!!formik.errors.sourceType && formik.touched.sourceType}
                                required
                            />
                            <TextField
                                value={formik.values.imageUrl}
                                onChange={formik.handleChange}
                                error={!!formik.errors.imageUrl && formik.touched.imageUrl}
                                name="imageUrl"
                                placeholder="Image URL"
                                required
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <LoadingButton isLoading={processing} type="submit" className="btn bg-blue-600 text-white w-full">
                                    Submit
                                </LoadingButton>
                                <LoadingButton isLoading={processing} type="button" className="btn btn-success text-white w-full">
                                    Preview Image
                                </LoadingButton>
                            </div>
                        </div>
                    </Form>
                </FormikProvider>
            </div>
            <div className="grid col-span-1">
                <div className="flex flex-col border-[1px] rounded-md p-2 items-center justify-center">
                    {
                        formik.values.sourceType === "gdrive" &&
                        <img
                            src={`https://drive.google.com/thumbnail?id=${formik.values.imageUrl}&sz=w1000`}
                            alt={specie?.commonName}
                            className="w-full h-full"
                            onError={(e) => e.currentTarget.src = fallbackUrl}
                        />
                    }
                    {formik.values.sourceType !== "gdrive" &&
                        <img
                            src={formik.values.imageUrl}
                            alt={specie?.commonName}
                            className="w-full h-full"
                            onError={(e) => e.currentTarget.src = fallbackUrl}
                        />
                    }
                </div>
            </div>
            <div className="grid col-span-3">
                <div className="divider"></div>
                <div className="-mt-3">
                    <SliderComponent items={images} allowEdit={true} onDelete={deleteSpecieImage} />
                </div>
            </div>
        </div>
    )
}

export default CapturedImagesForm