import { ReactNode } from "react";
import { FieldPath, FieldValues } from "react-hook-form";

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export type FormItemContextValue = {
  id: string;
};

// user context
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserContextType {
  userInfo: User | null;
  setUserInfo: (user: User) => void;
  userProfileData: OrganizationInfo | null;
  setUserProfileData: (organizationInfo: OrganizationInfo) => void;
}

export interface UserProviderProps {
  children: ReactNode;
}
