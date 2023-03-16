import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";

import { Button } from "element-react";
import FieldEditor from "@/components/blocks/FieldEditor";
import { GetParams } from "tse-ui-lib";
import AddFieldButton from "./AddFieldButton";
import { isContainScope } from "../actions/utils";
import FieldItem from "./FieldItem";

const publish = (e, publishShowTime) => {
  e.preventDefault();
  publishShowTime();
};

function debounced(delay, fn) {
  let timerId;
  return function(...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

const PassFieldsForm = ({
  fields,
  onSubmit,
  lang,
  translate,
  publishShowTime,
  ...props
}) => {
  const handleFieldUpdate = debounced(400, (form, idx, fieldLang, data) => {
    form.change(`fields[${idx}].langs.${fieldLang}.value`, data);
  });

  const editors = {};
  useEffect(() => {
    Object.keys(editors).forEach(field => {
      /**
       * TODO: Use core draft editor over wrapped plugin editor for more controlable editorState
       * current status: Anytime update EditorState using push new contentState lead to cursor reset to begin of first blockContent
       * current solution: Only call exported reloadData method on change the field order Drag & Drop, switch language
       * */

      editors[field].reloadData();
    });
  }, [lang]);

  return (
    <Form
      initialValues={{ fields }}
      mutators={{
        ...arrayMutators
      }}
      onSubmit={(values, { initialize, reset }) => {
        onSubmit(values);
        initialize(values);
        reset();
      }}
      render={({ pristine, handleSubmit, form }) => {
        const disabled = !isContainScope("put:my-org-type:base") || pristine;
        const buttonDisabled = "button-disbaled";
        const { baseID } = props.match.params;

        return (
          <form
            onSubmit={handleSubmit}
            className="container-form"
            style={{
              width: "calc(100% - 340px)"
            }}
          >
            <div className="container-lg-form__button-group">
              <Button
                className={`container-lg-form__button ${
                  !isContainScope("publish:my-org-type:base")
                    ? buttonDisabled
                    : null
                }`}
                disabled={!isContainScope("publish:my-org-type:base")}
                type="primary"
                onClick={e => publish(e, publishShowTime)}
              >
                {translate("publish")}
              </Button>
              <Button
                className={`container-lg-form__button ${
                  disabled ? buttonDisabled : null
                }`}
                onClick={e => handleSubmit(e)}
                disabled={disabled}
                type="primary"
              >
                {translate("submit")}
              </Button>
            </div>
            <div id="back" />
            <div className="card">
              <div className="card__body">
                <div className="card__body-col">
                  <GetParams
                    baseId={baseID}
                    render={params => {
                      {
                        const suggestions = params.map(param => ({
                          name: `{{ .${param.name} }}`
                        }));

                        return (
                          <FieldArray
                            name="fields"
                            render={array => (
                              <DragDropContext
                                onDragEnd={result => {
                                  array.fields.move(
                                    result.source.index,
                                    result.destination.index
                                  );

                                  // setTimeout because react-final-form take time to update it's array state
                                  setTimeout(() => {
                                    /**
                                     * TODO: Use core draft editor over wrapped plugin editor for more controlable editorState
                                     * current status: Anytime update EditorState using push new contentState lead to cursor reset to begin of first blockContent
                                     * current solution: Only call exported reloadData method on change the field order Drag & Drop, switch language
                                     */
                                    Object.keys(editors).forEach(field => {
                                      editors[field].reloadData();
                                    });
                                  }, 200);
                                }}
                              >
                                <Droppable droppableId="droppable">
                                  {provided => (
                                    <div ref={provided.innerRef}>
                                      {array.fields.map((name, idx) => {
                                        form.registerField(
                                          `fields[${idx}].langs.${lang}.value`,
                                          () => {},
                                          {
                                            data: true,
                                            initial: true
                                          }
                                        );

                                        const fieldValueState = form.getFieldState(
                                          `fields[${idx}].langs.${lang}.value`
                                        );

                                        return (
                                          <Draggable
                                            isDragDisabled={
                                              !isContainScope(
                                                "put:my-org-type:base"
                                              )
                                            }
                                            key={`${name}`}
                                            draggableId={`${name}`}
                                            index={idx}
                                          >
                                            {providedDraggable => (
                                              <div
                                                ref={providedDraggable.innerRef}
                                                {...providedDraggable.draggableProps}
                                                {...providedDraggable.dragHandleProps}
                                                className="field"
                                              >
                                                <Field
                                                  name={`${name}.langs.${lang}.label`}
                                                  render={({ input, meta }) => (
                                                    <FieldItem
                                                      disabled={
                                                        !isContainScope(
                                                          "put:my-org-type:base"
                                                        )
                                                      }
                                                      name={input.name}
                                                      placeholder="label"
                                                      label={
                                                        array.fields.value[idx]
                                                          .id
                                                      }
                                                      onClose={() => {
                                                        array.fields.remove(
                                                          idx
                                                        );

                                                        setTimeout(() => {
                                                          Object.keys(
                                                            editors
                                                          ).forEach(field => {
                                                            editors[
                                                              field
                                                            ].reloadData();
                                                          });
                                                        }, 100);
                                                      }}
                                                      onChange={input.onChange}
                                                      value={input.value}
                                                      isModified={meta.dirty}
                                                      type="text"
                                                    />
                                                  )}
                                                />
                                                <FieldEditor
                                                  exports={(
                                                    nameFieldEditor,
                                                    method
                                                  ) => {
                                                    /**
                                                     * TODO: Use core draft editor over wrapped plugin editor for more controlable editorState
                                                     * current status: Anytime update EditorState using push new contentState lead to cursor reset to begin of first blockContent
                                                     * current solution: Only call exported reloadData method on change the field order Drag & Drop, switch language
                                                     * */
                                                    editors[`field${idx}`] = {
                                                      [nameFieldEditor]: method
                                                    };
                                                  }}
                                                  dirty={fieldValueState.dirty}
                                                  data={fieldValueState.value}
                                                  onChange={data =>
                                                    handleFieldUpdate(
                                                      form,
                                                      idx,
                                                      lang,
                                                      data
                                                    )
                                                  }
                                                  suggestions={suggestions}
                                                />
                                              </div>
                                            )}
                                          </Draggable>
                                        );
                                      })}
                                      {isContainScope(
                                        "put:my-org-type:base"
                                      ) ? (
                                        <AddFieldButton
                                          onAdd={() => {
                                            const currentFieldIdNumbers = array.fields.value.map(
                                              field => {
                                                const fieldIdTrim = field.id.replace(
                                                  /^back_/,
                                                  ""
                                                );
                                                return fieldIdTrim !== field.id
                                                  ? parseInt(fieldIdTrim, 10)
                                                  : 0;
                                              }
                                            );
                                            const nextIdNumber =
                                              Math.max(
                                                ...[0, ...currentFieldIdNumbers]
                                              ) + 1;
                                            const nextId = `back_${nextIdNumber}`;

                                            array.fields.push({
                                              id: nextId,
                                              langs: {
                                                en: {
                                                  label: "",
                                                  link: "",
                                                  value: ""
                                                },
                                                de: {
                                                  label: "",
                                                  link: "",
                                                  value: ""
                                                }
                                              },
                                              notifyChange: false
                                            });
                                          }}
                                        />
                                      ) : null}
                                    </div>
                                  )}
                                </Droppable>
                              </DragDropContext>
                            )}
                          />
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};

PassFieldsForm.propTypes = {
  fields: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      baseID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }).isRequired,
  lang: PropTypes.string,
  translate: PropTypes.func,
  publishShowTime: PropTypes.func
};

PassFieldsForm.defaultProps = {
  fields: [],
  lang: "en",
  translate: value => {
    return value;
  },
  publishShowTime: () => {}
};

export default connect(
  state => ({
    translate: getTranslate(state.locale)
  }),
  () => ({})
)(PassFieldsForm);
