import styled from 'styled-components';

const PageWrapper = styled.div`
  padding-top: 5.2rem;

  .toolbar {
    width: fit-content;
    margin-left: auto;
  }

  .btn-icon {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    width: fit-content;
  }

  // 卡片外層
  & div.swiper-slide > div:first-child {
    min-height: 151.66px;
    padding: 1.2rem;
    margin-bottom: 0.2rem;
  }

  // 卡片名稱
  &
    div.swiper-slide
    > div
    > div.justify-between.items-start
    > div
    > div:nth-child(1) {
    height: 24px;
    line-height: 24px;
  }

  // 卡號
  &
    div.swiper-slide
    > div
    > div.justify-between.items-start
    > div
    > div:nth-child(2) {
    font-size: 1.5rem;
    color: #666;
    height: 24px;
    line-height: 28px;
  }

  // 餘額
  & div.swiper-slide .balance {
    height: 42px;
    line-height: 45px;
  }

  // 右下快捷列
  & div.justify-end.gap-6.mt-4.divider {
    margin-top: 0.8rem;
  }

  // 右下快捷按鈕
  & div.swiper-slide > div > div.justify-end.gap-6.mt-4.divider > button {
    color: #042c5c;
    font-weight: 300;
  }

  .remark {
    margin: 1rem;
    text-align: left;
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 1.4rem;
    line-height: 2.1rem;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  padding: 0 1.6rem 6rem;

  .panel {
    padding-top: .8rem;
    padding-bottom: 1.6rem;
  }
`;

export const RewardPageWrapper = styled.div`
  display: grid;
  align-content: flex-start;
  grid-gap: 2.4rem;
  padding-bottom: 6rem;

  .text-red {
    color: ${({ theme }) => theme.colors.state.error};
  }
`;

export default PageWrapper;
