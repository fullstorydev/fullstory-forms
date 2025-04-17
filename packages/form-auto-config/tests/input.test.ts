import { FSForm } from "../src/index";
import userEvent from "@testing-library/user-event";

describe("All Inputs", () => {
  describe("Text", () => {
    beforeAll(() => {
      document.body.innerHTML = `
      <form id="mktoForm_2608" data-component="marketo-form" data-analytics-id="2608" data-analytics-component="marketo-embedded-form">
        <input type="text" name="firstname" />
        <button type="submit" class="mktoButton">SUBMIT</button>    
      </form>
      `;

      const form = document.body.querySelector("form");
      FSForm(form, "test-form");
    });

    it("has correct fs-element", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-element");
      expect(attribute).toEqual("input");
    });

    it("has correct fs-input-name", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-input-name");
      expect(attribute).toEqual("firstname");
    });

    it("updates value on input", async () => {
      const input = document.body.querySelector("input");

      const user = userEvent.setup();
      await user.type(input, "John");

      const attribute = input.getAttribute("data-fs-input-value");
      expect(attribute).toEqual("John");
    });

    it("button has option value set", () => {
      const button = document.body.querySelector("button");
      const attribute = button.getAttribute("data-firstname");
      expect(attribute).toEqual("John");
    });

    it("has correct schema", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-properties-schema");
      const parsed = JSON.parse(attribute);
      const schema = {
        "data-fs-element": {
          type: "str",
          name: "fs-element",
        },
        "data-fs-input-name": {
          type: "str",
          name: "fs-input-name",
        },
        "data-fs-input-value": {
          type: "str",
          name: "fs-input-value",
        },
      };
      expect(parsed).toEqual(schema);
    });
  });

  describe("Button", () => {
    beforeAll(() => {
      document.body.innerHTML = `
      <form id="mktoForm_2608" data-component="marketo-form" data-analytics-id="2608" data-analytics-component="marketo-embedded-form">
      <input type="email"  name="email" class="mktoButton"/>   
      
      <input type="button"  value="Start" class="mktoButton"/>    
      </form>
      `;

      const form = document.body.querySelector("form");
      FSForm(form, "test-form");
    });

    it("has correct fs-element", () => {
      const buttons = document.body.querySelectorAll("input");
      const button = buttons[1];
      const attribute = button.getAttribute("data-fs-element");
      expect(attribute).toEqual("button");
    });

    it("has correct fs-button-name", () => {
      const buttons = document.body.querySelectorAll("input");
      const button = buttons[1];
      const attribute = button.getAttribute("data-fs-button-name");
      expect(attribute).toEqual("Start");
    });

    it("has correct fs-button-type", () => {
      const buttons = document.body.querySelectorAll("input");
      const button = buttons[1];
      const attribute = button.getAttribute("data-fs-button-type");
      expect(attribute).toEqual("input");
    });

    it("is updated with input value", async () => {
      const buttons = document.body.querySelectorAll("input");
      const input = buttons[0];

      const user = userEvent.setup();
      await user.type(input, "john@email.com");

      const button = buttons[1];
      const attribute = button.getAttribute("data-email");
      expect(attribute).toEqual("john@email.com");
    });

    it("has correct schema", () => {
      const buttons = document.body.querySelectorAll("input");
      const button = buttons[1];
      const attribute = button.getAttribute("data-fs-properties-schema");
      const parsed = JSON.parse(attribute);
      const schema = {
        "data-fs-element": {
          type: "str",
          name: "fs-element",
        },
        "data-fs-button-name": {
          type: "str",
          name: "fs-button-name",
        },
        "data-fs-button-type": {
          type: "str",
          name: "fs-button-type",
        },
        "data-email": {
          type: "str",
          name: "email",
        },
      };
      expect(parsed).toEqual(schema);
    });
  });

  describe("Checkbox", () => {
    beforeAll(() => {
      document.body.innerHTML = `
      <form id="mktoForm_2608" data-component="marketo-form" data-analytics-id="2608" data-analytics-component="marketo-embedded-form">
        <input type="checkbox" value="Testing Box" name="Testing Box" />
        <button type="submit" class="mktoButton">SUBMIT</button>    
      </form>
      `;

      const form = document.body.querySelector("form");
      FSForm(form, "test-form");
    });

    it("has correct fs-element", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-element");
      expect(attribute).toEqual("checkbox-item");
    });

    it("has correct fs-checkbox-item-name", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-checkbox-item-name");
      expect(attribute).toEqual("testing box");
    });

    it("has correct fs-checkbox-item-value", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-checkbox-item-value");
      expect(attribute).toEqual("Testing Box");
    });

    it("has selected set at false", async () => {
      const input = document.body.querySelector("input");

      const attribute = input.getAttribute("data-fs-checkbox-item-selected");
      expect(attribute).toEqual("false");
    });

    it("updates selected to true on click", async () => {
      const input = document.body.querySelector("input");

      const user = userEvent.setup();
      await user.click(input);

      const attribute = input.getAttribute("data-fs-checkbox-item-selected");
      expect(attribute).toEqual("true");
    });

    it("button has selected value set", () => {
      const button = document.body.querySelector("button");
      const attribute = button.getAttribute("data-testing-box");
      expect(attribute).toEqual("true");
    });

    it("has correct schema", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-properties-schema");
      const parsed = JSON.parse(attribute);
      const schema = {
        "data-fs-element": {
          type: "str",
          name: "fs-element",
        },
        "data-fs-checkbox-item-name": {
          type: "str",
          name: "fs-checkbox-item-name",
        },
        "data-fs-checkbox-item-value": {
          type: "str",
          name: "fs-checkbox-item-value",
        },
        "data-fs-checkbox-item-selected": {
          type: "bool",
          name: "fs-checkbox-item-selected",
        },
      };
      expect(parsed).toEqual(schema);
    });
  });

  describe("Date", () => {
    beforeAll(() => {
      document.body.innerHTML = `
      <form id="mktoForm_2608" data-component="marketo-form" data-analytics-id="2608" data-analytics-component="marketo-embedded-form">
        <input type="text" name="firstname" />
        <button type="submit" class="mktoButton">SUBMIT</button>    
      </form>
      `;

      const form = document.body.querySelector("form");
      FSForm(form, "test-form");
    });

    it("has correct fs-element", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-element");
      expect(attribute).toEqual("input");
    });

    it("has correct fs-input-name", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-input-name");
      expect(attribute).toEqual("firstname");
    });

    it("updates value on input", async () => {
      const input = document.body.querySelector("input");

      const user = userEvent.setup();
      await user.type(input, "John");

      const attribute = input.getAttribute("data-fs-input-value");
      expect(attribute).toEqual("John");
    });

    it("button has option value set", () => {
      const button = document.body.querySelector("button");
      const attribute = button.getAttribute("data-firstname");
      expect(attribute).toEqual("John");
    });

    it("has correct schema", () => {
      const input = document.body.querySelector("input");
      const attribute = input.getAttribute("data-fs-properties-schema");
      const parsed = JSON.parse(attribute);
      const schema = {
        "data-fs-element": {
          type: "str",
          name: "fs-element",
        },
        "data-fs-input-name": {
          type: "str",
          name: "fs-input-name",
        },
        "data-fs-input-value": {
          type: "str",
          name: "fs-input-value",
        },
      };
      expect(parsed).toEqual(schema);
    });
  });
});
