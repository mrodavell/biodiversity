import * as Yup from "yup";

export const campusSchema = Yup.object().shape({
  campus: Yup.string().required("Campus is required"),
  address: Yup.string().required("Address is required"),
  longitude: Yup.number().required("Longitude is required"),
  latitude: Yup.number().required("Latitude is required"),
  zoom: Yup.number().required("Latitude is required"),
});
