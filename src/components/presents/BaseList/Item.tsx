import React from "react";
import { TranslateFunction } from "react-localize-redux";

import { formatDateTime } from "@/utils/time";
import { BaseMedia } from "@/resources/bases";
import { ProtectedScopedComponent } from "@/components/HocComponent";
import { NextIcon } from "@/components/units/Icon";
import TagPanel from "@/container/TagPanel";
import { MemoLink, ActionLink } from "./styles";

interface Props {
  item: BaseMedia;
  currentBaseId: number;
  translate: TranslateFunction;
}

function Item({ item, currentBaseId, translate = () => "Translated" }: Props) {
  return (
    <tr key={`item-${item.id}`}>
      <td>
        <MemoLink to={`/bases/${item.id}/cases`}>
          <span>{item.name}</span>
          <h4 className={item.id === currentBaseId ? "current" : ""}>
            {item.memo}
          </h4>
        </MemoLink>
      </td>
      <td>{item.shortcode || "not availble"}</td>
      <td>
        {item.updatedAt ? formatDateTime(item.updatedAt) : "not availble"}
      </td>
      <td>
        <ProtectedScopedComponent scopes={["get:my-org-type:base"]}>
          <TagPanel
            baseID={item.id}
            selectedTags={item.tags || []}
            placeHolder={translate("searchTags")}
          />
        </ProtectedScopedComponent>
      </td>
      <td>
        <ProtectedScopedComponent scopes={["get:my-org-type:base"]}>
          <ActionLink className="view" to={`/bases/${item.id}`}>
            <NextIcon name="edit" size={24} />
          </ActionLink>
        </ProtectedScopedComponent>
      </td>
      <td>
        <ProtectedScopedComponent scopes={["get:my-org-type-base:workflow"]}>
          <ActionLink to={`/bases/${item.id}/workflows/*/actions`}>
            <NextIcon name="workflow" size={24} />
          </ActionLink>
        </ProtectedScopedComponent>
      </td>
    </tr>
  );
}

export default Item;
