import { FSForm } from "../src/index";
import userEvent from "@testing-library/user-event";

describe("Button Element", () => {
  beforeAll(() => {
    document.body.innerHTML = `
    <form id="mktoForm_2608" data-component="marketo-form" data-analytics-id="2608" data-analytics-component="marketo-embedded-form">
      <input type="email" id="email" name="email"/>
      <button type="submit" class="mktoButton">SUBMIT</button>    
    </form>
    `;

    const form = document.body.querySelector("form");
    FSForm(form, "test-form");
  });

  it("has correct fs-element", () => {
    const button = document.body.querySelector("button");
    const attribute = button.getAttribute("data-fs-element");
    expect(attribute).toEqual("button");
  });

  it("has correct fs-button-name", () => {
    const button = document.body.querySelector("button");
    const attribute = button.getAttribute("data-fs-button-name");
    expect(attribute).toEqual("SUBMIT");
  });

  it("has correct fs-button-type", () => {
    const button = document.body.querySelector("button");
    const attribute = button.getAttribute("data-fs-button-type");
    expect(attribute).toEqual("submit");
  });

  it("has input value as property", async () => {
    const input = document.body.querySelector("input");
    const user = userEvent.setup();
    await user.type(input, "new@email.com");

    const button = document.body.querySelector("button");
    const attribute = button.getAttribute("data-email");
    expect(attribute).toEqual("new@email.com");
  });

  it("has correct schema", () => {
    const button = document.body.querySelector("button");
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
