import styled from 'styled-components';
import Layout from 'components/Layout';

export const AplFxProxyWrapper = styled(Layout)`
    .hint-message{
        a{
            color:${(({theme}) => theme.colors.primary.dark)}
        }
    }
`;
