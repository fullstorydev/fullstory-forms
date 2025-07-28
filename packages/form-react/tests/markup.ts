import { testQuestionMarkup } from "../../../tests/markup/helper";
import { markupTests } from "../../../tests/markup/etalon";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { Model } from "@fullstory/form-core";
import { act } from "react-dom/test-utils";
import * as React from "react";
import * as ReactDOM from "react-dom";

var platformDescriptor = {
  name: "React",
  survey: null,
  surveyFactory: json => new Model(json),
  render: (survey, element) => {
    var component = React.createElement(SurveyReact, { model: survey }, null);
    act(() => {
      ReactDOM.render(component, element);
    });
  },
  getStrFromHtml: snapshot => {
    return require("../../../tests/markup/snapshots/" + snapshot + ".snap.html");
    // return require("../../../tests/markup/snapshots/boolean-checkbox-custom-icon.snap.html");
  },
  finish: element => {
    ReactDOM.unmountComponentAtNode(element);
  }
};

export default QUnit.module("Base");

(async () => {
  for (const test of markupTests) {
    QUnit.test(test.name, async function (assert) {
      await testQuestionMarkup(assert, test, platformDescriptor);
    });
  }
})();
