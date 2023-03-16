import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";

import co from "co";
import format from "date-fns/format";
import subDays from "date-fns/sub_days";
import queryString from "query-string";
import { pathOr, map, prop, unnest } from "ramda";
import { parse as csvParse } from "json2csv";

import DownloadButton from "@/components/download-button/container";
import Pagination from "@/container/Pagination";
import iconDownload from "@/assets/icons/ic-circle-download.svg";
import Star from "@/components/Star";
import DateRangeOrFromTo from "@/components/DateRangeOrFromTo";

import { getDefaultSetting } from "@/actions/utils";
import {
  fetchListQuestionByBase,
  fetchListFeedbackByBaseAndQuestionId
} from "@/actions/case";

import orgConfig from "@/constants/orgConfigs";

import icExtendDown from "@/assets/icons/extend-down.svg";
import icSearch from "@/assets/icons/ic-search.svg";
import icClose from "@/assets/icons/ic-close.svg";
import { getTranslate } from "react-localize-redux";

class FeedBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // get default base id from ORG
      baseId: parseInt(getDefaultSetting("baseId", this.props.getOrgName)),
      dropdown: false,
      currentQuestion: undefined,
      questionList: [],
      displayQuestion: {},
      feedbackList: {},
      loading: true,
      error: false,
      isIconSearch: true,
      isSearchingList: false,
      isFromTo: false,
      dateTo: new Date(new Date().setHours(23, 59, 59)),
      dateFrom: subDays(new Date(), 30),
      isFiltering: false
    };
  }

  componentWillMount() {
    let questionIdsInt = [];
    let questionList = [];
    const { baseId } = this.state;
    this.setState({
      loading: true
    });

    // get query String
    const queryValues = queryString.parse(this.props.location.search);
    if (
      pathOr(false, ["index"], queryValues) &&
      pathOr(false, ["start"], queryValues) &&
      pathOr(false, ["end"], queryValues)
    ) {
      console.log(
        "index question, start end time:",
        queryValues.index,
        queryValues.start,
        queryValues.end
      );
    }

    // initialize number of displaying feedbacks
    const numItem = 20;
    const orgName = this.props.getOrgName;
    // get question ids from ORG and convert to Integer
    Object.keys(orgConfig[orgName].numberQuestionMap).map(idString => {
      let idInt = parseInt(idString);
      questionIdsInt.push(idInt);
    });
    // get questions list
    this.props
      .fetchListQuestionByBase({
        baseId: baseId,
        listQuestionId: questionIdsInt
      })
      .then(response => {
        response.data.map((item, index) => {
          questionList.push({
            id: item.id,
            content: `${index + 1}. ${item.content}`
          });
        });

        // check query params if there is a filter calling from Analytic
        if (queryValues.index) {
          const currentQuestion = questionList[parseInt(queryValues.index)].id;

          this.props
            .fetchListFeedbackByBaseAndQuestionId({
              questionId: currentQuestion,
              baseId: baseId,
              numItem: numItem,
              start: format(queryValues.start.toString(), "YYYY-MM-DD"),
              end: format(queryValues.end.toString(), "YYYY-MM-DD")
            })
            .then(response => {
              this.setState({
                loading: false,
                numItem: numItem,
                currentQuestion: currentQuestion,
                displayQuestion: questionList[parseInt(queryValues.index)],
                questionList: questionList,
                isFromTo: true,
                feedbackList: response,
                isFiltering: true,
                dateFrom: new Date(queryValues.start.toString()),
                dateTo: new Date(queryValues.end.toString())
              });
            })
            .catch(err => {
              this.setState({
                loading: false,
                error: true
              });
              console.log("fetchListFeedbackByBaseAndQuestionId ERROR: ", err);
            });
        } else {
          this.props
            .fetchListFeedbackByBaseAndQuestionId({
              questionId: questionList[0].id,
              baseId: baseId,
              numItem: numItem
            })
            .then(response => {
              this.setState({
                loading: false,
                currentQuestion: questionList[0].id,
                numItem: numItem,
                displayQuestion: questionList[0],
                questionList: questionList,
                feedbackList: response
              });
            })
            .catch(err => {
              this.setState({
                loading: false,
                error: true
              });
              console.log("fetchListFeedbackByBaseAndQuestionId ERROR: ", err);
            });
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: true
        });
        console.log("fetchListQuestionByBase ERROR: ", err);
      });
  }

  handleCoverClick = () => {
    this.setState({
      dropdown: !this.state.dropdown
    });
  };

  downloadCSV = () => {
    const { baseId, currentQuestion, isFiltering } = this.state;

    const dateRange = isFiltering
      ? {
          start: this.convertGMTToUTCAndFormat(
            "YYYY-MM-DD",
            this.state.dateFrom
          ),
          end: this.convertGMTToUTCAndFormat("YYYY-MM-DD", this.state.dateTo)
        }
      : {};

    return this.props
      .fetchListFeedbackByBaseAndQuestionId({
        questionId: currentQuestion,
        baseId: baseId,
        /**
         * HARDCODED i need to fetch all records
         **/
        numItem: 10000,
        ...dateRange
      })
      .then(({ data }) =>
        csvParse(data, {
          fields: [
            "id",
            "alternativeId",
            "onStep",
            "comment",
            "rating",
            "archived",
            "test",
            "createdAt"
          ]
        })
      );
  };

  downloadAllCSV = () => {
    const questionIds = map(prop("id"), this.state.questionList);

    const requests = questionIds.map(questionId =>
      this.props
        .fetchListFeedbackByBaseAndQuestionId({
          questionId: questionId,
          baseId: this.state.baseId,
          /**
           * HARDCODED i need to fetch all records
           **/
          numItem: 10000,
          ...(this.state.isFiltering
            ? {
                start: this.convertGMTToUTCAndFormat(
                  "YYYY-MM-DD",
                  this.state.dateFrom
                ),
                end: this.convertGMTToUTCAndFormat(
                  "YYYY-MM-DD",
                  this.state.dateTo
                )
              }
            : {})
        })
        .then(({ data }) => data)
    );

    return co(function*() {
      return yield requests;
    }).then(respondDatas =>
      csvParse(unnest(respondDatas).filter(o => o), {
        fields: [
          "id",
          "alternativeId",
          "onStep",
          "comment",
          "rating",
          "archived",
          "test",
          "createdAt"
        ]
      })
    );
  };

  handleQuestionSelect = question => {
    const { baseId } = this.state;
    //reset search text
    document.getElementById("search-input").value = "";

    this.setState({
      loading: true,
      dropdown: false
    });

    const dateRange = this.state.isFiltering
      ? {
          start: this.convertGMTToUTCAndFormat(
            "YYYY-MM-DD",
            this.state.dateFrom
          ),
          end: this.convertGMTToUTCAndFormat("YYYY-MM-DD", this.state.dateTo)
        }
      : {};
    // get feedback list by the first question's Id in the questionList
    this.props
      .fetchListFeedbackByBaseAndQuestionId({
        questionId: question.id,
        baseId: baseId,
        numItem: this.state.numItem,
        ...dateRange
      })
      .then(response => {
        this.setState({
          currentQuestion: question.id,
          loading: false,
          displayQuestion: question,
          feedbackList: response,
          isSearchingList: false
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: true
        });
        console.log("fetchListFeedbackByBaseAndQuestionId ERROR: ", err);
      });
  };

  /* Hanlde pagination */
  gotoPage = pageNum => {
    const {
      dateFrom,
      dateTo,
      isFiltering,
      isSearchingList,
      displayQuestion
    } = this.state;
    let params = {};
    const numItem = this.state.numItem || 20;

    this.setState({
      loading: true
    });

    if (isSearchingList && isFiltering) {
      params = {
        page: pageNum,
        numItem: numItem,
        baseId: this.state.baseId,
        questionId: displayQuestion.id,
        matching: document.getElementById("search-input").value,
        start: this.convertGMTToUTCAndFormat("YYYY-MM-DD", dateFrom),
        end: this.convertGMTToUTCAndFormat("YYYY-MM-DD", dateTo)
      };
    } else if (isSearchingList && !isFiltering) {
      params = {
        page: pageNum,
        numItem: numItem,
        baseId: this.state.baseId,
        questionId: displayQuestion.id,
        matching: document.getElementById("search-input").value
      };
    } else if (!isSearchingList && isFiltering) {
      params = {
        page: pageNum,
        numItem: numItem,
        baseId: this.state.baseId,
        questionId: displayQuestion.id,
        start: this.convertGMTToUTCAndFormat("YYYY-MM-DD", dateFrom),
        end: this.convertGMTToUTCAndFormat("YYYY-MM-DD", dateTo)
      };
    } else {
      params = {
        page: pageNum,
        numItem: numItem,
        baseId: this.state.baseId,
        questionId: displayQuestion.id
      };
    }

    this.props
      .fetchListFeedbackByBaseAndQuestionId(params)
      .then(res => {
        this.setState({
          loading: false,
          feedbackList: res
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: true
        });
        console.log("fetchListFeedbackByBaseAndQuestionId ERROR: ", err);
      });
  };
  handleChangeNumItem = numItem => {
    const {
      dateFrom,
      dateTo,
      displayQuestion,
      isSearchingList,
      isFiltering
    } = this.state;
    let params = {};
    this.setState({
      loading: true
    });

    if (isSearchingList && isFiltering) {
      params = {
        numItem: numItem,
        baseId: this.state.baseId,
        questionId: displayQuestion.id,
        matching: document.getElementById("search-input").value,
        start: this.convertGMTToUTCAndFormat("YYYY-MM-DD", dateFrom),
        end: this.convertGMTToUTCAndFormat("YYYY-MM-DD", dateTo)
      };
    } else if (isSearchingList && !isFiltering) {
      params = {
        numItem: numItem,
        baseId: this.state.baseId,
        questionId: displayQuestion.id,
        matching: document.getElementById("search-input").value
      };
    } else if (!isSearchingList && isFiltering) {
      params = {
        numItem: numItem,
        baseId: this.state.baseId,
        questionId: displayQuestion.id,
        start: this.convertGMTToUTCAndFormat("YYYY-MM-DD", dateFrom),
        end: this.convertGMTToUTCAndFormat("YYYY-MM-DD", dateTo)
      };
    } else {
      params = {
        numItem: numItem,
        baseId: this.state.baseId,
        questionId: displayQuestion.id
      };
    }

    this.props
      .fetchListFeedbackByBaseAndQuestionId(params)
      .then(response => {
        this.setState({
          loading: false,
          numItem: numItem,
          feedbackList: response
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: true
        });
        console.log("fetchListFeedbackByBaseAndQuestionId ERROR: ", err);
      });
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

  convertGMTToUTCAndFormat = (formatString, value) => {
    let tempValue = new Date(value);

    let returnValue = format(
      tempValue.getTime() + tempValue.getTimezoneOffset() * 60000,
      formatString
    );

    return returnValue;
  };

  handleOnchangeFromTo = dateInfo => {
    this.setState({
      loading: true
    });
    const { isSearchingList } = this.state;

    let target = dateInfo.component;
    let dataValue = dateInfo.value;

    const currentTime = new Date();
    dataValue = new Date(dataValue).setHours(currentTime.getHours());

    if (target === "from") {
      this.setState({
        dateFrom: dataValue
      });
    } else {
      this.setState({
        dateTo: dataValue
      });
    }

    const numItem = this.state.numItem || 20;
    let params = isSearchingList
      ? {
          numItem: numItem,
          baseId: this.state.baseId,
          questionId: this.state.displayQuestion.id,
          matching: document.getElementById("search-input").value,
          start: this.convertGMTToUTCAndFormat(
            "YYYY-MM-DD",
            this.state.dateFrom
          ),
          end: this.convertGMTToUTCAndFormat("YYYY-MM-DD", this.state.dateTo)
        }
      : {
          numItem: numItem,
          baseId: this.state.baseId,
          questionId: this.state.displayQuestion.id,
          start: this.convertGMTToUTCAndFormat(
            "YYYY-MM-DD",
            this.state.dateFrom
          ),
          end: this.convertGMTToUTCAndFormat("YYYY-MM-DD", this.state.dateTo)
        };

    this.props
      .fetchListFeedbackByBaseAndQuestionId(params)
      .then(res => {
        this.setState({
          loading: false,
          feedbackList: res,
          isFiltering: true
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: true
        });
        console.log("fetchListFeedbackByBaseAndQuestionId ERROR: ", err);
      });
  };

  toggleSearch = () => {
    let inputSearch = document.getElementById("search-input");
    inputSearch.classList.toggle("dropdown_container__search__input-active");
    inputSearch.value = "";
    inputSearch.focus();

    this.setState({
      isIconSearch: !this.state.isIconSearch
    });
  };

  handleKeyDown = e => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      this.setState({
        loading: true
      });
      const { value } = e.target;

      const dateRange = this.state.isFiltering
        ? {
            start: this.convertGMTToUTCAndFormat(
              "YYYY-MM-DD",
              this.state.dateFrom
            ),
            end: this.convertGMTToUTCAndFormat("YYYY-MM-DD", this.state.dateTo)
          }
        : {};
      this.props
        .fetchListFeedbackByBaseAndQuestionId({
          baseId: this.state.baseId,
          matching: value,
          questionId: this.state.displayQuestion.id,
          numItem: this.state.numItem,
          ...dateRange
        })
        .then(response => {
          this.setState({
            loading: false,
            feedbackList: response,
            isSearchingList: true
          });
        })
        .catch(err => {
          this.setState({
            loading: false,
            error: true
          });
          console.log("fetchListFeedbackByBaseAndQuestionId ERROR: ", err);
        });
    }
  };

  reSetListFeedback = () => {
    this.setState({
      loading: true
    });
    this.props
      .fetchListFeedbackByBaseAndQuestionId({
        baseId: this.state.baseId,
        questionId: this.state.displayQuestion.id,
        numItem: 20
      })
      .then(response => {
        let inputSearch = document.getElementById("search-input");
        inputSearch.value = "";
        this.setState({
          loading: false,
          feedbackList: response,
          isSearchingList: false,
          isFiltering: false,
          dateTo: new Date(new Date().setHours(23, 59, 59)),
          dateFrom: subDays(new Date().setHours(23, 59, 59), 30)
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: true
        });
        console.log("fetchListFeedbackByBaseAndQuestionId ERROR: ", err);
      });
  };

  toggleDateRangeAndFromTo = () => {
    if (this.state.isFromTo) {
      this.reSetListFeedback();
    }
    this.setState({
      isFromTo: !this.state.isFromTo,
      isFiltering: false
    });
  };

  rangeDateHandler = day => {
    this.setState({
      loading: true
    });
    const { isSearchingList } = this.state;
    let start,
      end = this.convertGMTToUTCAndFormat("YYYY-MM-DD", new Date());
    if (day === 7) {
      start = this.convertGMTToUTCAndFormat(
        "YYYY-MM-DD",
        subDays(new Date(), 7)
      );
    } else {
      start = this.convertGMTToUTCAndFormat(
        "YYYY-MM-DD",
        subDays(new Date(), 30)
      );
    }

    const numItem = this.state.numItem || 20;
    let params = isSearchingList
      ? {
          numItem: numItem,
          baseId: this.state.baseId,
          questionId: this.state.displayQuestion.id,
          matching: document.getElementById("search-input").value,
          start: start,
          end: end
        }
      : {
          numItem: numItem,
          baseId: this.state.baseId,
          questionId: this.state.displayQuestion.id,
          start: start,
          end: end
        };

    this.props
      .fetchListFeedbackByBaseAndQuestionId(params)
      .then(res => {
        this.setState({
          loading: false,
          feedbackList: res,
          isFiltering: true,
          dateFrom:
            day === 7 ? subDays(new Date(), 7) : subDays(new Date(), 30),
          dateTo: new Date()
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: true
        });
        console.log("fetchListFeedbackByBaseAndQuestionId ERROR: ", err);
      });
  };

  nonAction = () => {
    this.setState({
      isFiltering: false
    });
    this.reSetListFeedback();
  };

  render() {
    const fields = ["case", "time", "rating", "feedback"];
    const { feedbackList, isIconSearch, isFromTo } = this.state;
    const { translate } = this.props;

    const mapViewField = (item, key) => {
      return {
        case: (
          <td key={key} className="fb-alternativeId">
            {item.archived ? (
              <div className="u-text-transform">
                {item.alternativeId ? item.alternativeId : ""}
              </div>
            ) : (
              <Link
                key={item.id}
                to={`/case/${item.id}`}
                className="fb-alternativeId"
              >
                <div className="u-text-transform">
                  {item.alternativeId ? item.alternativeId : ""}
                </div>
              </Link>
            )}
          </td>
        ),
        time: (
          <td key={key} className="fb-time">
            {item.createdAt
              ? format(item.createdAt, "DD/MM/YYYY HH:mm:ss")
              : ""}
          </td>
        ),
        rating: (
          <td key={key} className="fb-time">
            {item.rating ? <Star starNumb={item.rating} /> : ""}
          </td>
        ),
        feedback: (
          <td key={key} className="phone">
            {item.comment ? item.comment : ""}
          </td>
        )
      };
    };

    const mapColumnName = fieldKey => {
      const mapNameDefinition = [
        {
          name: translate("caseID"),
          keys: ["case"]
        },
        {
          name: translate("date"),
          keys: ["time"]
        },
        {
          name: translate("rating"),
          keys: ["rating"]
        },
        {
          name: translate("feedback"),
          keys: ["feedback"]
        }
      ];
      const defIndex = mapNameDefinition.findIndex(def =>
        def.keys.includes(fieldKey)
      );
      return defIndex === -1 ? fieldKey : mapNameDefinition[defIndex].name;
    };

    return (
      <div className="home">
        <div className="home__content">
          <div className="container-wide">
            <div className="page">
              <div className="dropdown_container">
                <div
                  className="dropdown_container__top"
                  onClick={this.handleCoverClick}
                >
                  <p>{this.state.displayQuestion.content}</p>
                  <div className="dropdown_container__top__icon">
                    <img src={icExtendDown} />
                  </div>
                </div>
                <div
                  className="dropdown_list--feedback"
                  style={this.state.dropdown ? { display: "block" } : {}}
                  ref={node => (this.node = node)}
                >
                  {this.state.questionList.map((question, index) => (
                    <div key={index}>
                      <div
                        className="rowwrapper"
                        onClick={() => this.handleQuestionSelect(question)}
                      >
                        <p
                          style={
                            this.state.displayQuestion.id === question.id
                              ? { color: "#f08262" }
                              : {}
                          }
                        >
                          {question.content}
                        </p>
                      </div>
                      {index < this.state.questionList.length - 1 ? (
                        <div className="devider" />
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="dropdown_container__search">
                  <div className="dropdown_container__search__filter">
                    <DateRangeOrFromTo
                      //params passedto DateRange
                      nonAction={this.nonAction}
                      last7DaysAction={() => this.rangeDateHandler(7)}
                      last30DaysAction={() => this.rangeDateHandler(30)}
                      customDatesAction={this.toggleDateRangeAndFromTo}
                      //params passed to DatePickerFromTo
                      isFromTo={isFromTo}
                      dateFrom={format(
                        this.state.dateFrom.toString(),
                        "YYYY-MM-DD"
                      )}
                      iconCloseClick={this.toggleDateRangeAndFromTo}
                      handleOnchangeFromTo={this.handleOnchangeFromTo}
                    />
                  </div>
                  <div className="dropdown_container__search__devider" />
                  <div
                    className={
                      !this.state.isIconSearch
                        ? "dropdown_container__search--inner-wrapper border-bottom"
                        : "dropdown_container__search--inner-wrapper"
                    }
                  >
                    <input
                      id="search-input"
                      placeholder={`${translate("search")}...`}
                      className="dropdown_container__search__input"
                      type="text"
                      onKeyDown={e => this.handleKeyDown(e)}
                    />
                    <div
                      className="dropdown_container__search__lable-icon"
                      onClick={() => this.toggleSearch()}
                    >
                      {isIconSearch ? <span>{translate("search")}</span> : null}
                      <img src={isIconSearch ? icSearch : icClose} />
                    </div>
                    <div className="dropdown_container__search__devider" />
                  </div>
                  <DownloadButton
                    label="Export"
                    iconPath={iconDownload}
                    multiOptions={{
                      [translate("This Question")]: this.downloadCSV,
                      [translate("All Questions")]: this.downloadAllCSV
                    }}
                  />
                </div>
              </div>
              {this.state.loading ? (
                <div className="dropdown_container__load-spinner-wrapper">
                  <div className="loader-spinner u-margin-right--12" />
                </div>
              ) : this.state.error ? (
                " error"
              ) : feedbackList.data ? (
                <div>
                  <table className="table table--default">
                    <thead>
                      <tr className="table__head">
                        {fields.map((field, index) => (
                          <th key={index}>{mapColumnName(field)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.feedbackList.data.map((item, index) => (
                        <tr className="table__row" key={index}>
                          {fields.map(
                            (field, index) => mapViewField(item, index)[field]
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination
                    page={this.state.feedbackList}
                    gotoPage={this.gotoPage}
                    stepPage={this.stepPage}
                    handleChangeNumItem={this.handleChangeNumItem}
                    selected={this.state.numItem || 20}
                  />
                </div>
              ) : (
                " no data"
              )}
            </div>
          </div>
          <div />
        </div>
      </div>
    );
  }
}

FeedBack.propTypes = {
  fetchListQuestionByBase: PropTypes.func,
  fetchListFeedbackByBaseAndQuestionId: PropTypes.func,
  location: PropTypes.object,
  translate: PropTypes.func,
  getOrgName: PropTypes.string
};

const mapState = state => {
  return {
    translate: getTranslate(state.locale),
    getOrgName: state.getOrgName.data
  };
};

const mapDispatch = dispatch => {
  return {
    fetchListQuestionByBase: bindActionCreators(
      fetchListQuestionByBase,
      dispatch
    ),
    fetchListFeedbackByBaseAndQuestionId: bindActionCreators(
      fetchListFeedbackByBaseAndQuestionId,
      dispatch
    )
  };
};

export default connect(
  mapState,
  mapDispatch
)(FeedBack);
