import React from "react";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import Loading from "../components/Loading";

class List extends React.Component {
  render() {
    const { loading, data, error, name } = this.props;
    return (
      <div>
        <h2>{name}</h2>
        {loading ? (
          <Loading />
        ) : error ? (
          <p>{error}</p>
        ) : data ? (
          <div>
            <ReactJson src={data} />
          </div>
        ) : (
          "no data"
        )}
      </div>
    );
  }
}

List.propTypes = {
  name: PropTypes.string,
  error: PropTypes.bool,
  loading: PropTypes.bool,
  data: PropTypes.array
};

export default List;
