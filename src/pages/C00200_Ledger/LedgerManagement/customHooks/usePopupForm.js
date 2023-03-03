import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextareaField } from 'components/Fields';
import { customPopup } from 'utilities/MessageModal';

export default ({ title = '' }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { data: '' },
    resolver: yupResolver(
      yup.object().shape({
        data: yup.string().required('必填'),
      }),
    ),
    mode: 'onChange',
  });

  useEffect(() => {
    reset((formValues) => ({
      ...formValues,
    }));
  }, []);

  const showPopupForm = (callBack = () => {}) => {
    customPopup(
      title,
      <TextareaField
        control={control}
        name="data"
        rowsMin={3}
        rowsMax={6}
        limit={30}
      />,
      handleSubmit(({ data }) => {
        callBack(data);
      }),
    );
  };

  return { showPopupForm };
};
