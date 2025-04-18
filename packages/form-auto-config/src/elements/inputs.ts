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
      case "radio":
        return dressRadioItem(form, input);
      default:
        return dressInputText(form, input);
    }
  });
};

const dressInputText = (form: HTMLFormElement, input: HTMLInputElement) => {
  // get input properties
  const name = input.getAttribute("name");
  const type = input.getAttribute("type");
  const value = input.value;

  // set properties on element
  input.setAttribute("data-fs-element", "input");
  name && input.setAttribute("data-fs-input-name", name.toLowerCase());
  type && input.setAttribute("data-fs-input-type", type);
  if (value) {
    input.setAttribute("data-fs-input-value", value);
    updateButton(form, name, value);
  }

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
};

const dressCheckboxItem = (form: HTMLFormElement, input: HTMLInputElement) => {
  /**
   * Possible Properties
   * -------------------
   *  data-fs-element = checkbox-item
   *  data-fs-checkbox-selected = true | false
   *  data-fs-checkbox-item-name = <NAME>
   *  data-fs-checkbox-item-value = <VALUE>
   *  data-fs-input-type = checkbox-item
   */

  // get name of input and set on element
  const name = input.getAttribute("name");
  // get type and set on element
  const type = input.getAttribute("type");
  // get value and set on element
  const value = input.getAttribute("value");

  // set properties on element
  input.setAttribute("data-fs-element", "checkbox-item");
  name && input.setAttribute("data-fs-checkbox-item-name", name.toLowerCase());
  value && input.setAttribute("data-fs-checkbox-item-value", value);
  type && input.setAttribute("data-fs-input-type", type);

  // check for selected attribute on element
  const selected = input.getAttribute("data-fs-checkbox-item-selected");

  // if selected is null set property as false
  if (selected === null) {
    input.setAttribute("data-fs-checkbox-item-selected", "false");
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

const dressRadioItem = (form: HTMLFormElement, input: HTMLInputElement) => {
  /**
   * Possible Properties
   * -------------------
   *  data-fs-element = radio-item
   *  data-fs-raidio-item-selected = true | false
   *  data-fs-raidio-item-name = <NAME>
   *  data-fs-raidio-item-value = <VALUE>
   *  data-fs-input-type = raidio
   */

  // get name of input and set on element
  const name = input.getAttribute("name");
  // get type and set on element
  const type = input.getAttribute("type");
  // get value and set on element
  const value = input.getAttribute("value");

  // set properties on element
  input.setAttribute("data-fs-element", "radio-item");
  name && input.setAttribute("data-fs-radio-item-name", name.toLowerCase());
  value && input.setAttribute("data-fs-radio-item-value", value);
  type && input.setAttribute("data-fs-input-type", type);

  // check for selected attribute on element
  const selected = input.getAttribute("data-fs-radio-item-selected");

  // if selected is null set property as false
  if (selected === null) {
    input.setAttribute("data-fs-radio-item-selected", "false");
  }

  // add event listener to update the dom when selected
  input.addEventListener("click", () => {
    // grab current selection
    const curselected = input.getAttribute("data-fs-radio-item-selected");

    // get selected
    const selected =
      curselected === "false"
        ? "true"
        : curselected === "true"
        ? "false"
        : "false";

    // update selected on property
    input.setAttribute("data-fs-radio-item-selected", selected);

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
