import { setPropertySchema } from "../helpers";
import { updateButton } from "./buttons";

export const dressDropdowns = (form: HTMLFormElement) => {
  // get all dropdowns
  const selects = form.querySelectorAll("select");

  // for each dropdown dress with data attributes
  selects.forEach((select) => {
    // get dropdown name
    const name = select.getAttribute("name");

    // if name dress dropdown
    if (name) {
      // set element as dropdown
      select.setAttribute("data-fs-element", "dropdown");
      // set dropdown name as it's name
      select.setAttribute("data-fs-dropdown-name", name.toLowerCase());

      // set property schema
      setPropertySchema(select);

      // dress options
      dressOptions(select);

      // add listener on change
      select.addEventListener("change", (e) => {
        // grab change value
        const value = (e.target as HTMLTextAreaElement).value;
        // set value attribute
        select.setAttribute("data-fs-dropdown-value", value);

        // redress options
        dressOptions(select, value);

        // add value to button
        updateButton(form, name, value);

        // update property schema
        setPropertySchema(select);
      });
    }
  });
};

const dressOptions = (
  select: HTMLSelectElement,
  selected: string | null = null
) => {
  // get all options on the select
  const options = select.querySelectorAll("option");

  // for each option dress with data properties
  options.forEach((option) => {
    // grab option value
    const value = option.value;

    // if value dress element
    if (value) {
      // set element as option
      option.setAttribute("data-fs-element", "option");
      // set option value as value
      option.setAttribute("data-fs-option-value", value);
      // set option selected as boolean

      const isSelected = value === selected;
      option.setAttribute("data-fs-option-selected", isSelected.toString());

      // create schema
      setPropertySchema(option);
    }
  });
};
