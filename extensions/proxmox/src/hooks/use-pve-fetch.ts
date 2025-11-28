import { getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useEffect } from "react";
import { ApiResponse, FetchOptions } from "../types";
import { buildHeaders } from "../utils/headers";

export function usePveFetch<T>(url: string, options?: FetchOptions<T>) {
  const preferences = getPreferenceValues<Preferences>();
  const fetchUrl = new URL(url, preferences.serverUrl).toString();
  const fetchOptions: FetchOptions<T> = {
    ...options,
    headers: buildHeaders(),
    mapResult(result) {
      return { data: (result as ApiResponse<T>).data };
    },
  };

  const result = useFetch<T>(fetchUrl, fetchOptions);

  useEffect(() => {
    const handle = setInterval(() => {
      result.revalidate();
    }, 1000);

    return () => clearInterval(handle);
  }, [result.revalidate]);

  return result;
}
