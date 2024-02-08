import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="ma">
      <div className="absolute">
        <img
          id="inputImage"
          src={imageUrl}
          alt=""
          width={"500px"}
          height={"auto"}
        />
        {box.map((box) => (
          <div
            key={`box${box.topRow}${box.rightCol}`}
            className="bounding-box"
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
