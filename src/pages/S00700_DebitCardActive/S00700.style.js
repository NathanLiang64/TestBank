import styled from 'styled-components';
import Layout from 'components/Layout';

const DebitCardActiveWrapper = styled(Layout)`

`;

export default DebitCardActiveWrapper;

export const SuccessDescWrapper = styled.div`
    text-align:left;
    font-weight: 600;
    .success_title{
        display:flex;
        align_items:center;
        
        h3{
            color:${({theme}) => theme.colors.primary.brand};
            white-space: nowrap;
            font-size: 16px;
        }
        div{
            font-size: 16px;
            color:red
        }      
    }
`;
