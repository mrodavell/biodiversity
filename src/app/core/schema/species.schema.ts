import * as Yup from "yup";
import { SpeciesCategory } from "../enums/species";

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
  diet: Yup.string().when("category", {
    is: SpeciesCategory.BIRDS,
    then: (schema) => schema.required("Diet is required"),
  }),
  habitats: Yup.string().when("category", {
    is: SpeciesCategory.BIRDS,
    then: (schema) => schema.required("Habitats is required"),
  }),
  distribution: Yup.string().when("category", {
    is: SpeciesCategory.BIRDS,
    then: (schema) => schema.required("Distribution is required"),
  }),
  conservationStatus: Yup.string().when("category", {
    is: SpeciesCategory.BIRDS,
    then: (schema) => schema.required("Conservation status is required"),
  }),
  ecologicalImportance: Yup.string().when("category", {
    is: SpeciesCategory.BIRDS,
    then: (schema) => schema.required("Ecological importance is required"),
  }),
  endemism: Yup.string().when("category", {
    is: SpeciesCategory.TREES,
    then: (schema) => schema.required("Endemism is required"),
  }),
});
