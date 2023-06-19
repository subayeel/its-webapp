import { AddCircleOutlineOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const CenterFlexContainer = styled.div`
  display: flex;
  align-items: ${(props) => (props.align ? props.align : "center")};
  justify-content: ${(props) => (props.justify ? props.justify : "center")};
`;

export const Container = styled(CenterFlexContainer)`
  flex-direction: column;
`;

export const MainContainer = styled.div`
  margin: auto;
  max-width: 1140px;
`;

export const GridContainer = styled.div`
  display: grid;
  box-sizing: "border-box";
  gap: ${(props) => (props.gap ? props.gap : "1rem")};
  grid-template-columns: ${(props) => props.columns};
  place-content: ${(props) => (props.place ? props.place : "center")};
  align-items: ${(props) => (props.align ? props.align : "center")};
  justify-content: ${(props) => (props.justify ? props.justify : "center")};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
`;

export const RelativeContainer = styled.div`
  position: absolute;
`;
export const Absolute = styled.div`
  position: absolute;
  width: ${(props) => props.width};
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
  left: ${(props) => props.left};
`;

export const FullScreen = styled.div`
  height: calc(100vh - 60px);
`;

export const HLine = styled.hr`
  width: 100%;
  height: 2px;
  background-color: #ddd;
  border: none;
`;

export const CardContainer = styled(CenterFlexContainer)`
  flex-wrap: wrap;
  flex: 1;
  margin: 1rem 0;
  padding: 1.8rem;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24);

  @media screen and (max-width: 768px) {
    /* width: 100%; */
    padding: 0.7rem;
    margin: 0.2rem;
    border-radius: 20px;
    /* display: none; */

    & > div {
      width: 100%;
    }
  }
`;

export const ErrorContainer = styled(CenterFlexContainer)`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  background-color: #fa6a64;
  margin: 8px 0;
  color: #fff;
  font-weight: 500;
`;

export const TextButton = styled.p`
  padding: 0.7rem 1rem;
  color: blue;
  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

export const TextField = styled.input`
  padding: 0.7rem 1rem 0.7rem 2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
`;

export const HeroText = styled.h1`
  text-align: center;
  color: #6c6c6c;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.5px;
  width: 100%;
  margin: 0 0 1rem 0;
`;
export const Heading = styled.h1`
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.5px;
  width: 100%;
  margin: 0 0 1rem 0;
`;
export const Heading2 = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #303234;
  margin: 0 0 4px 0;
  width: 100%;
`;
export const LightText = styled.p`
  font-size: 14px;
  color: #777;
  margin: 0;
`;
export const LinkText = styled(Link)`
  font-size: 14px;
  color: #6095f0;
  margin: 0;
  text-decoration: none;
  &:hover {
    color: #2024ea;
    cursor: pointer;
  }
`;
export const AddIcon = styled(AddCircleOutlineOutlined)`
  font-size: 14px;
  color: #6095f0;
  margin: 0;
  text-decoration: none;
  &:hover {
    color: #2024ea;
    cursor: pointer;
  }
`;
