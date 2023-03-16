import React from "react";
import { storiesOf } from "@storybook/react";
import ConditionForm from "@/components/presents/NodeDetail/ConditionForm";

const input = {
  comparator: "&&",
  rules: [
    {
      op: "==",
      val: "2019-02-02",
      var: "TimePoint"
    },
    {
      op: ">",
      val: "1",
      var: "employer"
    },
    {
      op: "==",
      val: "Miss Money Penny awesome",
      var: "IssuerName"
    }
  ]
};

const input2 = {
  op: "==",
  val: "2019-02-02",
  var: "TimePoint"
};

console.log("input", input);
const params = [
  { name: "TimePoint", type: "date" },
  { name: "employer", type: "number" },
  { name: "IssuerName", type: "text" }
];

storiesOf("ConditionForm", module).add("normal", () => (
  <ConditionForm
    conditionExp={input}
    params={params}
    onSubmit={value => {
      console.log("normal", value);
    }}
    onCancel={() => console.log("cancel")}
  />
));

storiesOf("ConditionForm", module).add("One exp", () => (
  <ConditionForm
    conditionExp={input2}
    params={params}
    onSubmit={value => {
      console.log("normal", value);
    }}
    onCancel={() => console.log("cancel")}
  />
));
