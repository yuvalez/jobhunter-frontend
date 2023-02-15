import styled from 'styled-components';

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: 8rem;
  ${({ palette }) => palette && `background-color: ${palette.background};`}
  ${({ palette }) => palette && `color: ${palette.text};`}
  text-align: center;
  border-radius: 0.36rem;
  padding: 0.3rem 0;
  position: absolute;
  z-index: 1;
  ${({ direction }) => `${direction}: ${["top", "bottom"].includes(direction) ? '-3.2rem' : '-9rem'}`};
  ${({ direction }) => ["top", "bottom"].includes(direction) ? 'left: 50%' : 'bottom:50%'};
  transform: ${({ direction }) => ["top", "bottom"].includes(direction) ? 'translateX(-50%)' : 'translateY(50%)'};
  opacity: 0;
  transition: opacity 0.3s;
`;

const TooltipWrapperWithHover = styled(TooltipWrapper)`
  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = ({ text, children, palette = null, direction = "top" }) => {

  return (
    <TooltipWrapperWithHover>
      <TooltipText palette={palette} direction={direction}>{text}</TooltipText>
      {children}
    </TooltipWrapperWithHover>
  );
}

export default Tooltip;