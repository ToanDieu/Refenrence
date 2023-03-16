import React from "react";
// import { expect } from "chai";
import { mount } from "enzyme";

import App from "@/components/App";
// import { AppClass } from "@/components/App/style/app.module.scss";

/* Testcase */
describe("<App />", () => {
  describe("rendering", () => {
    it("should render", () => {
      // const wrapper = mount(<App />);
      mount(<App />);
      // expect(wrapper.find("div")).to.have.className(AppClass);
    });
  });
});
