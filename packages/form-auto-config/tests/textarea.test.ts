import userEvent from "@testing-library/user-event";
import { FSForm } from "../src/index";

describe("TextArea", () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <form id="mktoForm_2608" data-component="marketo-form" data-analytics-id="2608" data-analytics-component="marketo-embedded-form">
        <textarea id="story" name="story" rows="5" cols="33">It was a dark and stormy night...
        </textarea>
        <button type="submit" class="mktoButton">SUBMIT</button>    
      </form>
      `;

    const form = document.body.querySelector("form");
    FSForm(form, "test-form");
  });

  it("has correct fs-element", () => {
    const input = document.body.querySelector("textarea");
    const attribute = input.getAttribute("data-fs-element");
    expect(attribute).toEqual("textarea");
  });

  it("has correct fs-textarea-name", () => {
    const input = document.body.querySelector("textarea");
    const attribute = input.getAttribute("data-fs-textarea-name");
    expect(attribute).toEqual("story");
  });

  it("has correct fs-textarea-type", () => {
    const input = document.body.querySelector("textarea");
    const attribute = input.getAttribute("data-fs-textarea-type");
    expect(attribute).toEqual(null);
  });

  it("updates value on input", async () => {
    const input = document.body.querySelector("textarea");
    const text = "the end";

    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, "the end");

    const attribute = input.getAttribute("data-fs-textarea-value");
    expect(attribute).toEqual(text);
  });

  it("button has option value set", () => {
    const button = document.body.querySelector("button");
    const attribute = button.getAttribute("data-story");
    expect(attribute).toEqual("the end");
  });

  it("has correct schema", () => {
    const input = document.body.querySelector("textarea");
    const attribute = input.getAttribute("data-fs-properties-schema");
    const parsed = JSON.parse(attribute);
    const schema = {
      id: "str",
      "data-fs-element": {
        type: "str",
        name: "fs-element",
      },
      "data-fs-textarea-name": {
        type: "str",
        name: "fs-textarea-name",
      },
      "data-fs-textarea-value": {
        type: "str",
        name: "fs-textarea-value",
      },
    };
    expect(parsed).toEqual(schema);
  });
});
