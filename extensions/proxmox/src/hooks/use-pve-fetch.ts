import { getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useEffect } from "react";
import { ApiResponse, FetchOptions } from "../types";
import { buildHeaders } from "../utils/headers";

type PveFetchOptions<T> = FetchOptions<T> & {
  timerInterval?: number;
};

export const usePveFetch = <T>(url: string, options?: PveFetchOptions<T>) => {
  const { timerInterval = 1000, ...rest } = options ?? {};
  const preferences = getPreferenceValues<Preferences>();
  const fetchUrl = new URL(url, preferences.serverUrl).toString();
  const fetchOptions: FetchOptions<T> = {
    ...rest,
    headers: buildHeaders(),
    mapResult(result) {
      return { data: (result as ApiResponse<T>).data };
    },
  };

  const result = useFetch<T>(fetchUrl, fetchOptions);

  useEffect(() => {
    const handle = setInterval(() => {
      result.revalidate();
    }, timerInterval);

    return () => clearInterval(handle);
  }, [result.revalidate]);

  return result;
};
