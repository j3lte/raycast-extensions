import type { Tags } from "exifreader";
import { memo } from "react";

import { Detail } from "@raycast/api";

export const TagDetails = memo(({ fileName, tags }: { fileName: string; tags: Tags }) => {
  const tagsArray: [string, string, string][] = Object.entries(tags)
    .filter(([key]) => !["Thumbnail", "Images"].includes(key) && !key.startsWith("undefined-"))
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .map(([k, value]) => {
      const key = k.trim();
      if (["ApplicationNotes", "MakerNote"].includes(key)) {
        return [key, "..."];
      }
      if (value === undefined) {
        return [key, "(unknown)"];
      }
      if (value instanceof Array) {
        return [key, value.map((v) => v.description).join(", ")];
      }
      if (value instanceof Date) {
        return [key, value.toISOString()];
      }
      return [key, value.description];
    })
    .map(([key, value], index, array) => {
      const keyVal = key.trim();
      if (array.findIndex(([k]) => k.trim() === keyVal) === index) {
        return [keyVal, key, value];
      }
      return [`${keyVal}-${index}`, key, value];
    });

  return (
    <Detail.Metadata>
      <Detail.Metadata.Label title="File" text={decodeURIComponent(fileName)} />
      <Detail.Metadata.Separator />
      {tagsArray.map(([keyVal, key, value]) => (
        <Detail.Metadata.Label key={keyVal} title={key} text={value} />
      ))}
    </Detail.Metadata>
  );
});
