import type { Tags } from "exifreader";
import { parse } from "node:path";
import { type FC, useEffect, useMemo } from "react";

import { Action, ActionPanel, Detail, Icon, Toast, showToast, useNavigation } from "@raycast/api";

import { TagDetails } from "@/components/TagDetails";
import useTagsMarkdown from "@/hooks/use-tags-markdown";

import RawDataScreen from "./RawData";

interface TagsScreenProps {
  file: string;
  tags: Tags;
}

const TagsScreen: FC<TagsScreenProps> = ({ tags, file }) => {
  const { push } = useNavigation();

  const tagsString = useMemo(() => JSON.stringify(tags, null, 2), [tags]);
  const { rawTags, image, location, thumbnail } = useTagsMarkdown(tags, file);

  const fileName = parse(file).name + parse(file).ext;

  useEffect(() => {
    showToast({ style: Toast.Style.Success, title: "Tags", message: "Tags loaded" });
  }, []);

  return (
    <Detail
      navigationTitle="Exif Tags"
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy JSON" content={tagsString} />
          {tagsString.length < 10000 ? (
            <Action title="View Raw Tags" icon={Icon.CodeBlock} onAction={() => push(<RawDataScreen tags={tags} />)} />
          ) : null}
        </ActionPanel>
      }
      markdown={[image, thumbnail, location, rawTags].join("\n")}
      metadata={<TagDetails fileName={fileName} tags={tags} />}
    />
  );
};

export default TagsScreen;
