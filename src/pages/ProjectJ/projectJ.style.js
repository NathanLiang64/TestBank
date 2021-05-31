import styled from 'styled-components';
import Layout from 'components/Layout';
import theme from 'themes/theme';

const ProjectJWrapper = styled(Layout)`
  .projectDescription {
    font-size: 1rem;
  }
  .agreeLabel {
    p {
      color: ${theme.colors.text.lightBlue};
      font-size: 1rem;
    }
  }
  text-align: justify;
  .personalSaveLink {
    font-weight: bold;
    text-decoration: underline;
  }
  .checkBoxContainer {
    .MuiFormControlLabel-root {
      align-items: flex-start;
      .MuiButtonBase-root {
        padding-top: 4px;
      }
    }
  }
  .alertContainer {
    p {
      font-size: 1rem;
      color: ${theme.colors.text.lightBlue};
    }
  }
`;

export default ProjectJWrapper;
