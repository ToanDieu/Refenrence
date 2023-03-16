export interface TriggerType {
  /**
   * example:
   * [object Object]
   */
  triggerData?: {
    [name: string]: any;
  };
  /**
   * example:
   * TimeBefore
   */
  triggerType?:
    | "TimePoint"
    | "TimeBefore"
    | "TimeAfter"
    | "Condition"
    | "WebhookTrigger"
    | "None";
}

export interface ActionType {
  /**
   * Accept Action ID.
   * example:
   * 1
   */
  acceptActionID?: number; // int64
  /**
   * Data of action.
   * example:
   * [object Object]
   */
  actionData?: {
    [name: string]: any;
  };
  /**
   * Type of Action.
   * example:
   * SetParamValue
   */
  actionType:
    | "SendSMS"
    | "SendEmail"
    | "SetParamValue"
    | "Branch"
    | "Sleep"
    | "WebhookAction"
    | "ChangeFieldVisibility"
    | undefined;
  /**
   * DeletedAt of a action.
   * example:
   * 1982-12-19T13:15:56Z
   */
  createdAt?: string; // date-time
  /**
   * DeletedAt of a action.
   * example:
   * 2000-02-15T10:05:11Z
   */
  deletedAt?: string; // date-time
  /**
   * Identifier of action.
   * example:
   * 12
   */
  id?: number; // int64
  /**
   * Reject Action ID.
   * example:
   * 2
   */
  rejectActionID?: number; // int64
  /**
   * Quantifier of trigger.
   * example:
   * All
   */
  triggerQuantifier?: string;
  /**
   * List triggers.
   * example:
   * [object Object],[object Object]
   */
  /**
   * UpdatedAt of a action.
   * example:
   * 2006-04-19T11:40:10Z
   */
  updatedAt?: string; // date-time
  /**
   * Identifier of action.
   * example:
   * 1
   */
  workflowID: number; // int64
  assignParent?: {
    branching: string;
    id: number;
  };
}

/**
 * Mediatype identifier: application/vnd.action-media+json; view=default
 * Action-Media media type (default view)
 * example:
 * [object Object]
 */
export interface ActionMedia extends ActionType {
  triggers?: TriggerType[];
}
