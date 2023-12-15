import styled from "styled-components";

export const MainContainer = styled.div`
     padding: 20px;
    margin-top: 10vh;
    height: 90vh;
    overflow-y: auto;
    background-color: var(--main-background);
    width: 100%;
`

export const CurrentUser = styled.span`
    color: #007bff;
`

export const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin-top:30px;
`;

export const SectionCard = styled.div`
  flex: 0 0 calc(100% - 20px);
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;

  @media (min-width: 768px) {
    flex: 0 0 calc(50% - 20px);
    margin-right: 20px;
  }

  @media (min-width: 1024px) {
    flex: 0 0 calc(33.333% - 20px);
  }
`;

export const DashboardItem = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  padding: 20px;

  .dashboard-icon {
    margin-bottom: 10px;
    color: ${(props) => props.iconColor || '#333'};
  }
`;

export const DetailsContainer = styled.div`
  margin-top: 20px;
`;