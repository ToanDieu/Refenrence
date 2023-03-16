import React from "react";
import PropTypes from "prop-types";
// import { Form, Field } from "react-final-form";
import { pathOr } from "ramda";
import defauCloseIcon from "./assets/ic-close.svg";
// import { BasicField, PasswordWithGenerator, DropdownField } from "../fields";
import { Tabs } from "element-react";
import ss from "classnames";
import c from "./popup.comp.scss";

class PopUpForm extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    showForm: PropTypes.bool,
    mainLabel: PropTypes.string,
    toggleCloseForm: PropTypes.func,
    closeIcon: PropTypes.object,
    tabsLabel: PropTypes.array
  };

  render() {
    const {
      showForm,
      mainLabel,
      toggleCloseForm,
      closeIcon,
      tabsLabel
    } = this.props;

    const childrens = React.Children.toArray(this.props.children);

    const FormModal = (
      <div className={ss(c["modal"], c["modal--full"])}>
        <div className={ss(c["content"], c["content--modal"])}>
          <div className={ss(c["title"])}>
            <div>{mainLabel}</div>
            <div
              className={ss(c["title__close"])}
              onClick={() => {
                toggleCloseForm();
              }}
            >
              <img src={pathOr(defauCloseIcon, [], closeIcon)} />
            </div>
          </div>

          <div className={ss(c["tab"])}>
            <Tabs type="card" value={0}>
              {childrens.map((children, index) => (
                <Tabs.Pane label={tabsLabel[index]} name={index} key={index}>
                  {children}
                </Tabs.Pane>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    );
    return showForm ? FormModal : "";
  }
}
export default PopUpForm;
