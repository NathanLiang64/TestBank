import styled from 'styled-components';
import Layout from 'components/Layout';

const DebitCardActiveWrapper = styled(Layout)`
    .hint_text {
        margin-bottom: 2rem;
        font-size: 1.4rem;
    }
`;

export default DebitCardActiveWrapper;

export const SuccessDescWrapper = styled.div`
    text-align:left;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 2rem auto;

    & >div{
        margin-bottom:1rem;
    }
    .success_title{
        display:flex;
        align-items:center;
        color:${({theme}) => theme.colors.primary.brand};
        white-space: nowrap;
        font-size: 1.6rem;
        
        div{
            color:red;
            white-space: normal;
        }      
    }

`;
