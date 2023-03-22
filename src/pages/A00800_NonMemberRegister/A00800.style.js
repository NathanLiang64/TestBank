/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import Layout from 'components/Layout';

const A00800Wrapper = styled(Layout)`
    min-height: max-content;

    .basic_data_form {
        display: grid;
        align-content: flex-start;
        grid-gap: 2rem;
        margin-bottom: 2rem;
    }
    .form_item {
        margin: 1rem 0;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: space-between;
        grid-template-columns: 25% 70%
    }
    .form_item_input {
        display: flex;
        flex-direction: column;
    }
    .term_agree {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .form_button {
        margin-bottom: 2rem;
    }

    .accoridon_title {
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 1.2rem;
    }
    .accoridon_content {
        ul {
            li {
                list-style: none;
            }
        }
    }
`;

export default A00800Wrapper;
