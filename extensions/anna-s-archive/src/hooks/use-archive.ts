import { useMemo } from "react";

import { showFailureToast, useFetch } from "@raycast/utils";

import type { ArchiveItem } from "@/api/archive";
import { parseArchivePage } from "@/api/archive/index";

export const useArchive = (baseURL: string, onErrorPrimaryAction?: () => void, queryText?: string) => {
  const url = useMemo(() => {
    if (queryText && queryText.length > 0) {
      return `${baseURL}/search?q=${encodeURIComponent(queryText)}`;
    }
    return null;
  }, [baseURL, queryText]);

  const {
    data: list,
    error,
    isLoading,
    revalidate,
  } = useFetch<ArchiveItem[]>(url!, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
    },
    execute: url !== null,
    parseResponse: async (response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No results found : ${response.statusText}`);
        }
        if (response.status === 500) {
          throw new Error(`Internal server error : ${response.statusText}`);
        }
        if (response.status === 502) {
          throw new Error(`Bad gateway : ${response.statusText}`);
        }
        if (response.status === 503) {
          throw new Error(`Service unavailable : ${response.statusText}`);
        }
        throw new Error(`Network response was not ok : ${response.statusText}`);
      }
      const text = await response.text();
      return parseArchivePage(text);
    },
    onError: (error) => {
      showFailureToast(error, {
        title: "Failed to fetch data",
        primaryAction: onErrorPrimaryAction
          ? { title: "Test Mirrors", onAction: () => onErrorPrimaryAction() }
          : undefined,
      });
    },
  });

  return {
    data: list,
    isLoading,
    error,
    revalidate,
  };
};
