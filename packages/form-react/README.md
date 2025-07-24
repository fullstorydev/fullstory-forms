# Fullstory Forms React Library

This project is a fork of [survey.js](https://github.com/surveyjs/survey-library.git), customized for compatibility with our internal tools.

## Purpose

This form solution seemlessly integrates with the Fullstory by creating auto generated api defined elements on the form, fields, and buttons.

## How it differs from SurveyJS

### Elements

This library adds additional functionality to the original SurveyJS library. Specific data properties are added to each React Question and buttons. The properties will differ depending on the property but every element will get at least these two data properties used for identification. Where the name of the element is mapped to the name property on the question model.

`data-fs-element=<ELEMENT_TYPE>`  
`data-fs-element-name=<ELEMENT_NAME>`

### Implementation

Due to Fullstory's privacy-first approach, we need to access the blocklist from the client. This async functionality causes a slight difference in how we instantiate the forms.

**Before**

```
var model = new Survey.Model(json);

window.survey = model;

ReactDOM.render(
  <SurveyReact.Survey model={model} />,
  document.getElementById("surveyElement")
);
```

**After**

```
var model = new Survey.Model(json);

model.createBlockList().then(() => {
  window.survey = model;

  model.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
  });

  ReactDOM.render(<SurveyReact.Survey model={model} />, document.getElementById("surveyElement"));
});
```

### Maintenance

The current forked verson of the React SurveyJS is 2.2.6, we will be updating with every major version release.

# SurveyJS React Form Library

<video src="https://github.com/surveyjs/survey-library/assets/22315929/b24a68bf-d703-4096-835b-752f5f610aa6"></video>

[![Build Status](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_apis/build/status/SurveyJS%20Library?branchName=master)](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_build/latest?definitionId=7&branchName=master)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE)
<a href="https://github.com/DevExpress/testcafe">
<img alt="Tested with TestCafe" src="https://img.shields.io/badge/tested%20with-TestCafe-2fa4cf.svg">
</a>
<a href="https://github.com/surveyjs/survey-library/issues">
<img alt="Issues" title="Open Issues" src="https://img.shields.io/github/issues/surveyjs/survey-library.svg">
</a>
<a href="https://github.com/surveyjs/survey-library/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+">
<img alt="Closed issues" title="Closed Issues" src="https://img.shields.io/github/issues-closed/surveyjs/survey-library.svg">
</a>

A free and open-source MIT-licensed JavaScript form builder library that allows you to design dynamic, data-driven, multi-language survey forms and run them in your React applications.

## Features

- Dynamic forms, surveys, polls, and quizzes for your JavaScript application
- Integration with React, Angular, Vue, jQuery, and Knockout
- 20+ built-in question types and support for custom question types
- Built-in themes and CSS customization
- Answer validation
- TypeScript support
- Community-supported UI localization to 50+ languages
- Integration with any backend framework (examples for PHP, NodeJS, and ASP.NET included)
- Compatibility with any server + database combination
- Third-party component integration

## Get Started

To get started with SurveyJS React Form Library, refer to the following tutorial: [Add a Survey to a React Application](https://surveyjs.io/Documentation/Library?id=get-started-react).

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/Documentation/Library)
- [Live Examples](https://surveyjs.io/form-library/examples/nps-question/reactjs)
- [What's New](https://surveyjs.io/WhatsNew)

## Build SurveyJS React Form Library from Sources

1. [**Build the platform-independent part**](../survey-core/README.md#survey-model-platform-independent-part)

1. **Install SurveyJS React Form Library dependencies and build this library**

   ```
   cd ../form-react
   npm i
   npm run build
   ```

   You can find the built scripts in folders under the `build` directory.

1. **Run a test application**

   ```
   npm run start
   ```

   This command runs a local HTTP server at http://localhost:7777/.

1. **Run unit tests**

   ```
   npm run test
   ```

   The unit tests use [Karma](https://karma-runner.github.io/6.3/index.html).

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).
