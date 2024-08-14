import { styled } from "styled-components";
// stlyed component input container/wrapper
export const InputContainer = styled.div`
    background-color: #f4efdc;
    padding: 8px 16px;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 12px;
    transition: all 120ms ease-in-out;
    &:focus-within {
        border-left: 8px solid #fcb606;
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

export const TestButton = styled.button`
    width: 100%;
    outline: none;
    border: 4px #090909 solid;
    border-radius: 10px;
    padding: 25px 0;
    margin: 0.5em 0 0.5em 0;
    background: linear-gradient(145deg, #171717, #444);
    box-shadow: inset 2px 2px 0px #7d7c7e,
    inset -2px -2px 0px #1c1c1c;
    color: #eecf96;
    font-family: 'vhs';
    font-size: 24px;
    &:hover {
        border-color: #171717;
        background: #252525;
    }
    &:focus {
        border-color: #171717;
        background: #252525;
    }
    &:active {
        border-color: #171717;
        /* background: linear-gradient(145deg, #303030, #444245); */
        transform: translateY(2px)
    }
`;

export const PageHeader = styled.div`
    font-family: 'vhs-bold';
    font-size: 50px;
    color: #f4efdc;
    margin-bottom: 24px;
`;

export const SectionHeader = styled.div`
    font-family: 'vhs-bold';
    font-size: 2em;
    color: #f4efdc;
`;

// container for general page content
export const Page = styled.div`
    /* background-color: #2f2f2f; */
    /* background-color: #ebd9b3; */
    height: auto;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;


export const HomePageContainer = styled.div`
    /* background-color: #1a1a1a; */
    height: 100%;
    display: flex;
`;

// what is in the side bar?
// => conversations, friends, groups(?) 
export const SideBarContainer = styled.div`
    background-color: var(--dark-gray);
    color: #f4efdc;
    height: 100%;
    min-width: 350px;
    display: flex;
    flex-direction: column;
    align-items:center;
    overflow: hidden;
`;