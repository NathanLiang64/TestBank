import userAxios from 'apis/axiosConfig';

export const doGetInitData = (apiUrl) => (

  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);

export const getBankCode = async (params) => (
  await userAxios.post('/api/transfer/queryBank', params)
    .then((response) => response)
    .catch((error) => error)
);

// 查詢轉岀帳號資訊
export const getNtdTrAcct = async (params) => (
  await userAxios.post('/api/transfer/queryNtdTrAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
// 查詢常用帳號
export const getFavAcct = async (params) => (
  await userAxios.post('/api/transfer/queryFavAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
// 常用帳號新增
export const insertFacAcct = async (params) => (
  await userAxios.post('/api/transfer/insertFacAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);

// 查詢約定帳號
export const queryRegAcct = async (params) => (
  await userAxios.post('/api/transfer/queryRegAcct', params)
    .then((response) => {
      console.log(response);
      return [{
        id: 'fL9HylbGfbbRPs9N5AAgy0cazPT2wDXc',
        bankId: '805',
        bankName: '遠東商銀',
        acctId: '04300499099427',
        acctName: 'Catherine Smith',
        acctImg: 'https://images.unsplash.com/photo-1528341866330-07e6d1752ec2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=801&q=80',
      },
      {
        id: 'xC3wzNqK0x3OOkih0uDxJP5aXeP5eFwu',
        bankId: '805',
        bankName: '遠東商銀',
        acctId: '04300499001010',
        acctName: 'Jason',
        acctImg: '',
      },
      {
        id: 's1JkfvhrK0pmtz8UtPYafyjD0Enprlqp',
        bankId: '806',
        bankName: '元大商銀',
        acctId: '04300499001011',
        acctName: 'Mike',
        acctImg: '',
      }];
    })
    .catch((error) => error)
);
// 轉帳確認
export const doNtdTrConfirm = async (params) => (
  await userAxios.post('/api/transfer/ntdTr/confirm', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);

// 常用帳號刪除(單筆)
export const doDeleteFacAcct = async (params) => (
  await userAxios.post('/api/transfer/deleteFacAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);

// 預約轉帳確認
export const doBookNtdTrConfirm = async (params) => (
  await userAxios.post('/api/transfer/ntdTr/book/confirm', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
