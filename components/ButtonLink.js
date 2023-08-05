import Link from "next/link";
import styled, { css } from "styled-components";
import { buttonStyles } from "./Button";

const StyledLink = styled(Link)`
${buttonStyles
    }`

export default function ButtonLink(props){
    return (
        <StyledLink {...props}/>
    );
}