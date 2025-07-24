# Fullstory Forms Core Library

This project is a fork of [survey.js](https://github.com/surveyjs/survey-library.git) customized for compatibility with Fullstory tools.

## Purpose

This form solution seemlessly integrates with the Fullstory by creating auto generated api defined elements on the form, fields, and buttons.

## How it differs from SurveyJS Core Library

Updates to the Survey Model, Base Model, individual Question Models, and Action Models have been created in order to maintain and update element data properties.

### Survey Class Updates

In `survey.ts`

- `createBlockList` function which is to be called after model instantiation. The purpose of this is to call Fullstory's blocklist at the beginning of the session and store it with the model as a way to maintain privacy rules.
- `updateButtonValuesCallBack` updates the button with the form field values as data properties.
- `deleteButtonValuesCallBack` deletes values on the button when the corresponding field values are deleted from the form.

### Base Class Updates

In `base.ts`

- `getDataElement` gets the initial data properties for the element.
- `createElementData`: creates the data properties and corresponding property schema
- `getDataType`: returns the data type of the property for the property schema
- `getTypeOfObject`: returns the type of object being used on the property
- `getDataElementItem`: gets the initial data properties for an element that is an item like a checkbox item or radio item. It utilizes the same functions as `getDataElement` The difference is this function applies a selected property to the element which indicates if the item was selected or not.
- `traverseBlocked`: traverses an elements children to looked for blocked elements. If a child element is blocked return true otherwise return false.
- `isBlocked`: matches the element against the Fullstory blocklist
- `updateDataValue`: Updates the element with the form field values.
- `updatePropertySchema`: updates the property schema with the new property and value data type
- `deleteFromPropertySchema`: deletes a property and data type from the elements property schema

### Action Class

In `src/actions/action.ts`

- `dataProperties`: property that lives on the Action class and holds property data
- `elementData`: gets the data properties.
- `getElementData`: returns the data created by the function in the `createElementData` in the Base class
- `deleteElementData`: deletes properties from the button
- `updateElementData`: updates properties on the button.
- `setButtonProperties`: sets the properties directly on the button

### Pages and Panels

Pages and Panels also sustain data properties with `elementData` those changes can be found in the classes:

- PanelModel
- PageModel

### Question Classes

Select classes have been updated to communicated property data to the library consuming the survey model.
Each class is given the property `elementData` and a function to update and delete properties from the element.
The list below is going to highlight which classes sustained updates

- QuestionBooleanModel
- QuestionCheckboxModel
- QuestionDropdownModel
- QuestionFileModel
- QuestionImagePickerModel
- MatrixCells
- QuestionMatrixModel
- MatrixRowModel
- QuestionMatrixDynamicModel
- QuestionMultipleTextModel
- QuestionPanelDynamicModel
- QuestionRadiogroupModel
- QuestionRankingModel
- QuestionRatingModel
- RenderedRatingItem
- QuestionSignaturePadModel
- QuestionTagboxModel
- QuestionTextModel
- TextAreaModel
- ItemValue (this class handles checkbox items, radio items, and matrix columns)

# Survey Model (Platform-Independent Part)

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

A platform-independent survey model for SurveyJS Form Library. This package should be used with one of platform-specific UI rendering packages. Refer to the following Get Started tutorials for more information:

- [Angular](https://surveyjs.io/Documentation/Library?id=get-started-angular)
- [React](https://surveyjs.io/Documentation/Library?id=get-started-react)
- [Vue](https://surveyjs.io/Documentation/Library?id=get-started-vue)
- [HTML/CSS/JavaScript](https://surveyjs.io/form-library/documentation/get-started-html-css-javascript)

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/Documentation/Library)
- [Live Examples](https://surveyjs.io/Examples/Library)
- [What's New](https://surveyjs.io/WhatsNew)

## Build Survey Model from Sources

1.  **Clone the repo**

    ```
    git clone https://github.com/surveyjs/survey-library.git
    cd survey-library/packages/survey-core
    ```

2.  **Install dependencies**  
    Make sure that you have Node.js v16 or later and a compatible npm version installed.

        ```
        npm install
        ```

3.  **Build the library**

    ```
    npm run build:all
    ```

    You can find the built scripts and style sheets in folders under the `build` directory.

4.  **Run unit tests**

    ```
    npm run test
    ```

    The unit tests use [Karma](https://karma-runner.github.io/6.3/index.html).

After that, you can build one of the UI packages:

- [Angular Form Library](../survey-angular-ui/README.md#build-surveyjs-angular-form-library-from-sources)
- [React Form Library](../survey-react-ui/README.md#build-surveyjs-react-form-library-from-sources)
- [Vue Form Library](../survey-vue3-ui/README.md#build-surveyjs-vue-form-library-from-sources)
- [HTML/CSS/JS Form Library](../survey-js-ui/README.md#build-surveyjs-form-library-ui-from-sources)

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).
