import { styled } from "styled-components";


// stlyed component input container/wrapper
export const InputContainer = styled.div`
    background-color: #131313;
    padding: 12px 16px;
    border-radius: 10px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 8px;
    transition: all 200ms ease-in-out;
`;

// styling for the input labels
export const InputLabel = styled.label`
    display: block;
    color: #8f8f8f;
    font-size: 14px;
    margin: 4px 0;
    &:active {
        
    }
`;

// styled component for form inputs
export const InputField = styled.input`
    font-family: 'Inter';
    font-size: 18px;
    outline: none;
    border: none;
    background-color: inherit;
    color: #fff;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 4px 0;
`;

export const SubmitButton = styled.button`
    width: 100%;
    outline: none;
    background-color: #893858;
    color: #fff;
    font-family: 'Inter';
    font-size: 16px;
    font-weight: 500;
    border-radius: 10px;
    border: 2px solid transparent;
    padding: 25px 0;
    transition: 100ms background-color ease;
    &:hover {
        background-color: #df558c;
    }
    &:active {
        background-color: #f14d8f;
        box-shadow: 2px 2px 5px #b40c4f;
    }
    &:focus {
        background-color: #f15b97;
        border: 2px solid #00a8fc;
    }
`;


// container for general page content
export const Page = styled.div`
    background-color: #1a1a1a;
    height: auto;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;


// temp 
export const HomePageContainer = styled.div`
    background-color: #1a1a1a;
    height: 100%;
`;

// what is in the side bar?
// => conversations, friends, groups(?) 
export const NavBarStyle = styled.div`
    background-color: #fff;
    color: #000;
    height: 100%;
    width: 300px;
`;