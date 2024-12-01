import styled from 'styled-components';

export const StyledButton = styled.button`
  background: linear-gradient(145deg, #2a2a2a, #3e3e3e); /* Soft gradient for depth */
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 700;
  margin: 6px 4px;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2), 
              -2px -2px 6px rgba(255, 255, 255, 0.1); /* Neumorphic shadow */
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(145deg, #3e3e3e, #2a2a2a); /* Reverse gradient on hover */
    color: #ffda79; /* A vibrant accent color for text */
    transform: scale(1.05); /* Slight enlargement */
    box-shadow: 6px 6px 14px rgba(0, 0, 0, 0.3), 
                -4px -4px 8px rgba(255, 255, 255, 0.2); /* Enhanced shadow on hover */
  }

  &:active {
    transform: scale(0.98); /* Button press effect */
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.4), 
                inset -2px -2px 4px rgba(255, 255, 255, 0.1); /* Inset shadow for pressed look */
  }
`;
