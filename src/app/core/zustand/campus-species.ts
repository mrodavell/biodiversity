import { create } from "zustand";
import { ICampusSpecies } from "../interfaces/common.interface";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { getTimestamp } from "../helpers/date";
import { confirmArchive, confirmRestore } from "../helpers/alerts";

const table = "campus_species";

type CampusSpecies = {
  campusSpecies: ICampusSpecies[];
  campusSpecie: ICampusSpecies | null;
  processing: boolean;
};

type CampusSpeciesActions = {
  setCampusSpecie: (campusSpecie: ICampusSpecies | null) => void;
  setCampusSpecies: (campuseSpecies: ICampusSpecies[]) => void;
  getCampusSpecies: (isIncludeArchived: boolean) => void;
  createCampusSpecie: (data: ICampusSpecies, callback?: () => void) => void;
  editCampusSpecie: (data: ICampusSpecies, callback?: () => void) => void;
  deleteCampusSpecie: (data: ICampusSpecies, callback?: () => void) => void;
  restoreCampusSpecie: (data: ICampusSpecies, callback?: () => void) => void;
  searchCampusSpecies: (search: string) => void;
};

export const useCampusSpeciesStore = create<
  CampusSpecies & CampusSpeciesActions
>((set, get) => ({
  campusSpecies: [],
  campusSpecie: null,
  processing: false,
  setCampusSpecie: (campusSpecie) => set({ campusSpecie }),
  setCampusSpecies: (campusSpecies) => set({ campusSpecies }),
  getCampusSpecies: async (isIncludeArchived = false) => {
    try {
      set({ processing: true });
      let response = null;
      if (!isIncludeArchived) {
        response = await supabase
          .from(table)
          .select("*")
          .order("campus", { ascending: true })
          .is("deleted_at", null);
      } else {
        response = await supabase.from(table).select("*");
      }

      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      get().setCampusSpecies(response.data as ICampusSpecies[]);
    } catch (error: unknown) {
      toast.error((error as Error).message);
      return null;
    } finally {
      set({ processing: false });
    }
  },
  createCampusSpecie: async (data: ICampusSpecies, callback?: () => void) => {
    try {
      set({ processing: true });
      const { error } = await supabase.from(table).insert(data);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Campus specie created successfully!");
      get().getCampusSpecies(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  editCampusSpecie: async (data: ICampusSpecies, callback?: () => void) => {
    try {
      set({ processing: true });
      const updated = { ...data, updated_at: getTimestamp() };
      const { error } = await supabase
        .from(table)
        .update([updated])
        .eq("id", data.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Campus specie updated successfully!");
      get().getCampusSpecies(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  deleteCampusSpecie: async (data: ICampusSpecies, callback?: () => void) => {
    try {
      set({ processing: true });

      const confirm = await confirmArchive(`${data.campus}`);

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

      toast.success("Campus specie deleted successfully!");
      get().getCampusSpecies(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  restoreCampusSpecie: async (data: ICampusSpecies, callback?: () => void) => {
    try {
      set({ processing: true });

      const confirm = await confirmRestore(`${data.campus}`);

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

      toast.success("Campus specie restored successfully!");
      get().getCampusSpecies(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  searchCampusSpecies: async (search: string) => {
    try {
      set({ processing: true });
      const response = await supabase
        .from(table)
        .select("*")
        .or(`campus.ilike.%${search}%,address.ilike.%${search}%`)
        .is("deleted_at", null);
      if (response.error) {
        toast.error(response.error.message);
        return;
      }
      get().setCampusSpecies(response.data as ICampusSpecies[]);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
}));
