import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { FEIBButton, FEIBInputLabel } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';

import {
  findCity, localCities, localCounties,
} from 'utilities/locationOptions';
import { addressValidation } from 'utilities/validation';
import { LossReissueDialogWrapper } from './S00800.style';

export const AddressEditor = ({addressValue, onSubmit}) => {
  const {
    control, handleSubmit, reset, watch,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        county: yup.string().required('請選擇縣市'),
        city: yup.string().required('請選擇鄉鎮市區'),
        addr: addressValidation(),
      }),
    ),
    defaultValues: addressValue,
  });

  const [watchedCounty, watchedCity] = watch(['county', 'city']);
  const cityOptions = localCities.map(({ name }) => ({ label: name, value: name }));
  const countyOptions = useMemo(() => {
    if (!watchedCity) return [];
    const foundCity = findCity(watchedCity);
    if (foundCity) {
      return localCounties[foundCity.code].map(({ name }) => ({
        label: name,
        value: name,
      }));
    }
    // NOTE 目前後端傳過來的 city 以及 county 很亂，
    // 如果 foundCounty 不存在，代表後端傳過來的 county 是錯的，無法在 localCounties 找到
    // 因此把 county 以及 city 兩個欄位清空，要求使用者再選一次
    reset((formValues) => ({ ...formValues, county: '', city: '' }));
    return [];
  }, [watchedCity]);

  useEffect(() => {
    // 如果 county 被更換後，原 city 值不存在於 districtOptions 內部，就 reset city
    const isExisted = countyOptions.find(({value}) => value === watchedCounty);
    if (watchedCounty && !isExisted) reset((formValues) => ({ ...formValues, county: '' }));
  }, [watchedCity]);

  return (
    <LossReissueDialogWrapper>
      <form>
        <div className="formContent">
          <FEIBInputLabel>通訊地址</FEIBInputLabel>
          <div className="formElementGroup">
            <div>
              <DropdownField
                options={cityOptions}
                name="city"
                control={control}
              />
            </div>
            <div>
              <DropdownField
                options={countyOptions}
                name="county"
                control={control}
              />
            </div>
          </div>

        </div>
        <TextInputField labelName="地址" name="addr" control={control} />
        <FEIBButton onClick={handleSubmit(onSubmit)}>確認</FEIBButton>
      </form>
    </LossReissueDialogWrapper>
  );
};
