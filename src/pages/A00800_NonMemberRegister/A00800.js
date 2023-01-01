import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  getOsType, getPlatform, transactionAuth,
} from 'utilities/AppScriptProxy';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import { showCustomPrompt } from 'utilities/MessageModal';
import Accordion from 'components/Accordion';
import { RadioGroupField } from 'components/Fields/radioGroupField';
import { TextInputField } from 'components/Fields';
import { AuthCode } from 'utilities/TxnAuthCode';
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { memberRegister } from './api';
import A00800AccoridonContent from './A00800_AccoridonContent';

/* Styles */
import A00800Wrapper from './A00800.style';

/**
 * A00800 訪客註冊
 */

const A00800 = () => {
  // eslint-disable-next-line no-unused-vars
  const [inviteToken, setInviteToken] = useState('');
  const { closeFunc } = useNavigation();
  const dispatch = useDispatch();

  // 驗證錯誤文字 (文字依照1.0)
  const mobileError = (isEmpty) => `請輸入${!isEmpty && '正確的'}手機號碼`;
  const nameError = (isEmpty) => (isEmpty ? '請輸入姓名' : '姓名請勿超過5字元');
  const emailError = (isEmpty) => (isEmpty ? '請輸入Email' : '電子郵件請勿超過40字元');
  const emailFormatError = '請輸入正確的Email';
  const passwordError = (isEmpty) => (isEmpty ? '請輸入密碼' : '請輸入6位數字密碼');
  const passwordConfirmError = (isEmpty) => (isEmpty ? '請再次輸入密碼' : '密碼與確認密碼不相符');
  const termConfirmError = '請閱讀並同意使用條款';

  /**
   * 資料驗證 (規則依照1.0)
   */
  const schema = yup.object().shape({
    mobileNum: yup.string().min(10, mobileError(false)).max(10, mobileError(false)).required(mobileError(true)),
    name: yup.string().max(40, nameError(false)).required(nameError(true)),
    email: yup.string().max(40, emailError(false)).email(emailFormatError).required(emailError(true)),
    password: yup.string().min(6, passwordError(false)).max(6, passwordError(false)).required(passwordError(true)),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], passwordConfirmError(false)).required(passwordConfirmError(true)),
    agreeTerms: yup.string().required(termConfirmError),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      mobileNum: '',
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      agreeTerms: '',
    },
    resolver: yupResolver(schema),
  });

  /* TODO: 註冊成功後跳轉 */
  const handleSwitchPage = () => {
    console.log('A00800');
    if (inviteToken !== '') {
      // TODO: 跳轉至邀請卡
      return '';
    }
    // 成功畫面

    return '';
  };

  /* submit動作處理 */
  const onSubmit = async (data) => {
    dispatch(setWaittingVisible(true));
    const authResult = await transactionAuth(AuthCode.A00800, data.mobileNum);
    const regData = {
      name: data.name,
      email: data.email,
      passwd: data.password,
      mobile: data.mobileNum,
      osType: getOsType(), // 1.iOS, 2.Android, 3.其他
      platform: getPlatform(),
    };

    if (authResult.result === true) {
      /* 驗證成功：呼叫註冊 */
      const result = await memberRegister(regData);
      console.log(result); // accessToken 或 memberId 可能可以用來跳轉至邀請卡

      /* 註冊成功：進入首頁 */
      if (result) {
        await showCustomPrompt({
          title: '註冊成功！',
          onOk: () => handleSwitchPage(),
          onClose: () => handleSwitchPage(),
        });
      }
    }
    dispatch(setWaittingVisible(false));
  };

  useEffect(async () => {
    // TODO: 取得inviteToken(若有)
  }, []);

  return (
    <Layout title="訪客註冊" goHome={false} goBackFunc={closeFunc}>
      <A00800Wrapper className="NonmemberWrapper">
        <form className="basic_data_form" onSubmit={handleSubmit((data) => onSubmit(data))}>
          <TextInputField labelName="手機號碼" type="tel" name="mobileNum" control={control} />
          <TextInputField labelName="姓名" type="text" name="name" control={control} />
          <TextInputField labelName="E-mail" type="email" name="email" control={control} />
          <TextInputField labelName="密碼" type="password" name="password" control={control} placeholder="六位數字" />
          <TextInputField labelName="確認密碼" type="password" name="passwordConfirm" control={control} />

          <Accordion space="both" title="個資保護法公告內容" className="accordion">
            <A00800AccoridonContent />
          </Accordion>
          <div className="term_agree">
            <RadioGroupField control={control} name="agreeTerms" options={[{label: '本人已閱讀並同意上述條款', value: 'true'}]} />
          </div>

          <FEIBButton className="form_button" type="submit">確定</FEIBButton>
        </form>
      </A00800Wrapper>
    </Layout>
  );
};

export default A00800;
