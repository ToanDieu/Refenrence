import React from "react";
import PropTypes from "prop-types";
import { pathOr } from "ramda";

import config from "../appConfig";
import { fetchCaseListByBase, searchCase } from "../actions/case";
import { fetchOldNotifications, setBaseChannel } from "../actions/notify";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import exportdashboardIcon from "../assets/icons/ic-circle-download.svg";
import Path from "ramda/src/path";
import { fetchBaseList } from "../actions/base";

//CASELIST IMPORT
import orgConfigs from "../constants/orgConfigs";
import { isContainScope } from "../actions/utils";

import { Table } from "tse-storybook";
// import infoIcon from "../assets/icons/ic-circle-info.svg";
// import sortIcon from "../assets/icons/ic-extend-down.svg";

// const sortColumn = ({ data, field, desc }) => {
//   if (data == undefined) {
//     return [];
//   }
//   data.sort(function(a, b) {
//     if (a[field] > b[field]) {
//       return desc ? -1 : 1;
//     } else {
//       return desc ? 1 : -1;
//     }
//   });
//   return data;
// };

//Hard code
// const sortColumnDefault = ({ data, desc }) => {
//   if (data == undefined) {
//     return [];
//   }
//   const checkReson = Path(["activities", 0, "createdAt"]);

//   data.sort(function(a, b) {
//     if (checkReson(a) == undefined) {
//       return 1;
//     }
//     if (checkReson(b) == undefined) {
//       return -1;
//     }
//     if (a.activities[0].createdAt > b.activities[0].createdAt) {
//       return desc ? -1 : 1;
//     } else {
//       return desc ? 1 : -1;
//     }
//   });
//   const result = data.filter(item => !item.archived);
//   console.log("data after sort", result);
//   return result;
// };
class Home extends React.Component {
  componentWillMount() {
    const org = this.props.getOrgName;
    const numItem = 100;
    this.setState({
      numItem: numItem,
      fields: orgConfigs[org].display.homePage.caseListFields.data
    });
    let baseID = this.props.match.params["baseID"];

    if (!baseID) {
      const { typeID } = this.props;

      this.props.fetchBaseList({ typeID }).then(res => {
        console.log("Home fetchBaseList", res.payload);
        //Hardcode default first baseid in list.
        baseID = res.payload[0].id;

        this.props.setBaseChannel({ baseID });
        this.props.fetchCaseListByBase({ baseID, numItem });
      });
    } else {
      this.props.setBaseChannel({ baseID });
      this.props.fetchCaseListByBase({ baseID, numItem });
    }
  }

  componentDidMount() {
    // this.props.fetchOldNotifications({ baseID });
  }

  capitalizeFirstLetter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  gotoPage = page => {
    const baseID = this.props.match.params["baseID"];
    this.props.setBaseChannel({ baseID });
    const numItem = this.state.numItem || 10;
    this.props.fetchCaseListByBase({ baseID, page, numItem });
  };
  handleChangeNumItem = numItem => {
    const baseID = this.props.match.params["baseID"];
    this.setState({
      numItem: numItem
    });
    this.props.setBaseChannel({ baseID });
    this.props.fetchCaseListByBase({ baseID, numItem });
  };
  stepPage = (next, currentPage, maxPage) => {
    if (next) {
      if (currentPage < maxPage) {
        this.gotoPage(currentPage + 1);
      }
    } else {
      if (currentPage > 1) {
        this.gotoPage(currentPage - 1);
      }
    }
  };

  searchCase = matching => {
    this.props.searchCase({ matching });
  };

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
        name: translate("updated"),
        keys: ["update"]
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
    const baseID = this.props.match.params["baseID"];
    const token = localStorage.getItem("token");
    const { caseList, translate } = this.props;
    const { fields } = this.state;

    console.log("fields: ", fields);

    //PAGE TITLE
    const titleFirstTable = { label: "Base " + baseID };
    const titleSecondTable = {
      label: translate("pendingcase"),
      number: caseList.data && caseList.data.size ? caseList.data.size : null
    };
    const titleThirdTable = isContainScope("list:my-org-type-base:case")
      ? {
          label: translate("exportdashboard"),
          href: `${
            config.TSE_API
          }/base/${baseID}/exportdashboard?field=code&auth=${token}`,
          icon: exportdashboardIcon
        }
      : {};

    //TABLE stuffs
    let loading = caseList.loading;
    let error = caseList.error;
    let columnArray = [];
    let dataArray = [];
    //GET COLUMNS AND COMLUMNS DEFINE
    fields.map(field => {
      if (field.EXTRA) {
        //add extra column
        columnArray.push({
          rowClassname: "u-text-align--right"
        });
      } else {
        columnArray.push({
          key: field.key,
          label: this.mapColumnName(field.key),
          rowClassname: field.rowClassname ? field.rowClassname : null,
          headClassname: field.headClassname ? field.headClassname : null,
          type: field.type ? field.type : null,
          formatString: field.formatString ? field.formatString : null,
          splitBy: field.splitBy ? field.splitBy : null,
          bold: field.bold && field.bold === "yes" ? true : false,
          width: field.width ? field.width + " !important" : null
        });
      }
    });

    // GET AND HANDLE ROWS DATA
    caseList.data && caseList.data.data
      ? caseList.data.data.map(item => {
          let rowData = {};
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
          });
          //fill each row in to dataArray
          dataArray.push(rowData);
        })
      : "";
    // capitalize first letter
    let show = translate("show");
    show = this.capitalizeFirstLetter(show);

    //PAGINATION STUFFS

    let paginationStuff = {
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
    return (
      <div className="home">
        <div className="home__content">
          <div className="container-wide">
            {isContainScope("list:my-org-type-base:case") ? (
              <Table
                columnsDefine={columnArray}
                data={dataArray}
                titleFirst={titleFirstTable}
                titleSecond={titleSecondTable}
                titleThird={titleThirdTable}
                paginationStuff={paginationStuff}
                loading={loading}
                error={error}
              />
            ) : (
              <Table
                columnsDefine={columnArray}
                data={dataArray}
                titleFirst={titleFirstTable}
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

Home.propTypes = {
  typeID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  match: PropTypes.shape({
    params: PropTypes.shape({
      baseID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }),
  socket: PropTypes.object,
  setBaseChannel: PropTypes.func,
  fetchCaseListByBase: PropTypes.func,
  fetchOldNotifications: PropTypes.func,
  fetchBaseList: PropTypes.func,
  searchCase: PropTypes.func,
  searchList: PropTypes.array,
  caseList: PropTypes.shape({
    loading: PropTypes.bool,
    data: PropTypes.object
  }),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  translate: PropTypes.func,
  getLanguage: PropTypes.func,
  getOrgName: PropTypes.string
};

const mapState = state => ({
  searchList: state.searchList || [],
  caseList: state.caseList,
  createCase: state.caseCreate,
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
)(Home);
