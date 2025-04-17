import { setPropertySchema } from "../helpers";

export const dressFormElement = (name: string, element: HTMLFormElement) => {
  // set the element as form
  element.setAttribute("data-fs-element", "form");

  // set the form name as unique name
  element.setAttribute("data-fs-form-name", name);
  setPropertySchema(element);
};
