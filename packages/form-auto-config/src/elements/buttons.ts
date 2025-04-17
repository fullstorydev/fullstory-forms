import { setPropertySchema } from "../helpers";

export const dressButtons = (element: HTMLFormElement) => {
  const buttons = element.querySelectorAll("button");

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    dressButton(button);
  }
};

export const dressButton = (
  button: HTMLInputElement | HTMLButtonElement,
  isInput = false
) => {
  const type = isInput ? "input" : button.getAttribute("type");
  const text = isInput ? button.value : button.textContent;

  // set element as option
  button.setAttribute("data-fs-element", "button");
  // set option value as value
  button.setAttribute("data-fs-button-type", type);
  // set option selected as boolean
  button.setAttribute("data-fs-button-name", text);

  setPropertySchema(button);
};

export const updateButton = (
  element: HTMLFormElement,
  key: string,
  value: any
) => {
  // create array for al kinds of buttons
  const buttons = [];

  // but all button elements from the form
  const buttonElements = element.querySelectorAll("button");

  // for each button element put it in the array
  buttonElements.forEach((x) => buttons.push(x));

  // get all inputs from the form
  const inputs = element.querySelectorAll("input");

  // look for each input that is of type button or submit and add it to button array
  inputs.forEach((x) => {
    const type = x.getAttribute("type");
    if (type === "button" || type === "submit") {
      buttons.push(x);
    }
  });

  const parsedKey = key.split(" ").join("-").toLowerCase();
  // loop over every button and upday with data values
  for (const button of buttons) {
    button.setAttribute(`data-${parsedKey}`, value);
    setPropertySchema(button);
  }
};
