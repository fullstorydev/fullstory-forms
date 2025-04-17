export function isDate(data: any) {
  let [y, M, d, h, m, s] = data.split(/[- : T Z]/);
  return y && M <= 12 && d <= 31 ? true : false;
}

export const getDataType = (
  data: any
): "date" | "str" | "real" | "int" | "bool" => {
  // if string is date return date
  if (isDate(data)) {
    return "date";
  } else {
    // create a map that matches js types to fullstory types
    const typeMap = {
      string: "str",
      number: "real",
      bigint: "int",
      int: "int",
      boolean: "bool",
    };

    let dataType;
    if (data === "true" || data === "false") {
      dataType = "boolean";
    } else {
      // grab data type
      dataType = isNaN(data) ? typeof data : typeof Number(data);
    }

    // if these data types throw error
    if (
      dataType === "undefined" ||
      dataType === "symbol" ||
      dataType === "function"
    ) {
      throw Error(`Data type of ${dataType} is not allowed`);
    } else {
      // create type
      let type;

      // if type is object dig deeper
      if (dataType === "object") {
        type = getTypeOfObject(data);
      } else {
        // grab type from map
        type = typeMap[dataType];
      }

      // return data type
      return type;
    }
  }
};

export const getTypeOfObject = (data: any) => {
  // create many type map
  const typeMap = {
    string: "strs",
    number: "reals",
    bigint: "ints",
    int: "ints",
    boolean: "bools",
  };

  // if data is an array proceed or else throw error
  if (Array.isArray(data)) {
    const type = typeof data[0];

    // if Date return date
    if (isDate(data[0])) {
      return "dates";
    } else if (
      type === "undefined" ||
      type === "symbol" ||
      type === "function" ||
      type === "object"
    ) {
      // if not fullstory type, throw error
      throw Error(`Data type of ${type} is not allowed`);
    } else {
      // return type from the map
      return typeMap[type];
    }
  } else {
    throw Error("Data type of object is not allowed");
  }
};

export const setPropertySchema = (element: HTMLElement) => {
  // create schema store
  const schema = {};

  // get all properties on the element
  const props = element.getAttributeNames();

  // loop through props
  for (const prop of props) {
    // if property has id place it on schema
    if (prop === "id") {
      schema[prop] = getDataType(prop);
    }

    // prop includes data and is not the property schema transform it
    if (prop.includes("data-") && prop !== "data-fs-properties-schema") {
      // getting name
      let property = prop.split("-");
      property.splice(0, 1);
      const name = property.join("-");

      // getting property type
      const attributeValue = element.getAttribute(prop);
      const type = getDataType(attributeValue);

      // setting schema
      schema[prop] = {
        type: type,
        name: name,
      };
    }
  }

  // set schem on element
  element.setAttribute("data-fs-properties-schema", JSON.stringify(schema));
};
