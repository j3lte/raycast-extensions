import { ActionPanel, List, Action, Icon } from "@raycast/api";
import { useVmList } from "./hooks/use-vm-list";
import { VmDetail } from "./components/VmDetail";
import { getVmStatusIcon } from "./utils/ui";
import { VmActionPanel } from "./components/VmActionPanel";
import { VmTypeDropdown } from "./components/VmTypeDropdown";
import { ErrorGuard } from "./components/ErrorGuard";

const Command = () => {
  const { isLoading, data, revalidate, mutate, setType, showErrorScreen } = useVmList();

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
        searchBarAccessory={<VmTypeDropdown onChange={setType} />}
      >
        {data.map((vm) => (
          <List.Item
            key={vm.id}
            icon={{ ...getVmStatusIcon(vm.status), tooltip: vm.status }}
            title={vm.name}
            actions={<VmActionPanel vm={vm} mutate={mutate!} revalidate={revalidate} />}
            keywords={[vm.vmid.toString()]}
            detail={<VmDetail vm={vm} />}
            accessories={[{ text: vm.id }]}
          />
        ))}
      </List>
    </ErrorGuard>
  );
};

export default Command;
