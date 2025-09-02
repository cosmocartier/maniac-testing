import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <span />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    position: relative;
    width: 160px;
    height: 160px;
    border: 4px solid #000000;
    overflow: hidden;
    border-radius: 50%;
    box-shadow: -5px -5px 5px rgba(0, 0, 0, 0.1),
      10px 10px 10px rgba(0, 0, 0, 0.4),
      inset -5px -5px 5px rgba(0, 0, 0, 0.2),
      inset 10px 10px 10px rgba(0, 0, 0, 0.4);
  }

  .loader:before {
    content: "";
    position: absolute;
    top: 25px;
    left: 25px;
    right: 25px;
    bottom: 25px;
    z-index: 10;
    background: #000000;
    border-radius: 50%;
    border: 2px solid #000000;
    box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.2),
      inset 3px 3px 5px rgba(0, 0, 0, 0.5);
  }

  .loader span {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-image: linear-gradient(
      -225deg,
      #4502ff 0%,
      #8000ff 50%,
      #5e66ff 100%
    );
    filter: blur(20px);
    z-index: -1;
    animation: animate 1s linear infinite;
  }

  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }`;

export default Loader;
