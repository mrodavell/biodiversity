import * as Yup from "yup";

export const speciesSchema = Yup.object().shape({
  avatar: Yup.string().required("Avatar is required"),
  species: Yup.string().required("Species is required"),
  commonName: Yup.string().required("Common name is required"),
  scientificName: Yup.string().required("Scientific name is required"),
  family: Yup.string().required("Family is required"),
  description: Yup.string().required("Description is required"),
  foodDiet: Yup.string().required("Food diet is required"),
  habitats: Yup.string().required("Habitats is required"),
  distribution: Yup.string().required("Distribution is required"),
  iucnStatus: Yup.string().required("IUCN status is required"),
  ecologicalImportance: Yup.string().required(
    "Ecological importance is required"
  ),
  longitude: Yup.number().required("Longitude is required"),
  latitude: Yup.number().required("Latitude is required"),
});
