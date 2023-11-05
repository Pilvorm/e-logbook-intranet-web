import { useMemo } from "react";
import { FieldArray, useField } from "formik";
import chunk from "lodash/chunk";
import { Col, CustomInput, FormGroup, Input } from "reactstrap";

export default function Checkboxes({
  name = "checkboxes",
  data,
  chunkSize = 11,
  formik,
  getOptionFromData,
  valueMapper,
  pushedValue,
}) {
  const chunked = useMemo(() => {
    return chunk(data.map(getOptionFromData), chunkSize);
  }, [data, chunkSize]);

  return (
    <FieldArray name={name}>
      {(helpers) => (
        <>
          {chunked.map((list, outerIndex) => (
            <Col key={outerIndex} className="p-0">
              {list.map((item, innerIndex) => (
                <FormGroup key={innerIndex}>
                  <CustomInput
                    type="checkbox"
                    id={`checkbox-${name}-${outerIndex}-${innerIndex}`}
                    label={item.label}
                    onChange={(e) => {
                      if (e.target.checked) {
                        helpers.push(pushedValue(item));
                      } else {
                        helpers.remove(
                          formik.values[name].findIndex(
                            (value) => value[valueMapper.id] == item.id
                          )
                        );
                      }
                    }}
                    checked={formik.values[name].some(
                      (value) => value[valueMapper.id] == item.id
                    )}
                    inline
                  />
                  {formik.values[name].some(
                    (value) => value[valueMapper.label] == "Lainnya"
                  ) &&
                    item.label == "Lainnya" && (
                      <Input
                        style={{ marginTop: "5px", maxWidth: "500px" }}
                        type="text"
                        id="namaKondisiLainnya"
                        name="namaKondisiLainnya"
                        value={
                          formik.values[name].find(
                            (value) => value[valueMapper.label] == "Lainnya"
                          )?.[valueMapper.other] || ""
                        }
                        onChange={(e) => {
                          const index = formik.values[name].findIndex(
                            (value) => value[valueMapper.label] == "Lainnya"
                          );
                          formik.setFieldValue(
                            `${name}.${index}.${valueMapper.other}`,
                            e.target.value
                          );
                        }}
                      />
                    )}
                </FormGroup>
              ))}
            </Col>
          ))}
        </>
      )}
    </FieldArray>
  );
}
