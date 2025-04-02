import { checkLibraryVersion } from "@bateman001/form-core";

export * from "./react-ui-model";
export {
  SurveyModel,
  SurveyWindowModel,
  SurveyModel as Model,
  settings,
  ISurveyEnvironment,
  surveyLocalization,
  surveyStrings
} from "@bateman001/form-core";

checkLibraryVersion(`${process.env.VERSION}`, "form-react");
