import styled from 'styled-components';

const CopyTextIconButtonWrapper = styled.div`
  ${({ $isInline }) => $isInline && `
    display: inline;
    vertical-align: 2px;

    button {
      margin-block: -12px;
      margin-inline: -8px;
    }
  `}

  .copiedTextMessage {}
`;

export default CopyTextIconButtonWrapper;
