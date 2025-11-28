import { ActionPanel, List, Action, Icon } from "@raycast/api";
import { getStorageStatusIcon } from "./utils/ui";
import { useStorageList } from "./hooks/use-storage-list";
import { StorageDetail } from "./components/StorageDetail";
import { ErrorGuard } from "./components/ErrorGuard";

const Command = () => {
  const { isLoading, data, revalidate, showErrorScreen } = useStorageList();

  return (
    <ErrorGuard showErrorScreen={showErrorScreen}>
      <List
        isLoading={isLoading}
        isShowingDetail
        actions={
          <ActionPanel>
            <Action
              title="Refresh"
              icon={Icon.ArrowClockwise}
              shortcut={{ modifiers: ["cmd"], key: "r" }}
              onAction={revalidate}
            />
          </ActionPanel>
        }
      >
        {data.map((storage) => (
          <List.Item
            key={storage.id}
            title={storage.storage}
            icon={{ ...getStorageStatusIcon(storage.status), tooltip: storage.status }}
            accessories={[{ text: storage.maxdiskParsed, tooltip: `Max disk: ${storage.maxdiskParsed}` }]}
            keywords={storage.contentTypes}
            detail={<StorageDetail storage={storage} />}
          />
        ))}
      </List>
    </ErrorGuard>
  );
};

export default Command;
