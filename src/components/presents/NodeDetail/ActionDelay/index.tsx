import React, { FunctionComponent, useState, useEffect } from "react";
import { Form } from "element-react";

import { timeRegex } from "@/constants";
import InputDelay from "./Input";

interface ActionDelayProps {
  value?: string;
  disabled?: boolean;
  onChange?: (e: string) => void;
  onValidate?: (isValid: boolean) => void;
  loading?: boolean;
}

const ActionDelay: FunctionComponent<ActionDelayProps> = ({
  value = "",
  disabled = false,
  onChange = () => {},
  onValidate = () => {}
}) => {
  const [valid, setValid] = useState<boolean | undefined>(undefined);

  const [form, setForm] = useState({
    duration: value
  });

  useEffect(() => {
    setForm({ duration: value });
  }, [value]);

  useEffect(() => {
    onValidate(!!valid);
  }, [valid]);

  const getValue = (valChange: string) => {
    onChange(valChange);
    setForm({ duration: valChange });
    if (formRef.current !== null) {
      formRef.current.validate((isValid: boolean) => {
        setValid(isValid);
      });
    }
  };

  const formRef = React.createRef<Form>();

  return (
    <Form
      ref={formRef}
      model={form}
      rules={{
        duration: [
          {
            required: true,
            message: "required",
            trigger: "blur"
          },
          {
            validator: (_: object, changeValue: string, callback: any) => {
              const match = timeRegex.exec(changeValue);
              if (changeValue.trim().replace(" ", "").length === 0) {
                callback(new Error("required"));

                setValid(false);
              } else if (!match) {
                callback(
                  new Error("Please use format 00h00m00s (Where 00 are digits)")
                );

                setValid(false);
              } else {
                callback();

                setValid(true);
              }
            }
          }
        ]
      }}
    >
      <Form.Item prop="duration">
        <InputDelay
          onChange={e => getValue(e)}
          label="duration"
          value={form.duration}
          isValid={valid}
          disabled={disabled}
        />
      </Form.Item>
    </Form>
  );
};

export default ActionDelay;
