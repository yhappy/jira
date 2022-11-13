export const isFalsy = (value) => (value === 0 ? false : !value);

export const cleanObject = (object) => {
  const result = { ...object };
  Object.keys(result).forEach((keys) => {
    const value = result[keys];
    if (isFalsy(value)) {
      delete result[keys];
    }
  });
  return result;
};
