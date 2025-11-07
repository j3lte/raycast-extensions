import { memo, useMemo } from "react";

import { Action, ActionPanel, Icon, List, getPreferenceValues } from "@raycast/api";

import type { ArchiveItem } from "@/api/archive";
import ArchiveListItemDetail from "@/components/ArchiveListItemDetail";
import { TestMirrors } from "@/components/TestMirrors";

interface ArchiveListItemProps {
  item: ArchiveItem;
}

const mirror = getPreferenceValues<Preferences>().mirror ?? "https://annas-archive.org";

const ArchiveListItemF = ({ item }: ArchiveListItemProps) => {
  const icon = useMemo(() => {
    if (item.cover !== null) {
      return { source: item.cover };
    }
    return { source: Icon.Book };
  }, [item.cover]);
  return (
    <List.Item
      title={item.title}
      icon={icon}
      detail={<ArchiveListItemDetail item={item} />}
      actions={
        <ActionPanel>
          <ActionPanel.Section title="Actions">
            <Action.OpenInBrowser title="Open in Browser" url={`${mirror}/md5/${item.id}`} icon={Icon.Globe} />
            <Action.CopyToClipboard
              title="Copy URL to Clipboard"
              content={`${mirror}/md5/${item.id}`}
              icon={Icon.Clipboard}
            />
          </ActionPanel.Section>
          <ActionPanel.Section title="Mirrors">
            <Action.Push title="Test Mirrors" target={<TestMirrors />} icon={Icon.List} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};

const ArchiveListItem = memo(ArchiveListItemF);

export default ArchiveListItem;
