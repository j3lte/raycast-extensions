import { PveVm } from "../api";

export type VmAction = {
  title: string;
  labels: {
    doing: string;
    ended: string;
  };
  func: (vm: PveVm) => Promise<unknown>;
  needConfirm?: boolean;
};
