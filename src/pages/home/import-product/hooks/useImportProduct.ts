import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { changeUserImportBreadCrumb, UserDataImportSchema } from "../constants";
import { useCreateProductFromCSV } from "@/services/queries";
import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";

export const useUserDataImport = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importPending, setImportPending] = useState(false);

  const { mutateAsync: createProductFromCSV } = useCreateProductFromCSV();
  const form = useForm<z.infer<typeof UserDataImportSchema>>({
    resolver: zodResolver(UserDataImportSchema),
    defaultValues: {
      measurementType: "",
    },
  });

  const handleImport = async (value: z.infer<typeof UserDataImportSchema>) => {
    setImportPending(true);
    try {
      const data = await createProductFromCSV(value as CSVProps);

      const importedCount = data.createdProducts?.length || 0;
      const skippedCount = data.errors?.length || 0;

      toast({
        title: "CSV Import Successfully",
        description: `${importedCount} products imported, ${skippedCount} skipped.`,
        duration: 2000,
      });

      navigate(`${ROUTES.IMPORT_SUCCESS_PRODUCT}`, {
        state: {
          imported: importedCount,
          skipped: skippedCount,
          importedProducts: data.createdProducts || [],
          errorProducts: data.errors || [],
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";

      toast({
        title: "Import Failed",
        description: errorMessage,
        duration: 2000,
      });
    } finally {
      setImportPending(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setSelectedFile(null);
  };

  const handleMeasurementType = (value: string) => {
    form.setValue("measurementType", value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const isCSV =
        file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
      const isFileSizeLimit = file.size <= 1 * 1024 * 1024;

      if (!isCSV) {
        form.setError("csvFile", {
          type: "manual",
          message: "Only CSV files are allowed.",
        });

        setSelectedFile(null);
        return;
      }
      if (!isFileSizeLimit) {
        form.setError("csvFile", {
          type: "manual",
          message: "File size must be 1MB or smaller.",
        });
        setSelectedFile(null);
        return;
      }
      form.clearErrors("csvFile");
      form.setValue("csvFile", file);
      setSelectedFile(file);
      form.trigger("csvFile");
    }
  };

  return {
    form,
    handleImport,
    handleCancel,
    importPending,
    changeUserImportBreadCrumb,
    handleFileChange,
    selectedFile,
    setSelectedFile,
    handleMeasurementType,
  };
};
