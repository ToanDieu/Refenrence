import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { pathOr } from "ramda";
import format from "date-fns/format";
import ss from "classnames";

import Loading from "@/components/Loading";
import TagPanel from "@/components/tag-panel/container";
import TagFilter from "@/components/tag-filter/container";
import { ProtectedScopedComponent } from "@/components/HocComponent";
import { NextIcon } from "@/components/units/Icon";

import { fetchBaseList, fetchBaseListByTag } from "@/actions/base";
import { getAvailableTagsStore } from "@/actions/tag";
import { getTranslate } from "react-localize-redux";
import { getBaseTags } from "./actions";

import c from "./base-list.comp.scss";
import sortIcon from "./assets/ic-extend-down.svg";
import editIcon from "./assets/ic-circle-edit.svg";

// TODO: Convert to TS
class BaseList extends React.Component {
  state = {
    showTagPanel: false,
    tagMeta: [],
    isChecked: false
  };

  componentWillMount() {
    const { typeID } = this.props;
    this.props.fetchBaseList({ typeID }).then(this.fetchBaseTags);
  }

  componentDidMount() {
    this.props.fetchBaseList({ typeID: this.props.typeID });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.typeID !== this.props.typeID) {
      this.props
        .fetchBaseList({ typeID: this.props.typeID })
        .then(this.fetchBaseTags);
    }
  }

  toggleTagPanel = () => {
    this.setState(state => ({
      showTagPanel: !state.showTagPanel
    }));
  };

  handleClickTag = tagID => {
    const { typeID } = this.props;
    if (tagID === "-1") {
      this.props
        .fetchBaseList({ typeID: this.props.typeID })
        .then(this.fetchBaseTags);
    } else {
      this.props.fetchBaseListByTag({ typeID, tagID }).then(this.fetchBaseTags);
    }
  };

  fetchBaseTags = () => {
    const data = pathOr([], ["baseList", "data"], this.props);
    const baseIDs = data.map(({ id }) => id);

    this.props
      .getBaseTags({ baseIDs })
      .then(tagMeta => this.setState(state => ({ ...state, tagMeta })));
  };

  getTags = baseID => {
    return pathOr(
      [],
      ["tagIDs"],
      this.state.tagMeta.find(meta => meta.baseID === baseID)
    );
  };

  searchBase = (searchTerm, bases = []) => {
    const unCapSearchTerm = searchTerm.toLowerCase();

    const filteredBases = bases.filter(base => {
      const unCapMemo = base.memo.toLowerCase();
      const unCapShortcode = base.shortcode.toLowerCase();

      return (
        unCapMemo.includes(unCapSearchTerm) ||
        unCapShortcode.includes(unCapSearchTerm)
      );
    });

    return filteredBases;
  };

  render() {
    const fields = ["name", "code", "updated"];
    let { data = [] } = this.props.baseList;
    // sort data by column name
    data = data
      ? data.sort((prev, next) =>
          prev.memo.toLowerCase().localeCompare(next.memo.toLowerCase())
        )
      : null;
    const { loading, error } = this.props.baseList;
    const { searchTerm } = this.props.match.params;
    if (searchTerm && searchTerm !== "") {
      data = this.searchBase(searchTerm, data);
    }
    const { translate } = this.props;

    const mapViewField = (item, key) => {
      return {
        name: (
          <td key={key} className={ss(c["name-col"])}>
            <div className="memo">
              <Link key={item.id} to={`/bases/${item.id}/cases`}>
                <div className="u-text-transform u-margin-bottom--6">
                  {item.name}
                </div>
                <div
                  className={ss("memo__content", {
                    [c["base-name--current"]]:
                      parseInt(this.props.currentBaseId, 10) === item.id
                  })}
                >
                  {item.memo}
                </div>
              </Link>
            </div>
          </td>
        ),
        code: (
          <td key={key} className={ss(c["code-col"])}>
            {item.shortcode ? item.shortcode : "not availble"}
          </td>
        ),
        updated: (
          <td key={key} className={ss(c["updated-col"])}>
            {item.updatedAt
              ? format(item.updatedAt, "MMM DD, YYYY, HH:mm:ss")
              : "not availble"}
          </td>
        )
      };
    };

    const mapColumnName = fieldKey => {
      const mapNameDefinition = [
        {
          name: "name",
          keys: ["name"]
        },
        {
          name: "code",
          keys: ["code"]
        },
        {
          name: "updated",
          keys: ["updated"]
        }
      ];
      const defIndex = mapNameDefinition.findIndex(def =>
        def.keys.includes(fieldKey)
      );
      return defIndex === -1 ? fieldKey : mapNameDefinition[defIndex].name;
    };

    console.log(error);
    return (
      <div className={ss("home", c.container)}>
        <div className="home__content">
          <div className="container-wide">
            <div className="page">
              <div className="page-title">
                <h1 className="u-margin-bottom--22">Bases</h1>
                <div className="u-margin-right--9" style={{ float: "right" }}>
                  <TagFilter onSelectTag={this.handleClickTag} translate />
                </div>
              </div>
              {loading ? (
                <Loading />
              ) : (
                <table className="table table--default">
                  <thead>
                    <tr className="table__head">
                      {fields.map(field => (
                        <th
                          className={field === "update" ? "update" : ""}
                          key={field}
                          // onClick={this.sortCol(field)}
                        >
                          {{translate(mapColumnName(field))}}
                          <img
                            alt=""
                            className="icon-img--18 u-margin-left--6 u-text-align--right"
                            src={sortIcon}
                            style={{ visibility: "hidden" }}
                          />
                        </th>
                      ))}
                      <th>{translate("tags")}</th>
                      <th />
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map(item => (
                        <tr className="table__row" key={item.id}>
                          {fields.map(
                            (field, index) => mapViewField(item, index)[field]
                          )}
                          <td className={ss("u-text-align--right")}>
                            <ProtectedScopedComponent
                              scopes={["get:my-org-type:base"]}
                            >
                              <TagPanel
                                type="base"
                                identifier={item.id}
                                selectedTagIDs={this.getTags(item.id)}
                              />
                            </ProtectedScopedComponent>
                          </td>
                          <td
                            className={ss("u-text-align--right", c["icon-col"])}
                          >
                            <ProtectedScopedComponent
                              scopes={["get:my-org-type:base"]}
                            >
                              <Link className="view" to={`/bases/${item.id}`}>
                                <img
                                  alt=""
                                  className="icon-img--24 u-text-align--right"
                                  src={editIcon}
                                />
                              </Link>
                            </ProtectedScopedComponent>
                          </td>
                          <td
                            className={ss("u-text-align--right", c["icon-col"])}
                          >
                            <ProtectedScopedComponent
                              scopes={["get:my-org-type-base:workflow"]}
                            >
                              <Link
                                to={`/bases/${item.id}/workflows/*/actions`}
                              >
                                <NextIcon name="workflow" size={24} />
                              </Link>
                            </ProtectedScopedComponent>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div style={{ clear: "both" }} />
        </div>
      </div>
    );
  }
}

const mapState = store => ({
  baseList: store.baseList,
  currentBaseId: store.pageDetail.current.detail.id,
  availableTags: pathOr([], ["tagList", "data"], store),
  translate: getTranslate(store.locale)
});

const mapDispatch = dispatch =>
  bindActionCreators(
    { fetchBaseList, fetchBaseListByTag, getAvailableTagsStore, getBaseTags },
    dispatch
  );

export default connect(
  mapState,
  mapDispatch
)(BaseList);
