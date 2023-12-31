import styled from "styled-components";

export const ClientDocumentContainer = styled.div`
    margin-top: 10vh;
    height: 90vh;
    padding: 1rem;
    width: 100%;
    text-align: start;
    overflow: auto;
    background-color: var(--main-background);
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

export const Description = styled.p`
    font-size: 16px;
    margin-bottom: 20px;
    @media screen and (max-width:768px){
        font-size:14px;
    }
`;

export const CtaSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 20px;
    border-radius: 4px;
`;

export const Lable = styled.label`
    margin-top:10px;
`

export const Button = styled.button`
    border-radius: 30px;
    padding: 8px 16px;
    background-color: transparent;
    color: var(--main-background-white);
    cursor: pointer;
    font-weight: bold;
    border: none;
`

export const DocumentsTableContainer = styled.div`
    width:100%;
`

export const DocumentTableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`;

export const DocumentTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
`;


export const DocumentName = styled.span`
    font-size:16px;
    @media screen and (max-width:912px){
        font-size:14px;
    }
    @media screen and (max-width:768px){
        font-size:12px;
    }
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

export const NoDocumentsContainer = styled.div`
    height:80vh;
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
`

export const ButtonContainer = styled.div`
    width:100%;
    display:flex;
    justify-content:flex-end;
`

export const ViewButton = styled(Button)`
    background-color: transparent;
    border: 1.4px solid var(--accent-background);
    color: var(--accent-background);
    &:hover{
        color: var(--button-text);
        background-color: var(--accent-background);
    }
`