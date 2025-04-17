import { FSForm } from "../src/index";
import userEvent from "@testing-library/user-event";

describe("Dropdown and Option Elements", () => {
  beforeAll(() => {
    document.body.innerHTML = `
    <form id="mktoForm_2608" data-component="marketo-form" data-analytics-id="2608" data-analytics-component="marketo-embedded-form">
      <select id="fruit" name="fruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="grape">Grape</option>
      </select>
      <button type="submit" class="mktoButton">SUBMIT</button>    
    </form>
    `;

    const form = document.body.querySelector("form");
    FSForm(form, "test-form");
  });

  describe("Dropdown", () => {
    it("has correct fs-element", () => {
      const dropdown = document.body.querySelector("select");
      const attribute = dropdown.getAttribute("data-fs-element");
      expect(attribute).toEqual("dropdown");
    });

    it("has correct fs-dropdown-name", () => {
      const dropdown = document.body.querySelector("select");
      const attribute = dropdown.getAttribute("data-fs-dropdown-name");
      expect(attribute).toEqual("fruit");
    });

    it("updates value on option click", async () => {
      const dropdown = document.body.querySelector("select");

      const user = userEvent.setup();
      await user.click(dropdown);
      await user.selectOptions(dropdown, "apple");

      const attribute = dropdown.getAttribute("data-fs-dropdown-value");
      expect(attribute).toEqual("apple");
    });

    it("button has option value set", () => {
      const button = document.body.querySelector("button");
      const attribute = button.getAttribute("data-fruit");
      expect(attribute).toEqual("apple");
    });

    it("has correct schema", () => {
      const dropdown = document.body.querySelector("select");
      const attribute = dropdown.getAttribute("data-fs-properties-schema");
      const parsed = JSON.parse(attribute);
      const schema = {
        id: "str",
        "data-fs-element": {
          type: "str",
          name: "fs-element",
        },
        "data-fs-dropdown-name": {
          type: "str",
          name: "fs-dropdown-name",
        },
        "data-fs-dropdown-value": {
          type: "str",
          name: "fs-dropdown-value",
        },
      };
      expect(parsed).toEqual(schema);
    });
  });

  describe("Options", () => {
    it("has correct fs-element", () => {
      const options = document.body.querySelectorAll("option");
      const attribute = options[0].getAttribute("data-fs-element");
      expect(attribute).toEqual("option");
    });

    it("has correct fs-option-value", () => {
      const options = document.body.querySelectorAll("option");
      const fruits = ["apple", "banana", "orange", "grape"];

      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const attribute = option.getAttribute("data-fs-option-value");
        expect(attribute).toEqual(fruits[i]);
      }
    });

    it("has correct fs-option-selected", () => {
      const options = document.body.querySelectorAll("option");
      const fruits = ["apple", "banana", "orange", "grape"];

      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const attribute = option.getAttribute("data-fs-option-selected");
        const fruit = fruits[i];
        let selected = "false";
        if (fruit === "apple") {
          selected = "true";
        }
        expect(attribute).toEqual(selected);
      }
    });
  });
});
