import { styled } from "styled-components";

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


// stlyed component input container/wrapper
export const InputContainer = styled.div`
    background-color: #131313;
    padding: 12px 16px;
    border-radius: 10px;
    width: 100%;
    box-sizing: border-box;
`;


// styling for the input labels
export const InputLabel = styled.label`
    display: block;
    color: #8f8f8f;
    font-size: 14px;
    margin: 4px 0;
`;


export const SubmitButton = styled.button`
    width: 100%;
    border: none;
    outline: none;
    background-color: #893858;
    color: #fff; // text color-- replace with hex later
    font-family: 'Inter';
    font-size: 15px;
    border-radius: 10px;
    padding: 25px 0;
`;


// container for general page content
export const Page = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: #1a1a1a;
`;