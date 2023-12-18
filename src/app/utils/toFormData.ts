export const toFormData = (obj: Record<string, unknown>) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  return formData;
};
