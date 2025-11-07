import { List } from "@raycast/api";

import { MirrorItem } from "@/components/MirrorItem";
import { useMirrorDomain } from "@/hooks/use-mirror-domain";

const mirrorList = ["https://annas-archive.org", "https://annas-archive.se", "https://annas-archive.li"];

export const TestMirrors = () => {
  const usedMirror = useMirrorDomain();

  return (
    <List>
      {usedMirror.custom ? (
        <List.Section title="Custom Mirror">
          <MirrorItem
            mirror={usedMirror.url}
            selected
            subtitle="If you encounter issues, please clear this in the extension preferences."
          />
        </List.Section>
      ) : null}
      <List.Section title="All Mirrors">
        {mirrorList.map((mirror) => (
          <MirrorItem key={mirror} mirror={mirror} selected={mirror === usedMirror.url} />
        ))}
      </List.Section>
    </List>
  );
};
