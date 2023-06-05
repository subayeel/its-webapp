import styled from "styled-components";
import { CenterFlexContainer, GridContainer } from "../Global";

export const NavContainer = styled(GridContainer)`
  grid-template-columns: 1fr 4fr 2fr auto;
  padding: 0 2rem;
  height: 60px;
border-bottom: 2px solid #ddd;
  /* box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.4); */
`;

export const LogoText = styled.h2`
  font-size: 24px;
  margin: 0;
  color: #224368;
`;

export const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  & > li {
    margin: 0 8px;
    color: #000;
    font-weight: 600;

    &:hover {
      cursor: pointer;
      color: #6dddc1;
    }
  }
  & > li > a {
    text-decoration: none;
    color: inherit;
  }
`;

export const SearchBtn = styled.button`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  background-color: #e58f52;
  color: #fff;
  border: none;
  border-radius:4px;
  padding: 0.7rem;
`;
