import * as Yup from "yup";

export const campusSpeciesSchema = Yup.object().shape({
  campus: Yup.string().required("Campus is required"),
  species: Yup.string().required("Species is required"),
  longitude: Yup.number().required("Longitude is required"),
  latitude: Yup.number().required("Latitude is required"),
  zoom: Yup.number().required("Latitude is required"),
});
