import { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { EditAccountIcon, DeleteIcon } from 'assets/images/icons';
import {
  showCustomPrompt,
  showError,
  showAnimationModal,
} from 'utilities/MessageModal';
import { getBankCode } from 'utilities/CacheData';
import { TextTwoColumnFiled, ButtonTwoColumnFiled } from './ManagedColumn';
import {
  EditLedgerNameForm,
  EditNickNameForm,
  EditAccountForm,
} from './EditForm';
import { setLedgerName, setNickname, getBankAccount } from '../api';
import { getLedgerTypeName } from '../../utils/lookUpTable';

export default () => {
  const location = useLocation();
  const history = useHistory();
  const isMounted = useRef(false);
  const { state } = location;
  // Guard
  if (!state) return null;
  useEffect(() => {
    if (!state) showError('未取得狀態資訊', () => history.goBack());
  }, []);
  // 狀態設定
  const [viewModel, setViewModel] = useState(state);
  const [bankCodeOptions, setBankCodeOptions] = useState([]);
  const [bindAccount, setBindAccount] = useState({
    bankCode: '',
    accountNumber: '',
  });
  // 初始設定
  const init = async () => {
    const resFromGetBankAccount = await getBankAccount();
    const { bankCode, accountNumber } = resFromGetBankAccount;
    setBindAccount({ bankCode, accountNumber });
    const resFromGetBankCode = await getBankCode();
    const formatBankCode = resFromGetBankCode.map((item) => ({
      label: `${item.bankNo} - ${item.bankName}`,
      value: item.bankNo,
    }));
    setBankCodeOptions(formatBankCode);
  };
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      init();
    } else {
      history.push(location.pathname, viewModel);
    }
  }, [viewModel]);
  //   點擊 - 編輯帳本名稱
  const onLedgerNameEditClick = () => {
    showCustomPrompt({
      title: '編輯帳本名稱',
      message: (
        <EditLedgerNameForm
          nameDefaultValue={viewModel.ledgerName}
          callback={async (data) => {
            const res = await setLedgerName({ name: data });
            if (res) {
              setViewModel((p) => ({ ...p, ledgerName: data }));
            }
            showAnimationModal({
              isSuccess: res,
              successTitle: '設定成功',
              errorTitle: '設定失敗',
            });
          }}
        />
      ),
    });
  };

  //   列表 - 欄位設定
  const HEADER_CONFIG = {
    label: viewModel.ledgerName,
    value: '',
    isEdited: viewModel.owner,
  };
  const TEXT_CINFIG = [
    {
      label: '連結帳號',
      value: `(${viewModel.bankeeAccount.bankCode})${viewModel.bankeeAccount.accountNumber}`,
    },
    { label: '建立日期', value: viewModel.createDate },
    { label: '類型', value: getLedgerTypeName(viewModel.ledgerType) },
    {
      label: '目前帳本金額',
      value: `${viewModel.bankeeAccount.accountCurrency} ${viewModel.ledgerAmount}`,
    },
    {
      label: '我的暱稱',
      value: viewModel.memberNickName,
      isEdited: true,
      onEditClick: () => {
        showCustomPrompt({
          title: '編輯暱稱',
          message: (
            <EditNickNameForm
              nameDefaultValue={viewModel.memberNickName}
              callback={async (data) => {
                const res = await setNickname({ name: data });
                if (res) {
                  setViewModel((p) => ({ ...p, memberNickName: data }));
                }
                showAnimationModal({
                  isSuccess: res,
                  successTitle: '設定成功',
                  errorTitle: '設定失敗',
                });
              }}
            />
          ),
        });
      },
    },
    {
      label: '我的綁定帳號',
      value: `(${bindAccount.bankCode})${bindAccount.accountNumber}`,
      isEdited: true,
      isHide: viewModel.owner,
      onEditClick: () => {
        showCustomPrompt({
          title: '編輯綁定帳號',
          message: (
            <EditAccountForm
              nameDefaultValue={bindAccount}
              dropOptions={bankCodeOptions}
              callback={(data) => console.log(data)}
            />
          ),
        });
      },
    },
  ];
  //   按鈕 - 欄位設定
  const BUTTON_CONFIG = [
    {
      label: '分享明細',
      icon: <EditAccountIcon />,
      callBack: () => {
        console.log('分享明細');
        history.push('/ShareLedgerDetail');
      },
    },
    {
      label: '終止帳本',
      icon: <DeleteIcon />,
      callBack: () => {
        console.log('終止帳本');
        history.push('/AbortLedgerConfirm');
      },
    },
  ];

  return (
    <Box>
      <Paper>
        <Box p={1}>
          <Box height={35}>
            <TextTwoColumnFiled
              label={HEADER_CONFIG.label}
              value={HEADER_CONFIG.value}
              isEdited={HEADER_CONFIG.isEdited}
              onEditClick={onLedgerNameEditClick}
            />
          </Box>
          <Divider />
          {TEXT_CINFIG.map((item) => (
            <Box key={item.label} display={item.isHide ? 'none' : 'block'}>
              <TextTwoColumnFiled {...item} />
            </Box>
          ))}
          <Divider />
          {viewModel.owner
            && BUTTON_CONFIG.map((item) => (
              <ButtonTwoColumnFiled key={item.label} {...item} />
            ))}
        </Box>
      </Paper>
    </Box>
  );
};
