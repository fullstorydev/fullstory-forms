import { setPropertySchema } from "../helpers";
import { dressButton, updateButton } from "./buttons";

export const dressInput = (form: HTMLFormElement) => {
  // get all inputs in form
  const inputs = form.querySelectorAll("input");

  // for each input dress which data attributes
  inputs.forEach((input) => {
    const type = input.getAttribute("type");

    switch (type) {
      case "checkbox":
        return dressCheckboxItem(form, input);
      case "button":
        return dressButton(input, true);
      default:
        return dressInputText(form, input);
    }
  });
};

const dressInputText = (form: HTMLFormElement, input: HTMLInputElement) => {
  // get name of input
  const name = input.getAttribute("name");

  // get value of input
  const value = input.value;

  // if name we can set the data properties
  if (name) {
    // set element as input
    input.setAttribute("data-fs-element", "input");
    // set input name as it's name
    input.setAttribute("data-fs-input-name", name.toLowerCase());

    // if value set the value
    value && input.setAttribute("data-fs-input-value", value);

    // add event listener to update the dom with data values
    input.addEventListener("input", () => {
      // add input value property
      input.setAttribute("data-fs-input-value", input.value);

      // add value to button
      updateButton(form, name, input.value);

      // update property schema
      setPropertySchema(input);
    });

    // set the property schema
    setPropertySchema(input);
  }
};

const dressCheckboxItem = (form: HTMLFormElement, input: HTMLInputElement) => {
  /**
   * Possible Properties
   * -------------------
   *  data-fs-element = checkbox-item
   *  data-fs-checkbox-selected = true | false
   *  data-fs-checkbox-item-name = <NAME>
   *  data-fs-checkbox-item-value = <VALUE>
   */

  // get name of input
  const name = input.getAttribute("name");
  const value = input.getAttribute("value");

  // set element as input
  input.setAttribute("data-fs-element", "checkbox-item");

  // check for selected attribute on element
  const selected = input.getAttribute("data-fs-checkbox-item-selected");

  // if selected is null set property as false
  if (selected === null) {
    input.setAttribute("data-fs-checkbox-item-selected", "false");
  }

  // if name we can set the data properties
  if (name) {
    // set input name as it's name
    input.setAttribute("data-fs-checkbox-item-name", name.toLowerCase());
  }
  if (value) {
    input.setAttribute("data-fs-checkbox-item-value", value);
  }

  // add event listener to update the dom when selected
  input.addEventListener("click", () => {
    // grab current selection
    const curselected = input.getAttribute("data-fs-checkbox-item-selected");

    // get selected
    const selected =
      curselected === "false"
        ? "true"
        : curselected === "true"
        ? "false"
        : "false";

    // update selected on property
    input.setAttribute("data-fs-checkbox-item-selected", selected);

    // update button
    if (name) {
      updateButton(form, name, selected);
    } else {
      updateButton(form, value, selected);
    }

    // update property schema
    setPropertySchema(input);
  });

  // set the property schema
  setPropertySchema(input);
};
