/* eslint-disable no-unused-vars */
/** @format */

import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton, FEIBCheckbox } from 'components/elements';

/* Styles */
import theme from 'themes/theme';
import InstalmentWrapper from './R00200.style';

const R00200_1 = () => {
  const [openDrawer, setOpenDrawer] = useState(true);

  const history = useHistory();
  const location = useLocation();

  /* 資料驗證 */
  const schema = yup.object().shape({
    installmentItem: yup.array().min(1),
  });
  const {
    control, handleSubmit, getValues, setValue,
  } = useForm({
    defaultValues: {
      installmentItem: [],
    },
    resolver: yupResolver(schema),
  });

  const handleItemSelect = (checkedItem) => {
    const { installmentItem: id } = getValues();

    const newItems = id?.includes(checkedItem) ? id?.filter((item) => item !== checkedItem) : [...(id ?? []), checkedItem];

    // console.log('R002001 handleItemSelect() selectedName: ', newItems);

    setValue('installmentItem', newItems);
    return newItems;
  };

  const renderSelectList = () => (
    <div className="selectList">
      {location.state.installmentData.map((item) => (
        <Controller
          key={location.state.installmentData.indexOf(item)}
          name="installmentItem"
          control={control}
          render={() => (
            <div className="checkbox">
              <FEIBCheckbox
                className="customPadding"
                name={item.name}
                onChange={() => handleItemSelect(item.id)}
              />
              <div style={{ flex: 1, padding: 8 }}>
                <div style={{ flex: 1 }}>{item.name}</div>
                <div style={{ flex: 1, color: theme.colors.text.light }}>{item.date}</div>
              </div>
              <div style={{ padding: 8 }}>{`$${item.cost}`}</div>
            </div>
          )}
        />
      ))}
    </div>
  );

  const handleOnSubmit = (data) => {
    console.log('R002001 handleOnSubmit() data: ', data);

    setOpenDrawer(!openDrawer);
    history.push('/R002002'); // 帶 list.cost 總和到下一頁
  };

  return (
    <Layout title={`晚點付 (${location.state.installmentType.installmentType === '1' ? '單筆' : '總額'})`}>
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={handleSubmit((data) => handleOnSubmit(data))}>
          <div>
            <div className="messageBox">
              <p style={{ width: '100%', textAlign: 'center' }}>勾選申請分期消費</p>
              <p style={{ width: '100%', textAlign: 'center' }}>(單筆消費限額需達3,000元以上)</p>
            </div>
            {renderSelectList()}
          </div>
          <FEIBButton
            type="submit"
          >
            下一步
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_1;
