import { useCallback, useMemo, useState } from "react";
import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { type ArchiveFilter, isArchiveFilter, useArchive } from "@/hooks/use-archive";
import { useMirrorDomain } from "@/hooks/use-mirror-domain";
import { isEmpty } from "@/utils";
import { TestMirrors } from "@/screens/TestMirrors";
import { ArchiveListItem } from "@/components/ArchiveListItem";
import { TestMirrorsAction } from "@/components/TestMirrorsAction";
import { isBotProtectionError } from "@/api/search-error";
import { FILE_TYPES } from "@/constants";
import { rankArchiveItems } from "@/utils/ranking";

const FILTER_STORAGE_KEY = "anna-s-archive-search-filter";

const Command = () => {
  const { push } = useNavigation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useCachedState<ArchiveFilter>(FILTER_STORAGE_KEY, "all");

  const usedMirror = useMirrorDomain();

  const onErrorPrimaryAction = useCallback(() => {
    push(<TestMirrors />);
  }, [push]);

  const handleFilterChange = useCallback(
    (value: string) => {
      setFilter(isArchiveFilter(value) ? value : "all");
    },
    [setFilter],
  );

  const { data, error, isLoading, searchUrl } = useArchive(usedMirror.url, onErrorPrimaryAction, search, filter);

  const listData = useMemo(() => {
    if (!data || search.length === 0) {
      return [];
    }
    return rankArchiveItems(data, search, filter);
  }, [data, filter, search]);

  const emptyViewTitle = useMemo(() => {
    if (isLoading) {
      return { title: "Loading..." };
    }
    if (listData.length === 0 && !isEmpty(search)) {
      return { title: "No Results", description: "Try a different search term" };
    }
    return { title: "Search on Anna's Archive" };
  }, [listData, isLoading, search]);

  const errorView = useMemo(() => {
    if (!error) {
      return null;
    }
    if (isBotProtectionError(error)) {
      return {
        title: "Search blocked by bot protection",
        description:
          "Anna's Archive is showing a browser check (DDoS-Guard). Test Mirrors can still look fine because it only pings the host. Open this search in your browser to continue, or paste a Cookie header from that session in extension preferences.",
      };
    }
    return {
      title: "Whoops! Something went wrong.",
      description:
        "An error occurred. The selected mirror may be down. Press Enter to test mirrors, or copy the error message and report the issue.",
    };
  }, [error]);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search Archives"
      onSearchTextChange={setSearch}
      throttle={true}
      filtering={false}
      isShowingDetail={listData.length > 0}
      searchBarAccessory={
        <List.Dropdown tooltip="File Type" value={filter} onChange={handleFilterChange}>
          <List.Dropdown.Item title="All" value="all" />
          {FILE_TYPES.map((fileType) => (
            <List.Dropdown.Item key={fileType} title={fileType.toUpperCase()} value={fileType} />
          ))}
        </List.Dropdown>
      }
    >
      {error && errorView && (
        <List.EmptyView
          title={errorView.title}
          description={errorView.description}
          icon={{ source: Icon.WifiDisabled }}
          actions={
            <ActionPanel>
              {searchUrl ? <Action.OpenInBrowser title="Open Search in Browser" url={searchUrl} /> : null}
              <TestMirrorsAction />
              <Action.CopyToClipboard
                title="Copy Error Message"
                content={`Mirror: ${usedMirror.url}\nError: ${error.message}\nStack: ${error.stack}\nSearch: ${search}\nURL: ${searchUrl ?? ""}`}
                icon={Icon.Clipboard}
              />
            </ActionPanel>
          }
        />
      )}
      {!error && !isLoading && listData.length === 0 && (
        <List.EmptyView
          title={emptyViewTitle.title}
          description={emptyViewTitle.description}
          icon={{ source: Icon.Book }}
        />
      )}
      {!error && listData.map((item) => <ArchiveListItem key={item.id} item={item} />)}
    </List>
  );
};

export default Command;
