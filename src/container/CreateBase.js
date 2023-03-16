import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { getTranslate } from "react-localize-redux";

import { clearForm, fetchCaseListByBase } from "../actions/case";
import { submitNewBase } from "../actions/base";
import closeIcon from "../assets/icons/ic-close.svg";
import CreateBaseForm from "../components/CreateBaseForm";

class CreateBase extends React.Component {
  submitNewBase = values => {
    console.log("submit new base");
    this.props.submitNewBase({ values, typeID: this.props.typeID });
    this.props.toggleBaseForm();
  };

  render() {
    const {
      showBaseForm,
      toggleBaseForm,
      error,
      loading,
      clearForm,
      translate
    } = this.props;
    const FormModal = (
      <div className="Modal Modal--full">
        <div className="card card--modal">
          <div className="card__title card__title--form">
            <div>{translate("createBase")}</div>
            <div
              className="card__title__close"
              onClick={() => {
                toggleBaseForm();
                clearForm();
              }}
            >
              <img src={closeIcon} />
            </div>
          </div>
          <CreateBaseForm
            onSubmit={value => {
              this.submitNewBase(value);
            }}
            error={error}
            loading={loading}
            translate={translate}
          />
        </div>
      </div>
    );
    return showBaseForm ? FormModal : "";
  }
}

CreateBase.propTypes = {
  submitNewBase: PropTypes.func,
  push: PropTypes.func,
  showBaseForm: PropTypes.bool,
  loading: PropTypes.bool,
  toggleBaseForm: PropTypes.func,
  clearForm: PropTypes.func,
  fetchCaseListByBase: PropTypes.func,
  typeID: PropTypes.number,
  error: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
  translate: PropTypes.func
};

const mapState = state => {
  // console.log("mapState__typeOrg: ", state.typeOrg);
  return {
    ...state.caseCreate,
    translate: getTranslate(state.locale)
  };
};

const mapDispatch = dispatch => {
  return {
    submitNewBase: bindActionCreators(submitNewBase, dispatch),
    push: bindActionCreators(push, dispatch),
    clearForm: bindActionCreators(clearForm, dispatch),
    fetchCaseListByBase: bindActionCreators(fetchCaseListByBase, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(CreateBase);
