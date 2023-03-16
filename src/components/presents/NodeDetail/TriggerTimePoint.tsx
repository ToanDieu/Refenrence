import React, { FunctionComponent } from "react";
import { Form } from "element-react";

import DateTimePicker from "@/components/blocks/DatetimePicker";

/**
 * TimePointForm
 */

// Types
interface TimePointTriggerPrps {
  initial: string | Date;
  onChange: (value: string) => void;
  onValidate?: (valid: boolean) => void;
}

const TimePointTrigger: FunctionComponent<TimePointTriggerPrps> = props => {
  return (
    <Form labelPosition="top">
      <Form.Item label="DATE / TIME">
        <DateTimePicker initial={props.initial} onChange={props.onChange} />
      </Form.Item>
    </Form>
  );
};

export default TimePointTrigger;
