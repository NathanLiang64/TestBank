/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { FEIBButton, FEIBInputLabel } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';
import { closeFunc } from 'utilities/AppScriptProxy';
import { showError } from 'utilities/MessageModal';
import { getCountyList } from 'pages/T00700_BasicInformation/api';

import { LossReissueDialogWrapper } from './S00800.style';
import { validationSchema } from './validationSchema';

export const S00800_1 = ({currentFormValue, onSubmit}) => {
  const [countyOptions, setCountyOptions] = useState([]);
  const {
    control, handleSubmit, reset, watch, getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: currentFormValue,
  });

  const watchedCountyName = watch('county');

  const generateCountyOptions = () => {
    if (countyOptions.length) {
      return countyOptions.map(({ countyName }) => ({
        label: countyName,
        value: countyName,
      }));
    }
    return [];
  };

  const generateDistrictOptions = () => {
    const foundDistrictOption = countyOptions.find(
      ({ countyName }) => countyName === watchedCountyName,
    );

    if (foundDistrictOption) {
      return foundDistrictOption.cities.map(({ cityName }) => ({
        label: cityName,
        value: cityName,
      }));
    }
    return [];
  };

  useEffect(async () => {
    const listResponse = await getCountyList();
    if (listResponse.code === '0000') {
      setCountyOptions(listResponse.data);
    } else {
      showError(listResponse.message, closeFunc);
    }
  }, []);

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
                options={generateCountyOptions()}
                name="county"
                control={control}
              />
            </div>
            <div>
              <DropdownField
                options={generateDistrictOptions()}
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
