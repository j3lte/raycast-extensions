import { useFetch } from "@raycast/utils";

export const useMirrorTest = (domain: string) => {
  const { error, isLoading, revalidate } = useFetch<boolean>(domain, {
    method: "OPTIONS",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
    },
    parseResponse: (response) => {
      if (!response.ok) {
        throw new Error("Mirror is not up");
      }
      return Promise.resolve(true);
    },
    onError: () => {},
  });

  const isUp = !error && !isLoading;

  return { isUp, isLoading, error: error ?? null, revalidate };
};
