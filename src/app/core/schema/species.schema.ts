import * as Yup from "yup";

export const speciesSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  commonName: Yup.string().required("Common name is required"),
  scientificName: Yup.string().required("Scientific name is required"),
  kingdom: Yup.string().required("Kingdom is required"),
  phylum: Yup.string().required("Phylum is required"),
  class: Yup.string().required("Class is required"),
  order: Yup.string().required("Order is required"),
  family: Yup.string().required("Family is required"),
  genus: Yup.string().required("Genus is required"),
  description: Yup.string().required("Description is required"),
  diet: Yup.string().required("Diet is required"),
  habitats: Yup.string().required("Habitats is required"),
  distribution: Yup.string().required("Distribution is required"),
  ecologicalImportance: Yup.string().required(
    "Ecological importance is required"
  ),
  conservationStatus: Yup.string().required("Conservation status is required"),
});
