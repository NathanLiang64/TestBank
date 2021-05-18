import { useSelector } from 'react-redux';
import Alert from 'components/Alert';
import NoticeArea from 'components/NoticeArea';
import LossReissueWrapper from './lossReissue.style';

const LossReissue2 = () => {
  const cardValues = useSelector(({ lossReissue }) => lossReissue.cardValues);
  const actionText = useSelector(({ lossReissue }) => lossReissue.actionText);

  return (
    <LossReissueWrapper>
      <Alert state="success">{`已完成${actionText}申請`}</Alert>

      <NoticeArea className="notice">
        <p>1. Bankee存款帳戶申請補發Bankee金融卡，手續費新臺幣(以下同)100元及郵寄掛號費50元將由Bankee存款帳戶中自動扣除(前述Bankee存款帳戶泛指持有「Bankee數位存款帳戶」或「Bankee一般帳戶」者，以下簡稱本存戶)。</p>
        <p>2. 本存戶向遠東國際商業銀行辦理金融卡申請/異動申請，除金融卡註銷外，嗣後往來仍悉遵「遠東國際商業銀行金融卡服務約定事項」有關業務規定辦理。</p>
        <p>3. 於各項異動手續辦理妥前，所有使用本存戶Bankee金融卡之交易或申請人為不實之申請，而致蒙受損害時，其一切損害及責任概由本存戶負責。</p>
        <p>4. 本存戶於申請此服務時，業已審閱並充分了解全部內容，並完全同意後才使用各項服務及申請憑證。</p>
      </NoticeArea>

      <table>
        <tbody>
          <tr>
            <td>帳號</td>
            <td>04300499006456</td>
          </tr>
          <tr>
            <td>金融卡狀態</td>
            <td>{cardValues.state}</td>
          </tr>
        </tbody>
      </table>

    </LossReissueWrapper>
  );
};

export default LossReissue2;
