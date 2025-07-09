// Component
import { Form, FormLabel, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";

import BreadcrumbWrapper from "@/components/ui/Breadcrumb";

// Utils
import { FormField, FormItem } from "@/contexts/FormContexts";
import { formatFileSize } from "@/lib/utils";
import { useUserDataImport } from "./hooks/useImportProduct";
import Icons from "@/assets/icons";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import CircularProgressLoader from "@/components/ui/Spinner";
import { measurementType } from "./constants";

const UserDataImport = () => {
  const {
    form,
    handleImport,
    handleCancel,
    importPending,
    changeUserImportBreadCrumb,
    handleFileChange,
    selectedFile,
    setSelectedFile,
  } = useUserDataImport();

  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbWrapper routes={changeUserImportBreadCrumb} />
      <Form {...form}>
        <div className="flex flex-col items-center justify-center pt-4">
          <div className="flex w-[465px] flex-col gap-4 rounded-lg bg-white p-4">
            <div className="flex flex-col justify-center">
              <form
                onSubmit={form.handleSubmit(handleImport)}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <FormField
                    control={form.control}
                    name="measurementType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Measurement Type</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger
                            id="category"
                            className="mt-0.5 h-8 w-full rounded-md border px-2 font-medium"
                          >
                            <SelectValue placeholder="Select Measurement Type" />
                          </SelectTrigger>

                          <SelectContent className="bg-slate-200">
                            <SelectGroup>
                              {measurementType.map(
                                (category: string, index: number) => (
                                  <SelectItem
                                    key={index}
                                    value={category}
                                    className="hover:cursor-pointer"
                                  >
                                    {category}
                                  </SelectItem>
                                )
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="csvFile"
                  render={() => (
                    <FormItem className="gap-4">
                      <div className="flex justify-between">
                        <FormLabel>Import Product CSV</FormLabel>
                        <Button type="button" variant="outline" asChild>
                          <a
                            href="/sample_CsvFile.csv"
                            className="mt-1 text-xs font-medium text-[#1071D8]"
                            download
                          >
                            Download Sample CSV
                          </a>
                        </Button>
                      </div>
                      <div
                        id="importCSV"
                        className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dotted border-[#E6E6E6] py-5 text-center transition"
                      >
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          className="hidden"
                          id="csvInput"
                        />
                        <label
                          htmlFor="csvInput"
                          className="flex cursor-pointer flex-col items-center justify-center"
                        >
                          <Icons.importCSV />
                          <span className="pt-3 text-xs font-normal text-[#000000]">
                            Select a CSV file to import
                            <br />
                            <span className="text-xs font-normal text-[#B3B3B3]">
                              or drag and drop it here <br />
                              (Max: 1MB)
                            </span>
                          </span>
                        </label>
                      </div>

                      {/*Show file name if selected */}
                      {selectedFile && (
                        <div
                          id="selectFile"
                          className="flex w-full flex-row items-start justify-between border-b p-1"
                        >
                          <div className="flex flex-row items-start gap-1">
                            <Icons.csvFileSelect />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-normal text-[#000000]">
                                {selectedFile.name}
                              </span>
                              <span className="text-xs text-[#999999]">
                                {formatFileSize(selectedFile.size)}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              const input = document.getElementById(
                                "csvInput"
                              ) as HTMLInputElement;
                              if (input) input.value = "";
                              //@ts-ignore
                              form.setValue("csvFile", null);
                              form.trigger("csvFile");
                            }}
                            className="mt-2"
                          >
                            <Icons.csvFileCross />
                          </button>
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pb-3">
                  <Button
                    type="button"
                    id="discard"
                    variant="outline"
                    onClick={handleCancel}
                    className="w-[128px] border border-black"
                  >
                    Discard
                  </Button>
                  <Button
                    type="submit"
                    id="importFile"
                    disabled={Boolean(importPending)}
                    className="w-[128px] bg-black text-white hover:bg-black"
                  >
                    {importPending ? (
                      <CircularProgressLoader size={20} />
                    ) : (
                      "Import"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserDataImport;
