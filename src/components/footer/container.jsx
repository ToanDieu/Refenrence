import React from "react";
import FooterSource from "@/components/footer/sourceTrigger";
import Footer from "@/components/footer";

export default class FooterContainer extends React.Component {
  render() {
    return (
      <FooterSource
        render={({ versionEngine, error, versionWeb }) => {
          return (
            <Footer
              versionEngine={versionEngine}
              error={error}
              versionWeb={versionWeb}
            />
          );
        }}
      />
    );
  }
}
