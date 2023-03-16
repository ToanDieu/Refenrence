import React from "react";
import PropTypes from "prop-types";
import backButton from "../assets/icons/ic-back.svg";
import nextButton from "../assets/icons/ic-next.svg";

class PaginationButton extends React.Component {
  render() {
    const currentPage = this.props.currentpage;
    const numberPage = this.props.numberPage;
    const handleClick = this.props.handleClick;
    const stepPage = this.props.stepPage;

    //setup Pagination Button
    let maxbutton = 5;
    let first = 1;
    let last = numberPage;
    let middlebuttons = {
      first: 1,
      last: maxbutton
    };

    if (maxbutton > numberPage) {
      first = 0;
      last = 0;
      middlebuttons = {
        first: 1,
        last: numberPage
      };
    } else {
      if (currentPage <= Math.floor(maxbutton / 2)) {
        // near header list button
        first = 0;
        console.log("header");
      } else {
        if (currentPage >= numberPage - Math.floor(maxbutton / 2)) {
          // near footer list button
          console.log("footer");
          last = 0;
          middlebuttons.first = numberPage - maxbutton;
          middlebuttons.last = numberPage;
        } else {
          console.log("not");
          middlebuttons.first = currentPage - Math.floor(maxbutton / 2);
          middlebuttons.last = currentPage + Math.floor(maxbutton / 2);
        }
      }

      if (first == middlebuttons.first) {
        first = 0;
      }
      console.log(
        "last == middlebuttons.last:",
        last,
        middlebuttons.last,
        last == middlebuttons.last
      );
      if (last == middlebuttons.last) {
        last = 0;
      }
      if (middlebuttons.last > numberPage) {
        middlebuttons.last = numberPage;
        last = 0;
      }
    }

    console.log("setuppagging:", first, last, middlebuttons, currentPage);

    const listPagin = () => {
      let buttons = [];

      if (first > 0) {
        buttons.push(
          <button
            onClick={currentPage == first ? () => {} : () => handleClick(first)}
            className={
              currentPage == first
                ? "button-paging button-paging--selected"
                : "button-paging button-paging--default"
            }
          >
            {first}
          </button>
        );
        buttons.push(
          <button className="button-paging button-paging--default">
            {" "}
            ...{" "}
          </button>
        );
      }
      for (let i = middlebuttons.first; i <= middlebuttons.last; i++) {
        if (i == currentPage) {
          buttons.push(
            <button key={i} className="button-paging button-paging--selected">
              {i}
            </button>
          );
        } else {
          buttons.push(
            <button
              key={i}
              onClick={() => handleClick(i)}
              className="button-paging button-paging--default"
            >
              {i}
            </button>
          );
        }
      }
      if (last > 0) {
        buttons.push(
          <button className="button-paging button-paging--default">
            {" "}
            ...{" "}
          </button>
        );
        buttons.push(
          <button
            onClick={currentPage == last ? () => {} : () => handleClick(last)}
            className={
              currentPage == last
                ? "button-paging button-paging--selected"
                : "button-paging button-paging--default"
            }
          >
            {last}
          </button>
        );
      }
      return buttons;
    };
    return (
      <div
        style={{
          textAlign: "center"
        }}
      >
        <img
          onClick={() => stepPage(false, currentPage, numberPage)}
          className="button-paging--small"
          src={backButton}
        />
        {listPagin()}
        <img
          onClick={() => stepPage(true, currentPage, numberPage)}
          className="button-paging--small"
          src={nextButton}
        />
      </div>
    );
  }
}
PaginationButton.propTypes = {
  currentpage: PropTypes.number,
  numberPage: PropTypes.number,
  handleClick: PropTypes.func,
  stepPage: PropTypes.func
};

export default PaginationButton;
