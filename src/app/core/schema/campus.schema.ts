import * as Yup from "yup";

export const campusSchema = Yup.object().shape({
  campus: Yup.string().required("Avatar is required"),
  address: Yup.string().required("Species is required"),
  longitude: Yup.number().required("Longitude is required"),
  latitude: Yup.number().required("Latitude is required"),
  zoom: Yup.number().required("Latitude is required"),
});
