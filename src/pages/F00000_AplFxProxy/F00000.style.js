import styled from 'styled-components';

export const AplFxProxyWrapper = styled.div`
  text-align: center;
  .hint-message {
    a {
      color: ${({ theme }) => theme.colors.primary.dark};
    }
  }
  .token {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
