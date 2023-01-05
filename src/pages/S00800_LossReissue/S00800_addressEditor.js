import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { FEIBButton, FEIBInputLabel } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';

import {
  findCounty, localCities, localCounties,
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
  const countyOptions = localCounties.map(({ name }) => ({ label: name, value: name }));
  const cityOptions = useMemo(() => {
    if (!watchedCounty) return [];
    const foundCounty = findCounty(watchedCounty);
    if (foundCounty) {
      return localCities[foundCounty.code].map(({ name }) => ({
        label: name,
        value: name,
      }));
    }
    // NOTE 目前後端傳過來的 city 以及 county 很亂，
    // 如果 foundCounty 不存在，代表後端傳過來的 county 是錯的，無法在 localCounties 找到
    // 因此把 county 以及 city 兩個欄位清空，要求使用者再選一次
    reset((formValues) => ({ ...formValues, county: '', city: '' }));
    return [];
  }, [watchedCounty]);

  useEffect(() => {
    // 如果 county 被更換後，原 city 值不存在於 districtOptions 內部，就 reset city
    const isExisted = cityOptions.find(({value}) => value === watchedCity);
    if (watchedCity && !isExisted) reset((formValues) => ({ ...formValues, city: '' }));
  }, [watchedCounty]);

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
                options={cityOptions}
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
