import { useState } from "react";
import { PveStorageParsed, WithShowErrorScreen } from "../types";
import { usePveFetch, PveFetchWithDataResult } from "./use-pve-fetch";
import { showFailureToast } from "@raycast/utils";
import { filesize } from "filesize";

export const useStorageList = (mock = false): WithShowErrorScreen<PveFetchWithDataResult<PveStorageParsed[]>> => {
  const [showErrorScreen, setShowErrorScreen] = useState<boolean>(false);
  const url = "api2/json/cluster/resources";
  const search = new URLSearchParams({
    type: "storage",
  });

  const { data, ...rest } = usePveFetch<PveStorageParsed[]>(`${url}?${search.toString()}`, {
    execute: !mock,
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
      maxdiskParsed: filesize(storage.maxdisk),
    })) ?? [];

  return {
    ...rest,
    data: parsedData.sort((a, b) => a.storage.localeCompare(b.storage)) ?? [],
    showErrorScreen,
  };
};
