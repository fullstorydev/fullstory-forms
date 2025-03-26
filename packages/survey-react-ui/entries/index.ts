import { checkLibraryVersion } from "fullstory-form-core";

export * from "./react-ui-model";
export {
  SurveyModel,
  SurveyWindowModel,
  SurveyModel as Model,
  settings,
  ISurveyEnvironment,
  surveyLocalization,
  surveyStrings
} from "fullstory-form-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-react-ui");
