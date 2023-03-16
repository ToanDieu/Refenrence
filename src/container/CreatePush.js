import React from "react";
import PropTypes from "prop-types";
// import { applyPatch } from "fast-json-patch";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import { pathOr } from "ramda";

import {
  fetchBaseList,
  getBaseStepsWithoutStore,
  createBaseStepsWithoutStore,
  fetchBasesContentWithoutStore
} from "../actions/base";
import closeIcon from "../assets/icons/ic-close.svg";
import CreatePushForm from "../components/CreatePushForm";

class CreatePush extends React.Component {
  state = {
    bases: [],
    baseIDs: []
  };
  // HACK force retrive baseID
  componentWillMount = () => {
    let typeID;
    if (this.props.typeList.data.length > 0) {
      typeID = this.props.typeID;

      this.props.getBaseList({ typeID }).then(() => {
        this.props.baseList.data.map(base => {
          this.setState({
            baseIDs: [...this.state.baseIDs, base.id]
          });
        });

        this.props
          .fetchBasesContent(typeID, {
            baseIDs: this.state.baseIDs
          })
          .then(data => {
            data.map(detail => {
              let baseDetail = detail;

              const secondaryIndex = pathOr(
                [],
                ["fields", "front"],
                baseDetail
              ).findIndex(field => field.id.includes("secondary"));

              let baseState = {
                meta: this.props.baseList.data.find(
                  base => base.id == baseDetail.id
                ),
                detail: baseDetail
              };

              if (secondaryIndex != -1) {
                baseState.secondaryFrontFieldIndex = secondaryIndex;
                baseState.isPushable = true;
                baseState.error = undefined;
              } else {
                baseState.secondaryFrontFieldIndex = secondaryIndex;
                baseState.isPushable = false;
                baseState.error = "secondary front field is not exist";
              }

              this.setState({
                bases: [...this.state.bases, baseState]
              });

              // this.props.getBaseSteps({ baseID: base.id }).then(steps => {
              //   // console.log(
              //   //   "detail: ",
              //   //   detail,
              //   //   "- steps: ",
              //   //   sortBy(i => i.orderNum, steps)
              //   // );
              //   if (steps.length > 0) {
              //     sortBy(i => i.orderNum, steps).map(({ patches = [] }) => {
              //       if (patches.length > 0) {
              //         baseDetail = applyPatch(baseDetail, patches).newDocument;
              //       }
              //     });
              //   }
              //   // console.log("patched detail: ", baseDetail);

              //   const secondaryIndex = pathOr(
              //     [],
              //     ["fields", "front"],
              //     baseDetail
              //   ).findIndex(field => {
              //     return field.id === "secondary";
              //   });

              //   let baseState = {
              //     meta: base,
              //     detail: baseDetail
              //   };

              //   if (secondaryIndex != -1) {
              //     baseState.secondaryFrontFieldIndex = secondaryIndex;
              //     baseState.isPushable = true;
              //     baseState.error = undefined;
              //   } else {
              //     baseState.secondaryFrontFieldIndex = secondaryIndex;
              //     baseState.isPushable = false;
              //     baseState.error = "secondary front field is not exist";
              //   }

              //   this.setState({
              //     bases: [...this.state.bases, baseState]
              //   });
              // });
            });
          });
      });
    }
  };

  render = () => (
    <div className="Modal Modal--full">
      <div className="card card--modal card--lg">
        <div className="card__title card__title--form">
          <div className="capitalizes__all-letter">
            {this.props.translate("addPushNotification")}
          </div>
          <div
            className="card__title__close"
            onClick={this.props.togglePushForm}
          >
            <img src={closeIcon} />
          </div>
        </div>
        <CreatePushForm
          checkedBases={this.state.bases}
          translate={this.props.translate}
        />
      </div>
    </div>
  );
}

CreatePush.propTypes = {
  typeID: PropTypes.number,
  getBaseList: PropTypes.func,
  getBaseSteps: PropTypes.func,
  togglePushForm: PropTypes.func,
  typeList: PropTypes.arrayOf(PropTypes.object),
  baseList: PropTypes.arrayOf(PropTypes.object),
  translate: PropTypes.func,
  fetchBasesContent: PropTypes.func
};

const mapState = ({ baseList, typeOrg, locale }) => ({
  baseList: baseList.data ? baseList : { ...baseList, data: [] },
  typeList: typeOrg.data ? typeOrg : { ...typeOrg, data: [] },
  translate: getTranslate(locale)
});

const mapDispatch = dispatch => ({
  getBaseList: bindActionCreators(fetchBaseList, dispatch),
  getBaseSteps: bindActionCreators(getBaseStepsWithoutStore, dispatch),
  fetchBasesContent: bindActionCreators(
    fetchBasesContentWithoutStore,
    dispatch
  ),
  createBaseSteps: bindActionCreators(createBaseStepsWithoutStore, dispatch)
});

export default connect(
  mapState,
  mapDispatch
)(CreatePush);
