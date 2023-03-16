/* eslint-disable prettier/prettier */ // infinity fix
import React, { useEffect } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { pathOr } from "ramda";
import { Button } from "element-react";

import FieldItem from "./FieldItem";
import AddFieldButton from "./AddFieldButton";
import FieldEditor from "@/components/blocks/FieldEditor";
import { GetParams } from "tse-ui-lib";
import fieldFormat from "../constants/passFieldFormat";
import { isContainScope } from "../actions/utils";
import { CheckboxField } from "@/components/fields";

const upperCase = input => {
  // input = input.toUpperCase();
  return input;
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

const newLabel = (fields, fieldId, passStyle) => {
  const max = pathOr(
    0,
    ["passTypeFormats", passStyle, `${fieldId}Fields`],
    fieldFormat
  );

  for (let i = 1; i <= max; i += 1) {
    let isExist = false;
    fields.forEach(field => {
      if (
        field &&
        field.id &&
        field.id.startsWith(fieldId) &&
        field.id.endsWith(`_${i}`)
      ) {
        isExist = true;
      }
    });

    if (!isExist) {
      return `${fieldId}_${i}`;
    }
  }
  return `${fieldId}_${max}`;
};
const sortField = (values, passStyle) => {
  const passField = pathOr([], ["passTypeFormats", passStyle], fieldFormat);
  const newFields = [];
  Object.keys(passField).forEach(function(key) {
    values.forEach(value => {
      const fieldName = value.id.split("_");
      if (key === `${fieldName[0]}Fields`) {
        // newFields.swap(first, index);
        newFields.push(value);
      }
    });
  });
  return newFields;
};

const publish = (e, publishShowTime) => {
  e.preventDefault();
  publishShowTime();
};

const PassFieldsForm = ({
  fields,
  onSubmit,
  lang,
  passStyle,
  translate,
  publishShowTime,
  ...props
}) => {
  const handleFieldUpdate = debounced(400, (form, idx, fieldLang, data) => {
    form.change(`fields[${idx}].langs.${fieldLang}.value`, data);
  });

  const editors = {};
  useEffect(() => {
    console.log(editors);
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
            <div className="card">
              <div className="card__body">
                <div className="card__body-col">
                  <GetParams
                    baseId={baseID}
                    render={params => {
                      const suggestions = params.map(param => ({
                        name: `{{ .${param.name} }}`
                      }));

                      return (
                        <FieldArray
                          name="fields"
                          render={array => {
                            const fieldsValue = array.fields.value;

                            return (
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
                                     * */
                                    Object.keys(editors).forEach(field => {
                                      editors[field].reloadData();
                                    });
                                  }, 200);
                                }}
                              >
                                <Droppable droppableId="droppable">
                                  {providedDrop => (
                                    <div ref={providedDrop.innerRef}>
                                      {array.fields.map((name, idx) => {
                                        const fieldNameForward = pathOr(
                                          "",
                                          ["fields", "value", idx - 1, "id"],
                                          array
                                        ).split("_");
                                        const fieldName = pathOr(
                                          "",
                                          ["fields", "value", idx, "id"],
                                          array
                                        ).split("_");
                                        let labelGroup;
                                        if (
                                          fieldNameForward.length < 1 ||
                                          fieldNameForward[0] !== fieldName[0]
                                        ) {
                                          let marginTop = "30px";
                                          if (idx === 0) {
                                            marginTop = "10px";
                                          }
                                          labelGroup = (
                                            <div
                                              className="field__label field__label--group"
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginTop
                                              }}
                                            >
                                              {/* eslint-disable-next-line */}
                                              <a id={fieldName[0]} />
                                              <span>{fieldName[0]}</span>
                                            </div>
                                          );
                                        }

                                        const fieldForm = (
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
                                            {provided => {
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
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  className="field"
                                                >
                                                  {fieldsValue[idx].id &&
                                                  !fieldsValue[idx].id.includes(
                                                    "secondary"
                                                  ) ? (
                                                    ""
                                                  ) : (
                                                    <Field
                                                      name={`${name}.notifyChange`}
                                                      render={({ input }) => {
                                                        let defaultValue = [];
                                                        if (
                                                          pathOr(
                                                            false,
                                                            [],
                                                            input.value
                                                          ) ||
                                                          pathOr(
                                                            false,
                                                            [0],
                                                            input.value
                                                          )
                                                        ) {
                                                          defaultValue = [" "];
                                                        }
                                                        return (
                                                          <div className="field__label--checkbox">
                                                            <CheckboxField
                                                              items={[" "]}
                                                              options={{
                                                                value: defaultValue
                                                              }}
                                                              label="display as push notification"
                                                              onChange={value => {
                                                                let notifyChange = false;
                                                                if (
                                                                  pathOr(
                                                                    false,
                                                                    [0],
                                                                    value
                                                                  )
                                                                ) {
                                                                  notifyChange = true;
                                                                }
                                                                input.onChange(
                                                                  notifyChange
                                                                );
                                                              }}
                                                            />
                                                          </div>
                                                        );
                                                      }}
                                                    />
                                                  )}

                                                  <Field
                                                    name={`${name}.langs.${lang}.label`}
                                                    render={({
                                                      input,
                                                      meta
                                                    }) => (
                                                      <FieldItem
                                                        placeholder="label"
                                                        disabled={
                                                          !isContainScope(
                                                            "put:my-org-type:base"
                                                          )
                                                        }
                                                        name={input.name}
                                                        label={
                                                          fieldsValue[idx].id
                                                        }
                                                        onClose={() => {
                                                          array.fields.remove(
                                                            idx
                                                          );
                                                        }}
                                                        onChange={
                                                          input.onChange
                                                        }
                                                        value={upperCase(
                                                          input.value
                                                        )}
                                                        isModified={meta.dirty}
                                                        type="text"
                                                        lengthIndication={
                                                          // TODO should be moved to generic field config, assumes "fields[0]" is the header, sets special length indication
                                                          name === "fields[0]"
                                                            ? 15
                                                            : 45
                                                        }
                                                      />
                                                    )}
                                                  />
                                                  <FieldEditor
                                                    exports={(
                                                      exportedName,
                                                      method
                                                    ) => {
                                                      /**
                                                       * TODO: Use core draft editor over wrapped plugin editor for more controlable editorState
                                                       * current status: Anytime update EditorState using push new contentState lead to cursor reset to begin of first blockContent
                                                       * current solution: Only call exported reloadData method on change the field order Drag & Drop, switch language
                                                       * */

                                                      editors[`field${idx}`] = {
                                                        [exportedName]: method
                                                      };
                                                    }}
                                                    hyperLink={false}
                                                    dirty={
                                                      fieldValueState.dirty
                                                    }
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
                                              );
                                            }}
                                          </Draggable>
                                        );

                                        return (
                                          <div>
                                            {labelGroup}
                                            {fieldForm}
                                          </div>
                                        );
                                      })}
                                      {isContainScope("put:my-org-type:base")
                                        ? [
                                            "header",
                                            "primary",
                                            "secondary",
                                            "auxiliary"
                                          ].map(fieldId => {
                                            let totalField = 0;

                                            fieldsValue.forEach(field => {
                                              if (
                                                field &&
                                                field.id &&
                                                field.id.startsWith(fieldId)
                                              ) {
                                                totalField += 1;
                                              }
                                            });

                                            const labelField = newLabel(
                                              fieldsValue,
                                              fieldId,
                                              passStyle
                                            );

                                            return totalField >=
                                              pathOr(
                                                0,
                                                [
                                                  "passTypeFormats",
                                                  passStyle,
                                                  `${fieldId}Fields`
                                                ],
                                                fieldFormat
                                              ) ? null : (
                                                <AddFieldButton
                                                  key={labelField}
                                                  fieldType={fieldId}
                                                  onAdd={() => {
                                                  array.fields.push({
                                                    id: labelField,
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

                                                  const newSlice = sortField(
                                                    form.getFieldState("fields")
                                                      .value,
                                                    passStyle
                                                  );

                                                  form.change(
                                                    "fields",
                                                    newSlice
                                                  );
                                                }} 
                                                />
                                            );
                                          })
                                        : null}
                                    </div>
                                  )}
                                </Droppable>
                              </DragDropContext>
                            );
                          }}
                        />
                      );
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

// PassFieldsForm.propTypes = {
//   fields: PropTypes.object,
//   onSubmit: PropTypes.func,
//   lang: PropTypes.string,
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       baseID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//     })
//   }),
//   passStyle: PropTypes.string,
//   translate: PropTypes.func,
//   publishShowTime: PropTypes.func
// };

export default connect(
  state => ({
    translate: getTranslate(state.locale)
  }),
  () => ({})
)(PassFieldsForm);
