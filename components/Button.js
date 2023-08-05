import { css, styled } from "styled-components";

export const buttonStyles = css`
background-color: #5542F6;
    border:0;
    color: #fff;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    svg {
        height: 16px;
        margin-right: 5px;
    }
    ${props => props.block && css`
    display: block;
    width: 100%;`}
    ${props => props.white  && !props.outline && css`
    background-color: transparent;
    color:#000;`}
    ${props => props.white  && props.outline && css`
    background-color: transparent;
    color:#fff;
    border: 1px solid #fff;`}
    ${props => props.primary && css`
    background-color: #5542F6;
    border: 1px solid #5542F6;
    `}
    ${props => props.size === "l" && css`   
    font-size: 1.2rem;
    padding: 10px 20px;
    svg {
        height: 20px;
    }
    `}`;

export const StyledButton = styled.button`
    ${buttonStyles}
`;

export default function Button({ children, ...rest }) {
    return (
        <StyledButton {...rest}>{children}</StyledButton>
    )
}