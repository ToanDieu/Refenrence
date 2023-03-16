import React, { useState } from "react";
import { Checkbox, Button } from "element-react";
import Input from "@/components/units/Input";
import { emailPattern } from "@/constants/index";

import { storiesOf } from "@storybook/react";
import Form from "@/components/units/Form/index";

const FormComp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    checkbox: true
  });

  const [rules] = useState({
    name: {
      required: true,
      message: "Please input name",
      trigger: "onchange"
    },
    email: {
      required: true,
      message: "Please input email address",
      trigger: "onchange",
      validator: value => {
        // const emailPattern = /^[\w/.+-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(value)) {
          return "Invalid email";
        }
        return null;
      }
    }
  });

  const [refMethods, setMethods] = useState({});
  const injectMethod = (methodName, handleFunc) => {
    setMethods(state => {
      return { ...state, [methodName]: handleFunc };
    });
  };

  const [loading, setLoading] = useState(false);

  const [buttonsST, setButtonsST] = useState({
    primary: true,
    secondary: true
  });

  const onChange = key => value => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = typeBtn => () => {
    if (typeBtn === "secondary") {
      setLoading(false);
      setButtonsST({ ...buttonsST, primary: true });
      return null;
    }

    const valid = refMethods.validate();
    if (valid) {
      setLoading(!loading);
      setButtonsST({ ...buttonsST, [typeBtn]: false });
    } else {
      setButtonsST({ ...buttonsST, [typeBtn]: true });
    }

    return null;
  };

  const buttons = [];
  buttons.push(
    <Button
      type="primary"
      key="primary"
      onClick={handleSubmit("primary")}
      disabled={!buttonsST.primary}
    >
      Submit
    </Button>
  );

  buttons.push(
    <Button
      key="secondary"
      onClick={handleSubmit("secondary")}
      disabled={!buttonsST.secondary}
    >
      Cancel
    </Button>
  );

  return (
    <Form
      onInjectMethod={injectMethod}
      buttons={buttons}
      form={form}
      rules={rules}
      loading={loading}
    >
      <Form.Item key="checkbox" prop="checkbox">
        <Checkbox checked={form.checkbox} onChange={onChange("checkbox")}>
          hello
        </Checkbox>
      </Form.Item>
      <Form.Item key="name" prop="name" label="This is name">
        <Input value={form.name} onChange={onChange("name")} />
      </Form.Item>
      <Form.Item key="email" prop="email" label="haha">
        <Input
          value={form.email}
          onChange={onChange("email")}
          placeholder="placeholder"
        />
      </Form.Item>
    </Form>
  );
};

storiesOf("Form", module).add("normal", () => <FormComp />);
