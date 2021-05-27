import styled from 'styled-components';
import Layout from 'components/Layout';
import theme from 'themes/theme';

const ProjectJWrapper = styled(Layout)`
  text-align: justify;
  .personalSaveLink {
    font-weight: bold;
    text-decoration: underline;
  }
  .checkBoxContainer {
    transform: translateY(-2.4rem);
  }
  .alertContainer {
    p {
      color: ${theme.colors.text.point}
    }
  }
`;

export default ProjectJWrapper;
