/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import Layout from 'components/Layout';

const A00800Wrapper = styled(Layout)`
    .phone_input {
        position: relative;

        .phone_input_send {
            position: absolute;

            right: 0;
            top: -0.2rem;
        }

        form {
            padding-bottom: 0;
        }
    }
    .basic_data_form {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-bottom: 0;
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
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 12px;
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
