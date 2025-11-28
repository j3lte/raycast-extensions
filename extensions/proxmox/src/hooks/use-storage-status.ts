import { useState } from "react";
import { PveStorageStatus, WithShowErrorScreen } from "../types";
import { usePveFetch, type PveFetchResult } from "./use-pve-fetch";
import { showFailureToast } from "@raycast/utils";

export const useStorageStatus = (node: string, id: string): WithShowErrorScreen<PveFetchResult<PveStorageStatus>> => {
  const [showErrorScreen, setShowErrorScreen] = useState<boolean>(false);

  const result = usePveFetch<PveStorageStatus>(`api2/json/nodes/${node}/storage/${id}/status`, {
    onError: (error) => {
      showFailureToast(error);
      setShowErrorScreen(true);
    },
    timerInterval: 5000,
  });

  return {
    ...result,
    showErrorScreen,
  };
};
