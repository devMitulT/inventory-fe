import BreadcrumbWrapper from "@/components/ui/Breadcrumb";
import { breadCrumbData } from "./constants";
import Icons from "@/assets/icons";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useProfile } from "./hooks/useProfile";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { FormField, FormItem } from "@/contexts/FormContexts";
import { InputField } from "@/components/ui/Input";
import { useRef } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const Profile = () => {
  const {
    form,
    isLoading,
    rules,
    newRule,
    setNewRule,
    isAddingRule,
    imagePreview,
    logo,
    handleImageChange,
    isConfirmOpen,
    requestRuleDelete,
    confirmRuleDelete,
    cancelRuleDelete,
    requestNewRuleDelete,
    handleRuleChange,
    handleAddRule,
    handleUpdate,
    handleClearRule,
    makedisable,
    addError,
    updatingProfile,
    profileImageError,
    setProfileImageError,
  } = useProfile();

  const skipAddOnBlur = useRef(false);

  if (isLoading) {
    return (
      <div className="mt-72 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center p-2">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-gray-500"></div>
        </div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <div className="flex items-center justify-between">
          <BreadcrumbWrapper routes={breadCrumbData} />
          <Button
            id="save"
            onClick={handleUpdate}
            disabled={updatingProfile}
            className={`mx-6 h-8 w-[128px] rounded-lg bg-[#000000] py-2 text-sm font-medium text-white hover:bg-[#000000] hover:text-white`}
          >
            {updatingProfile ? "Saving..." : "Save"}
          </Button>
        </div>

        {/* Profile Inputs */}
        <div className="mx-6 mb-6 flex flex-col gap-4 rounded-md border bg-white p-6">
          <div className="flex gap-8">
            <div className="flex h-fit w-fit flex-col">
              <div className="relative flex h-fit w-fit">
                {imagePreview ? (
                  <img
                    id="profileImage"
                    // @ts-ignore
                    src={imagePreview || logo}
                    alt="Profile"
                    className="mt-2 h-[124px] w-[124px] max-w-[140px] rounded-full border border-gray-200 object-cover"
                    onError={() => setProfileImageError(true)}
                  />
                ) : (
                  <div className="mt-2 flex h-[124px] w-[124px] flex-col items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                    <Icons.selectImages className="text-[40px] text-gray-400" />
                    <span className="text-center text-[13px] text-[#817e7e]">
                      No image
                    </span>
                  </div>
                )}
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-1 cursor-pointer rounded-full border border-[#FFFFFF] bg-[#FFFFFF] p-1 shadow-xl"
                >
                  <Icons.CameraIcon
                    width={23}
                    height={23}
                    className="text-[#000000]"
                  />
                </label>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {profileImageError && (
                <span className="mt-2 max-w-[124px] text-center text-xs font-medium text-red-500">
                  Only JPG, PNG , JPEG formats are allowed.
                </span>
              )}
            </div>
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#4D4D4D]">
                        Organization Name
                      </FormLabel>
                      <FormControl>
                        <InputField
                          id="organizationName"
                          placeholder="Organization Name"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            form.trigger("organizationName");
                          }}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#4D4D4D]">
                        Owner Name
                      </FormLabel>
                      <FormControl>
                        <InputField
                          id="ownerName"
                          placeholder="Owner Name"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            form.trigger("ownerName");
                          }}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#4D4D4D]">
                        Description
                      </FormLabel>
                      <FormControl>
                        <InputField
                          id="description"
                          className="h-12 rounded-lg border px-2 pb-5 text-sm font-medium"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#4D4D4D]">
                        Address
                      </FormLabel>
                      <FormControl>
                        <InputField
                          id="address"
                          className="h-12 rounded-lg border px-2 pb-5 text-sm font-medium"
                          placeholder="Address"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="gstNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#4D4D4D]">
                        GST Number (GSTIN)
                      </FormLabel>
                      <FormControl>
                        <InputField
                          id="gstNumber"
                          placeholder="GST Number (GSTIN)"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            form.trigger("ownerName");
                          }}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div
          className={` ${rules.length === 0 ? "h-[60vh]" : "max-h-[calc(100vh_-_390px)]"} mx-6 flex flex-col overflow-x-auto rounded-md border bg-white p-6`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-md ml-2 font-semibold text-black">
              Special Notes
            </span>
          </div>
          {/* Rule List */}
          {rules.length > 0 && (
            <ul className="space-y-3 text-sm font-medium">
              {rules.map((rule, idx) => (
                <li
                  key={idx}
                  className="group relative flex items-center gap-2 px-2"
                >
                  <div className="relative flex-1">
                    <InputField
                      id={`rule-${idx}`}
                      type="text"
                      value={rule}
                      onChange={(e) => handleRuleChange(idx, e.target.value)}
                      className={`h-8 w-full cursor-pointer rounded-md border px-2 pr-8 text-sm`}
                    />
                    {rule && (
                      <button
                        id="clear"
                        onClick={() => handleClearRule(idx)}
                        className="cross-button pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus:opacity-0"
                      >
                        <Icons.crossIcon width={20} height={20} />
                      </button>
                    )}
                  </div>
                  <button
                    id="delete"
                    onClick={() => requestRuleDelete(idx)}
                    className="absolute -right-4 top-1/2 -translate-y-1/2"
                  >
                    <Icons.deleteRule />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {/* Empty State */}
          {rules.length === 0 && !isAddingRule && (
            <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg pt-28 text-center transition">
              <Icons.ruleWrite />
              <span className="text-xs font-normal text-[#4D4D4D]">
                There is no any notes found!
              </span>
            </div>
          )}

          {/* Rule Input */}
          {isAddingRule && (
            <div className="group relative mt-4 flex items-center gap-2 px-2">
              <div className="relative flex-1">
                <InputField
                  id="rule"
                  type="text"
                  placeholder="Enter rule"
                  className={`h-8 w-full cursor-pointer rounded-md border px-3 py-1 pr-8 text-sm font-medium`}
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onBlur={() => {
                    if (!skipAddOnBlur.current && newRule.trim()) {
                      handleAddRule();
                    }
                    skipAddOnBlur.current = false; // reset after blur
                  }}
                />
                {newRule && (
                  <button
                    id="newRule"
                    onMouseDown={() => {
                      skipAddOnBlur.current = true;
                    }}
                    onClick={() => setNewRule("")}
                    className="cross-button pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100"
                  >
                    <Icons.crossIcon width={20} height={20} />
                  </button>
                )}
              </div>
              <button
                id="delete"
                onClick={() => requestNewRuleDelete()}
                className="absolute -right-4 top-1/2 -translate-y-1/2"
              >
                <Icons.deleteRule />
              </button>
            </div>
          )}

          {/* Add Rule Button */}
          <div
            className={`mx-2 mt-3 flex ${
              rules.length === 0 && !isAddingRule
                ? "justify-center"
                : "justify-between"
            }`}
          >
            <span className="mt-1.5 flex flex-col text-sm font-medium text-red-500">
              {addError}
            </span>

            <button
              id="addRule"
              onClick={handleAddRule}
              disabled={makedisable}
              className={`flex h-8 w-[142px] items-center justify-center gap-1 rounded-[8px] bg-black text-sm font-medium text-white ${
                makedisable
                  ? "cursor-not-allowed text-[#000000]"
                  : rules.length === 0 && !isAddingRule
                    ? "h-8 w-[128px] rounded-md bg-black text-white hover:bg-[#1a1a1a]"
                    : "border-white text-black"
              }`}
            >
              <Plus
                className={`h-4 w-4 rounded-full ${!rules.length ? "" : " "} `}
              />
              <span className="flex h-4 items-center text-sm font-medium">
                {rules.length === 0 ? "Add New Notes" : "Add More Notes"}
              </span>
            </button>
          </div>
        </div>
      </Form>

      {/* Confirm Dialog for Rule Deletion */}
      <ConfirmationModal
        isOpen={isConfirmOpen !== null}
        title="Confirm Notes Deletion?"
        message="Are you sure you want to delete this notes?"
        subMessage="This action cannot be undone."
        confirmButtonText="Yes, Delete"
        onConfirm={confirmRuleDelete}
        onCancel={cancelRuleDelete}
        isLoading={false}
      />
    </div>
  );
};

export default Profile;
