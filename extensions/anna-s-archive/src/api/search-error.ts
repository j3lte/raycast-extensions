export const BOT_PROTECTION_MESSAGE =
  "Search is blocked by bot protection. Open this search in your browser to continue.";

export const isBotProtectionError = (error: Error) => error.message.includes("blocked by bot protection");

export const isBotProtectionPage = (response: Response, body: string) => {
  const url = response.url.toLowerCase();
  const text = body.toLowerCase();

  return (
    text.includes("ddos-guard") ||
    text.includes("checking your browser before accessing") ||
    (url.includes("check=1") && response.status >= 400) ||
    (response.status === 403 && (text.includes("ddos") || text.includes("captcha") || text.includes("challenge")))
  );
};

export const logSearchFailure = (response: Response, body: string) => {
  console.error("[anna-s-archive] search failed", {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    snippet: body.slice(0, 400),
  });
};

export const errorMessageForSearchResponse = (response: Response, body: string) => {
  if (isBotProtectionPage(response, body)) {
    return BOT_PROTECTION_MESSAGE;
  }

  const errorMessages: Record<number, string> = {
    404: "No results found",
    500: "Internal server error",
    502: "Bad gateway",
    503: "Service unavailable",
  };

  const message = errorMessages[response.status] ?? "Network response was not ok";
  return `${message}: ${response.statusText || response.status}`;
};
