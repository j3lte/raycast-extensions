/**
 * Prettify a JSON string by making sure the number arrays are not too long.
 *
 * @param jsonString - The JSON string to prettify.
 * @param maxLength - The maximum length of a number line.
 * @returns The prettified JSON string.
 */
export const prettifyJson = (jsonString: string, maxLength: number = 50) => {
  let currentNumberLine = "";
  return jsonString
    .split("\n")
    .reduce((acc, line) => {
      if (line.trim().match(/^\d+,$/)) {
        if (currentNumberLine.length === 0) {
          currentNumberLine = line.replace(/\d+,/, "");
        }
        currentNumberLine += `${line.trimStart()} `;
        if (currentNumberLine.length > maxLength) {
          const res = `${currentNumberLine}`;
          currentNumberLine = "";
          return [...acc, res];
        } else {
          currentNumberLine += line.trimStart() + " ";
          return [...acc];
        }
      } else if (currentNumberLine.length > 0) {
        if (line.trim().match(/^\d+,?$/)) {
          currentNumberLine += line.trimStart() + " ";
          return [...acc];
        }
        const res = `${currentNumberLine}\n${line}`;
        currentNumberLine = "";
        return [...acc, res];
      }
      return [...acc, line];
    }, [] as string[])
    .join("\n");
};
