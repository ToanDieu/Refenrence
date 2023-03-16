import React from "react";
import PropTypes from "prop-types";
import { searchCase } from "../actions/case";
import { getTranslate } from "react-localize-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Table } from "tse-storybook";
import orgConfigs from "../constants/orgConfigs.js";
import Path from "ramda/src/path";

class SearchResult extends React.Component {
  componentWillMount() {
    const org = this.props.getOrgName;
    this.setState({
      fields: orgConfigs[org].display.homePage.caseListFields.data
    });
  }

  componentDidMount() {
    const { searchTerm } = this.props.match.params;
    const baseID = this.props.baseID;
    this.props.searchCase({
      params: { matching: searchTerm },
      baseID
    });
  }

  componentWillUpdate(nextProps) {
    const { searchTerm } = this.props.match.params;
    const nextSearchTerm = nextProps.match.params.searchTerm;
    if (nextSearchTerm && searchTerm !== nextSearchTerm) {
      this.props.searchCase({
        params: { matching: nextSearchTerm },
        baseID: this.props.baseID
      });
    }
  }

  //CASELIST HANDLE
  checkPathReason = data => {
    const checkReson = Path(["activities", 0, "meta", "detail", "reason"]);
    return (
      checkReson(data) != undefined &&
      data.activities[0].meta.detail.reason != ""
    );
  };

  checkPathUpdate = data => {
    const checkReson = Path(["activities", 0, "createdAt"]);
    return checkReson(data) != undefined && data.activities[0].createdAt != "";
  };

  mapViewField = item => {
    const statusTypeExtra = item.activities
      ? item.activities[0].actiType
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          // uppercase the first character
          .replace(/^./, function(str) {
            return str;
          })
          .toLowerCase()
      : "";
    const statusTypeStuff = "step" + item.currentStep + " " + statusTypeExtra;
    return {
      id: item.alternativeId,
      step: item.currentStep,
      createdDate: item.createdAt,
      status: item.activities ? item.activities[0].brief : "",
      statusType: statusTypeStuff,
      hasPass: item.isRegistered ? "yes" : "no",
      update: this.checkPathUpdate(item) ? item.activities[0].createdAt : "",
      licensePlate:
        item.extraParams && item.extraParams.LicensePlate
          ? item.extraParams.LicensePlate
          : "!",
      phone: item.mobile,
      issuer: item.issuerName,
      code:
        item.extraParams && item.extraParams.code ? item.extraParams.code : "!",
      shop:
        item.extraParams && item.extraParams.shop ? item.extraParams.shop : "!",
      createdBy:
        item.createdBy.substring(0, item.createdBy.lastIndexOf("@")) ||
        item.createdBy
    };
  };

  mapColumnName = fieldKey => {
    const { translate } = this.props;
    const mapNameDefinition = [
      {
        name: translate("caseid"),
        keys: ["id", "alternativeId"]
      },
      {
        name: "has pass",
        keys: ["hasPass"]
      },
      {
        name: translate("state"),
        keys: ["statusType"]
      },
      {
        name: translate("created"),
        keys: ["createdDate"]
      },
      {
        name: translate("l_plate"),
        keys: ["licensePlate"]
      },
      {
        name: translate("manager"),
        keys: ["createdBy"]
      },
      {
        name: translate("step"),
        keys: ["step"]
      },
      {
        name: translate("phone"),
        keys: ["phone"]
      },
      {
        name: translate("issuer"),
        keys: ["issuer"]
      }
    ];
    const defIndex = mapNameDefinition.findIndex(def =>
      def.keys.includes(fieldKey)
    );
    return defIndex === -1 ? fieldKey : mapNameDefinition[defIndex].name;
  };

  render() {
    let { caseSearchList, translate } = this.props;
    caseSearchList = caseSearchList.data ? caseSearchList.data : { data: [] };
    console.log("SearchResult render: ", caseSearchList);

    const { fields } = this.state;
    //PAGE TITLE
    const titleSecondTable = {
      label: "Search Result",
      number:
        caseSearchList.data && caseSearchList.data.length
          ? caseSearchList.data.length
          : null
    };

    //TABLE stuffs
    let loading = caseSearchList.loading;
    let error = caseSearchList.error;
    let columnArray = [];
    let dataArray = [];
    //GET COLUMNS AND COMLUMNS DEFINE
    fields.map(field => {
      if (field.EXTRA) {
        //add extra column
        columnArray.push({
          rowclassname: "u-text-align--right"
        });
      } else {
        columnArray.push({
          key: field.key,
          label: this.mapColumnName(field.key),
          rowclassname: field.rowclassname ? field.rowclassname : null,
          headclassname: field.headclassname ? field.headclassname : null,
          type: field.type ? field.type : null,
          formatString: field.formatString ? field.formatString : null,
          splitBy: field.splitBy ? field.splitBy : null,
          bold: field.bold && field.bold === "yes" ? true : false,
          width: field.width ? field.width + " !important" : null
        });
      }
    });

    // GET AND HANDLE ROWS DATA
    caseSearchList.data
      ? caseSearchList.data.map(item => {
          let rowData = {};
          fields.map((field, index) => {
            if (field.type === "distanceInWordsToNow") {
              rowData[field.key] = new Date(
                this.mapViewField(item, index)[field.key]
              );
            } else if (field.type === "linkTag") {
              rowData[field.key] = {
                label: this.mapViewField(item, index)[field.key],
                url: `/case/${item.id}`
              };
            } else if (field.EXTRA && field.EXTRA === "KEYCUSTOM") {
              rowData[field.EXTRA] = {
                type: field.extraType,
                label: translate(field.extraLabel),
                url: `/case/${item.id}`,
                icon: field.extraIcon ? field.extraIcon : null
              };
            } else {
              rowData[field.key] = this.mapViewField(item, index)[field.key];
            }
          });
          //fill each row in to dataArray
          dataArray.push(rowData);
        })
      : "";

    return (
      <div className="home">
        <div className="home__content">
          <div className="container-wide">
            <Table
              columnsDefine={columnArray}
              data={dataArray}
              titleSecond={titleSecondTable}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    );
  }
}

SearchResult.propTypes = {
  translate: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      searchTerm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }),
  baseID: PropTypes.number,
  searchCase: PropTypes.func,
  caseSearchList: PropTypes.object,
  searchTerm: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getOrgName: PropTypes.string
};

const mapState = state => ({
  baseID: state.pageDetail.current.detail.id,
  caseSearchList: state.caseSearchList || [],
  translate: getTranslate(state.locale),
  getOrgName: state.getOrgName.data
});

const mapDispatch = dispatch => {
  return {
    searchCase: bindActionCreators(searchCase, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(SearchResult);
