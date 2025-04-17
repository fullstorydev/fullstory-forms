import { FSForm } from "../src/index";

describe("Form Element", () => {
  beforeAll(() => {
    document.body.innerHTML = `
    <form id="mktoForm_2608" data-component="marketo-form" data-analytics-id="2608" data-analytics-component="marketo-embedded-form">
    <input type="email" id="email" name="email"/>
    </form>
    `;

    const form = document.body.querySelector("form");
    FSForm(form, "test-form");
  });

  it("has correct fs-element", () => {
    const form = document.body.querySelector("form");
    const attribute = form.getAttribute("data-fs-element");
    expect(attribute).toEqual("form");
  });

  it("has correct fs-form-name", () => {
    const form = document.body.querySelector("form");
    const attribute = form.getAttribute("data-fs-form-name");
    expect(attribute).toEqual("test-form");
  });

  it("has correct schema", () => {
    const form = document.body.querySelector("form");
    const attribute = form.getAttribute("data-fs-properties-schema");
    const parsed = JSON.parse(attribute);
    const schema = {
      "data-analytics-component": {
        type: "str",
        name: "analytics-component",
      },
      "data-analytics-id": {
        type: "real",
        name: "analytics-id",
      },
      id: "str",
      "data-component": {
        type: "str",
        name: "component",
      },
      "data-fs-element": {
        type: "str",
        name: "fs-element",
      },
      "data-fs-form-name": {
        type: "str",
        name: "fs-form-name",
      },
    };
    expect(parsed).toEqual(schema);
  });
});
