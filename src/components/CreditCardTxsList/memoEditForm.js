import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { FEIBButton } from 'components/elements';
import { TextInputField } from 'components/Fields';
import { setModalVisible } from 'stores/reducers/ModalReducer';

export const MemoEditForm = ({
  defaultValues,
  isBankeeCard,
  onTxnNotesEdit,
}) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, unregister } = useForm({
    defaultValues,
    resolver: yupResolver(
      yup.object().shape({
        note: yup
          .string()
          .max(7, '限制字數為7個字元')
          .required('請輸入備註說明'),
      }),
    ),
  });

  const onSubmit = async ({
    cardNo, txDate, txKey, note,
  }) => {
    const payload = {
      cardNo, txDate, txKey, note,
    };

    await onTxnNotesEdit(payload, isBankeeCard);
    dispatch(setModalVisible(false));
  };

  useEffect(() => () => unregister('note'), []);

  return (
    <form style={{gap: '2rem'}} onSubmit={handleSubmit(onSubmit)}>
      <TextInputField labelName="備註說明" name="note" control={control} inputProps={{maxLength: 7}} />
      <FEIBButton>完成</FEIBButton>
    </form>
  );
};
