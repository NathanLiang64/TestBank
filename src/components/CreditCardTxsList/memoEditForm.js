import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { FEIBButton } from 'components/elements';
import { TextInputField } from 'components/Fields';

export const MemoEditForm = ({
  defaultValues,
  isBankeeCard,
  onTxnNotesEdit,
}) => {
  const { control, handleSubmit, unregister } = useForm({
    defaultValues,
    resolver: yupResolver(
      yup.object().shape({
        note: yup
          .string()
          .max(7, '限制字數為7個字元'),
      }),
    ),
  });

  const onSubmit = async ({
    cardNo, txDate, txKey, note,
  }) => {
    const payload = {
      cardNo, txDate, txKey, note,
    };

    onTxnNotesEdit(payload, isBankeeCard);
  };

  useEffect(() => () => unregister('note'), []);

  return (
    <form style={{ display: 'grid', alignContent: 'flex-start', gridGap: '2rem' }} onSubmit={handleSubmit(onSubmit)}>
      <TextInputField labelName="備註說明" name="note" control={control} inputProps={{maxLength: 7}} />
      <FEIBButton>完成</FEIBButton>
    </form>
  );
};
