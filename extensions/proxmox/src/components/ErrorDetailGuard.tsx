import { List } from "@raycast/api";
import { PropsWithChildren } from "react";

type ErrorDetailGuardProps = PropsWithChildren<{
  showErrorScreen?: boolean;
}>;

export const ErrorDetailGuard = ({ children, showErrorScreen }: ErrorDetailGuardProps) => {
  if (showErrorScreen) {
    return <List.Item.Detail markdown="Something went wrong, check your preferences." />;
  }

  return children;
};
