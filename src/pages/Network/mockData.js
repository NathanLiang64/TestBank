import avatarImage from 'assets/images/avatarImage.png';

const mockData = {
  getNetworkUserInfo: {
    nickname: 'Jason Huang',
    avatar: avatarImage,
    level: '3',
    referralCode: '630FG3',
    shareContent: '點擊「成為Bankee會員」申辦Bankee數位存晚帳戶，享活存利率2.6%！',
  },
  getNetworkOverview: {
    clicks: '79',
    applying: '0',
    approved: '2',
    recommendList: [
      {
        id: '1',
        name: '王玉惠',
        approvedDate: '20210308',
        accountApplyDate: '20210308',
      },
      {
        id: '2',
        name: '陳均仁',
        approvedDate: '20210304',
        accountApplyDate: '20210304',
      },
    ],
  },
  getNetworkFeedback: {
    interestRateLimit: '5萬',
    profit: '60',
    loan: 'XXXXX',
  },
};

export default mockData;
