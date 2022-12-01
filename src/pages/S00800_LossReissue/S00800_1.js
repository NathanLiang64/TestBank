import React, { useEffect } from 'react';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { FEIBButton, FEIBInputLabel } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';

import { useLocationOptions } from 'hooks/useLocationOptions';
import { LossReissueDialogWrapper } from './S00800.style';
import { validationSchema } from './validationSchema';

export const S00800_1 = ({currentFormValue, onSubmit}) => {
  const {
    control, handleSubmit, reset, watch, getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: currentFormValue,
  });

  const watchedCountyName = watch('county');
  const { countyOptions, districtOptions } = useLocationOptions(watchedCountyName);

  useEffect(() => {
    if (watchedCountyName !== currentFormValue.county) {
      reset({ ...getValues(), city: '' });
    }
  }, [watchedCountyName]);

  return (
    <LossReissueDialogWrapper>
      <form>
        <div className="formContent">
          <FEIBInputLabel>通訊地址</FEIBInputLabel>
          <div className="formElementGroup">
            <div>
              <DropdownField
                options={countyOptions}
                name="county"
                control={control}
              />
            </div>
            <div>
              <DropdownField
                options={districtOptions}
                name="city"
                control={control}
              />
            </div>
          </div>
          <div>
            <TextInputField labelName="地址" name="addr" control={control} />
          </div>
        </div>
        <FEIBButton onClick={handleSubmit(onSubmit)}>確認</FEIBButton>
      </form>
    </LossReissueDialogWrapper>
  );
};
