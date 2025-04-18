import { setPropertySchema } from "../helpers";
import { updateButton } from "./buttons";

export const dressTextAreas = (form: HTMLFormElement) => {
  // get all dropdowns
  const textareas = form.querySelectorAll("textarea");

  // for each dropdown dress with data attributes
  textareas.forEach((textarea) => {
    // get input properties
    const name = textarea.getAttribute("name");
    const type = textarea.getAttribute("type");
    const value = textarea.value;

    // set properties on element
    textarea.setAttribute("data-fs-element", "textarea");
    name && textarea.setAttribute("data-fs-textarea-name", name.toLowerCase());
    type && textarea.setAttribute("data-fs-textarea-type", type);
    if (value) {
      textarea.setAttribute("data-fs-textarea-value", value);
      updateButton(form, name, value);
    }

    console.log("adding listener");
    // add event listener to update the dom with data values
    textarea.addEventListener("input", () => {
      // add input value property
      textarea.setAttribute("data-fs-textarea-value", textarea.value);

      // add value to button
      updateButton(form, name, textarea.value);

      // update property schema
      setPropertySchema(textarea);
    });

    // set the property schema
    setPropertySchema(textarea);
  });
};
