/* eslint react/jsx-filename-extension: 0 */
/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getTranslate } from "react-localize-redux";
import { connect } from "react-redux";

import QRCode from "qrcode.react";
import { Dropdown } from "tse-storybook";
import { Form, Field } from "react-final-form";
import { Button } from "element-react";
import { pathOr } from "ramda";

import SingleField from "@/components/SingleField";
import TemplateImageForm from "@/components/TemplateImageForm";
import fieldFormat from "@/constants/passFieldFormat";
import configs from "@/constants/orgConfigs";
import tzDBTimeZone from "@/i18n/tzDatabaseTimeZone";
import { isContainScope } from "@/actions/utils";
import { ProtectedScopedComponent } from "@/components/HocComponent";
import { CheckboxField } from "@/components/fields";
import { HorizontalForm } from "@/components/form";

import Tooltip from "@/components/tooltip";

const ImageInfo = ({ activeLang, imageType, passStyle }) => (
  <Tooltip
    placement="top"
    content={(() => {
      switch (`${imageType}-${activeLang}`) {
        case "background-en":
          return (
            <div>
              Recommended size 180 x 220px
              <br />
              The image is cropped slightly on all sides and blurred.
              <br />
              Set this to change the layout of event tickets from strip to
              thumbnail image.
            </div>
          );
        case "background-de":
          return (
            <div>
              Empfohlene Bildgröße 180 x 220px
              <br />
              Das Bild wird automatisch leicht zugeschnitten und verschwommen
              dargestellt.
              <br />
              Das setzen dieses Bild stellt das Layout des Event Tickets von
              strip image auf thumbnail image um.
            </div>
          );
        case "icon-en":
          return (
            <div>
              Recommended size 58x58px
              <br />
              On iOS a change of this value will only be effective after the
              device is restarted.
            </div>
          );
        case "icon-de":
          return (
            <div>
              Empfohlene Bildgröße 58x58px
              <br />
              Unter iOS werden Änderungen dieses Wertes erst nach Neustart des
              Gerätes sichtbar.
            </div>
          );
        case "logo-en":
          return <div>Recommended size 100px and up to 320px wide.</div>;
        case "logo-de":
          return (
            <div>Empfohlene Bildgröße 100px hoch und max. 320px breit.</div>
          );
        case "strip-en":
          switch (passStyle) {
            case "eventTicket":
              return <div>Recommended size 750x196px.</div>;
            case "storeCard":
            case "coupon":
              return <div>Recommended size 750x288px.</div>;
            default:
              return <div>Recommended size 750x246px.</div>;
          }
        case "strip-de":
          switch (passStyle) {
            case "eventTicket":
              return <div>Empfohlene Bildgröße 750x196px.</div>;
            case "storeCard":
            case "coupon":
              return <div>Empfohlene Bildgröße 750x288px.</div>;
            default:
              return <div>Empfohlene Bildgröße 750x246px.</div>;
          }
        case "thumbnail-en":
          return (
            <div>
              Recommended size up to 180x180px.
              <br />
              The aspect ratio should be in the range of 2:3 to 3:2, otherwise
              the image is cropped.
            </div>
          );
        case "thumbnail-de":
          return (
            <div>
              Empfohlene Bildgröße max. 180x180px.
              <br />
              Das Seitenverhältnis sollte zwischen 2:3 und 3:2, ansonsten wird
              das Bild zugeschnitten.
            </div>
          );
        default:
          break;
      }
    })()}
  />
);

ImageInfo.propTypes = {
  activeLang: PropTypes.string,
  imageType: PropTypes.string,
  passStyle: PropTypes.string
};

function checkTimeZone(timeZone) {
  if (pathOr("", [], timeZone).split("/").length < 2) {
    return false;
  }
  return true;
}

@connect(
  state => ({
    translate: getTranslate(state.locale),
    activeLang: pathOr(
      "en",
      [0, "code"],
      state.locale.languages.filter(lang => lang.active)
    ),
    getOrgName: state.getOrgName.data
  }),
  () => ({})
)
class DetailForm extends React.Component {
  componentWillMount = () => {
    this.setState({
      pristine: this.props.pristine,
      imageChange: this.props.imageChange
    });
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.pristine !== nextProps.pristine) {
      this.setState({
        pristine: nextProps.pristine
      });
    }
    if (this.props.imageChange !== nextProps.imageChange) {
      this.setState({
        imageChange: nextProps.imageChange
      });
    }
    if (nextProps.imageChange) {
      this.setState({
        pristine: false
      });
    }
    if (!nextProps.pristine) {
      this.setState({
        imageChange: true
      });
    }
  };

  publishShowTime = e => {
    e.preventDefault();
    this.props.publishShowTime();
  };

  render() {
    const {
      handleSubmit,
      baseMeta,
      link,
      uploadImageHanlder,
      formchange,
      style,
      translate,
      activeLang,
      transitType,
      handleSaveQR,
      setQRFormat,
      qRFormat,
      getOrgName,
      images
    } = this.props;
    const { pristine, imageChange } = this.state;
    const disabled =
      !isContainScope("put:my-org-type:base") ||
      pristine ||
      !pathOr(
        false,
        ["value"],
        formchange.form.getFieldState("organizationName")
      ) ||
      !checkTimeZone(
        pathOr(false, ["value"], formchange.form.getFieldState("timeZone"))
      ) ||
      !imageChange;
    const buttonDisabled = "button-disbaled";
    return (
      <form
        onSubmit={handleSubmit}
        className="container-form"
        style={{
          width: "calc(100% - 340px)"
        }}
      >
        <div className="container-lg-form__button-group">
          <Button
            className={`container-lg-form__button ${
              !isContainScope("publish:my-org-type:base")
                ? buttonDisabled
                : null
            }`}
            disabled={!isContainScope("publish:my-org-type:base")}
            type="primary"
            onClick={e => this.publishShowTime(e)}
          >
            {translate("publish")}
          </Button>

          <Button
            className={`container-lg-form__button ${
              disabled ? buttonDisabled : null
            }`}
            onClick={e => handleSubmit(e)}
            disabled={disabled}
            type="primary"
          >
            {translate("submit")}
          </Button>
        </div>
        <div className="card">
          <div className="card__body">
            <div className="card__body-col">
              <div className="u-margin-bottom--24">
                <div className="preview__item">
                  <Field
                    name="name"
                    render={({ input, meta }) => (
                      <SingleField
                        disabled={!isContainScope("put:my-org-type:base")}
                        name="name"
                        label="name"
                        value={input.value}
                        onChange={input.onChange}
                        isModified={meta.dirty}
                        type="text"
                        tooltip={
                          activeLang === "de" ? (
                            <div>
                              Eine eindeutige Bezeichung für diese Base. Sie
                              sollte gut lesbar und URL-freundlich sein.
                            </div>
                          ) : (
                            <div>
                              A unique identifier for the base. It should be
                              easy to read and URL-friendly.
                            </div>
                          )
                        }
                      />
                    )}
                  />
                </div>
                <div className="preview__item">
                  <Field
                    name="memo"
                    render={({ input, meta }) => (
                      <SingleField
                        disabled={!isContainScope("put:my-org-type:base")}
                        name="memo"
                        label="memo"
                        onChange={input.onChange}
                        value={input.value}
                        isModified={meta.dirty}
                        type="text"
                        tooltip={
                          activeLang === "de" ? (
                            <div>
                              Eine kurze Erklärung zur Verwendung dieser Base.
                            </div>
                          ) : (
                            <div>
                              A short explaination on how to use this base.
                            </div>
                          )
                        }
                      />
                    )}
                  />
                </div>
                <div className="preview__item">
                  <Field
                    name="organizationName"
                    render={({ input, meta }) => (
                      <SingleField
                        disabled={!isContainScope("put:my-org-type:base")}
                        name="organizationName"
                        label={translate("organizationName")}
                        onChange={input.onChange}
                        value={input.value}
                        isModified={meta.dirty}
                        type="text"
                        tooltip={
                          activeLang === "en" ? (
                            <div>
                              Displayed in the push notification with the suffix
                              // eslint-disable-next-line
                              react/no-unescaped-entities "| WALLET".
                              <br />
                              On iOS a change of this value will only be
                              effective after the device is restarted.
                            </div>
                          ) : (
                            <div>
                              Wird in der Push Notification mit dem Suffix "|
                              WALLET" angezeigt.
                              <br /> Unter iOS werden Änderungen dieses Wertes
                              erst nach Neustart des Gerätes sichtbar.
                            </div>
                          )
                        }
                      />
                    )}
                  />
                  {!pathOr(
                    false,
                    ["value"],
                    formchange.form.getFieldState("organizationName")
                  ) ? (
                    <div
                      className="require-field"
                      style={{ marginTop: "-15px" }}
                    >
                      This field is required
                    </div>
                  ) : null}
                </div>
                <div className="preview__item">
                  <div className="field__label field__label--default field__label--align">
                    <span>{translate("timeZone")}</span>
                  </div>
                  <Field
                    name="timeZone"
                    type="text"
                    render={({ input }) => {
                      const inputRegion = pathOr(
                        "",
                        [0],
                        input.value.split("/")
                      );
                      let inputCity = "";
                      if (input.value.split("/").length > 1) {
                        inputCity = input.value.substring(
                          input.value.indexOf("/") + 1,
                          input.value.length
                        );
                      }

                      return (
                        <HorizontalForm className="u-margin-bottom--22">
                          <div className="u-margin-right--12">
                            <div className="field__label field__label--min field__label--align">
                              <span>{translate("region")}</span>
                            </div>
                            <Dropdown
                              name="region"
                              className="pagination_text_dropdown preview__dropdown__passtype"
                              fullwidth
                              border
                              hinter={inputRegion}
                              options={
                                isContainScope("put:my-org-type:base")
                                  ? Object.keys(tzDBTimeZone).map(region => {
                                      return {
                                        lable: region,
                                        onClick: () => {
                                          formchange.form.change(
                                            "timeZone",
                                            `${region}`
                                          );
                                        }
                                      };
                                    })
                                  : []
                              }
                            />
                          </div>
                          <div className="u-margin-right--12">
                            <div className="field__label field__label--min field__label--align">
                              <span>{translate("city")}</span>
                            </div>
                            <Dropdown
                              name="city"
                              className="pagination_text_dropdown preview__dropdown__timezone-city"
                              fullwidth
                              border
                              hinter={inputCity}
                              options={
                                isContainScope("put:my-org-type:base")
                                  ? pathOr([], [inputRegion], tzDBTimeZone).map(
                                      tzDBname => {
                                        const city = tzDBname.substring(
                                          tzDBname.indexOf("/") + 1,
                                          tzDBname.length
                                        );
                                        return {
                                          lable: city,
                                          onClick: () => {
                                            formchange.form.change(
                                              "timeZone",
                                              `${tzDBname}`
                                            );
                                          }
                                        };
                                      }
                                    )
                                  : []
                              }
                            />
                          </div>
                        </HorizontalForm>
                      );
                    }}
                  />
                </div>
                <div className="preview__item">
                  <div className="field__label field__label--default field__label--align">
                    <span>{translate("style")}</span>
                    <Tooltip
                      content={
                        activeLang === "en" ? (
                          <dl>
                            <dt className="tooltip__dt">
                              Warning: changing the style of existing passes may
                              require updating pass fields and images. Also, the
                              pass holder should be informed about this change.
                            </dt>
                            <dd />
                            <hr className="tooltip__hr" />

                            <dt className="tooltip__dt">Boarding passes</dt>
                            <dd>
                              This pass style is appropriate for passes used
                              with transit systems such as train tickets,
                              airline boarding passes, and other types of
                              transit. Typically, each pass corresponds to a
                              single trip with a specific starting and ending
                              point.
                            </dd>
                            <hr className="tooltip__hr" />
                            <dt className="tooltip__dt">Coupons</dt>
                            <dd>
                              This pass style is appropriate for coupons,
                              special offers, and other discounts.
                            </dd>
                            <hr className="tooltip__hr" />
                            <dt className="tooltip__dt">Event tickets</dt>
                            <dd>
                              This pass style is appropriate for passes used to
                              gain entry to an event like a concert, a movie, a
                              play, or a sporting event. Typically, each pass
                              corresponds to a specific event, but you can also
                              use a single pass for several events as in a
                              season ticket.
                            </dd>
                            <hr className="tooltip__hr" />
                            <dt className="tooltip__dt">Store cards</dt>
                            <dd>
                              This pass style is appropriate for store loyalty
                              cards, discount cards, points cards, and gift
                              cards. Typically, a store identifies an account
                              the user has with your company that can be used to
                              make payments or receive discounts. When the
                              account carries a balance, show the current
                              balance on the pass.
                            </dd>
                            <hr className="tooltip__hr" />
                            <dt className="tooltip__dt">Generic passes</dt>
                            <dd>
                              This pass style is appropriate for any pass that
                              doesn’t fit into one of the other more specific
                              styles—for example, gym membership cards,
                              coat-check claim tickets, and metro passes that
                              carry a balance.
                            </dd>
                          </dl>
                        ) : (
                          <dl>
                            <dt className="tooltip__dt">
                              Warnung: Die Änderung des Styles kann Anpassungen
                              der Pass Felder und Bilder erfordern. Darüber
                              hinaus sollte der Pass Halter über diese Änderung
                              informiert werden.
                            </dt>
                            <dd />
                            <hr className="tooltip__hr" />
                            <dt className="tooltip__dt">Boarding Pässe</dt>
                            <dd>
                              Dieser Pass Style eignet sich als Ticket für Bahn,
                              Flugzeug, Bus oder andere Verkehrsmittel. In der
                              Regel gilt jeder Pass für eine einzelne Fahrt mit
                              Start und Zielort.
                            </dd>
                            <hr className="tooltip__hr" />
                            <dt className="tooltip__dt">Coupons</dt>
                            <dd>
                              Dieser Pass Style eignet sich als Coupon, für
                              Sonderangebote oder andere Verkaufsaktionen.
                            </dd>
                            <hr className="tooltip__hr" />
                            <dt className="tooltip__dt">Event Tickets</dt>
                            <dd>
                              Dieser Pass Style eignet sich als Eintrittskarte
                              für Konzert, Kino, Theater oder Sport
                              Veranstaltungen. In der Regel gilt jeder Pass für
                              eine einzelne Veranstaltung, kann aber auch für
                              mehrere Veranstaltungen, z.B. als eine Saisonkarte
                              verwendet werden.
                            </dd>
                            <hr className="tooltip__hr" />
                            <dt className="tooltip__dt">Store Cards</dt>
                            <dd>
                              Dieser Pass Style eignet sich als Kundenkarte für
                              Treuepunkte, Rabattkarte und Geschenkgutschein. In
                              der Regel ist die Kundin registriert und kann mit
                              der Karte zahlen oder Punkte sammeln. Wenn es für
                              diese Kundin ein Punktekonto gibt, sollte der
                              Kontostand auf der Karte angezeigt werden.
                            </dd>
                            <hr className="tooltip__hr" />
                            <dt className="tooltip__dt">Generische Pässe</dt>
                            <dd>
                              Dieser Pass Style eignet sich für alle weiteren
                              Anwendungsfälle, wie z.B. Mitgliedskarten,
                              Garderoben-Ticket oder Fahrausweise, die einen
                              Kontostand anzeigen.
                            </dd>
                          </dl>
                        )
                      }
                    />
                  </div>
                  <Field
                    name="style"
                    label="style"
                    type="text"
                    render={({ input }) => (
                      <Dropdown
                        name="style"
                        className="pagination_text_dropdown preview__dropdown__passtype"
                        fullwidth
                        border
                        hinter={input.value}
                        options={
                          isContainScope("put:my-org-type:base")
                            ? pathOr(
                                [],
                                [
                                  getOrgName,
                                  "display",
                                  "passCreator",
                                  "passTypes"
                                ],
                                configs
                              ).map(passType => {
                                return {
                                  lable: passType,
                                  onClick: () => {
                                    formchange.form.change("style", passType);
                                  }
                                };
                              })
                            : []
                        }
                      />
                    )}
                  />
                </div>
                {pathOr(
                  "",
                  ["value"],
                  formchange.form.getFieldState("style")
                ) === "boardingPass" ? (
                  <div className="preview__item">
                    <div className="field__label field__label--default field__label--align">
                      <span>transit type</span>
                      <Tooltip
                        content={
                          activeLang === "de" ? (
                            <div>
                              Diese Auswahl setzt das Symbol für das
                              Transportmittel, zwischen der Start- und Zielort
                              Angabe.
                            </div>
                          ) : (
                            <div>
                              This sets the vehicle type as the center icon
                              between source and destination.
                            </div>
                          )
                        }
                      />
                    </div>

                    <Field
                      name="transitType"
                      label="transitType"
                      type="text"
                      render={() => (
                        <select
                          onChange={e => {
                            formchange.form.change(
                              "transitType",
                              e.target.value
                            );
                          }}
                        >
                          {[
                            ["PKTransitTypeAir", "Air"],
                            ["PKTransitTypeBoat", "Boat"],
                            ["PKTransitTypeBus", "Bus"],
                            ["PKTransitTypeGeneric", "Generic"],
                            ["PKTransitTypeTrain", "Train"]
                          ].map((x, index) => (
                            <option
                              key={index}
                              value={x[0]}
                              selected={transitType === x[0] ? "selected" : ""}
                            >
                              {x[1]}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="preview__item">
                  <Field
                    name="sharingProhibited"
                    render={({ input }) => {
                      let defaultValue = [];
                      if (
                        pathOr(false, [], input.value) ||
                        pathOr(false, [0], input.value)
                      ) {
                        defaultValue = [" "];
                      }
                      return (
                        <CheckboxField
                          items={[" "]}
                          options={{ value: defaultValue }}
                          label={translate("disableSharingPass")}
                          onChange={value => {
                            let sharingProhibited = false;
                            if (pathOr(false, [0], value)) {
                              sharingProhibited = true;
                            }
                            input.onChange(sharingProhibited);
                          }}
                          tooltip={
                            activeLang === "de" ? (
                              <div>
                                Diese Option deaktiviert die "Teilen" Funktion
                                auf der Passrückseite.
                              </div>
                            ) : (
                              <div>
                                This disables the sharing option on the backside
                                of the pass.
                              </div>
                            )
                          }
                        />
                      );
                    }}
                  />
                </div>
                {baseMeta && Object.keys(baseMeta).length ? (
                  <div>
                    <div className="preview__item">
                      <div className="field">
                        <div className="field__label field__label--default">
                          code
                        </div>
                        {baseMeta.shortcode}
                      </div>
                    </div>
                    <ProtectedScopedComponent
                      scopes={["get:my-org-type-base:analytic"]}
                    >
                      <div className="preview__item">
                        <div className="field">
                          <div className="field__label field__label--default">
                            Analytics
                          </div>
                          <Link to="/analytic">View Analytics</Link>
                        </div>
                      </div>
                    </ProtectedScopedComponent>
                    <div className="preview__item">
                      <div className="field">
                        <div className="field__label field__label--default">
                          URL
                        </div>
                        <div className="field__warning">
                          <p className="field__warning__major">{`${translate("warning")}:`}</p>
                          <p className="field__warning__content">
                          {translate("warningURLWithoutLegal")}
                          </p>
                        </div>
                        <a href={link} target="_blank">
                          {link}
                        </a>
                      </div>
                    </div>
                    <div className="preview__item">
                      <div className="field">
                        <div className="field__label field__label--default">
                          QRCode
                        </div>
                        <div className="field__warning">
                          <p className="field__warning__major">{`${translate("warning")}:`}</p>
                          <p className="field__warning__content">
                            {translate("warningQRWithoutLegal")}
                          </p>
                        </div>
                        <QRCode value={link} renderAs={qRFormat} />
                      </div>
                      <a
                        href=""
                        onClick={e => {
                          e.preventDefault();
                          handleSaveQR();
                        }}
                      >
                        Download as &nbsp;
                      </a>
                      <select onChange={setQRFormat}>
                        <option value="svg">.svg (vector graphics)</option>
                        <option value="canvas">.png (pixel graphics)</option>
                      </select>
                    </div>

                    <ProtectedScopedComponent scopes={["put:my-org-type:base"]}>
                      <div className="preview__item">
                        {pathOr(
                          false,
                          [
                            "passTypeFormats",
                            pathOr(
                              style,
                              ["value"],
                              formchange.form.getFieldState("style")
                            ),
                            "images"
                          ],
                          fieldFormat
                        )
                          ? pathOr(
                              [],
                              [
                                "passTypeFormats",
                                pathOr(
                                  style,
                                  ["value"],
                                  formchange.form.getFieldState("style")
                                ),
                                "images"
                              ],
                              fieldFormat
                            ).map(image => (
                              <div className="field" key={image}>
                                <div className="field__label field__label--default field__label--align">
                                  <span>
                                    {`${image} ${translate(`image`)}`}
                                  </span>
                                  <ImageInfo
                                    activeLang={activeLang}
                                    imageType={image}
                                    passStyle={pathOr(
                                      "",
                                      ["value"],
                                      formchange.form.getFieldState("style")
                                    )}
                                  />
                                </div>

                                <TemplateImageForm
                                  handleUploadImage={uploadImageHanlder}
                                  imageKey="default"
                                  imageType={image}
                                  value={images[image]}
                                />
                              </div>
                            ))
                          : ""}
                      </div>
                    </ProtectedScopedComponent>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* {false ? <div className="error u-text-align--right">Error</div> : ""} */}
          </div>
        </div>
      </form>
    );
  }
}

const BaseContentForm = ({
  baseMeta, // //Base
  link,
  uploadImageHanlder,
  handleSaveQR,
  setQRFormat,
  qRFormat,
  style,
  activeLang,
  onSubmit,
  transitType,
  publishShowTime,
  imageChange,
  images
}) => {
  baseMeta.style = style;
  return (
    <Form
      initialValues={{ ...baseMeta }}
      onSubmit={(values, { initialize, reset }) => {
        onSubmit(values);
        initialize(values);
        reset();
      }}
      render={props => {
        return (
          <DetailForm
            {...props}
            link={link}
            style={style}
            activeLang={activeLang}
            transitType={transitType}
            uploadImageHanlder={uploadImageHanlder}
            baseMeta={baseMeta} // //Base
            formchange={props}
            handleSaveQR={handleSaveQR}
            setQRFormat={setQRFormat}
            qRFormat={qRFormat}
            publishShowTime={publishShowTime}
            imageChange={imageChange}
            images={images}
          />
        );
      }}
    />
  );
};

DetailForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleSaveQR: PropTypes.func,
  setQRFormat: PropTypes.func,
  uploadImageHanlder: PropTypes.func,
  dirty: PropTypes.bool,
  values: PropTypes.object,
  baseMeta: PropTypes.object,
  link: PropTypes.string,
  activeLang: PropTypes.string,
  pristine: PropTypes.bool,
  style: PropTypes.string,
  qRFormat: PropTypes.string,
  transitType: PropTypes.string,
  formchange: PropTypes.object,
  translate: PropTypes.func,
  publishShowTime: PropTypes.func,
  getOrgName: PropTypes.string,
  imageChange: PropTypes.bool,
  images: PropTypes.object
};

BaseContentForm.propTypes = {
  onSubmit: PropTypes.func,
  handleSaveQR: PropTypes.func,
  setQRFormat: PropTypes.func,
  uploadImageHanlder: PropTypes.func,
  activeLang: PropTypes.string,
  dirty: PropTypes.bool,
  values: PropTypes.object,
  baseMeta: PropTypes.object,
  qRFormat: PropTypes.string,
  transitType: PropTypes.string,
  style: PropTypes.string,
  link: PropTypes.string,
  publishShowTime: PropTypes.func,
  imageChange: PropTypes.bool,
  images: PropTypes.object
};

export default BaseContentForm;
