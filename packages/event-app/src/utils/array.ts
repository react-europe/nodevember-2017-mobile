export function groupBy(xs: any[], key: string) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export function occurence(array: any[], key: string, toFind: any) {
  let occurences = 0;
  for (const i of array) {
    if (i[key] === toFind) {
      occurences += 1;
    }
  }
  return occurences;
}
