import React from "react";
import PropTypes from "prop-types";
import { pathOr } from "ramda";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import Path from "ramda/src/path";
import { Table } from "tse-storybook";

import { fetchCaseListByBase, searchCase } from "../actions/case";
import { fetchOldNotifications, setBaseChannel } from "../actions/notify";
import { fetchBaseList } from "../actions/base";

// CASELIST IMPORT
import orgConfigs from "../constants/orgConfigs";
import { isContainScope } from "../actions/utils";

class SearchCases extends React.Component {
  componentWillMount() {
    const org = this.props.getOrgName;
    const numItem = 100;
    this.setState({
      numItem,
      fields: orgConfigs[org].display.homePage.caseListFields.data
    });
  }

  componentDidMount() {
    const { searchTerm } = this.props.match.params;
    const { baseID } = this.props;
    this.props.searchCase({
      params: {
        matching: searchTerm,
        lang: "en",
        limit: this.state.numItem,
        page: 1
      },
      baseID
    });
  }

  // componentWillUpdate(nextProps) {
  //   const { searchTerm } = this.props.match.params;
  //   const nextSearchTerm = nextProps.match.params.searchTerm;
  //   if (nextSearchTerm && searchTerm !== nextSearchTerm) {
  //     this.props.searchCase({
  //       params: { matching: nextSearchTerm },
  //       baseID: this.props.baseID
  //     });
  //   }
  // }

  capitalizeFirstLetter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  gotoPage = page => {
    const { searchTerm } = this.props.match.params;
    const { baseID } = this.props;
    this.props.setBaseChannel({ baseID });
    const numItem = this.state.numItem || 10;
    this.props.searchCase({
      params: {
        matching: searchTerm,
        lang: "en",
        page,
        limit: numItem
      },
      baseID
    });
  };

  handleChangeNumItem = numItem => {
    const { baseID } = this.props;
    const { searchTerm } = this.props.match.params;
    this.setState({
      numItem
    });

    this.props.setBaseChannel({ baseID });
    this.props.searchCase({
      params: {
        matching: searchTerm,
        lang: "en",
        limit: numItem,
        page: 1
      },
      baseID
    });
  };

  stepPage = (next, currentPage, maxPage) => {
    if (next) {
      if (currentPage < maxPage) {
        this.gotoPage(currentPage + 1);
      }
    } else if (currentPage > 1) {
      this.gotoPage(currentPage - 1);
    }
  };

  searchCase = matching => {
    this.props.searchCase({ matching });
  };

  // CASELIST HANDLE
  checkPathReason = data => {
    const checkReson = Path(["activities", 0, "meta", "detail", "reason"]);
    return (
      checkReson(data) !== undefined &&
      data.activities[0].meta.detail.reason !== ""
    );
  };

  checkPathUpdate = data => {
    const checkReson = Path(["activities", 0, "createdAt"]);
    return (
      checkReson(data) !== undefined && data.activities[0].createdAt !== ""
    );
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
    const statusTypeStuff = `step${item.currentStep} ${statusTypeExtra}`;
    return {
      id: item.alternativeId,
      step: item.currentStep,
      createdDate: item.createdAt,
      status: item.activities ? item.activities[0].brief : "",
      statusType: statusTypeStuff,
      hasPass: item.isRegistered ? "yes" : "no",
      update: this.checkPathUpdate(item) ? item.activities[0].createdAt : "",
      licensePlate: pathOr("!", ["params", "LicensePlate"], item),
      phone: pathOr("!", ["params", "Mobile"], item),
      issuer: pathOr("!", ["params", "IssuerName"], item),
      code: pathOr("!", ["params", "code"], item),
      shop: pathOr("!", ["params", "shop"], item),
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
        name: translate("shortIssuer"),
        keys: ["issuer"]
      }
    ];
    const defIndex = mapNameDefinition.findIndex(def =>
      def.keys.includes(fieldKey)
    );
    return defIndex === -1 ? fieldKey : mapNameDefinition[defIndex].name;
  };

  render() {
    const { caseSearchList: caseList, translate } = this.props;
    const { fields } = this.state;

    console.log(
      "render: ",
      caseList.data && caseList.data.size ? caseList.data.size : null
    );
    // PAGE TITLE
    const titleSecondTable = {
      label: "Search Result",
      number: caseList.data && caseList.data.size ? caseList.data.size : null
    };

    // TABLE stuffs
    const { loading } = caseList;
    const { error } = caseList;
    const columnArray = [];
    const dataArray = [];
    // GET COLUMNS AND COMLUMNS DEFINE
    fields.map(field => {
      if (field.EXTRA) {
        // add extra column
        return columnArray.push({
          rowClassname: "u-text-align--right"
        });
      }
      return columnArray.push({
        key: field.key,
        label: this.mapColumnName(field.key),
        rowClassname: field.rowClassname ? field.rowClassname : null,
        headClassname: field.headClassname ? field.headClassname : null,
        type: field.type ? field.type : null,
        formatString: field.formatString ? field.formatString : null,
        splitBy: field.splitBy ? field.splitBy : null,
        bold: !!(field.bold && field.bold === "yes"),
        width: field.width ? `${field.width} !important` : null
      });
    });

    // GET AND HANDLE ROWS DATA
    if (pathOr(false, ["data", "data"], caseList)) {
      caseList.data.data.map(item => {
        const rowData = {};
        fields.map(field => {
          if (field.type === "distanceInWordsToNow") {
            rowData[field.key] = new Date(this.mapViewField(item)[field.key]);
          } else if (field.type === "linkTag") {
            rowData[field.key] = {
              label: this.mapViewField(item)[field.key],
              url: `/case/${item.id}`
            };
          } else if (field.EXTRA && field.EXTRA === "KEYCUSTOM") {
            if (isContainScope("get:my-org-type-base:case")) {
              rowData[field.EXTRA] = {
                type: field.extraType,
                label: translate(field.extraLabel),
                url: `/case/${item.id}`,
                icon: field.extraIcon ? field.extraIcon : null
              };
            }
          } else {
            rowData[field.key] = this.mapViewField(item)[field.key];
          }

          return rowData[field.key];
        });
        // fill each row in to dataArray
        return dataArray.push(rowData);
      });
    }
    // capitalize first letter
    let show = translate("show");
    show = this.capitalizeFirstLetter(show);

    // PAGINATION STUFFS

    const paginationStuff = {
      numItem: this.state.numItem,
      page: {
        size: caseList.data ? caseList.data.size : null,
        currentpage: caseList.data ? caseList.data.currentpage : null,
        totalPage: caseList.data ? caseList.data.page : null
      },
      gotoPage: this.gotoPage,
      stepPage: this.stepPage,
      handleChangeNumItem: this.handleChangeNumItem,
      showListOption: [10, 20, 50, 100],
      paginationText: [show, translate("of"), translate("perPage")]
    };

    console.log("render page:", paginationStuff.page);

    return (
      <div className="home">
        <div className="home__content">
          <div className="container-wide">
            {isContainScope("list:my-org-type-base:case") ? (
              <Table
                columnsDefine={columnArray}
                data={dataArray}
                titleSecond={titleSecondTable}
                paginationStuff={paginationStuff}
                loading={loading}
                error={error}
              />
            ) : (
              <Table
                columnsDefine={columnArray}
                data={dataArray}
                titleSecond={titleSecondTable}
                paginationStuff={paginationStuff}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

SearchCases.propTypes = {
  translate: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      searchTerm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }).isRequired,
  baseID: PropTypes.number.isRequired,
  searchCase: PropTypes.func.isRequired,
  caseSearchList: PropTypes.object,
  searchTerm: PropTypes.string,
  getOrgName: PropTypes.string.isRequired
};

SearchCases.defaultProps = {
  translate: value => {
    return value;
  },
  caseSearchList: {},
  searchTerm: ""
};

const mapState = state => ({
  baseID: state.pageDetail.current.detail.id,
  caseSearchList: state.caseSearchList || [],
  translate: getTranslate(state.locale),
  getOrgName: state.getOrgName.data
});

const mapDispatch = dispatch => {
  return {
    setBaseChannel: bindActionCreators(setBaseChannel, dispatch),
    fetchCaseListByBase: bindActionCreators(fetchCaseListByBase, dispatch),
    searchCase: bindActionCreators(searchCase, dispatch),
    fetchOldNotifications: bindActionCreators(fetchOldNotifications, dispatch),
    fetchBaseList: bindActionCreators(fetchBaseList, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(SearchCases);
