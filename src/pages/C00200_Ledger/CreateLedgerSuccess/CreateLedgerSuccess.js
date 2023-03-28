import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import ResultAnimation from 'components/SuccessFailureAnimations/ResultAnimation';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showError } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import PageWrapper from './CreateLedgerSuccess.style';
import { getLedgerTypeName } from '../utils/lookUpTable';
import { openLedger } from './api';

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const isMounted = useRef(false);
  const { state } = location;
  // 狀態設定
  const [viewModel, setViewModel] = useState(state || {});
  // 欄位設定
  const CONFIG = [
    { id: 1, label: '帳本名稱', value: viewModel?.ledgerName },
    { id: 2, label: '暱稱', value: viewModel?.memberNickName },
    { id: 3, label: '類型', value: getLedgerTypeName(viewModel?.ledgerType) },
    {
      id: 4,
      label: '連結帳號',
      value: viewModel?.bankeeAccount?.accountNumber,
    },
    { id: 5, label: '與成員分享明細', value: viewModel?.share ? '是' : '否' },
  ];
  // 初始設定
  const init = async () => {
    if (!state) {
      showError('未取得LedgerId', () => history.goBack());
      return null;
    }
    dispatch(setWaittingVisible(true));
    const resFromOpenLedger = await openLedger({ ledgerId: state.ledgerId });
    setViewModel((p) => ({ ...p, ...resFromOpenLedger }));
    dispatch(setWaittingVisible(false));
    return null;
  };
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      init();
    } else {
      history.push(location.pathname, viewModel);
    }
  }, [viewModel]);

  // 點擊 - 邀請好友
  const onInvitationClick = async () => {
    history.push('/MemberInvitation');
  };

  // 點擊 - 進入帳本明細
  const onEnterLedgerDetailClick = () => {
    history.push('/LedgerDetail', state);
  };

  return (
    <Layout title="建立帳本" fid={Func.C002} goBackFunc={() => history.push('/C00200')}>
      <PageWrapper>
        <ResultAnimation isSuccess subject="設定完成" />
        {CONFIG.map((item) => (
          <InformationList
            key={item.id}
            title={item.label}
            content={item.value}
          />
        ))}
        <Box display="flex" justifyContent="space-between" my={3}>
          <Box width="49%" onClick={onInvitationClick}>
            <FEIBButton>邀請好友</FEIBButton>
          </Box>
          <Box width="49%" onClick={onEnterLedgerDetailClick}>
            <FEIBButton>進入帳本明細</FEIBButton>
          </Box>
        </Box>
      </PageWrapper>
    </Layout>
  );
};
