import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { Route, matchPath } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import co from "co";

import sanHTML from "sanitize-html";
import { pathOr } from "ramda";
import { saveAs } from "file-saver";
import { getTranslate } from "react-localize-redux";
import { Button } from "element-react";
import { NavHashLink as NavLink } from "react-router-hash-link";

import { showForm } from "@/ducks/forms";
import { componentName as PublishBaseName } from "@/components/base-publish";
import PublishBase from "@/components/base-publish/container";
import BaseContentForm from "@/components/BaseContentForm";
import PassInfoForm from "@/components/PassInfoForm";
import PassFieldsFormFront from "@/components/PassFieldsFormFront";
import PassFieldsFormBack from "@/components/PassFieldsFormBack";
import TemplatePushSchedule from "@/components/TemplatePushSchedule";
import ParamForm from "@/components/params-form/container";
import PassReview from "@/container/PassReview";
import globalIcon from "../assets/icons/ic-circle-global.svg";
import { fetchCaseList, submitNewCase } from "@/actions/case";
import { fetchPassDetailWithoutStore } from "@/actions/pass";
import {
  fetchBaseContent,
  updateBaseContent,
  updateBaseImages,
  createBaseSteps,
  getBaseSteps,
  updateBaseWithoutStore,
  fetchBase
} from "@/actions/base";
import { setBaseChannel } from "@/actions/notify";
import { ProtectedScopedComponent } from "@/components/HocComponent";
import examples from "@/constants/examples";

class BaseContent extends React.Component {
  state = {
    detail: {}, //Base Content
    meta: {}, // Base
    lang: "de",
    showLangSwitch: true,
    showPassReview: true,
    qRFormat: "svg",
    passPreviewTab: "preview",
    passDetail: { data: null, error: null, loading: true },
    imagesInfor: [],
    imageChange: false,
    images: {}
  };

  componentDidMount() {
    const baseID = this.props.match.params["baseID"];
    this.fetchBaseContent(baseID);
    this.fetchBase(baseID);
    this.props.setBaseChannel({ baseID });
    this.props.getBaseSteps({ baseID });
    this.fetchPassDetail(baseID);
  }

  turnLangSwitch = (showLangSwitch = false) => {
    this.setState({
      showLangSwitch
    });
  };

  turnPassReviewSwitch = (showPassReview = false) => {
    this.setState({
      showPassReview
    });
  };

  fetchPassDetail = baseID => {
    fetchPassDetailWithoutStore({ baseId: baseID }).then(res => {
      this.setState({
        passDetail: {
          data: res.data,
          loading: false,
          error: null
        },
        images: res.data.appleWallet.images
      });
    });
  };

  fetchBaseContent = baseID => {
    this.props.fetchBaseContent({ baseID }).then(() => {
      this.globalBaseContent = JSON.parse(
        JSON.stringify(this.props.baseDetail.data) ////Base Content
      );

      this.setState({
        detail: this.globalBaseContent //Base Content
      });
    });
  };

  fetchBase = baseID => {
    this.props.fetchBase({ baseID }).then(() => {
      this.globalBase = JSON.parse(JSON.stringify(this.props.baseMeta.data));
      this.setState({
        meta: this.globalBase //Base
      });
    });
  };

  submitNewCase = values => {
    this.props.submitNewCase({ values }).then(() => window.location.reload());
  };

  setLang = lang => {
    this.setState({ lang: lang });
  };

  switchPRTabs = name => {
    this.setState({ passPreviewTab: name });
  };

  submitGeneral = meta => {
    const baseID = this.props.match.params["baseID"];
    let payLoadBase = {
      id: meta.id,
      memo: meta.memo,
      name: meta.name,
      shortcode: meta.shortcode,
      style: meta.style,
      updatedAt: meta.updatedAt,
      timeZone: meta.timeZone
    };

    if (meta.organizationName) {
      this.props.updateBase({ payload: payLoadBase, baseID }).then(() => {
        let payload = { ...this.state.detail };
        payload.transitType = meta.transitType;
        payload.organizationName = meta.organizationName;
        payload.sharingProhibited = meta.sharingProhibited;
        this.updateBaseContent(payload);
        this.submitImages();
        this.setState({
          imageChange: false
        });
      });
    }
  };

  cloneArrayObj = originArray => {
    let cloneArray = [];
    originArray.map(element => {
      let cloneElement = Object.assign({}, element);
      cloneArray.push(cloneElement);
    });

    return cloneArray;
  };

  submitPassFields = input => {
    let detail = {};
    Object.keys(input).map(fieldName => {
      if (fieldName == "locations" || fieldName == "beacons") {
        detail[fieldName] = this.cloneArrayObj(input[fieldName]);
      } else {
        detail[fieldName] = input[fieldName];
      }
    });

    // convert type locations and beacons
    if (pathOr(false, ["locations"], detail)) {
      detail.locations.map((location, index) => {
        detail.locations[index].latitude = parseFloat(location.latitude);
        detail.locations[index].longitude = parseFloat(location.longitude);
        if (pathOr(false, ["altitude"], location)) {
          detail.locations[index].altitude = parseFloat(location.altitude);
        }
      });
    }

    if (pathOr(false, ["beacons"], detail)) {
      detail.beacons.map((beacon, index) => {
        if (pathOr(false, ["major"], beacon)) {
          detail.beacons[index].major = parseFloat(beacon.major);
        }
        if (pathOr(false, ["minor"], beacon)) {
          detail.beacons[index].minor = parseFloat(beacon.minor);
        }
      });
    }

    this.updateBaseContent(detail);
  };

  uploadAllImages = baseID => {
    let batchImagesUpload = function*() {
      return yield this.state.imagesInfor.map(image => {
        return this.props
          .updateBaseImages({ baseID, formData: image })
          .then(res => {
            return res;
          });
      });
    };
    batchImagesUpload = batchImagesUpload.bind(this);
    co(batchImagesUpload).then(() => {
      this.fetchPassDetail(baseID);
      this.setState({
        passDetail: { data: null, error: null, loading: true }
      });
    });
  };

  submitImages = () => {
    const baseID = this.props.match.params["baseID"];
    this.uploadAllImages(baseID);
  };

  imagesScarfolder = infor => {
    let count = 0;
    const { imagesInfor } = this.state;
    imagesInfor.map(image => {
      if (image.imageType === infor.imageType) {
        count++;
        image.imageFile = infor.imageFile;
      }
    });
    if (count === 0) {
      imagesInfor.push(infor);
    }

    this.setState({
      imagesInfor,
      imageChange: true
    });
  };

  submitFrontFields = front => {
    const detail = this.globalBaseContent;
    detail.fields.front = front.fields;
    console.log("submitFrontFields", front, detail);
    this.updateBaseContent(detail);
  };

  submitBackFields = back => {
    const detail = this.globalBaseContent; ////Base Content    
    detail.fields.back = back.fields;
    this.updateBaseContent(detail);
  };

  updateBaseContent = detail => {
    const baseID = this.props.match.params["baseID"];

    updateBaseContent({ baseID, values: detail }).then(res => {
      this.globalBaseContent = JSON.parse(
        JSON.stringify(res) ////Base Content
      );

      this.setState({
        detail: this.globalBaseContent, //Base Content
        passDetail: { data: null, error: null, loading: true }
      });
      this.fetchPassDetail(baseID);
    });
  };

  setQRFormat = e => {
    let format = e.target.value;
    this.setState({ qRFormat: format });
  };

  handleSaveQR = () => {
    if (this.state.qRFormat === "svg") {
      this.saveSVG();
    } else if (this.state.qRFormat === "canvas") {
      this.savePNG();
    }
  };

  saveSVG = () => {
    var c = document.getElementsByTagName("svg")[0];

    c.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = c.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {
      type: "image/svg+xml;charset=utf-8"
    });

    const baseID = this.props.match.params["baseID"];
    saveAs(svgBlob, baseID + ".svg");
  };

  savePNG = () => {
    var c = document.getElementsByTagName("canvas")[0];
    const baseID = this.props.match.params["baseID"];
    c.toBlob(function(blob) {
      saveAs(blob, baseID + ".png");
    });
  };

  onClickEdit = value => {
    const pathname = window.location.pathname;
    const isEditBaseViewRoot = matchPath(pathname, {
      path: "/bases/:baseID"
    });
    return (
      <NavLink to={`${isEditBaseViewRoot.url}/${value}`}>
        <Button className={`pass-review-edit__button`} type="primary">
          {this.props.translate("edit")}
        </Button>
      </NavLink>
    );
  };

  render() {
    const baseID = this.props.match.params["baseID"];
    let {
      detail,
      meta,
      passPreviewTab,
      passDetail,
      imageChange,
      images
    } = this.state;
    meta.organizationName = pathOr("", ["organizationName"], detail);
    meta.sharingProhibited = pathOr(false, ["sharingProhibited"], detail);
    const { translate, showForm } = this.props;

    if (passPreviewTab === "help") {
      passDetail = {
        data: { ...examples[meta.style] },
        error: null,
        loading: false
      };
    }

    return (
      <div className="home">
        <div className="home__content">
          <div className="container-wide container--center">
            <div className="page">
              {this.state.showLangSwitch && (
                <div className="translate">
                  <div className="translate__lang-switch-form">
                    <div className="lang-switch-contain-extra">
                      <div className="toggle-lang">
                        <div className="toggle-lang--global">
                          <img className="icon-global" src={globalIcon} />
                        </div>
                        <div className="toggle-lang--lang-toggle">
                          <span
                            onClick={() => this.setLang("en")}
                            className={`lang-switch__value ${
                              this.state.lang === "en"
                                ? "lang-switch__value--selected"
                                : ""
                            }`}
                          >
                            EN
                          </span>{" "}
                          |{" "}
                          <span
                            onClick={() => this.setLang("de")}
                            className={`lang-switch__value ${
                              this.state.lang === "de"
                                ? "lang-switch__value--selected"
                                : ""
                            }`}
                          >
                            DE
                          </span>{" "}
                          |{" "}
                          <span
                            onClick={() => this.setLang("fr")}
                            className={`lang-switch__value ${
                              this.state.lang === "fr"
                                ? "lang-switch__value--selected"
                                : ""
                            }`}
                          >
                            FR
                          </span>{" "}
                          |{" "}
                          <span
                            onClick={() => this.setLang("nl")}
                            className={`lang-switch__value ${
                              this.state.lang === "nl"
                                ? "lang-switch__value--selected"
                                : ""
                            }`}
                          >
                            NL
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <Route
                exact
                path={"/bases/:baseID"}
                render={props => (
                  <BaseContentForm
                    images={images}
                    imageChange={imageChange}
                    onSubmit={this.submitGeneral}
                    uploadImageHanlder={this.imagesScarfolder}
                    baseMeta={meta} ////Base
                    link={`${process.env.TSE_API}/bases/base__code/${
                      meta.shortcode
                    }/case__passes`}
                    handleSaveQR={this.handleSaveQR}
                    setQRFormat={this.setQRFormat}
                    qRFormat={this.state.qRFormat}
                    transitType={detail.transitType}
                    style={detail.style}
                    {...props}
                    publishShowTime={() => showForm(PublishBaseName)}
                  />
                )}
              />
              <Route
                exact
                path={"/bases/:baseID/passField"}
                render={props => (
                  <PassInfoForm
                    onSubmit={this.submitPassFields}
                    baseDetail={detail} ////Base Content
                    lang={this.state.lang}
                    {...props}
                    publishShowTime={() => showForm(PublishBaseName)}
                  />
                )}
              />
              <Route
                exact
                path={"/bases/:baseID/front"}
                render={props => (
                  <PassFieldsFormFront
                    onSubmit={this.submitFrontFields}
                    lang={this.state.lang}
                    fields={pathOr([], ["fields", "front"], detail)}
                    passStyle={pathOr([], ["style"], detail)}
                    {...props}
                    publishShowTime={() => showForm(PublishBaseName)}
                  />
                )}
              />
              <Route
                exact
                path={"/bases/:baseID/back"}
                render={props => (
                  <PassFieldsFormBack
                    onSubmit={this.submitBackFields}
                    lang={this.state.lang}
                    fields={pathOr([], ["fields", "back"], detail)}
                    {...props}
                    publishShowTime={() => showForm(PublishBaseName)}
                  />
                )}
              />
              <Route
                exact
                path={`/bases/:baseID/pushSchedule`}
                render={props => (
                  <ProtectedScopedComponent
                    scopes={["list:my-org-type-base:steps"]}
                  >
                    <TemplatePushSchedule
                      turnLangSwitch={this.turnLangSwitch}
                      turnPassReviewSwitch={this.turnPassReviewSwitch}
                      lang={this.state.lang}
                      {...props}
                    />
                  </ProtectedScopedComponent>
                )}
              />
              <Route
                exact
                path={"/bases/:baseID/params"}
                render={props => (
                  <ParamForm
                    turnLangSwitch={this.turnLangSwitch}
                    turnPassReviewSwitch={this.turnPassReviewSwitch}
                    baseID={baseID}
                    {...props}
                  />
                )}
              />
              {this.state.showPassReview ? (
                <div className="pass-review-container">
                  <div className="pass-review--tabs">
                    <span
                      className={passPreviewTab == "help" ? "selected" : ""}
                      onClick={() => this.switchPRTabs("help")}
                    >
                      {translate("help")}
                    </span>
                    <span
                      className={passPreviewTab == "preview" ? "selected" : ""}
                      onClick={() => this.switchPRTabs("preview")}
                    >
                      {translate("preview")}
                    </span>
                  </div>
                  <div className="card">
                    <div
                      className="card__title"
                      style={{
                        position: "relative"
                      }}
                    >
                      Pass Front Side
                    </div>
                    <div className="card__body" style={{ padding: "0 20px" }}>
                      <PassReview
                        lang={this.state.lang}
                        baseID={baseID}
                        overlay={passPreviewTab == "help" ? true : false}
                        onClickEdit={() => {}}
                        passDetail={passDetail}
                      />
                    </div>
                  </div>
                  <div className="card">
                    <div
                      className="card__title"
                      style={{
                        position: "relative"
                      }}
                    >
                      Pass Back Side
                    </div>
                    <div className="card__body" style={{ padding: "0 20px" }}>
                      <PassReview
                        lang={this.state.lang}
                        baseID={baseID}
                        flip={true}
                        overlay={passPreviewTab == "help" ? true : false}
                        onClickEdit={() => {}}
                        passDetail={passDetail}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              <PublishBase baseId={baseID} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BaseContent.propTypes = {
  fetchBaseContent: PropTypes.func,
  updateBase: PropTypes.func,
  goTo: PropTypes.func,
  fetchCaseListByBase: PropTypes.func,
  getBaseSteps: PropTypes.func,
  updateBaseImages: PropTypes.func,
  setBaseChannel: PropTypes.func,
  // Base
  baseMeta: PropTypes.object,
  submitNewCase: PropTypes.func,
  ////Base Content
  baseDetail: PropTypes.shape({
    error: PropTypes.bool,
    loading: PropTypes.bool,
    data: PropTypes.shape({
      id: PropTypes.number
    })
  }),
  socket: PropTypes.object,
  caseList: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({
      baseID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }),
  translate: PropTypes.func,
  showForm: PropTypes.func,
  passDetail: PropTypes.shape({
    error: PropTypes.bool,
    loading: PropTypes.bool,
    data: PropTypes.object
  }),
  fetchBase: PropTypes.func
};

const mapState = state => ({
  ////Base Content
  baseDetail: state.baseDetail || {},
  caseList: state.caseList || {},
  ////Base
  baseMeta: state.baseMeta,
  createCase: state.createCase,
  translate: getTranslate(state.locale),
  passDetail: state.passDetail
});

const mapDispatch = dispatch => {
  return {
    getBaseSteps: bindActionCreators(getBaseSteps, dispatch),
    updateBaseImages: bindActionCreators(updateBaseImages, dispatch),
    setBaseChannel: bindActionCreators(setBaseChannel, dispatch),
    fetchBaseContent: bindActionCreators(fetchBaseContent, dispatch),
    fetchCaseListByBase: bindActionCreators(fetchCaseList, dispatch),
    submitNewCase: bindActionCreators(submitNewCase, dispatch),
    createBaseSteps: bindActionCreators(createBaseSteps, dispatch),
    updateBase: bindActionCreators(updateBaseWithoutStore, dispatch),
    goTo: bindActionCreators(push, dispatch),
    showForm: bindActionCreators(showForm, dispatch),
    fetchBase: bindActionCreators(fetchBase, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(BaseContent);
