/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Loading from 'components/Loading';
import { FEIBButton } from 'components/elements';
import { TextInputField } from 'components/Fields';
import { setModalVisible } from 'stores/reducers/ModalReducer';

import { validationSchema } from './validationSchema';

export const MemoEditForm = ({
  defaultValues,
  isBankeeCard,
  onTxnNotesEdit,
}) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const { control, handleSubmit, unregister } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async ({
    cardNo, txDate, txKey, note,
  }) => {
    const payload = {
      cardNo, txDate, txKey, note,
    };
    // console.log('payload', payload);
    setIsUpdating(true);
    onTxnNotesEdit(payload, isBankeeCard);
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
