import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import uuid from 'react-uuid';

import { getFavAccounts } from 'apis/transferApi';
import { setDrawer, setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';

import { AddIcon } from 'assets/images/icons';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import Badge from 'components/Badge';
import { FEIBButton, FEIBInputLabel, FEIBInput } from 'components/elements';

import { handleAdd, handleEdit, handleRemove } from './api';
import PageWrapper, { DrawerWrapper } from './D00500.style';

const mock = [
  { accountName: 'Loid Forger', bankName: 'Peanuts Bank', accountId: '11122233334444' },
  { accountName: 'Anya Forger', bankName: 'Peanuts Bank', accountId: '11122233324444' },
  { accountName: 'Yor Forger', bankName: 'Peanuts Bank', accountId: '11122233304444' },
];

const uid = uuid();

/**
 * D00500 常用帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);
  const { control, handleSubmit } = useForm();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    try {
      setCards(await getFavAccounts());
    } catch {
      setCards(mock);
    }
    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 處理UI流程：新增帳戶
   */
  const onAddClick = () => {
    // TODO: Do something with UI, then call API:
    const card = {};
    const successful = handleAdd(card);

    if (!successful) {
      // TODO: You may want to do something with UI?
    }
  };

  /**
   * 處理UI流程：編輯帳戶
   */
  const onEditSubmit = (data, card) => {
    const param = {...card};
    const shouldUpdateNickname = card.accountName !== data.accountName;

    if (shouldUpdateNickname) param.accountName = data.accountName;
    // do something with photo too

    const successful = handleEdit(param);
    if (!successful) {
      // TODO: You may want to do something with UI?
      dispatch(setDrawerVisible(false));
      return;
    }

    const tmpCards = cards.slice();
    tmpCards.forEach((c) => {
      if (c.accountId === card.accountId) {
        if (shouldUpdateNickname) c.accountName = data.accountName;
        // do something with photo too
      }
    });
    setCards(tmpCards);
    dispatch(setDrawerVisible(false));
  };

  const onEditClick = (card) => {
    const options = (
      <DrawerWrapper>
        <Badge>
          <div className="label">帳號</div>
          <div className="text-blue">{`${card.bankName} ${card.accountId}`}</div>
        </Badge>
        <form className="flex-col" onSubmit={handleSubmit((data) => onEditSubmit(data, card))}>
          <div>
            <FEIBInputLabel htmlFor={`${uid}-edit-name`}>暱稱</FEIBInputLabel>
            <Controller
              name="accountName"
              control={control}
              defaultValue={card.accountName ?? ''}
              render={({ field }) => (
                <FEIBInput
                  id={`${uid}-edit-name`}
                  placeholder="請輸入"
                  {...field}
                />
              )}
            />
          </div>
          <FEIBButton type="submit">完成</FEIBButton>
        </form>
      </DrawerWrapper>
    );
    dispatch(setDrawer({ title: '編輯常用帳號', content: options }));
    dispatch(setDrawerVisible(true));
  };

  /**
   * 處理UI流程：移除登記帳戶
   */
  const onRemoveClick = (card) => {
    // TODO: Do something with UI, then call API:
    const successful = handleRemove(card);

    if (!successful) {
      // TODO: You may want to do something with UI?
    }
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout title="常用帳號管理">
      <Main small>
        <PageWrapper>
          <button type="button" aria-label="新增常用帳號" className="addMemberButtonArea" onClick={onAddClick}>
            <div className="addMemberButtonIcon">
              <AddIcon />
            </div>
            <span className="addMemberButtonText">新增常用帳號</span>
          </button>
          { !!cards && cards.map((card) => (
            <MemberAccountCard
              key={card.accountId}
              type="常用帳號"
              name={card.accountName}
              bankNo={card.bankId}
              bankName={card.bankName}
              account={card.accountId}
              avatarSrc={card.acctImg}
              onEdit={() => onEditClick(card)}
              onRemove={() => onRemoveClick(card)}
            />
          )) }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
