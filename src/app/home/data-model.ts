export class Question {
  questionId: string;
  questionLabel: string;
  questionType: string;
  selected: boolean;
  reportLabel: string;
  minutes: Number;
  response: QuestionResponse[];
  responseSelected: string;
}

export class RangeInfo {
  start: Number;
  end: Number;
  code: Number;
}

export class SelectItem {
  key: string;
  keyNumber: Number;
  label: string;
}

export class QuestionResponse {
  responseId: string;
  responseLabel: string;
  selected: boolean; // new
}

export type QuestionArray = Question[];

export type QuestionResponseArray = QuestionResponse[];

export type RangeInfoArray = RangeInfo[];

export type SelectItemArray = SelectItem[];
