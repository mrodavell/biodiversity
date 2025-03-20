import { create } from "zustand";
import { ICampus } from "../interfaces/common.interface";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";

type SystemState = {
  campuses: ICampus[];
  campus: ICampus | null;
  fetchingCampuses: boolean;
};

type SystemActions = {
  setCampus: (campus: ICampus | null) => void;
  setCampuses: (campuses: ICampus[]) => void;
  getCampuses: (isIncludeArchived: boolean) => void;
};

export const useSystemStore = create<SystemState & SystemActions>(
  (set, get) => ({
    campuses: [],
    campus: null,
    fetchingCampuses: false,
    setCampus: (campus) => set({ campus }),
    setCampuses: (campuses) => set({ campuses }),
    getCampuses: async (isIncludeArchived = false) => {
      try {
        set({ fetchingCampuses: true });
        let response = null;
        if (!isIncludeArchived) {
          response = await supabase
            .from("campus")
            .select("*")
            .order("campus", { ascending: true })
            .is("deleted_at", null);
        } else {
          response = await supabase.from("campus").select("*");
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
        set({ fetchingCampuses: false });
      }
    },
  })
);
