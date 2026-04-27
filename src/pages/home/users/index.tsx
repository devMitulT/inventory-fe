import { Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import CustomTable from "@/components/ui/Table";
import { useUsers } from "./hooks/useUsers";
import AddUserModal from "./components/AddUserModal";
import { usersColumns } from "./constants";

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
  } = useUsers();

  const columns = usersColumns({
    toggling,
    onToggle: handleToggleActive,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between px-6 pb-2 pt-6">
        <h1 id="Employee" className="pb-3 font-semibold text-[#000000]">
          Employee
        </h1>
        <div className="flex flex-wrap gap-4">
          <Button
            id="openAddEmployee"
            onClick={handleOpenAdd}
              className="h-8 rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-black hover:text-white"
          >
          + Add Employee
          </Button>
        </div>
      </div>

      <div className="mx-6 flex flex-col gap-4">
        <CustomTable
          columns={columns}
          data={users}
          isLoading={isLoading}
        />
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
