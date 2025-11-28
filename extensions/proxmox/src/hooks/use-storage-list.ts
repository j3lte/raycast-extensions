import { useState } from "react";
import { PveStorage, PveStorageParsed } from "../types";
import { usePveFetch } from "./use-pve-fetch";
import { showFailureToast } from "@raycast/utils";
import { filesize } from "filesize";

export const useStorageList = () => {
  const [showErrorScreen, setShowErrorScreen] = useState<boolean>(false);
  const url = "api2/json/cluster/resources";
  const search = new URLSearchParams({
    type: "storage",
  });

  const { data, ...rest } = usePveFetch<PveStorage[]>(`${url}?${search.toString()}`, {
    onError: (error) => {
      showFailureToast(error);
      setShowErrorScreen(true);
    },
    timerInterval: 5000,
  });

  const parsedData: PveStorageParsed[] =
    data?.map((storage) => ({
      ...storage,
      contentTypes: storage.content
        .split(",")
        .map((type) => type.trim())
        .filter((type) => type !== "")
        .sort((a, b) => a.localeCompare(b)),
      sharedParsed: storage.shared === 0 ? false : storage.shared === 1 ? true : null,
      maxdiskParsed: filesize(storage.maxdisk),
    })) ?? [];

  return {
    ...rest,
    data: parsedData.sort((a, b) => a.storage.localeCompare(b.storage)) ?? [],
    showErrorScreen,
  };
};
