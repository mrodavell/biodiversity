import { create } from "zustand";
import { ICampus } from "../interfaces/common.interface";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { getTimestamp } from "../helpers/date";
import { confirmArchive, confirmRestore } from "../helpers/alerts";

const table = "campus";

type Campus = {
  campuses: ICampus[];
  campus: ICampus | null;
  processing: boolean;
};

type CampusActions = {
  setCampus: (campus: ICampus | null) => void;
  setCampuses: (campuses: ICampus[]) => void;
  getCampuses: (isIncludeArchived: boolean) => void;
  createCampus: (data: ICampus, callback?: () => void) => void;
  editCampus: (data: ICampus, callback?: () => void) => void;
  deleteCampus: (data: ICampus, callback?: () => void) => void;
  restoreCampus: (data: ICampus, callback?: () => void) => void;
  searchCampuses: (search: string) => void;
};

export const useCampusStore = create<Campus & CampusActions>((set, get) => ({
  campuses: [],
  campus: null,
  processing: false,
  setCampus: (campus) => set({ campus }),
  setCampuses: (campuses) => set({ campuses }),
  getCampuses: async (isIncludeArchived = false) => {
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

      get().setCampuses(response.data as ICampus[]);
    } catch (error: unknown) {
      toast.error((error as Error).message);
      return null;
    } finally {
      set({ processing: false });
    }
  },
  createCampus: async (data: ICampus, callback?: () => void) => {
    try {
      set({ processing: true });
      const { error } = await supabase.from(table).insert(data);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Campus created successfully!");
      get().getCampuses(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  editCampus: async (data: ICampus, callback?: () => void) => {
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

      toast.success("Campus updated successfully!");
      get().getCampuses(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  deleteCampus: async (data: ICampus, callback?: () => void) => {
    try {
      set({ processing: true });

      const confirm = await confirmArchive(`${data.campus} Campus`);

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

      toast.success("Campus deleted successfully!");
      get().getCampuses(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  restoreCampus: async (data: ICampus, callback?: () => void) => {
    try {
      set({ processing: true });

      const confirm = await confirmRestore(`${data.campus} Campus`);

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

      toast.success("Campus restored successfully!");
      get().getCampuses(false);
      if (callback) {
        callback();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
  searchCampuses: async (search: string) => {
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
      get().setCampuses(response.data as ICampus[]);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      set({ processing: false });
    }
  },
}));
