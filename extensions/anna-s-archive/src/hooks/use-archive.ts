import { useMemo } from "react";
import { getPreferenceValues, open } from "@raycast/api";
import { showFailureToast, useFetch } from "@raycast/utils";
import { type ArchiveItem, parseArchivePage } from "@/api";
import {
  errorMessageForSearchResponse,
  isBotProtectionError,
  isBotProtectionPage,
  logSearchFailure,
} from "@/api/search-error";
import { FILE_TYPES, type FileType, USER_AGENT } from "@/constants";

export type ArchiveFilter = "all" | FileType;

export const isArchiveFilter = (value: string): value is ArchiveFilter =>
  value === "all" || FILE_TYPES.includes(value as FileType);

export const useArchive = (
  baseURL: string,
  onErrorPrimaryAction: () => void,
  queryText?: string,
  filter: ArchiveFilter = "all",
) => {
  const url = useMemo(() => {
    if (queryText && queryText.length > 0) {
      const params = new URLSearchParams({ q: queryText });
      if (filter !== "all") {
        params.set("ext", filter);
      }
      return `${baseURL}/search?${params.toString()}`;
    }
    return null;
  }, [baseURL, filter, queryText]);

  const browserCookies = getPreferenceValues<Preferences>().browserCookies?.trim() ?? "";

  const {
    data: list,
    error,
    isLoading,
    revalidate,
  } = useFetch<ArchiveItem[]>(url ?? "", {
    headers: {
      "User-Agent": USER_AGENT,
      ...(browserCookies ? { Cookie: browserCookies } : {}),
    },
    execute: url !== null,
    parseResponse: async (response) => {
      const text = await response.text();
      if (!response.ok || isBotProtectionPage(response, text)) {
        logSearchFailure(response, text);
        throw new Error(errorMessageForSearchResponse(response, text));
      }
      return parseArchivePage(text);
    },
    onError: (error) => {
      console.error("[anna-s-archive] search error", error);
      const botProtection = isBotProtectionError(error);
      showFailureToast(error, {
        title: botProtection ? "Search blocked by bot protection" : "Failed to fetch data",
        primaryAction:
          botProtection && url
            ? { title: "Open in Browser", onAction: () => open(url) }
            : onErrorPrimaryAction
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
    searchUrl: url,
  };
};
