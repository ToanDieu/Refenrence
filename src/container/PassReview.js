/* eslint-disable react/no-multi-comp */
/* eslint-disable react/no-danger */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getTranslate } from "react-localize-redux";

import Path from "ramda/src/path";

import Tooltip from "@/components/tooltip";
import { fetchPassDetail } from "../actions/pass";
import { PassFieldGroup, PassField } from "../components/Pass";
import fieldFormat from "../constants/passFieldFormat.js";
import Loading from "../components/Loading";

const checkField = (data, path) => {
  const check = Path(path || []);
  return check(data);
};

const getBracode = (data, format, className) => {
  // console.log("encode", encodeURIComponent(data.toString()));
  // console.log("format", format);
  return (
    <img
      src={
        "https://barcode.tec-it.com/barcode.ashx?data=" +
        encodeURIComponent(data.toString()) +
        "&code=" +
        format +
        "&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff"
      }
      className={className}
    />
  );
};

class PassReview extends React.Component {
  state = {
    flip: false
  };

  componentDidMount() {
    this.setState({ flip: this.props.flip });
  }

  preProcess = respass => {
    console.log("PassReview.preProcess", respass);

    let appleWallet = {};
    appleWallet.passIsExpired = false;
    appleWallet.eventIsStripFormat = false;
    appleWallet.noAppleBarcode = false;
    // this.setState({
    //   flip: false
    // });
    appleWallet.transitType = "";
    appleWallet.mergedAuxSecFields = [];
    appleWallet.data = {};
    appleWallet.images = {};
    appleWallet.barcode = {};
    appleWallet.barcodeIsSquare = false;
    if (checkField(respass, ["data", "data", this.props.lang])) {
      appleWallet.data = respass.data.data[this.props.lang];
      appleWallet.images = respass.data.appleWallet.images || {};
      appleWallet.passType = respass.data.appleWallet.passType || "";
    } else {
      return null;
    }
    if (checkField(appleWallet, ["images", "strip"])) {
      appleWallet.eventIsStripFormat = true;
    } else {
      appleWallet.eventIsStripFormat = false;
    }

    if (checkField(appleWallet, ["data", "fields", "transitType"])) {
      appleWallet.transitType = this.appleTransit(
        appleWallet.data.fields.transitType
      );
    }
    if (checkField(appleWallet, ["data", "fields"])) {
      appleWallet.mergedAuxSecFields = this.mergeAuxSecFields(
        appleWallet.data.fields
      );
    }
    if (!checkField(appleWallet, ["data", "logoText"])) {
      appleWallet.data.logoText = "";
    }
    if (checkField(appleWallet, ["data", "barcodes", 0])) {
      appleWallet.barcode = this.appleBarcode(appleWallet.data.barcodes);
      if (
        checkField(appleWallet, ["barcode", "format"]) &&
        (appleWallet.barcode.format == "MobileQRCode" ||
          appleWallet.barcode.format == "Aztec")
      ) {
        appleWallet.barcodeIsSquare = true;
      }
    } else {
      appleWallet.noAppleBarcode = true;
    }

    //if the pass is voided, or the expiration date has passed, then the pass is expired
    if (
      appleWallet.data.voided ||
      (checkField(appleWallet.data, ["expirationDate"]) &&
        new Date() > Date(appleWallet.data.expirationDate))
    ) {
      appleWallet.passIsExpired = true;
    }
    return appleWallet;
  };
  appleTransit = transitCode => {
    return fieldFormat.appleTransitFormats[transitCode];
  };
  mergeAuxSecFields = fields => {
    let mergedAuxSecFields = [];
    if (
      checkField(fields, ["auxiliaryFields"]) ||
      checkField(fields, ["secondaryFields"])
    ) {
      if (
        checkField(fields, ["auxiliaryFields"]) &&
        checkField(fields, ["secondaryFields"])
      ) {
        mergedAuxSecFields = fields.secondaryFields.concat(
          fields.auxiliaryFields
        );
      } else if (checkField(fields, ["auxiliaryFields"])) {
        mergedAuxSecFields = fields.auxiliaryFields;
      } else {
        mergedAuxSecFields = fields.secondaryFields;
      }
    }
    return mergedAuxSecFields;
  };

  checkMergedAuxSecLink = fields => {
    if (
      checkField(fields, ["auxiliaryFields"]) ||
      checkField(fields, ["secondaryFields"])
    ) {
      if (
        checkField(fields, ["auxiliaryFields"]) &&
        checkField(fields, ["secondaryFields"])
      ) {
        return "secondary";
      } else if (checkField(fields, ["auxiliaryFields"])) {
        return "auxiliary";
      } else {
        return "secondary";
      }
    }
  };
  appleBarcode = barcodes => {
    let selectedBarcode = {};
    if (barcodes.length > 1) {
      // first try to find if there is a code128 barcode stored
      for (var i = 0; i < barcodes.length; i++) {
        if (barcodes[i].format == "PKBarcodeFormatCode128") {
          selectedBarcode = barcodes[i];
        }
      }
      // else just load the first barcode available
      if (!checkField(selectedBarcode, "format")) {
        selectedBarcode = barcodes[0];
      }
    } else {
      selectedBarcode = barcodes[0];
    }

    let altText = selectedBarcode.altText || "",
      message = selectedBarcode.message || "";

    const barcode = {
      message: message,
      format: fieldFormat.appleBarcodeFormats[selectedBarcode.format],
      altText: altText
    };
    return barcode;
  };
  //Flip side pass
  flipPass = () => {
    this.setState({
      flip: !this.state.flip
    });
  };

  HelpInfo = fieldType => {
    const { translate } = this.props;
    return <div> {translate(fieldType + "Tooltip")} </div>;
    // switch (fieldType) {
    //   case "header":
    //     return <div> {translate("")} </div>;
    //   case "primary":
    //     return <div> {translate("")} </div>;
    //   case "auxiliary":
    //     return <div> {translate("")} </div>;
    //   case "secondary":
    //     return <div> {translate("")} </div>;
    //   case "back":
    //     return <div> {translate("")} </div>;
    // }
  };

  tooltipHelper = typeField => () => {
    if (!this.props.overlay) {
      return null;
    }

    return (
      <div
        className={`
        pass-reivew--tooltip ${
          typeField == "back"
            ? `pass-reivew--tooltip-back`
            : `pass-reivew--tooltip-front`
        }
        `}
      >
        <Tooltip
          background={true}
          placement="top"
          content={(() => {
            return (
              <div className={"pass-reivew--tooltip-content"}>
                {this.HelpInfo(typeField)}
                {this.props.onClickEdit(
                  typeField == "back" ? `back` : `${typeField}`
                )}
              </div>
            );
          })()}
        />
      </div>
    );
  };

  render() {
    const { passDetail } = this.props;
    console.log("this.props", this.props);
    const appleWallet = this.preProcess(passDetail);
    let displayMode = "";

    return (
      <div className="pk-apple-pass" style={{ minWidth: "270px" }}>
        {!appleWallet ? (
          <div style={{ padding: "15px 0px" }}>
            <Loading />
          </div>
        ) : (
          <div
            id="appleDisplay"
            className={
              "pass pass-" +
              appleWallet.passType +
              (displayMode == "back" ? "flipped" : "")
            }
          >
            {/* <!--Inline style for apple pass Preview -->  */}
            <style
              type="text/css"
              dangerouslySetInnerHTML={{
                __html: `
                      \n    #appleDisplay.pass .content .pass-value {color: ${
                        appleWallet.data.foregroundColor
                      } }
                      \n    #appleDisplay.pass .content .pass-value:after {content: ''; color: ${
                        appleWallet.data.foregroundColor
                      } }
                      \n    #appleDisplay.pass .content .pass-label {color: ${
                        appleWallet.data.labelColor
                      } }
                      \n    #appleDisplay.pass .content {background-color: ${
                        appleWallet.data.backgroundColor
                      } }
                      \n    #appleDisplay .boardingIcon path {fill: ${
                        appleWallet.data.labelColor
                      } }
                      \n    #appleDisplay .primary-strip-img.show-img {background-image: url( ${appleWallet
                        .images.strip || ""}) }
                      \n    #appleDisplay.pass-eventTicket .content:before{}
                      \n    .content:before, .content:after {background: linear-gradient(-45deg, transparent 10px, ${appleWallet.bgColor ||
                        "#fff"} 0), linear-gradient(45deg, transparent 10px, ${appleWallet.bgColor ||
                  "#fff"} 0);}
                      \n    #appleDisplay.pass-boardingPass .pass-header {position: relative;}
                      \n    #appleDisplay.pass-boardingPass .pass-header:before, #appleDisplay.pass-boardingPass .pass-header:after{
                      \n        content: " ";
                      \n        background-color: ${appleWallet.bgColor ||
                        "#fff"};
                      \n        height: 10px;
                      \n        width: 10px;
                      \n        position: absolute;
                      \n        bottom: -10px;
                      \n        border-radius: 100%;
                      \n    }
                      \n    #appleDisplay.pass-boardingPass .pass-header:before{left: -15px;right: auto;}
                      \n    #appleDisplay.pass-boardingPass .pass-header:after{left: auto;right: -15px;}
                      \n
                      `
              }}
            />
            {appleWallet.passType == "eventTicket" &&
            appleWallet.eventIsStripFormat ? (
              <style
                type="text/css"
                dangerouslySetInnerHTML={{
                  __html: `\n    #appleDisplay.pass .content.show-img {background-image: url(' ${appleWallet
                    .images.background ||
                    ""}');background-size:cover; background-position:center;}\n`
                }}
              />
            ) : (
              ""
            )}

            {/* <!--  Main content apple pass, two side : -->
                    <!--  Front: Logo, thumbnail, strip, Primary Fields, Secondary Fields, Auxiliary Fields -->
                    <!--  Back: Back Fields-->
               */}
            <div
              className={
                "content " +
                (appleWallet.passType == "eventTicket" &&
                appleWallet.eventIsStripFormat
                  ? "show-img"
                  : "")
              }
            >
              <div
                className={
                  "flip-front " + (this.state.flip ? "displayHide" : "")
                }
              >
                <div className="front">
                  <div className="not-blurred">
                    {/* <!--Header Section, same for all pass types: Logo Image, Logo Text, Header Fields--> */}
                    <div className="pass-header">
                      <div className="row">
                        {/* <!--Logo Image + Logo Text--> */}
                        <div
                          className={
                            "logo " +
                            (appleWallet.data.fields.headerFields
                              ? appleWallet.data.fields.headerFields.length < 2
                                ? "col-xs-10"
                                : appleWallet.data.fields.headerFields.length ==
                                  2
                                ? "col-xs-8"
                                : appleWallet.data.fields.headerFields.length ==
                                  3
                                ? "col-xs-6"
                                : ""
                              : null)
                          }
                        >
                          <div className="image" style={{ maxWidth: "40%" }}>
                            <div className="image-wrapper">
                              <img src={appleWallet.images.logo || ""} />
                            </div>
                          </div>
                          <div className="logoText pass-value">
                            {appleWallet.data.logoText || ""}
                          </div>
                        </div>
                        {/* <!--Header Fields--> */}
                        <div
                          className={
                            appleWallet.data.fields.headerFields
                              ? appleWallet.data.fields.headerFields.length < 2
                                ? "col-xs-2"
                                : appleWallet.data.fields.headerFields.length ==
                                  2
                                ? "col-xs-4"
                                : appleWallet.data.fields.headerFields.length ==
                                  3
                                ? "col-xs-6"
                                : ""
                              : null
                          }
                        >
                          <div className="row">
                            <PassFieldGroup
                              fields={
                                appleWallet.data.fields.headerFields || []
                              }
                              dataType="header"
                              lang=""
                              classUnkown="text-right"
                              tooltipHelper={this.tooltipHelper("header")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <!--Primary Section, five styles:-->
                    <!--  Transport: Primary Field 1, Transport Icon, Primary Field 2-->
                    <!--  Coupon, Store Card: Primary Field 1 over the top of a *thicker* Strip Image-->
                    <!--  Event Tickets with a strip image: Primary Field 1 over the top of a *thinner* Strip Image-->
                    <!--  Event Ticket with a background image: 2Rows(row 1: primary fields, row 2: secondary fields), Thumbnail image-->
                    <!--  Generic: Primary Field 1, Thumbnail Image-->
                    <!--Might want to come up with a nicer way to do this (maybe use a function to alter a scope variable using a switch)--> */}
                    <div
                      className={
                        appleWallet.eventIsStripFormat &&
                        appleWallet.passType == "eventTicket"
                          ? "show-img primary-strip-img event"
                          : appleWallet.passType == "coupon" ||
                            appleWallet.passType == "storeCard"
                          ? "show-img primary-strip-img normal"
                          : ""
                      }
                    >
                      {/* <!--Transport--> */}
                      {appleWallet.passType == "boardingPass" ? (
                        <div className="primary row primary-boarding">
                          {checkField(appleWallet.data.fields, [
                            "primaryFields",
                            0
                          ]) ? (
                            <div className="col-xs-5">
                              <PassField
                                field={appleWallet.data.fields.primaryFields[0]}
                                dataType="primary"
                                lang=""
                                tooltipHelper={this.tooltipHelper("primary")}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="col-xs-2 text-center pass-label">
                            <i
                              className={`fa fa-3x fa-fw ${
                                appleWallet.transitType
                              }`}
                            />
                          </div>
                          {checkField(appleWallet.data.fields, [
                            "primaryFields",
                            1
                          ]) ? (
                            <div className="col-xs-5 text-right">
                              <PassField
                                field={appleWallet.data.fields.primaryFields[1]}
                                dataType="primary"
                                lang=""
                                tooltipHelper={this.tooltipHelper("primary")}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}

                      {/* <!--Coupon, Store Card--> */}
                      {appleWallet.passType == "coupon" ||
                      appleWallet.passType == "storeCard" ? (
                        <div className="primary row primary-strip">
                          {checkField(appleWallet.data.fields, [
                            "primaryFields",
                            0
                          ]) ? (
                            <PassField
                              field={appleWallet.data.fields.primaryFields[0]}
                              dataType="primary"
                              lang=""
                              tooltipHelper={this.tooltipHelper("primary")}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}

                      {/* <!--Event Tickets with a strip image (text needs to be smaller than above due to thinner strip image)--> */}
                      {appleWallet.passType == "eventTicket" &&
                      appleWallet.eventIsStripFormat ? (
                        <div className="primary row primary-strip">
                          {checkField(appleWallet.data.fields, [
                            "primaryFields",
                            0
                          ]) ? (
                            <PassField
                              field={appleWallet.data.fields.primaryFields[0]}
                              dataType="primary"
                              lang=""
                              tooltipHelper={this.tooltipHelper("primary")}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}

                      {/* <!--Event Ticket with a background image--> */}
                      {appleWallet.passType == "eventTicket" &&
                      !appleWallet.eventIsStripFormat ? (
                        <div className="primary row">
                          <div className="col-xs-9">
                            <div className="primary row">
                              {checkField(appleWallet.data.fields, [
                                "primaryFields",
                                0
                              ]) ? (
                                <PassField
                                  field={
                                    appleWallet.data.fields.primaryFields[0]
                                  }
                                  dataType="primary"
                                  lang=""
                                  tooltipHelper={this.tooltipHelper("primary")}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="secondary row">
                              <PassFieldGroup
                                // fields="$ctrl.fields.secondaryFields"
                                fields={
                                  appleWallet.data.fields.secondaryFields || []
                                }
                                dataType="primary"
                                lang=""
                                tooltipHelper={this.tooltipHelper("primary")}
                              />
                            </div>
                          </div>
                          <div className="col-xs-3">
                            <img src={appleWallet.images.thumbnail || ""} />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* <!--Generic--> */}
                      {appleWallet.passType == "generic" ? (
                        <div className="primary row">
                          {appleWallet.images.thumbnail ? (
                            <div>
                              <div className="col-xs-8">
                                {checkField(appleWallet.data.fields, [
                                  "primaryFields",
                                  0
                                ]) ? (
                                  <PassField
                                    field={
                                      appleWallet.data.fields.primaryFields[0]
                                    }
                                    dataType="primary"
                                    lang=""
                                    tooltipHelper={this.tooltipHelper(
                                      "primary"
                                    )}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="col-xs-4">
                                <img src={appleWallet.images.thumbnail || ""} />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="col-xs-12">
                                {checkField(appleWallet.data.fields, [
                                  "primaryFields",
                                  0
                                ]) ? (
                                  <PassField
                                    field={
                                      appleWallet.data.fields.primaryFields[0]
                                    }
                                    dataType="primary"
                                    lang=""
                                    tooltipHelper={this.tooltipHelper(
                                      "primary"
                                    )}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* <!--Extra Fields Section, four styles:-->
                    <!--  Transport: Auxiliary fields then Secondary Fields (just to be contrary)-->
                    <!--  Coupon, Store Card, Generic Pass with Square Barcode: Auxiliary and Secondary fields merged-->
                    <!--  Event Tickets with a strip image, Generic Pass with Rectangular Barcode: Secondary fields then Auxiliary Fields-->
                    <!--  Event Ticket with a background image: Only the Auxiliary Fields (secondary fields are already in the primary section)--> */}
                    <div className="extra-fields">
                      {/* <!--Transport--> */}
                      {appleWallet.passType == "boardingPass" ? (
                        <div>
                          <div className="auxiliary row">
                            <PassFieldGroup
                              // fields="$ctrl.fields.auxiliaryFields"
                              fields={
                                appleWallet.data.fields.auxiliaryFields || []
                              }
                              dataType="extra"
                              lang=""
                              tooltipHelper={this.tooltipHelper("auxiliary")}
                            />
                          </div>
                          <div className="secondary row">
                            <PassFieldGroup
                              // fields="$ctrl.fields.secondaryFields"
                              fields={
                                appleWallet.data.fields.secondaryFields || []
                              }
                              dataType="extra"
                              lang=""
                              tooltipHelper={this.tooltipHelper("secondary")}
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* <!--Coupon, Store Card or (Generic Pass with Square Barcode) --> */}
                      {appleWallet.passType == "coupon" ||
                      appleWallet.passType == "storeCard" ||
                      (appleWallet.passType == "generic" &&
                        appleWallet.barcodeIsSquare) ? (
                        <div>
                          <div className="auxiliary secondary row">
                            <PassFieldGroup
                              fields={appleWallet.mergedAuxSecFields || []}
                              dataType="extra"
                              lang="here"
                              tooltipHelper={this.tooltipHelper(
                                this.checkMergedAuxSecLink(
                                  appleWallet.data.fields
                                )
                              )}
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* <!--Event Tickets with a strip image, Generic Pass with Rectangular Barcode--> */}
                      {(appleWallet.passType == "eventTicket" &&
                        appleWallet.eventIsStripFormat) ||
                      (appleWallet.passType == "generic" &&
                        !appleWallet.barcodeIsSquare) ? (
                        <div>
                          <div className="secondary row">
                            <PassFieldGroup
                              // fields="$ctrl.fields.secondaryFields"
                              fields={
                                appleWallet.data.fields.secondaryFields || []
                              }
                              dataType="extra"
                              lang=""
                              tooltipHelper={this.tooltipHelper("secondary")}
                            />
                          </div>
                          <div className="auxiliary row">
                            <PassFieldGroup
                              // fields="$ctrl.fields.auxiliaryFields"
                              fields={
                                appleWallet.data.fields.auxiliaryFields || []
                              }
                              dataType="extra"
                              lang=""
                              tooltipHelper={this.tooltipHelper("auxiliary")}
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* <!--Coupon, Store Card, Generic Pass with Square Barcode--> */}
                      {appleWallet.passType == "eventTicket" &&
                      !appleWallet.eventIsStripFormat ? (
                        <div>
                          <div className="auxiliary secondary row">
                            <PassFieldGroup
                              // fields="$ctrl.fields.auxiliaryFields"
                              fields={
                                appleWallet.data.fields.auxiliaryFields || []
                              }
                              dataType="extra"
                              lang=""
                              tooltipHelper={this.tooltipHelper("auxiliary")}
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* <!--Barcode Section... Actually pretty straightforward--> */}
                    <div className="barcode-section barcodeRow text-center">
                      {/* <!--Footer image for transport pass--> */}
                      <img
                        className="footer"
                        src={appleWallet.images.footer || ""}
                      />
                      {appleWallet.barcode ? (
                        <div
                          className={appleWallet.passIsExpired ? "expired" : ""}
                        >
                          {appleWallet.barcodeIsSquare ? (
                            <div className="row">
                              <div className="col-xs-3" />
                              {!appleWallet.noAppleBarcode ? (
                                <div className="col-xs-6 barcodeContainer">
                                  {getBracode(
                                    appleWallet.barcode.message,
                                    appleWallet.barcode.format,
                                    "barcode square"
                                  )}
                                  <div
                                    style={
                                      appleWallet.passIsExpired
                                        ? { display: "none" }
                                        : {}
                                    }
                                    className="text text-center"
                                  >
                                    {appleWallet.barcode.altText || ""}
                                  </div>
                                  <div
                                    style={
                                      appleWallet.passIsExpired
                                        ? {}
                                        : { display: "none" }
                                    }
                                    className="text text-center text-muted"
                                  >
                                    this pass has expired
                                  </div>
                                  {!appleWallet.barcode.altText &&
                                  !appleWallet.passIsExpired ? (
                                    <div className="paddingInsteadOfAltText" />
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="col-xs-3" />
                              <button
                                onClick={this.flipPass}
                                className="btn btn-default col-xs-1 info-button no-print"
                              >
                                i
                              </button>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-xs-1" />
                              {!appleWallet.noAppleBarcode ? (
                                <div className="col-xs-10 barcodeContainer">
                                  {getBracode(
                                    appleWallet.barcode.message,
                                    appleWallet.barcode.format,
                                    "barcode rect"
                                  )}
                                  <div
                                    style={
                                      appleWallet.passIsExpired
                                        ? { display: "none" }
                                        : {}
                                    }
                                    className="text text-center"
                                  >
                                    {appleWallet.barcode.altText || ""}
                                  </div>
                                  <div
                                    style={
                                      appleWallet.passIsExpired
                                        ? {}
                                        : { display: "none" }
                                    }
                                    className="text text-center text-muted"
                                  >
                                    this pass has expired
                                  </div>
                                  {!appleWallet.barcode.altText &&
                                  !appleWallet.passIsExpired ? (
                                    <div className="paddingInsteadOfAltText" />
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ) : (
                                ""
                              )}

                              <button
                                onClick={this.flipPass}
                                className="btn btn-default col-xs-1 info-button no-print"
                              >
                                i
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                      {!appleWallet.barcode ? (
                        <div>
                          <div className="row">
                            <div className="col-xs-11" />
                            <button
                              onClick={this.flipPass}
                              className="btn btn-default col-xs-1 info-button no-print"
                            >
                              i
                            </button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "flip-back " + (!this.state.flip ? "displayHide" : "")
                }
              >
                <div className="back">
                  <div className="row back-header">
                    <button
                      onClick={this.flipPass}
                      translate=""
                      className="btn btn-default col-xs-3 pull-right no-print"
                    >
                      Done
                    </button>
                  </div>
                  <div className="content-inner">
                    {this.tooltipHelper("back")()}
                    {appleWallet.data.fields.backFields &&
                      appleWallet.data.fields.backFields.map(field => (
                        <div
                          key={field.key.toString()}
                          className="back-field row"
                        >
                          <div className="col-xs-12">
                            <PassField field={field} dataType="back" lang="" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

PassReview.propTypes = {
  lang: PropTypes.string,
  fetchPassDetail: PropTypes.func,
  passDetail: PropTypes.shape({
    error: PropTypes.bool,
    loading: PropTypes.bool,
    data: PropTypes.object
  }),
  translate: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }),
  flip: PropTypes.bool,
  overlay: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  onClickEdit: PropTypes.func
};

const mapState = state => ({
  translate: getTranslate(state.locale)
});

const mapDispatch = dispatch => {
  return {
    fetchPassDetail: bindActionCreators(fetchPassDetail, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(PassReview);
