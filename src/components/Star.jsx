import React from "react";
import PropTypes from "prop-types";

import icStar from "../assets/icons/ic-star.svg";
import icStarEmpty from "../assets/icons/ic-star-empty.svg";

const Star = ({ starNumb }) => {
  let stars = [];
  const maxStar = 5;
  let i = 0;
  for (; i < starNumb; i++) {
    stars.push(<img key={i} className="rating-stars" src={icStar} />);
  }
  for (; i < maxStar; i++) {
    stars.push(<img key={i} className="rating-stars" src={icStarEmpty} />);
  }

  return <div style={{ height: "22px", lineHeight: "22px" }}>{stars}</div>;
};

Star.propTypes = {
  starNumb: PropTypes.number
};

export default Star;
