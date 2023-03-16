import React from "react";
import PropTypes from "prop-types";
import { getTranslate } from "react-localize-redux";
import { connect } from "react-redux";

import PaginationButton from "../components/PaginationButton";
import { Dropdown } from "tse-storybook";

@connect(
  state => ({
    translate: getTranslate(state.locale)
  }),
  () => ({})
)
class Pagination extends React.Component {
  render() {
    const { size, currentpage, page } = this.props.page;
    const selected = this.props.selected;
    const gotoPage = this.props.gotoPage;
    const stepPage = this.props.stepPage;
    const translate = this.props.translate;
    const handleChangeNumItem = this.props.handleChangeNumItem;
    return (
      <div className="pagination">
        <div className="pagination-item">
          <div className="pagination_text_dropdown capitalizes__first-letter">
            {translate("show")}
          </div>
          <Dropdown
            className="pagination_text_dropdown pagination_dropdown"
            fullwidth
            border
            hinter={selected}
            options={[
              { lable: "10", onClick: () => handleChangeNumItem(10) },
              { lable: "20", onClick: () => handleChangeNumItem(20) },
              { lable: "50", onClick: () => handleChangeNumItem(50) },
              { lable: "100", onClick: () => handleChangeNumItem(100) }
            ]}
          />
          <div className="pagination_text_dropdown">
            {translate("of")} <b>{size}</b> {translate("perPage")}
          </div>
        </div>
        <div className="pagination-item button-paging--list">
          <PaginationButton
            currentpage={currentpage}
            numberPage={page}
            handleClick={gotoPage}
            stepPage={stepPage}
          />
        </div>
      </div>
    );
  }
}

Pagination.propTypes = {
  page: PropTypes.object,
  selected: PropTypes.number,
  gotoPage: PropTypes.func,
  stepPage: PropTypes.func,
  handleChangeNumItem: PropTypes.func,
  translate: PropTypes.func
};
export default Pagination;
