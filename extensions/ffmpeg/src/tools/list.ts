type Input = {
  /**
   * List things from ffmpeg
   *
   * - formats: list available formats
   * - muxers: list available muxers
   * - demuxers: list available demuxers
   * - devices: list available devices
   * - codecs: list available codecs
   * - decoders: list available decoders
   * - encoders: list available encoder
   * - bsfs: list available bitstream filters
   * - protocols: list available protocols
   * - filters: list available filters
   * - pix_fmts: list available pixel formats
   * - layouts: list available layouts
   * - sample_fmts: list available audio sample formats
   * - dispositions: list available steam dispositions
   * - colors: list available color names
   * - hwaccels: list available hardware accelerations methods
   */
  list:
    | "formats"
    | "muxers"
    | "demuxers"
    | "devices"
    | "codecs"
    | "decoders"
    | "encoders"
    | "bsfs"
    | "protocols"
    | "filters"
    | "pix_fmts"
    | "layouts"
    | "sample_fmts"
    | "dispositions"
    | "colors"
    | "hwaccels";
};

import { executeFFmpegCommand } from "../utils/ffmpeg";
export default async function ({ list }: Input) {
  const listCommand = `-${list} -hide_banner`;
  const output = executeFFmpegCommand(listCommand);
  return { output };
}
