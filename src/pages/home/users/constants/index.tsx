import { z } from "zod";

import { formatStringDate } from "@/lib/utils";

export const usersBreadCrumb = ["Users"];

export const usersColumns = ({
  toggling,
  onToggle,
}: {
  toggling: boolean;
  onToggle: (user: OrgUser) => void;
}) => [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Email",
    accessor: "email",
    renderCell: (value: string) => (
      <span className="text-[#4D4D4D]">{value}</span>
    ),
  },
  {
    header: "Mobile",
    accessor: "mobileNumber",
    renderCell: (value?: string) => (
      <span className="text-[#4D4D4D]">{value || "-"}</span>
    ),
  },
  {
    header: "Role",
    accessor: "role",
    renderCell: (value: string) => (
      <span className="text-[#4D4D4D]">
        {value === "superAdmin" || value === "admin"
          ? "Organization Admin"
          : "Employee"}
      </span>
    ),
  },
  {
    header: "Created",
    accessor: "createdAt",
    renderCell: (value?: string) => (
      <span className="text-[#4D4D4D]">
        {value ? formatStringDate(value) : "-"}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: "isActive",
    renderCell: (_: unknown, row: OrgUser) => {
      const isSuper = row.role === "superAdmin";
      if (isSuper) {
        return (
          <span className="rounded-full bg-[#F2F2F2] px-3 py-1 text-xs font-medium text-[#4D4D4D]">
            Active
          </span>
        );
      }
      return (
        <button
          id={`toggleActive-${row._id}`}
          type="button"
          disabled={toggling}
          onClick={() => onToggle(row)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            row.isActive ? "bg-black" : "bg-gray-300"
          } ${toggling ? "opacity-60" : ""}`}
          aria-label={row.isActive ? "Deactivate user" : "Activate user"}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              row.isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      );
    },
  },
];

export const addUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required.")
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Invalid email format."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(6, { message: "Password must be at least 6 characters." })
    .max(16, { message: "Password cannot exceed 16 characters." }),
  mobileNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Mobile number must be exactly 10 digits.",
    }),
});

export const initialAddUserData = {
  name: "",
  email: "",
  password: "",
  mobileNumber: "",
};
