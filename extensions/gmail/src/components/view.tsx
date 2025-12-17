import { PropsWithChildren } from "react";
import { withGmailClient } from "../lib/withGmailClient";

/**
 * Makes sure that we have a authenticated gmail client available in the children
 */
export default function View({ children }: PropsWithChildren) {
  return withGmailClient(children);
}
