import { z } from "zod";

export const changeUserImportBreadCrumb = ["Products", "Import Products"];

export const UserDataImportSchema = z.object({
  measurementType: z.string().min(1, "Measurement Type is required."),
  csvFile: z
    .instanceof(File, { message: "CSV File is required." })
    .refine((file) => !file || file.name.endsWith(".csv"), {
      message: "Only CSV files are allowed.",
    }),
});

export const measurementType = ["meter", "piece", "liter"];
