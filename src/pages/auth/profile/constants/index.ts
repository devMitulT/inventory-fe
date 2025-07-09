import { z } from "zod";

export const breadCrumbData = ["Home", "Organization Details"];

export const profileFormSchema = z.object({
  ownerName: z.string().nonempty("Owner Name is required."),
  organizationName: z.string().nonempty("Organization Name is required."),
  description: z.string().nonempty("Description is required."),
  address: z.string().nonempty("Address is required."),
  gstNumber: z
    .string()
    .nonempty("GST number is required.")
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number format. Example: 27ABCDE1234F1Z5"
    ),
});
