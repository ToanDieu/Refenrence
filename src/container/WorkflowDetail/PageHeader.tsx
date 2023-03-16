import React, { memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import styled from "@emotion/styled";
import { TranslateFunction } from "react-localize-redux";

import { ProtectedScopedComponent } from "@/components/HocComponent";
import Dropdown from "@/components/units/Dropdown";
import { WorkflowMedia } from "@/resources/workflows";
import { ActionMedia } from "@/resources/actions";
import AutoSaveMessage from "@/components/blocks/AutoSaveMessage";
import { makeSelectTranslate } from "@/i18n/selectors";
import ActiveForm from "@/container/ActivateForm";
import * as actionCreators from "./actions";
import { makeSelectLastSave } from "./selectors";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
`;

const LeftSide = styled.div`
  color: ${props => props.theme.primary};
`;

const Heading = styled.span`
  font-size: 22px;
  margin-right: 10px;
  text-transform: uppercase;
`;

const InlineDropdown = styled(Dropdown)`
  display: inline-block;
`;

interface Props {
  baseID: number;
  workflow: WorkflowMedia;
  actions: ActionMedia[];
  lastSave: number;
  setEditMode: (mode: boolean) => void;
  translate: TranslateFunction;
}

export function PageHeader({
  baseID,
  workflow,
  actions,
  lastSave,
  setEditMode,
  translate
}: Props) {
  return (
    <Wrapper>
      <LeftSide>
        <Heading>{workflow.name}</Heading>
        <AutoSaveMessage
          lastSave={lastSave}
          text={translate("autoSaveText") as string}
          savingText={translate("savingText") as string}
        />
      </LeftSide>
      <div>
        {actions.length > 0 && (
          <React.Fragment>
            <ProtectedScopedComponent
              scopes={["put:my-org-type-base:workflow"]}
            >
              <ActiveForm baseID={baseID} workflow={workflow} />
            </ProtectedScopedComponent>
            <InlineDropdown
              initial="edit"
              items={[
                {
                  id: "edit",
                  name: "Edit Mode"
                },
                {
                  id: "view",
                  name: "View Mode"
                }
              ]}
              iconName="chevron-down"
              onChange={item => {
                if (item && item.id === "edit") {
                  setEditMode(true);
                  return;
                }
                setEditMode(false);
              }}
            />
          </React.Fragment>
        )}
      </div>
    </Wrapper>
  );
}

const mapStateToProps = createStructuredSelector<{}, {}>({
  lastSave: makeSelectLastSave(),
  translate: makeSelectTranslate()
});

const withConnect = connect(
  mapStateToProps,
  { ...actionCreators }
);

export default compose(
  withConnect,
  memo
)(PageHeader) as any;
