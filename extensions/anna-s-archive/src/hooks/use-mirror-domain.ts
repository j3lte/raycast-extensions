import { useMemo } from "react";

import { getPreferenceValues } from "@raycast/api";

export const useMirrorDomain = () => {
  return useMemo(() => {
    const customMirror = getPreferenceValues<Preferences>().customMirror ?? "";
    if (customMirror.length > 0) {
      if (customMirror.startsWith("http")) {
        return { custom: true, url: customMirror };
      }
      return { custom: true, url: `https://${customMirror}` };
    }
    return { custom: false, url: getPreferenceValues<Preferences>().mirror ?? "https://annas-archive.org" };
  }, []);
};
