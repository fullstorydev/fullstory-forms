import { setPropertySchema } from "../helpers";
import { updateButton } from "./buttons";

export const dressTextArea = (form) => {
  const input = form.querySelector("textArea");

  // get input properties
  const name = input.getAttribute("name");
  const type = input.getAttribute("type");
  const value = input.value;

  // set properties on element
  input.setAttribute("data-fs-element", "textarea");
  name && input.setAttribute("data-fs-textarea-name", name.toLowerCase());
  type && input.setAttribute("data-fs-textarea-type", type);
  if (value) {
    input.setAttribute("data-fs-textarea-value", value);
    updateButton(form, name, value);
  }

  // add event listener to update the dom with data values
  input.addEventListener("input", () => {
    // add input value property
    input.setAttribute("data-fs-textarea-value", input.value);

    // add value to button
    updateButton(form, name, input.value);

    // update property schema
    setPropertySchema(input);
  });

  // set the property schema
  setPropertySchema(input);
};
