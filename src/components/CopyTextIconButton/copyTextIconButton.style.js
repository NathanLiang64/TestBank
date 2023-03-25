import styled from 'styled-components';

const CopyTextIconButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ $isInline }) => $isInline
    && `
    display: inline;
    vertical-align: 2px;

    button {
      margin: -12px -8px;
    }
  `}

  .copiedTextMessage {
  }
`;

export default CopyTextIconButtonWrapper;
