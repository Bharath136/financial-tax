import styled, { keyframes } from "styled-components";


export const StaffListContainer = styled.div`
    width: 100%;
    margin: auto;
    margin-top: 10vh;
    padding: 1rem;
    background-color: var(--main-background);
    height: 90vh;
    overflow:auto;
`

export const H1 = styled.h1`
    color: var(--headings);
    font-weight: bolder;
    font-size: 26px;
    margin: 10px 0;
    margin-bottom: 20px;
    font-family:Arial, Helvetica, sans-serif;
    @media screen and (max-width:768px){
        font-size:20px;
    }
`;

export const ClientsHeaderContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    @media screen and (max-width:512px){
        flex-direction:column;
        align-items:flex-start;
    }
`

export const SearchBarContainer = styled.div`
    display: flex;
    width:20vw;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 30px;
    @media screen and (max-width:768px){
        width:40vw;
    }
    @media screen and (max-width:512px){
        width:80vw;
    }
`

export const SearchBar = styled.input`
    border: none;
    outline: none;
    border-radius: 30px;
    padding:10px 20px;
    width:100%;
    font-size:16px;
`

export const SearchButton = styled.button`
    height:30px;
    border-radius:30px;
    outline:none;
    border:none;
    background:transparent;
    color:grey;
`

export const FilterSelect = styled.select`
    border: none;
    outline: none;
    @media screen and (max-width:512px){
        margin-top:20px;
    }
`

export const TableContainer = styled.div`
    background-color: var(--background-white);
    padding: 20px;
    padding-bottom:100px;
    overflow:auto;
`

export const Container = styled.div`
    width:100%;
    overflow:auto;
`

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    text-align: center;
`

export const Th = styled.th`
    border: 1px solid var(--border);
    padding: 10px;
    text-align: center;
    background-color: var(--main-background);
`

export const Td = styled.td`
    border: 1px solid var(--border);
    padding: 10px;
    text-align: center;
`

export const Button = styled.button`
    border-radius: 30px;
    padding: 8px 16px;
    background-color: transparent;
    color: var(--button-text);
    cursor: pointer;
    font-weight: bold;
    border: none;
`

export const ExecuteButton = styled(Button)`
    color: var(--button-text);
    background-color: var(--accent-background);
    &:hover{
        background-color: transparent;
        color: var(--accent-background);
        border: 1.4px solid var(--accent-background);
    }
`

export const NoClientContainer = styled.div`
    height:70vh;
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
`

export const ScrollingTextContainer = styled.div`
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
`

export const ScrollingText = styled.p`
    font-weight:600;
    font-size:16px;
    margin:0;
  white-space: nowrap;
  width: 100%;
  animation: scrollText 15s linear infinite;

  @keyframes scrollText {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;
