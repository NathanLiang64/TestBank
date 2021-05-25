import styled from 'styled-components';

const DetailCardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1.2rem;
  border-radius: .8rem;
  background: ${({ theme }) => theme.colors.basic.white};
  box-shadow: 0 .2rem .8rem rgba(0, 0, 0, .08);

  .avatar {
    margin-right: .8rem;
    width: 4rem;
    height: 4rem;

    .type {
      position: absolute;
      right: -.2rem;
      bottom: -.2rem;
      border: .2rem solid ${({ theme }) => theme.colors.basic.white};
      border-radius: 50%;
      width: 40%;
      height: 40%;

      &.income {
        background: ${({ theme }) => theme.colors.state.success};
      }
      &.spend {
        background: ${({ theme }) => theme.colors.state.danger};
      }
    }

    img {
      border-radius: 50%;
    }
  }

  .description,
  .amount {

    h4 {
      font-size: 1.5rem;
      font-weight: bold;
    }

    p {
      font-size: 1.3rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }

  .amount {
    text-align: right;
    position: absolute;
    right: 1.2rem;
  }
`;

export default DetailCardWrapper;
