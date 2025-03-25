import * as Yup from "yup";

export const speciesImagesSchema = Yup.object().shape({
  imageUrl: Yup.string().required("Image URl is required"),
  sourceType: Yup.string().required("Source type is required"),
  species: Yup.string().required("Species is required"),
});
