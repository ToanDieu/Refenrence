import React from "react";
import PropTypes from "prop-types";

import DatePickerFromTo from "./DatePickerFromTo";
import DateRange from "./DateRange";

class DateRangeOrFromTo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isFromTo,
      last7DaysAction,
      last30DaysAction,
      customDatesAction,
      dateFrom,
      dateTo,
      iconCloseClick,
      handleOnchangeFromTo,
      nonAction
    } = this.props;
    return (
      <div>
        {isFromTo ? (
          <DatePickerFromTo
            dateFrom={dateFrom ? dateFrom : null}
            dateTo={dateTo ? dateTo : null}
            iconClick={iconCloseClick}
            handleOnchange={handleOnchangeFromTo}
          />
        ) : (
          <DateRange
            nonAction={nonAction}
            last7DaysAction={last7DaysAction}
            last30DaysAction={last30DaysAction}
            customDatesAction={customDatesAction}
          />
        )}
      </div>
    );
  }
}

DateRangeOrFromTo.propTypes = {
  isFromTo: PropTypes.bool,
  last7DaysAction: PropTypes.func,
  last30DaysAction: PropTypes.func,
  customDatesAction: PropTypes.func,
  iconCloseClick: PropTypes.func,
  dateFrom: PropTypes.string,
  dateTo: PropTypes.string,
  handleOnchangeFromTo: PropTypes.func,
  nonAction: PropTypes.func
};

export default DateRangeOrFromTo;
