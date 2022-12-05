import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FEIBButton } from 'components/elements';
import { TextInputField } from 'components/Fields';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setModalVisible } from 'stores/reducers/ModalReducer';
import Loading from 'components/Loading';
import { updateTxnNotes } from './api';
import { validationSchema } from './validationSchema';

export const MemoEditForm = ({ defaultValues, updateTransactions }) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const { control, handleSubmit, unregister } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = async ({
    cardNo, txDate, txKey, note,
  }) => {
    const payload = {
      cardNo,
      txDate,
      txKey,
      note,
    };
    setIsUpdating(true);
    const {result } = await updateTxnNotes(payload);
    if (result) await updateTransactions();
    setIsUpdating(false);
    dispatch(setModalVisible(false));
  };

  useEffect(() => () => unregister('note'), []);

  if (isUpdating) return <Loading space="both" isCentered />;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInputField labelName="備註說明" name="note" control={control} />
      <FEIBButton>完成</FEIBButton>
    </form>
  );
};
