import { Icon, Image, Color } from "@raycast/api";
import { PveVmStatus } from "../api";

export function getStatusIcon(status: PveVmStatus): Image {
  switch (status) {
    case PveVmStatus.running:
      return {
        source: Icon.Play,
        tintColor: Color.Green,
      };
    case PveVmStatus.stopped:
      return {
        source: Icon.Stop,
        tintColor: Color.SecondaryText,
      };
    case PveVmStatus.paused:
      return {
        source: Icon.Pause,
        tintColor: Color.Yellow,
      };
    default:
      return {
        source: Icon.QuestionMark,
      };
  }
}
