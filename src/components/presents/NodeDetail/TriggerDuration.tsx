import React, { FunctionComponent, useState, useEffect } from "react";
import { Form } from "element-react";

import { timeRegex } from "@/constants";
import InputDelay from "@/components/presents/NodeDetail/ActionDelay/Input";
import Dropdown from "@/components/units/Dropdown";

interface paramType {
  name: string;
  type?: string;
}

interface TriggerDurationTimePrps {
  params?: paramType[];
  paramName?: string;
  value?: string;
  onChange?: (e: string, param: string) => void;
  onValidate?: (valid: boolean) => void;
}

const TriggerDurationTime: FunctionComponent<TriggerDurationTimePrps> = ({
  value = "",
  paramName = "",
  params = [],
  onChange = () => {},
  onValidate = () => {}
}) => {
  const [valid, setValid] = useState<boolean | undefined>(undefined);

  const [form, setForm] = useState({
    duration: value,
    paramName
  });

  useEffect(() => {
    onChange(form.duration, form.paramName);
  }, [form]);

  useEffect(() => {
    onValidate(!!valid && !!form.paramName);
  }, [valid, form]);

  useEffect(() => {
    setForm(current => ({ duration: value, ...current }));
  }, [value]);

  const getValue = (valChange: string) => {
    setForm(current => ({ ...current, duration: valChange }));
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
      labelPosition="top"
      model={form}
      rules={{
        duration: [
          {
            message: "required",
            trigger: "blur"
          },
          {
            validator: (_: object, changeValue: string, callback: any) => {
              const match = timeRegex.exec(changeValue);
              if (changeValue.trim().replace(" ", "").length === 0) {
                setValid(false);

                callback(new Error("required"));
              } else if (!match) {
                setValid(false);

                callback(
                  new Error("Please use format 00h00m00s (Where 00 are digits)")
                );
              } else {
                setValid(true);

                callback();
              }
            }
          }
        ]
      }}
    >
      <Form.Item prop="param" label="PARAM">
        <Dropdown
          items={params.map(p => ({ id: p.name, ...p }))}
          initial={paramName}
          onChange={i => {
            setForm(current => ({
              ...current,
              paramName: i ? (i.id as string) : ""
            }));
          }}
        />
      </Form.Item>
      <Form.Item prop="duration" label="duration">
        <InputDelay
          onChange={e => getValue(e)}
          value={form.duration}
          isValid={valid}
        />
      </Form.Item>
    </Form>
  );
};

export default TriggerDurationTime;
