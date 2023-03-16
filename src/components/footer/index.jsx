import React, { Fragment } from "react";
import PropTypes from "prop-types";

import ss from "classnames";
import c from "./footer.comp.scss";

const Footer = ({ versionEngine, error, versionWeb }) => {
  const engineVersionHolder = () => {
    if (!error && versionEngine) {
      return (
        <Fragment>
          {versionEngine.version && (
            <p>
              Engine&nbsp;
              {versionEngine.version}
            </p>
          )}
          {versionEngine.versionDev && (
            <p>
              Engine&nbsp;
              {versionEngine.versionDev}
            </p>
          )}
        </Fragment>
      );
    }
    return null;
  };
  return (
    <div className={ss(c.footer)}>
      <div className={ss(c.footer__versions)}>
        {versionWeb && (
          <p>
            Client&nbsp;
            {versionWeb}
            &nbsp;
          </p>
        )}

        {engineVersionHolder()}
      </div>
      <p>
        &copy;&nbsp;
        {new Date().getFullYear()}
        &nbsp; Miss Moneypenny Technologies. All rights reserved.
      </p>
    </div>
  );
};

Footer.propTypes = {
  versionEngine: PropTypes.object,
  error: PropTypes.any,
  versionWeb: PropTypes.any
};

Footer.defaultProps = {
  versionEngine: {},
  error: "",
  versionWeb: ""
};

export default Footer;
