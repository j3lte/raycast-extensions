import { useState } from "react";
import { PveVm } from "../types";
import { usePveFetch } from "./use-pve-fetch";
import { showFailureToast } from "@raycast/utils";

function useVmListInternal() {
  const [showErrorScreen, setShowErrorScreen] = useState<boolean>(false);
  const url = "api2/json/cluster/resources";
  const search = new URLSearchParams({
    type: "vm",
  });

  const result = usePveFetch<PveVm[]>(`${url}?${search.toString()}`, {
    onError: (error) => {
      showFailureToast(error);
      setShowErrorScreen(true);
    },
  });

  return {
    ...result,
    showErrorScreen,
  };
}

export function useVmList() {
  const [type, setType] = useState<string>("all");

  const { data, ...rest } = useVmListInternal();
  const filteredData = data?.filter((vm) => (type === "all" ? true : vm.type === type)) ?? [];

  return {
    ...rest,
    data: filteredData,
    setType,
  };
}
