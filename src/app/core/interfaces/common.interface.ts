export interface IUser {
  userid: number;
  email: string;
  isLoggedIn: boolean;
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
}
