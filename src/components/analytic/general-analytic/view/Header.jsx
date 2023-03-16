import React from "react";
import PropTypes from "prop-types";
import { pathOr } from "ramda";
import { parse as csvParse } from "json2csv";

import { Button } from "element-react";
import { HorizontalForm } from "@/components/form";
import { DropdownButon, RadioField } from "@/components/fields";
import DownloadButton from "@/components/download-button/container";

import ss from "classnames";
import c from "./header.comp.scss";

import iconDownload from "@/assets/icons/ic-circle-download.svg";

export default class Header extends React.Component {
  onChange = value => {
    const { onChange } = this.props;
    onChange(value);
  };

  downloadCSV = () => {
    let labels = Object.keys(pathOr([], [0], this.props.dataChart));
    let newlabels = [];

    newlabels.push("label");
    labels = labels.filter(label => label != "labelX");
    labels = labels.filter(label => label != "label");

    newlabels = newlabels.concat(labels);
    console.log("downloadCSV", newlabels);

    return csvParse(this.props.dataChart, {
      fields: newlabels
    });
  };

  render() {
    const {
      timeFrequencyOptions,
      groupBySelected,
      timeFrequency,
      groupByList
    } = this.props;

    return (
      <HorizontalForm className={ss(c["container"])} noneBackground={true}>
        <RadioField format="horizontal">
          <Button.Group>
            <DropdownButon
              items={timeFrequencyOptions}
              onCommand={this.onChange}
              options={{ trigger: "click" }}
            >
              <Button
                className={ss(
                  c["text"],
                  groupBySelected == timeFrequency
                    ? c["selected"]
                    : c["default"]
                )}
                onClick={() => this.onChange(timeFrequency)}
              >
                {timeFrequency}
                <i className="el-icon-caret-bottom el-icon--right" />
              </Button>
            </DropdownButon>
            {groupByList.map(item => {
              if (item != "Date") {
                return (
                  <Button onClick={() => this.onChange(item)}>
                    <div
                      className={ss(
                        c["text"],
                        groupBySelected == item ? c["selected"] : c["default"]
                      )}
                    >
                      {item}
                    </div>
                  </Button>
                );
              }
            })}
          </Button.Group>
        </RadioField>
        <DownloadButton
          align={"right"}
          className={ss(c["export-button"])}
          label="Export"
          iconPath={iconDownload}
          onClick={this.downloadCSV}
        />
      </HorizontalForm>
    );
  }
}

Header.propTypes = {
  timeFrequencyOptions: PropTypes.array,
  groupByList: PropTypes.array,
  timeFrequency: PropTypes.string,
  onChange: PropTypes.func,
  groupBySelected: PropTypes.string,
  dataChart: PropTypes.array
};
