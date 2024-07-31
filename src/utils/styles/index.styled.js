import { styled } from "styled-components";
// stlyed component input container/wrapper
export const InputContainer = styled.div`
    background-color: #f4efdc;
    padding: 12px 16px;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 12px;
    transition: all 120ms ease-in-out;
    &:focus-within {
        border-left: 8px solid #8ccbb7;
    }
`;

// styling for the input labels
export const InputLabel = styled.label`
    display: block;
    color: #4a3425;
    font-family: 'vhs';
    font-weight: bold;
    font-size: 24px;
    margin: 4px 0;
`;

// styled component for form inputs
export const InputField = styled.input`
    font-family: 'Inter';
    font-size: 18px;
    outline: none;
    border: none;
    background-color: inherit;
    color: #000;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 4px 0;
    border-bottom: 1px solid #d1cdbd
`;

export const SubmitButton = styled.button`
    width: 100%;
    outline: none;
    background-color: #8ccbb7;
    color: #f4efdc;
    font-family: 'vhs';
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 0.1em;
    border-radius: 10px;
    border: 2px solid transparent;
    padding: 25px 0;
    margin-top: 8px;
    transition: 100ms background-color ease;
    &:hover {
        background-color: #fdb604;
    }
    &:active {
        background-color: #fdb604;
        box-shadow: 1px 1px 1px #ebd9b3;
    }
    &:focus {
        background-color: #fdb604;
    }
`;

// container for general page content
export const Page = styled.div`
    background-color: #2f2f2f;
    /* background-color: #ebd9b3; */
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