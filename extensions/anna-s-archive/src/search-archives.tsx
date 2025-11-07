import { useCallback, useMemo, useState } from "react";

import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";

import ArchiveListItem from "@/components/ArchiveListItem";
import { TestMirrors } from "@/components/TestMirrors";
import { useArchive } from "@/hooks/use-archive";
import { isEmpty } from "@/utils";

import { useMirrorDomain } from "./hooks/use-mirror-domain";

const Command = () => {
  const { push } = useNavigation();
  const [search, setSearch] = useState("");

  const usedMirror = useMirrorDomain();

  const onErrorPrimaryAction = useCallback(() => {
    push(<TestMirrors />);
  }, [push]);

  const { data, error, isLoading } = useArchive(usedMirror.url, onErrorPrimaryAction, search);

  const listData = useMemo(() => {
    if (!data || search.length === 0) {
      return [];
    }
    return data;
  }, [data, search]);

  const emptyViewTitle = useMemo<{ title: string; description?: string }>(() => {
    if (isLoading) {
      return { title: "Loading..." };
    }
    if (listData.length === 0 && !isEmpty(search)) {
      return { title: "No Results", description: "Try a different search term" };
    }
    return { title: "Search on Anna's Archive" };
  }, [listData, isLoading, search]);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search Archives"
      onSearchTextChange={setSearch}
      throttle={true}
      filtering={false}
      isShowingDetail={listData.length > 0}
    >
      {!error && !isLoading && listData.length === 0 ? (
        <List.EmptyView
          title={emptyViewTitle.title}
          description={emptyViewTitle.description}
          icon={{ source: Icon.Book }}
          actions={
            <ActionPanel>
              <Action.Push title="Test Mirrors" target={<TestMirrors />} icon={Icon.List} />
            </ActionPanel>
          }
        />
      ) : undefined}
      {error ? (
        <List.EmptyView
          title="Error"
          description={error.message}
          icon={{ source: Icon.Book }}
          actions={
            <ActionPanel>
              <Action.Push title="Test Mirrors" target={<TestMirrors />} icon={Icon.List} />
            </ActionPanel>
          }
        />
      ) : undefined}
      {!error ? listData.map((item) => <ArchiveListItem key={item.id} item={item} />) : undefined}
    </List>
  );
};

export default Command;
