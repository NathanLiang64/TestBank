import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  notes: yup.lazy((value) => {
    if (value) {
      const newEntries = Object.keys(value).reduce(
        (acc, val) => ({
          ...acc,
          [val]: yup.string().max(7, '限制字數為7個字元'),
        }),
        {},
      );
      return yup.object().shape(newEntries);
    }
    return yup.mixed().notRequired();
  }),
});
