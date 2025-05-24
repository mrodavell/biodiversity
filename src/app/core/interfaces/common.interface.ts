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

export interface ISpecies<T = void> {
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
  details?: T;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ICampusSpecies<T = void> {
  id?: number | string;
  campus: string;
  campusData?: ICampus;
  species: string;
  speciesData?: ISpecies<T>;
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

export interface IImages<T = void> {
  id?: number | string;
  imageUrl?: string;
  sourceType?: string;
  species?: string | number;
  speciesData?: ISpecies<T>;
  updated_at?: string;
  deleted_at?: string;
}
