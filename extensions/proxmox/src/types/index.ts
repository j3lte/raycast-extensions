import { useFetch } from "@raycast/utils";

export type FetchOptions<T> = Parameters<typeof useFetch<T>>[1];

export const enum PveVmStatus {
  running = "running",
  stopped = "stopped",
  paused = "paused",
}

export const enum PveVmTypes {
  qemu = "qemu",
  lxc = "lxc",
}

export interface PveVm {
  id: string;
  type: PveVmTypes;
  name: string;

  cpu: number;
  disk: number;
  mem: number;
  maxcpu: number;
  maxdisk: number;
  maxmem: number;

  diskread: number;
  diskwrite: number;
  netin: number;
  netout: number;

  node: string;
  status: PveVmStatus;
  uptime: number;
  vmid: number;
}

export interface ApiResponse<T> {
  data: T;
}

export type VmAction = {
  title: string;
  labels: {
    doing: string;
    ended: string;
  };
  func: (vm: PveVm) => Promise<unknown>;
  needConfirm?: boolean;
};
