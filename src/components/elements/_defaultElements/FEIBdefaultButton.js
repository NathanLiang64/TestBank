import styled from 'styled-components';

const FEIBdefaultButton = styled.button`
  min-width: 4.8rem;
  min-height: 3.2rem;
  border-radius: .8rem;
  width: ${({ $width }) => ($width && `${$width}rem`) || '100%'};
  height: ${({ $height }) => ($height && `${$height}rem`) || '3.6rem'};
  font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.4rem'};
  color: ${({ $color }) => $color || 'inherit'};
  transition: all .2s;
  cursor: pointer;
`;

export default FEIBdefaultButton;
