import styled from "@emotion/styled";

export const Article = styled.article`
  padding: 47px 20px 93px 20px;
  max-width: 1245px;
  margin: auto;
  min-height: calc(100vh - 156px);
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 1.5;
  margin-bottom: 22px;
`;

export const PageTitle = styled.h1`
  color: ${props => props.theme.primary};
`;
