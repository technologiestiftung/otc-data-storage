export function createResponse<T>(
  message: string,
  data?: T,
  dataKey?: string,
): {
  message: string;
  data?: {
    [key: string]: T;
  };
} {
  const d: { [key: string]: T } = {};

  const res: { message: string; data?: { [key: string]: T } } = {
    message,
  };
  if (data && dataKey) {
    d[dataKey] = data;
    res.data = d;
  }
  return res;
}
