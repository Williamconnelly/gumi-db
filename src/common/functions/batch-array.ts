export function batchArray<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];

  if (!array?.length)
    return batches;

  for (let i: number = 0; i < array.length; i += batchSize)
    batches.push(array.slice(i, i + batchSize));

  return batches;
}
