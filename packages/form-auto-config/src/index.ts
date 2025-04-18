import { dressButtons } from "./elements/buttons";
import { dressDropdowns } from "./elements/dropdowns";
import { dressInput } from "./elements/inputs";
import { dressFormElement } from "./elements/forms";
import { dressTextAreas } from "./elements/textarea";

export const FSForm = (form: HTMLFormElement, name: string) => {
  dressFormElement(name, form);
  dressInput(form);
  dressTextAreas(form);
  dressDropdowns(form);
  dressButtons(form);
};
