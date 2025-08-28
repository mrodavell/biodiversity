import { supabase } from "../lib/supabase"; // Adjust path to your supabase config

export interface MangroveUploadData {
  gdriveid: string | null;
  category: string;
  commonName: string;
  scientificName: string;
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  description: string;
  details: {
    endemism: string;
    distribution: string;
    conservationStatus: string;
    economicalImportance: string;
  };
}

export interface BulkUploadResult {
  success: boolean;
  insertedCount: number;
  errors: string[];
  data?: unknown[];
}

export const bulkUploadMangrove = async (
  speciesData: MangroveUploadData[]
): Promise<BulkUploadResult> => {
  try {
    // Validate input
    if (!speciesData || speciesData.length === 0) {
      return {
        success: false,
        insertedCount: 0,
        errors: ["No data provided for upload"],
      };
    }

    // Transform data for database insertion
    const transformedData = speciesData.map((species) => ({
      gdriveid: species.gdriveid,
      category: species.category,
      commonName: species.commonName,
      scientificName: species.scientificName,
      kingdom: species.kingdom,
      phylum: species.phylum,
      class: species.class,
      order: species.order,
      family: species.family,
      genus: species.genus,
      description: species.description,
      details: {
        endemism: species.details.endemism,
        distribution: species.details.distribution,
        conservationStatus: species.details.conservationStatus,
        economicalImportance: species.details.economicalImportance,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Perform bulk insert
    const { data, error } = await supabase
      .from("species") // Replace with your actual table name
      .insert(transformedData)
      .select();

    if (error) {
      console.error("Supabase bulk upload error:", error);
      return {
        success: false,
        insertedCount: 0,
        errors: [error.message],
      };
    }

    return {
      success: true,
      insertedCount: data?.length || 0,
      errors: [],
      data: data,
    };
  } catch (error) {
    console.error("Bulk upload exception:", error);
    return {
      success: false,
      insertedCount: 0,
      errors: [
        error instanceof Error ? error.message : "Unknown error occurred",
      ],
    };
  }
};

// Batch upload function for large datasets
export const batchUploadMangrove = async (
  speciesData: MangroveUploadData[],
  batchSize: number = 1000
): Promise<BulkUploadResult> => {
  try {
    const results: BulkUploadResult[] = [];
    const batches = [];

    // Split data into batches
    for (let i = 0; i < speciesData.length; i += batchSize) {
      batches.push(speciesData.slice(i, i + batchSize));
    }

    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(
        `Processing batch ${i + 1}/${batches.length} (${batch.length} records)`
      );

      const result = await bulkUploadMangrove(batch);
      results.push(result);

      // Add small delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Combine results
    const totalInserted = results.reduce(
      (sum, result) => sum + result.insertedCount,
      0
    );
    const allErrors = results.flatMap((result) => result.errors);
    const overallSuccess = allErrors.length === 0;

    return {
      success: overallSuccess,
      insertedCount: totalInserted,
      errors: allErrors,
    };
  } catch (error) {
    console.error("Batch upload exception:", error);
    return {
      success: false,
      insertedCount: 0,
      errors: [
        error instanceof Error ? error.message : "Unknown error occurred",
      ],
    };
  }
};
