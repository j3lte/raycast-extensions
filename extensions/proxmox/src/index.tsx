import { ActionPanel, List, Action, Icon, Detail, openExtensionPreferences } from "@raycast/api";
import { useVmList } from "./hooks/use-vm-list";
import { VmDetail } from "./components/VmDetail";
import { getStatusIcon } from "./utils/ui";
import { VmActionPanel } from "./components/VmActionPanel";
import { VmTypeDropdown } from "./components/VmTypeDropdown";

export default function Command() {
  const { isLoading, data, revalidate, mutate, setType, showErrorScreen } = useVmList();

  if (showErrorScreen) {
    return (
      <Detail
        markdown="Something went wrong, check your preferences."
        actions={
          <ActionPanel>
            <Action icon={Icon.Gear} title="Open Extension Preferences" onAction={openExtensionPreferences} />
          </ActionPanel>
        }
      />
    );
  }

  return (
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
      searchBarAccessory={<VmTypeDropdown onChange={setType} />}
    >
      {data.map((vm) => (
        <List.Item
          key={vm.id}
          icon={{ ...getStatusIcon(vm.status), tooltip: vm.status }}
          title={vm.name}
          actions={<VmActionPanel vm={vm} mutate={mutate!} revalidate={revalidate} />}
          keywords={[vm.vmid.toString()]}
          detail={<VmDetail vm={vm} />}
          accessories={[{ text: vm.id }]}
        />
      ))}
    </List>
  );
}
