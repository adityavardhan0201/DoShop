import styled from 'styled-components';

export const StyledButton = styled.button`
  background-color: #db4437;
  border: none;
  color: white; /* White text */
  padding: 10px 20px; /* Padding */
  text-align: center; /* Center text */
  text-decoration: none; /* No underline */
  display: inline-block; /* Inline-block display */
  font-size: 16px; /* Font size */
  margin: 4px 2px; /* Margins */
  cursor: pointer; /* Pointer cursor on hover */
  border-radius: 5px; /* Rounded corners */
  margin-left: 10px;
  &:hover {
    background-color: #c33d2e; /* Darker green on hover */
  }
`;
