import { ActionPanel, List, Action, Icon, Detail, openExtensionPreferences } from "@raycast/api";
import { useVmList } from "./api";
import { showFailureToast } from "@raycast/utils";
import VmDetail from "./components/VmDetail";
import { useState } from "react";
import { getStatusIcon } from "./utils/ui";
import { VmActionPanel } from "./components/VmActionPanel";

function VmTypeDropdown(props: { onChange: (value: string) => void }) {
  const TYPES = ["All", "QEMU", "LXC"];

  return (
    <List.Dropdown tooltip="VM Types" onChange={props.onChange}>
      {TYPES.map((type) => (
        <List.Dropdown.Item key={type} title={type} value={type.toLowerCase()} />
      ))}
    </List.Dropdown>
  );
}

export default function Command() {
  // hook is not used directly to account for URL being invalid
  let vmListData;
  try {
    vmListData = useVmList();
    console.log(vmListData);
  } catch (e) {
    showFailureToast(e);
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
  const { isLoading, data, revalidate, mutate } = vmListData;

  const [type, setType] = useState<string>("all");

  const filteredData =
    data?.filter((vm) => {
      if (type === "all") {
        return true;
      }

      return vm.type === type;
    }) ?? [];

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
      {filteredData.map((vm) => (
        <List.Item
          key={vm.id}
          icon={{ ...getStatusIcon(vm.status), tooltip: vm.status }}
          title={vm.name}
          actions={<VmActionPanel vm={vm} mutate={mutate} revalidate={revalidate} />}
          keywords={[vm.vmid.toString()]}
          detail={<VmDetail vm={vm} />}
          accessories={[{ text: vm.id }]}
        />
      ))}
    </List>
  );
}
