import React from "react";
import Tilt from "react-parallax-tilt";
import brain from "./brain.png";

const Logo = () => {
  return (
    <Tilt on style={{ height: 150, width: 150, zIndex: 1 }}>
      <div className="ma3 pa3 shadow-2 ">
        <img src={brain} alt="malto" />
      </div>
    </Tilt>
  );
};

export default Logo;
