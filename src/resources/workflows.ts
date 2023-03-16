export interface WorkflowMedia {
  /**
   * Identifier of base.
   * example:
   * 9
   */
  baseID: number; // int64
  /**
   * DeletedAt of a workflow
   * example:
   * 2007-02-25T23:31:50Z
   */
  createdAt?: string; // date-time
  /**
   * DeletedAt of a workflow
   * example:
   * 2002-04-21T07:17:19Z
   */
  deletedAt?: string; // date-time
  /**
   * Description of a workflow
   * example:
   * This is description for workflow.
   */
  description?: string;
  /**
   * Identifier of workflow.
   * example:
   * 12
   */
  id: number; // int64
  /**
   * Initial action ID of workflow.
   * example:
   * 1
   */
  initialActionID?: number; // int64
  /**
   * Name of a workflow
   * example:
   * event-tomorrow-workflow
   */
  name?: string;
  /**
   * Workflow be paused.
   * example:
   * true
   */
  paused?: boolean;
  /**
   * UpdatedAt of a workflow
   * example:
   * 2007-02-20T12:47:54Z
   */
  updatedAt?: string; // date-time
  active: boolean;
}
