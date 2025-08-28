import { FC, useEffect, useState, useRef } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import LoadingButton from "../../../../core/components/loadingbutton";
import Select from "../../../../core/components/select";
import { useCampusSpeciesStore } from "../../../../core/zustand/campus-species";
import { useSpeciesStore } from "../../../../core/zustand/species";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import { batchUploadBirds, BirdsUploadData } from "../../../../core/services/birds-bulk-upload";
import { batchUploadBats, BatsUploadData } from "../../../../core/services/bats-bulk-upload";
import { batchUploadButterfly, ButterflyUploadData } from "../../../../core/services/butterfly-bulk-upload";
import { batchUploadDamselFly, DamselFlyUploadData } from "../../../../core/services/damselfly-bulk-upload";
import { batchUploadDragonFly, DragonFlyUploadData } from "../../../../core/services/dragonfly-bulk-upload";
import { batchUploadFrogs, FrogsUploadData } from "../../../../core/services/frogs-bulk-upload";
import { batchUploadTrees, TreesUploadData } from "../../../../core/services/trees-bulk-upload";
import { batchUploadMangrove, MangroveUploadData } from "../../../../core/services/mangrove-bulk-upload";
import { batchUploadMacroInverts, MacroInvertsUploadData } from "../../../../core/services/macroinverts-bulk-upload";
import { extractGoogleDriveId } from "../../../../core/helpers/string";

type BulkUploadFormProps = {
    toggleModal: () => void;
}

const BulkUploadForm: FC<BulkUploadFormProps> = ({ toggleModal }) => {

    const { getCampusSpecies } = useCampusSpeciesStore();
    const categories = useSpeciesStore(state => state.categories);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setFile(file);
    };

    const getData = async (isIncludeArchived = false) => {
        getCampusSpecies(isIncludeArchived);
    }

    useEffect(() => {
        const fetchData = async () => {
            getData();
        };
        fetchData();
    }, [])

    const handleClearFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const processExcelFile = async (file: File): Promise<unknown[][]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Get the first worksheet
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    // Convert to JSON - extract all rows
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1 // This will return all rows as arrays
                    });

                    resolve(jsonData as unknown[][]);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    };

    const validateExcelData = (data: unknown[][]): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (data.length === 0) {
            errors.push("File contains no data");
            return { isValid: false, errors };
        }

        return { isValid: true, errors: [] };
    };

    const formatRowsForUpload = (allRows: unknown[][], selectedCategory: string) => {
        console.log(selectedCategory)
        if (selectedCategory === "") {
            toast.info("Please select a category");
        }
        // Skip the header row (index 0) and process data rows
        const dataRows = allRows.slice(1);

        return dataRows
            .filter((row: unknown[]) => {
                // Only include rows that have a commonName value (index 1)
                const commonName = row[1];
                return commonName && String(commonName).trim() !== '';
            })
            .map((row: unknown[]) => {
                let formattedRow;
                if (selectedCategory.toLowerCase() === 'birds') {
                    formattedRow = {
                        gdriveid: extractGoogleDriveId(String(row[14] ?? '')),
                        category: selectedCategory,
                        commonName: row[1] || '',
                        scientificName: row[0] || '',
                        kingdom: row[2] || '',
                        phylum: row[3] || '',
                        class: row[4] || '',
                        order: row[5] || '',
                        family: row[6] || '',
                        genus: row[7] || '',
                        description: row[8] || '',
                        details: {
                            diet: row[9] || '',
                            distribution: row[10] || '',
                            habitats: row[11] || '',
                            conservationStatus: row[12] || '',
                            ecologicalImportance: row[13] || ''
                        }
                    };
                } else if (selectedCategory.toLowerCase() === 'bats') {
                    formattedRow = {
                        gdriveid: extractGoogleDriveId(String(row[15] ?? '')),
                        category: selectedCategory,
                        commonName: row[1] || '',
                        scientificName: row[0] || '',
                        kingdom: row[2] || '',
                        phylum: row[3] || '',
                        class: row[4] || '',
                        order: row[5] || '',
                        family: row[6] || '',
                        genus: row[7] || '',
                        description: row[12] || '',
                        details: {
                            diet: row[10] || '',
                            distribution: row[8] || '',
                            habitats: row[13] || '',
                            conservationStatus: row[9] || '',
                            ecologicalImportance: row[14] || '',
                            endemism: row[11] || ''
                        }
                    };
                } else if (selectedCategory.toLowerCase() === 'butterfly') {
                    formattedRow = {
                        gdriveid: extractGoogleDriveId(String(row[16] ?? '')),
                        category: selectedCategory,
                        commonName: row[1] || '',
                        scientificName: row[0] || '',
                        kingdom: row[2] || '',
                        phylum: row[3] || '',
                        class: row[4] || '',
                        order: row[5] || '',
                        family: row[6] || '',
                        genus: row[7] || '',
                        description: row[12] || '',
                        details: {
                            diet: row[10] || '',
                            distribution: row[8] || '',
                            habitats: row[13] || '',
                            conservationStatus: row[9] || '',
                            ecologicalImportance: row[14] || '',
                            endemism: row[11] || ''
                        }
                    };
                } else if (selectedCategory.toLowerCase() === 'damselfly') {
                    formattedRow = {
                        gdriveid: extractGoogleDriveId(String(row[15] ?? '')),
                        category: selectedCategory,
                        commonName: row[1] || '',
                        scientificName: row[0] || '',
                        kingdom: row[2] || '',
                        phylum: row[3] || '',
                        class: row[4] || '',
                        order: row[5] || '',
                        family: row[6] || '',
                        genus: row[7] || '',
                        description: row[12] || '',
                        details: {
                            diet: row[10] || '',
                            distribution: row[8] || '',
                            habitats: row[13] || '',
                            conservationStatus: row[9] || '',
                            ecologicalImportance: row[14] || '',
                            endemism: row[11] || ''
                        }
                    };
                } else if (selectedCategory.toLowerCase() === 'dragonfly') {
                    formattedRow = {
                        gdriveid: extractGoogleDriveId(String(row[15] ?? '')),
                        category: selectedCategory,
                        commonName: row[1] || '',
                        scientificName: row[0] || '',
                        kingdom: row[2] || '',
                        phylum: row[3] || '',
                        class: row[4] || '',
                        order: row[5] || '',
                        family: row[6] || '',
                        genus: row[7] || '',
                        description: row[12] || '',
                        details: {
                            diet: row[10] || '',
                            distribution: row[8] || '',
                            habitats: row[13] || '',
                            conservationStatus: row[9] || '',
                            ecologicalImportance: row[14] || '',
                            endemism: row[11] || ''
                        }
                    };
                } else if (selectedCategory.toLowerCase() === 'frogs') {
                    formattedRow = {
                        gdriveid: extractGoogleDriveId(String(row[15] ?? '')),
                        category: selectedCategory,
                        commonName: row[1] || '',
                        scientificName: row[0] || '',
                        kingdom: row[2] || '',
                        phylum: row[3] || '',
                        class: row[4] || '',
                        order: row[5] || '',
                        family: row[6] || '',
                        genus: row[7] || '',
                        description: row[10] || '',
                        details: {
                            diet: row[11] || '',
                            distribution: row[8] || '',
                            habitats: row[12] || '',
                            conservationStatus: row[9] || '',
                            ecologicalImportance: row[13] || ''
                        }
                    };
                } else if (selectedCategory.toLowerCase() === 'trees') {
                    formattedRow = {
                        gdriveid: extractGoogleDriveId(String(row[16] ?? '')),
                        category: selectedCategory,
                        commonName: row[0] || '',
                        scientificName: row[1] || '',
                        kingdom: row[2] || '',
                        phylum: row[3] || '',
                        class: row[4] || '',
                        order: row[5] || '',
                        family: row[6] || '',
                        genus: row[7] || '',
                        description: row[11] || '',
                        details: {
                            distribution: row[10] || '',
                            conservationStatus: row[8] || '',
                            endemism: row[9] || '',
                            economicalImportance: row[12] || ''
                        }
                    };
                } else if (selectedCategory.toLowerCase() === 'mangroves') {
                    formattedRow = {
                        gdriveid: extractGoogleDriveId(String(row[15] ?? '')),
                        category: selectedCategory,
                        commonName: row[1] || '',
                        scientificName: row[0] || '',
                        kingdom: row[2] || '',
                        phylum: row[3] || '',
                        class: row[4] || '',
                        order: row[5] || '',
                        family: row[6] || '',
                        genus: row[7] || '',
                        description: row[11] || '',
                        details: {
                            distribution: row[8] || '',
                            conservationStatus: row[9] || '',
                            endemism: row[10] || '',
                            economicalImportance: row[12] || ''
                        }
                    };
                } else if (selectedCategory.toLowerCase() === 'macro_inverts') {
                    formattedRow = {
                        gdriveid: extractGoogleDriveId(String(row[8] ?? '')),
                        category: selectedCategory,
                        commonName: 'Macro Inverts',
                        scientificName: row[0] || '',
                        kingdom: row[1] || '',
                        phylum: row[2] || '',
                        class: row[3] || '',
                        order: row[4] || '',
                        family: row[5] || '',
                        genus: row[6] || '',
                        description: row[7] || '',
                        details: {
                            // distribution: row[8] || '',
                            // conservationStatus: row[9] || '',
                            // endemism: row[10] || '',
                            // economicalImportance: row[12] || ''
                        }
                    };
                }


                return formattedRow;
            });
    };

    const handleSubmit = async () => {
        if (!selectedCategory) {
            toast.error("Please select a category");
            return;
        }

        if (!file) {
            toast.error("Please select a file");
            return;
        }

        // Check file type
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
            toast.error("Please select a valid Excel file (.xlsx, .xls) or CSV file");
            return;
        }

        try {
            setIsLoading(true);
            toast.info("Processing file...");

            // Extract all rows from Excel file
            const allRows = await processExcelFile(file);

            // Validate the data
            const validation = validateExcelData(allRows);
            if (!validation.isValid) {
                validation.errors.forEach(error => toast.error(error));
                return;
            }

            // Format rows for Supabase upload
            const formattedData = formatRowsForUpload(allRows, selectedCategory) as unknown[];
            if (formattedData.length === 0) {
                toast.warning("No valid records found to upload");
                return;
            }

            // Upload to Supabase
            toast.info(`Uploading ${formattedData.length} records...`);
            let uploadResult;
            if (selectedCategory.toLowerCase() === 'birds') {
                uploadResult = await batchUploadBirds(formattedData as BirdsUploadData[]);
            } else if (selectedCategory.toLowerCase() === 'bats') {
                uploadResult = await batchUploadBats(formattedData as BatsUploadData[]);
            } else if (selectedCategory.toLowerCase() === 'butterfly') {
                uploadResult = await batchUploadButterfly(formattedData as ButterflyUploadData[]);
            } else if (selectedCategory.toLowerCase() === 'damselfly') {
                uploadResult = await batchUploadDamselFly(formattedData as DamselFlyUploadData[]);
            } else if (selectedCategory.toLowerCase() === 'dragonfly') {
                uploadResult = await batchUploadDragonFly(formattedData as DragonFlyUploadData[]);
            } else if (selectedCategory.toLowerCase() === 'frogs') {
                uploadResult = await batchUploadFrogs(formattedData as FrogsUploadData[]);
            } else if (selectedCategory.toLowerCase() === 'trees') {
                uploadResult = await batchUploadTrees(formattedData as TreesUploadData[]);
            } else if (selectedCategory.toLowerCase() === 'mangroves') {
                uploadResult = await batchUploadMangrove(formattedData as MangroveUploadData[]);
            } else if (selectedCategory.toLowerCase() === 'macro_inverts') {
                uploadResult = await batchUploadMacroInverts(formattedData as MacroInvertsUploadData[]);
            }

            if (uploadResult?.success) {
                toast.success(`Successfully uploaded ${uploadResult.insertedCount} records to the database`);

                // Refresh data and close modal
                await getData();
                toggleModal();
            } else {
                console.error("Upload errors:", uploadResult?.errors);
            }

        } catch (error) {
            console.error("Error processing file:", error);
            toast.error("Failed to process the file. Please check the file format and try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="flex flex-1 flex-col">
                <div className="flex flex-row flex-1 gap-4">
                    <div className="flex flex-col flex-1 gap-4">
                        <Select
                            className="select-sm"
                            value={selectedCategory}
                            options={categories}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            placeholder="Category"
                            name="category"
                            required
                        />
                        <div className="flex flex-row gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                            />
                            {file &&
                                <button className="btn btn-sm btn-primary" onClick={handleClearFile}>
                                    Clear
                                </button>
                            }
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 flex-row justify-end mt-10 gap-x-4">
                    <LoadingButton type="submit" isLoading={isLoading} className="btn btn-md !w-48 bg-red-500" onClick={toggleModal}>
                        Cancel
                        <FaTimesCircle size={12} />
                    </LoadingButton>
                    <LoadingButton onClick={handleSubmit} type="submit" isLoading={isLoading} className="btn btn-md !w-48 btn-primary">
                        Submit
                        <FaCheckCircle size={12} />
                    </LoadingButton>
                </div>
            </div>
        </div>
    )
}

export default BulkUploadForm;