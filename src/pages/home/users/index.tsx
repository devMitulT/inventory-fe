import { Plus } from "lucide-react";

import BreadcrumbWrapper from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { useUsers } from "./hooks/useUsers";
import AddUserModal from "./components/AddUserModal";
import { formatStringDate } from "@/lib/utils";

const Users = () => {
  const {
    users,
    isLoading,
    isAddOpen,
    handleOpenAdd,
    handleCloseAdd,
    form,
    handleCreateUser,
    creating,
    handleToggleActive,
    toggling,
    showPassword,
    togglePasswordVisibility,
    usersBreadCrumb,
  } = useUsers();

  return (
    <div>
      <div className="flex items-center justify-between">
        <BreadcrumbWrapper routes={usersBreadCrumb} />
        <Button
          id="openAddUser"
          onClick={handleOpenAdd}
          className="mx-6 h-8 rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-black hover:text-white"
        >
          <Plus className="mr-1 h-4 w-4 rounded-full border border-white" />
          Add User
        </Button>
      </div>

      <div className="mx-6 mb-6 rounded-md bg-white p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-[#4D4D4D]">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Mobile</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm">
                    Loading...
                  </td>
                </tr>
              )}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-[#7B7B7B]"
                  >
                    No users yet. Click "Add User" to create one.
                  </td>
                </tr>
              )}
              {!isLoading &&
                users.map((u) => {
                  const isSuper = u.role === "superAdmin";
                  return (
                    <tr
                      key={u._id}
                      className="border-b text-sm font-medium text-[#000000] hover:bg-[#FAFAFA]"
                    >
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3 text-[#4D4D4D]">{u.email}</td>
                      <td className="px-4 py-3 text-[#4D4D4D]">
                        {u.mobileNumber || "-"}
                      </td>
                      <td className="px-4 py-3 text-[#4D4D4D]">
                        {isSuper ? "Super Admin" : "User"}
                      </td>
                      <td className="px-4 py-3 text-[#4D4D4D]">
                        {u.createdAt ? formatStringDate(u.createdAt) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {isSuper ? (
                          <span className="rounded-full bg-[#F2F2F2] px-3 py-1 text-xs font-medium text-[#4D4D4D]">
                            Active
                          </span>
                        ) : (
                          <button
                            id={`toggleActive-${u._id}`}
                            type="button"
                            disabled={toggling}
                            onClick={() => handleToggleActive(u)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              u.isActive ? "bg-black" : "bg-gray-300"
                            } ${toggling ? "opacity-60" : ""}`}
                            aria-label={
                              u.isActive
                                ? "Deactivate user"
                                : "Activate user"
                            }
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                u.isActive ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal
        open={isAddOpen}
        onClose={handleCloseAdd}
        form={form}
        onSubmit={handleCreateUser}
        isSubmitting={creating}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />
    </div>
  );
};

export default Users;
