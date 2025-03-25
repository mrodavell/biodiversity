import { ReactNode } from "react";

export interface IUser {
  userid: number;
  email: string;
  isLoggedIn: boolean;
}
export interface ICampus {
  id?: number | string;
  campus: string;
  address: string;
  longitude: number | string;
  latitude: number | string;
  zoom: number | string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ISpecies {
  id?: number | string;
  gdriveid?: string;
  avatarUrl?: string;
  category?: string;
  commonName?: string;
  scientificName?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  description?: string;
  diet?: string;
  habitats?: string;
  distribution?: string;
  iucnStatus?: string;
  conservationStatus?: string;
  ecologicalImportance?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ICampusSpecies {
  id?: number | string;
  campus: string;
  campusData?: ICampus;
  species: string;
  speciesData?: ISpecies;
  longitude: number | string;
  latitude: number | string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IActions<T> {
  name: string;
  event: (data: T, index: number) => void;
  icon: ReactNode | ReactNode[];
  color?: string;
  disabled?: boolean;
  buttonType?: "submit" | "button" | "reset";
}

export interface IImages {
  id?: number | string;
  imageUrl?: string;
  sourceType?: string;
  species?: string | number;
  speciesData?: ISpecies;
  updated_at?: string;
  deleted_at?: string;
}
