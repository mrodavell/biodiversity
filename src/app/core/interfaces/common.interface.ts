export interface IUser {
  userid: number;
  email: string;
  isLoggedIn: boolean;
}
export interface ICampus {
  index?: number;
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
  avatar?: string;
  species?: string;
  commonName?: string;
  scientificName?: string;
  family?: string;
  description?: string;
  foodDiet?: string;
  habitats?: string;
  distribution?: string;
  iucnStatus?: string;
  ecologicalImportance?: string;
  longitude?: number;
  latitude?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
