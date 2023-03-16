/* global google */

// const _ = require("lodash");

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { pathOr } from "ramda";
import { Button } from "element-react";
import { get } from "lodash/fp";

import SingleField from "./SingleField";
import DateTimePickerField from "./DateTimePickerField";
import SelectColorField from "./SelectColorField";
import { isContainScope } from "../actions/utils";
import { HorizontalForm } from "@/components/form";
import AddFieldButton from "@/components/AddFieldButton";
import closeIcon from "../assets/icons/ic-circle-close.svg";
import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle
} from "recompose";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
const {
  SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");

// const apiKey = "AIzaSyAfqXuXTljKUyln1phfnBEOHTR4saLJiBs";

class PassInfoForm extends React.Component {
  publishShowTime = e => {
    e.preventDefault();
    this.props.publishShowTime();
  };

  getError = value => {
    if (!value || value == "") {
      return "This field is required";
    } else {
      return null;
    }
  };

  getErrorLocation = (value, type) => {
    if (!this.isNumber(value)) {
      return "Invalidate value";
    } else {
      if (this.getError(value)) {
        return this.getError(value);
      } else {
        const numberValue = parseFloat(value);
        if (!this.isLocation(numberValue, type)) {
          return "Invalidate value";
        }
      }
    }

    return null;
  };

  getErrorBeacon = value => {
    if (!this.isUnsignedInteger(value)) {
      return "Invalidate value";
    } else {
      const numberValue = parseFloat(value);
      if (!this.isMajorMinor(numberValue)) {
        return "Invalidate value";
      }
    }

    return null;
  };

  isNumber = value => {
    const valueString = String(value);
    if (
      value &&
      value != "" &&
      /^[-+]?\d*\.?\d*$/.test(value) &&
      valueString.substring(valueString.length - 1, valueString.length) != `.`
    ) {
      return true;
    }
    if (value && value != "") {
      return false;
    }
    return true;
  };

  isLocation = (value, type) => {
    switch (type) {
      case "long":
        if (value > 180 || value < -180) {
          return false;
        }
        return true;
      case "lat":
        if (value > 90 || value < -90) {
          return false;
        }
        return true;
    }
  };

  isMajorMinor = value => {
    if (value > 65535 || value < 0) {
      return false;
    }
    return true;
  };

  isUnsignedInteger = value => {
    if (value && value != "" && /^\d*$/.test(value)) {
      return true;
    }
    if (value && value != "") {
      return false;
    }
    return true;
  };

  onChangeNumberField = (e, input) => {
    let value = e.target.value;
    input.onChange(pathOr(null, [], value));
  };

  hasErrors = (locations, beacons) => {
    let hasErrors = false;
    locations.map(location => {
      if (!this.isNumber(location.longitude)) {
        hasErrors = true;
      } else {
        if (this.getError(location.longitude)) {
          hasErrors = true;
        } else {
          if (!this.isLocation(location.longitude, "long")) {
            hasErrors = true;
          }
        }
      }

      if (!this.isNumber(location.latitude)) {
        hasErrors = true;
      } else {
        if (this.getError(location.latitude)) {
          hasErrors = true;
        } else {
          if (!this.isLocation(location.latitude, "lat")) {
            hasErrors = true;
          }
        }
      }

      if (!this.isNumber(location.altitude)) {
        hasErrors = true;
      }
    });

    beacons.map(beacon => {
      if (this.getError(beacon.proximityUUID)) {
        hasErrors = true;
      }

      if (!this.isUnsignedInteger(beacon.major)) {
        hasErrors = true;
      } else {
        if (!this.isMajorMinor(beacon.major)) {
          hasErrors = true;
        }
      }

      if (!this.isUnsignedInteger(beacon.minor)) {
        hasErrors = true;
      } else {
        if (!this.isMajorMinor(beacon.minor)) {
          hasErrors = true;
        }
      }
    });

    return hasErrors;
  };

  render() {
    let { baseDetail, onSubmit, translate } = this.props;

    return (
      <Form
        initialValues={{ ...baseDetail }}
        mutators={{
          ...arrayMutators
        }}
        onSubmit={(values, { initialize, reset }) => {
          if (values.associatedStoreIdentifiers) {
            const appID = [];
            const idInt = parseInt(values.associatedStoreIdentifiers, 10);

            appID.push(idInt);
            values.associatedStoreIdentifiers = appID;
          }
          values.associatedPlayIdentifiers = [];

          onSubmit(values);
          initialize(values);
          reset();
        }}
        render={({ pristine, handleSubmit, form, mutators: { push } }) => {
          const disabled =
            !isContainScope("put:my-org-type:base") ||
            pristine ||
            this.hasErrors(
              pathOr([], ["value"], form.getFieldState("locations")),
              pathOr([], ["value"], form.getFieldState("beacons"))
            );
          const buttonDisabled = "button-disbaled";

          const initLocs = pathOr([], ["locations"], baseDetail);
          const locs = pathOr(
            initLocs,
            ["value"],
            form.getFieldState("locations")
          );

          const MapWithControlledZoom = compose(
            withProps({
              googleMapURL:
                "https://maps.googleapis.com/maps/api/js?key=AIzaSyAfqXuXTljKUyln1phfnBEOHTR4saLJiBs&v=3.exp&libraries=geometry,drawing,places",
              loadingElement: <div style={{ height: `100%` }} />,
              containerElement: <div style={{ height: `400px` }} />,
              mapElement: <div style={{ height: `100%` }} />
            }),
            withState("zoom", "onZoomChange", 8),
            withHandlers(() => {
              const refs = {
                map: undefined
              };

              return {
                onMapMounted: () => ref => {
                  refs.map = ref;
                },
                onZoomChanged: ({ onZoomChange }) => () => {
                  onZoomChange(refs.map.getZoom());
                }
              };
            }),
            lifecycle({
              componentWillMount() {
                const refs = {};

                this.setState({
                  bounds: null,
                  center: {
                    lat: 41.9,
                    lng: -87.624
                  },
                  markers: [],
                  onMapMounted: ref => {
                    refs.map = ref;
                  },
                  onBoundsChanged: () => {
                    this.setState({
                      bounds: refs.map.getBounds(),
                      center: refs.map.getCenter()
                    });
                  },
                  onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                  },
                  onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    const bounds = new google.maps.LatLngBounds();

                    places.forEach(place => {
                      if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport);
                      } else {
                        bounds.extend(place.geometry.location);
                      }
                    });
                    const nextMarkers = places.map(place => ({
                      position: place.geometry.location
                    }));
                    const nextCenter = get(
                      nextMarkers,
                      "0.position",
                      this.state.center
                    );

                    this.setState({
                      center: nextCenter,
                      markers: nextMarkers
                    });
                    refs.map.fitBounds(bounds);
                  }
                });
              }
            }),
            withScriptjs,
            withGoogleMap
          )(props => (
            <GoogleMap
              defaultCenter={
                locs.length
                  ? {
                      lat: parseFloat(locs[0].latitude),
                      lng: parseFloat(locs[0].longitude)
                    }
                  : { lat: 52.51218243913846, lng: 13.408252257812478 }
              }
              zoom={props.zoom}
              ref={props.onMapMounted}
              onZoomChanged={props.onZoomChanged}
              onClick={e => {
                console.log("clicked", e.latLng.lat(), e.latLng.lng());
                console.log(locs);
                form.change("locations", [
                  ...locs,
                  {
                    latitude: e.latLng.lat(),
                    longitude: e.latLng.lng(),
                    relevantText: "Edit new point message..."
                  }
                ]);
              }}
            >
              {locs.map((point, idx) => (
                <Marker
                  key={idx}
                  defaultLabel={"" + (idx + 1)}
                  position={{
                    lat: parseFloat(point.latitude),
                    lng: parseFloat(point.longitude)
                  }}
                  onClick={props.onToggleOpen}
                />
              ))}

              <SearchBox
                ref={props.onSearchBoxMounted}
                bounds={props.bounds}
                controlPosition={1}
                onPlacesChanged={props.onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Enter place..."
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    marginTop: `15px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`
                  }}
                />
              </SearchBox>
            </GoogleMap>
          ));

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
                    <div className="field__label field__label--group">
                      <span>{translate("general")}</span>
                    </div>
                    <Field
                      name="description"
                      label={translate("description")}
                      render={({ input, meta }) => (
                        <SingleField
                          disabled={!isContainScope("put:my-org-type:base")}
                          label={translate("description")}
                          placeholder={translate("description")}
                          onChange={input.onChange}
                          value={input.value}
                          isModified={meta.dirty}
                          type="text"
                          lengthIndication={15}
                          tooltip={translate("descriptionTooltip")}
                        />
                      )}
                    />
                    <Field
                      name="logoText"
                      render={({ input, meta }) => (
                        <SingleField
                          disabled={!isContainScope("put:my-org-type:base")}
                          label="logoText"
                          placeholder="Logo Text"
                          onChange={input.onChange}
                          value={input.value}
                          isModified={meta.dirty}
                          type="text"
                          tooltip={translate("logoTextTooltip")}
                        />
                      )}
                    />
                    <Field
                      name="barcodeMessage"
                      render={({ input, meta }) => (
                        <SingleField
                          disabled={!isContainScope("put:my-org-type:base")}
                          label={translate("barcodeMessage")}
                          placeholder={translate("barcodeMessage")}
                          onChange={input.onChange}
                          value={input.value}
                          isModified={meta.dirty}
                          type="text"
                          tooltip={translate("barcodeMessageTooltip")}
                        />
                      )}
                    />
                    <Field
                      name="associatedStoreIdentifiers"
                      render={({ input, meta }) => (
                        <SingleField
                          disabled={!isContainScope("put:my-org-type:base")}
                          label="App ID on App Store"
                          placeholder="ID on App Store"
                          onChange={input.onChange}
                          value={input.value}
                          isModified={meta.dirty}
                          type="text"
                          tooltip={translate(
                            "associatedStoreIdentifiersTooltip"
                          )}
                        />
                      )}
                    />
                    <Field
                      name="relevantDate"
                      render={({ input, meta }) => (
                        <DateTimePickerField
                          disabled={!isContainScope("put:my-org-type:base")}
                          label="Relevant Date"
                          onChange={input.onChange}
                          value={input.value}
                          isModified={meta.dirty}
                          type="text"
                          tooltip={translate("relevantDateTooltip")}
                        />
                      )}
                    />
                    <Field
                      name="maxDistance"
                      render={({ input, meta }) => (
                        <SingleField
                          disabled={!isContainScope("put:my-org-type:base")}
                          label="Max. Distance"
                          onChange={e => this.onChangeNumberField(e, input)}
                          value={input.value}
                          isModified={meta.dirty}
                          type="text"
                          tooltip={translate("maxDistanceTooltip")}
                          hasErrors={
                            this.isNumber(input.value) ? null : "Invalid value"
                          }
                        />
                      )}
                    />
                    <Field
                      name="backgroundColor"
                      render={({ input, meta }) => (
                        <SelectColorField
                          disabled={!isContainScope("put:my-org-type:base")}
                          name="backgroundColor"
                          label={translate("backgroundColor")}
                          placeholder={translate("barcodeMessage")}
                          onChange={input.onChange}
                          value={input.value}
                          isModified={meta.dirty}
                          type="text"
                        />
                      )}
                    />
                    <Field
                      name="foregroundColor"
                      render={({ input, meta }) => (
                        <SelectColorField
                          disabled={!isContainScope("put:my-org-type:base")}
                          name="foregroundColor"
                          label={translate("foregroundColor")}
                          placeholder={translate("foregroundColor")}
                          onChange={input.onChange}
                          value={input.value}
                          isModified={meta.dirty}
                          type="text"
                        />
                      )}
                    />
                    <Field
                      name="labelColor"
                      render={({ input, meta }) => (
                        <SelectColorField
                          disabled={!isContainScope("put:my-org-type:base")}
                          name="labelColor"
                          label={translate("labelColor")}
                          placeholder={translate("labelColor")}
                          onChange={input.onChange}
                          value={input.value}
                          isModified={meta.dirty}
                          type="text"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: "400px",
                  width: "865px"
                }}
              >
                <MapWithControlledZoom />
              </div>
              <FieldArray name="locations">
                {({ fields }) => (
                  <div className="card">
                    <div className="card__body">
                      <div className="card__body-col">
                        <div className="field__label field__label--group">
                          <span>{"Locations"}</span>
                          <span style={{ float: "right" }}>
                            {pathOr(0, ["length"], fields)}
                            {"/10"}
                          </span>
                        </div>
                        {fields.map((name, index) => (
                          <HorizontalForm
                            key={index}
                            className="u-margin-bottom--22"
                          >
                            <div
                              className="u-margin-right--12 pass-field-width"
                              widthItem={"50%"}
                            >
                              <Field
                                name={`locations[${index}].relevantText`}
                                render={({ input, meta }) => (
                                  <SingleField
                                    disabled={
                                      !isContainScope("put:my-org-type:base")
                                    }
                                    label="Message"
                                    placeholder="Message"
                                    onChange={input.onChange}
                                    value={input.value}
                                    isModified={meta.dirty}
                                    type="text"
                                  />
                                )}
                              />
                            </div>
                            <div
                              className="u-margin-right--12 pass-field-width"
                              widthItem={"15%"}
                            >
                              <Field
                                name={`locations[${index}].altitude`}
                                render={({ input, meta }) => (
                                  <SingleField
                                    disabled={
                                      !isContainScope("put:my-org-type:base")
                                    }
                                    label="altitude"
                                    placeholder="Altitude"
                                    onChange={e =>
                                      this.onChangeNumberField(e, input)
                                    }
                                    value={input.value}
                                    isModified={meta.dirty}
                                    type="text"
                                    hasErrors={
                                      this.isNumber(input.value)
                                        ? null
                                        : "Invalidate value"
                                    }
                                  />
                                )}
                              />
                            </div>
                            <div
                              className="u-margin-right--12 pass-field-width"
                              widthItem={"15%"}
                            >
                              <Field
                                name={`locations[${index}].latitude`}
                                render={({ input, meta }) => (
                                  <SingleField
                                    disabled={
                                      !isContainScope("put:my-org-type:base")
                                    }
                                    label="latitude"
                                    placeholder="-90 to 90"
                                    onChange={e =>
                                      this.onChangeNumberField(e, input)
                                    }
                                    value={input.value}
                                    isModified={meta.dirty}
                                    hasErrors={this.getErrorLocation(
                                      input.value,
                                      "lat"
                                    )}
                                    type="text"
                                  />
                                )}
                              />
                            </div>
                            <div
                              className="u-margin-right--12 pass-field-width"
                              widthItem={"15%"}
                            >
                              <Field
                                name={`locations[${index}].longitude`}
                                render={({ input, meta }) => (
                                  <SingleField
                                    disabled={
                                      !isContainScope("put:my-org-type:base")
                                    }
                                    label="longitude"
                                    placeholder="-180 to 180"
                                    onChange={e =>
                                      this.onChangeNumberField(e, input)
                                    }
                                    value={input.value}
                                    isModified={meta.dirty}
                                    hasErrors={this.getErrorLocation(
                                      input.value,
                                      "long"
                                    )}
                                    type="text"
                                  />
                                )}
                              />
                            </div>
                            <img
                              className="u-margin-left--9 close-icon-left"
                              widthItem={"5%"}
                              src={closeIcon}
                              onClick={() => fields.remove(index)}
                            />
                          </HorizontalForm>
                        ))}
                        {pathOr(0, ["length"], fields) < 10 ? (
                          <AddFieldButton
                            type="button"
                            fieldType="Location"
                            onAdd={() =>
                              push("locations", {
                                latitude: "0",
                                longitude: "0"
                              })
                            }
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </FieldArray>
              <FieldArray name="beacons">
                {({ fields }) => (
                  <div className="card">
                    <div className="card__body">
                      <div className="card__body-col">
                        <div className="field__label field__label--group">
                          <span>{"Beacons"}</span>
                          <span style={{ float: "right" }}>
                            {pathOr(0, ["length"], fields)}
                            {"/10"}
                          </span>
                        </div>
                        {fields.map((name, index) => (
                          <HorizontalForm
                            key={index}
                            className="u-margin-bottom--22"
                          >
                            <div
                              className="u-margin-right--12 pass-field-width"
                              widthItem={"50%"}
                            >
                              <Field
                                name={`beacons[${index}].relevantText`}
                                render={({ input, meta }) => (
                                  <SingleField
                                    disabled={
                                      !isContainScope("put:my-org-type:base")
                                    }
                                    label="Message"
                                    placeholder="Message"
                                    onChange={input.onChange}
                                    value={input.value}
                                    isModified={meta.dirty}
                                    type="text"
                                  />
                                )}
                              />
                            </div>
                            <div
                              className="u-margin-right--12 pass-field-width"
                              widthItem={"15%"}
                            >
                              <Field
                                name={`beacons[${index}].proximityUUID`}
                                render={({ input, meta }) => (
                                  <SingleField
                                    disabled={
                                      !isContainScope("put:my-org-type:base")
                                    }
                                    label="Proximity UUID"
                                    placeholder="Proximity UUID"
                                    onChange={input.onChange}
                                    value={input.value}
                                    isModified={meta.dirty}
                                    type="text"
                                    hasErrors={this.getError(input.value)}
                                  />
                                )}
                              />
                            </div>
                            <div
                              className="u-margin-right--12 pass-field-width"
                              widthItem={"15%"}
                            >
                              <Field
                                name={`beacons[${index}].major`}
                                render={({ input, meta }) => (
                                  <SingleField
                                    disabled={
                                      !isContainScope("put:my-org-type:base")
                                    }
                                    label="Major"
                                    placeholder="0 to 65535"
                                    onChange={e =>
                                      this.onChangeNumberField(e, input)
                                    }
                                    value={input.value}
                                    isModified={meta.dirty}
                                    type="text"
                                    hasErrors={this.getErrorBeacon(input.value)}
                                  />
                                )}
                              />
                            </div>
                            <div
                              className="u-margin-right--12 pass-field-width"
                              widthItem={"15%"}
                            >
                              <Field
                                name={`beacons[${index}].minor`}
                                render={({ input, meta }) => (
                                  <SingleField
                                    disabled={
                                      !isContainScope("put:my-org-type:base")
                                    }
                                    label="Minor"
                                    placeholder="0 to 65535"
                                    onChange={e =>
                                      this.onChangeNumberField(e, input)
                                    }
                                    value={input.value}
                                    isModified={meta.dirty}
                                    type="text"
                                    hasErrors={this.getErrorBeacon(input.value)}
                                  />
                                )}
                              />
                            </div>
                            <img
                              className="u-margin-left--9 close-icon-left"
                              widthItem={"5%"}
                              src={closeIcon}
                              onClick={() => fields.remove(index)}
                            />
                          </HorizontalForm>
                        ))}
                        {pathOr(0, ["length"], fields) < 10 ? (
                          <AddFieldButton
                            type="button"
                            fieldType="Beacon"
                            onAdd={() => push("beacons", {})}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </FieldArray>
            </form>
          );
        }}
      />
    );
  }
}

PassInfoForm.propTypes = {
  baseDetail: PropTypes.object,
  onSubmit: PropTypes.func,
  translate: PropTypes.func,
  publishShowTime: PropTypes.func
};

export default connect(
  state => ({
    translate: getTranslate(state.locale)
  }),
  () => ({})
)(PassInfoForm);
