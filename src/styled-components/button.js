import styled from 'styled-components';

export const StyledButton = styled.button`
  background-color: black; 
  color: white;
  border: none;
  padding: 10px 20px; 
  font-size: 16px; 
  font-weight: 700; 
  margin: 4px 2px; 
  cursor: pointer; 
  border-radius: 5px;

  &:hover {
    background-color: white; 
    color: #333; 
    border: 2px solid #333;
  }
`;
