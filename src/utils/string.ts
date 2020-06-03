export function toSnakeCase(toConvert: string): string {
  let converted: undefined | string = '';
  if (toConvert) {
    converted = toConvert
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      ?.map((x) => x.toLowerCase())
      .join('_');
  }
  return converted ? converted : '';
}
