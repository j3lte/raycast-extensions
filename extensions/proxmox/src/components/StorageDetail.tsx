import { List } from "@raycast/api";
import { PveStorageParsed } from "../types/index";

type StorageDetailProps = {
  storage: PveStorageParsed;
};

export const StorageDetail = ({ storage }: StorageDetailProps) => {
  return (
    <List.Item.Detail
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Name" text={storage.storage} />
          <List.Item.Detail.Metadata.Label title="Node" text={storage.node} />
          <List.Item.Detail.Metadata.Label title="Status" text={storage.status} />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="Plugin Type" text={storage.plugintype} />
          <List.Item.Detail.Metadata.Label title="Max disk" text={storage.maxdiskParsed} />
          <List.Item.Detail.Metadata.Label
            title="Shared"
            text={storage.sharedParsed === null ? "Unknown" : storage.sharedParsed ? "Yes" : "No"}
          />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.TagList title="Content">
            {storage.contentTypes.map((content) => (
              <List.Item.Detail.Metadata.TagList.Item key={content} text={content} />
            ))}
          </List.Item.Detail.Metadata.TagList>
        </List.Item.Detail.Metadata>
      }
    />
  );
};
