import { create } from "zustand";
import { ISpecies } from "../interfaces/common.interface";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { getTimestamp } from "../helpers/date";
import { confirmArchive, confirmRestore } from "../helpers/alerts";

const table = "species";

type Species = {
  category: string;
  categories: { value: string; text: string }[];
  speciesByCategory: { value: string; text: string }[];
  species: ISpecies[];
  specie: ISpecies | null;
  processing: boolean;
};

type SpeciesActions = {
  setSpecie: (specie: ISpecies | null) => void;
  setSpecies: (species: ISpecies[]) => void;
  setCategory: (category: string) => void;
  getSpecies: (isIncludeArchived: boolean) => void;
  getSpecie: (id: string) => void;
  createSpecie: (data: ISpecies, callback?: () => void) => void;
  editSpecie: (data: ISpecies, callback?: () => void) => void;
  deleteSpecie: (data: ISpecies, callback?: () => void) => void;
  restoreSpecie: (data: ISpecies, callback?: () => void) => void;
  searchSpecies: (search: string) => void;
  getSpeciesByCategory: (category: string) => void;
  searchSpeciesByCategory: (category: string, keyword: string) => void;
  filterSpeciesByCategory: (category: string) => void;
};

export const useSpeciesStore = create<Species & SpeciesActions>((set, get) => ({
  category: "",
  categories: [
    { value: "Birds", text: "Birds" },
    { value: "Bats", text: "Bats" },
    { value: "Butterfly", text: "Butterfly" },
    { value: "Damselfly", text: "Damselfly" },
    { value: "Dragonfly", text: "Dragonfly" },
    { value: "Frogs", text: "Frogs" },
    { value: "Trees", text: "Trees" },
    { value: "Mangroves", text: "Mangroves" },
    { value: "Macro_Inverts", text: "Macro Inverts" },
  ],
  speciesByCategory: [],
  species: [],
  specie: null,
  processing: false,
  setSpecie: (specie) => set({ specie }),
  setSpecies: (species) => set({ species }),
  setCategory: (category) => set({ category }),
  getSpecies: async (isIncludeArchived = false) => {
    try {
      set({ processing: true });
      let response = null;
      if (!isIncludeArchived) {
        response = await supabase
          .from(table)
          .select("*")
          .order("id")
          .is("deleted_at", null);
      } else {
        response = await supabase.from(table).select("*");
      }

      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      get().setSpecies(response.data as ISpecies[]);
    } catch (error: unknown) {
      toast.error((error as Error).message);
      return null;
    } finally {
      set({ processing: false });
    }
  },
  getSpecie: async (id: string) => {
    try {
      set({ processing: true });
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
      set({ specie: data[0] as ISpecies });
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  createSpecie: async (data: ISpecies, callback?: () => void) => {
    try {
      set({ processing: true });
      const { error } = await supabase.from(table).insert(data);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Specie created successfully!");
      if (get().category && get().category !== "") {
        get().filterSpeciesByCategory(get().category);
      } else {
        get().setCategory("");
        get().getSpecies(false);
      }
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  editSpecie: async (data: ISpecies, callback?: () => void) => {
    try {
      set({ processing: true });
      const { error } = await supabase
        .from(table)
        .update(data)
        .eq("id", data.id);
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Specie updated successfully!");
      if (get().category && get().category !== "") {
        get().filterSpeciesByCategory(get().category);
      } else {
        get().setCategory("");
        get().getSpecies(false);
      }

      if (callback) {
        callback();
      }
      return true;
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  deleteSpecie: async (data: ISpecies, callback?: () => void) => {
    try {
      const confirm = await confirmArchive(`${data.commonName} Specie`);

      if (!confirm.isConfirmed) {
        return;
      }

      const { error } = await supabase
        .from(table)
        .update({ deleted_at: getTimestamp() })
        .eq("id", data.id);
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Specie deleted successfully!");
      get().getSpecies(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error(error as string);
    }
  },
  restoreSpecie: async (data: ISpecies, callback?: () => void) => {
    try {
      const confirm = await confirmRestore(`${data.commonName} Specie`);

      if (!confirm.isConfirmed) {
        return;
      }

      const { error } = await supabase
        .from(table)
        .update({ deleted_at: null })
        .eq("id", data.id);
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Specie restored successfully!");
      get().getSpecies(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error(error as string);
    }
  },
  searchSpecies: async (search: string) => {
    try {
      set({ processing: true });
      const response = await supabase
        .from(table)
        .select("*")
        .or(
          `commonName.ilike.%${search}%,scientificName.ilike.%${search}%,kingdom.ilike.%${search}%`
        )
        .is("deleted_at", null);
      if (response.error) {
        toast.error(response.error.message);
        return;
      }
      get().setSpecies(response.data as ISpecies[]);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  getSpeciesByCategory: async (category: string) => {
    try {
      set({ processing: true });
      const response = await supabase
        .from(table)
        .select("*")
        .eq("category", category)
        .order("id", { ascending: false })
        .is("deleted_at", null);
      if (response.error) {
        toast.error(response.error.message);
        return;
      }
      // get().setSpecies(response.data as ISpecies[]);
      const formatted = response.data.map((specie) => {
        return {
          value: specie.id,
          text: specie.commonName,
        };
      });
      set({ speciesByCategory: formatted });
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  searchSpeciesByCategory: async (category: string, keyword: string) => {
    try {
      set({ processing: true });
      const response = await supabase
        .from(table)
        .select("*")
        .eq("category", category)
        .or(
          `commonName.ilike.%${keyword}%,scientificName.ilike.%${keyword}%,kingdom.ilike.%${keyword}%`
        )
        .is("deleted_at", null);
      if (response.error) {
        toast.error(response.error.message);
        return;
      }
      // get().setSpecies(response.data as ISpecies[]);
      const formatted = response.data.map((specie) => {
        return {
          value: specie.id,
          text: specie.commonName,
        };
      });
      set({ speciesByCategory: formatted });
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  filterSpeciesByCategory: async (category: string) => {
    try {
      set({ processing: true });
      const response = await supabase
        .from(table)
        .select("*")
        .eq("category", category)
        .order("id")
        .is("deleted_at", null);
      if (response.error) {
        toast.error(response.error.message);
        return;
      }
      get().setSpecies(response.data as ISpecies[]);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
}));
