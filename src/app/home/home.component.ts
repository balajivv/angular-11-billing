import { Component } from '@angular/core';

import { User } from '../_models';
import { AccountService } from '../_services';
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { map } from "rxjs/operators";
import {
  Question,
  QuestionArray,
  QuestionResponse,
  QuestionResponseArray
} from "./data-model";
import { questionJson } from "./questions";

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  
  user: User;

  questionsForm: FormGroup;

  questionData: QuestionArray;

  ngOnInit() {
    this.questionData = questionJson;

    this.questionsForm = this.builder.group({
      billingData: this.getQuestionArray(this.questionData)
    });

    // console.log(this.billingDataFA);
    // console.log(this.questionsForm);
  }

  constructor(private builder: FormBuilder, private accountService: AccountService) {
     this.user = this.accountService.userValue;
  }

  getQuestionArray(questionSInfo: QuestionArray): FormArray {
    return this.builder.array(
      questionSInfo.map(q => this.eachQuestionInForm(q), questionSInfo)
    );
  }

  eachQuestionInForm(questionInfo: Question): FormGroup {
    // console.log("questionInfo");
    // console.log(questionInfo);
    return this.builder.group({
      questionId: questionInfo.questionId,
      questionLabel: questionInfo.questionLabel,
      questionType: questionInfo.questionType,
      selected: questionInfo.selected,
      reportLabel: questionInfo.reportLabel,
      minutes: [
        {
          value: questionInfo.minutes,
          disabled: true
        }
      ],
      response: this.getResponseArray(questionInfo.response),
      responseSelected: [
        {
          value: questionInfo.responseSelected,
          disabled: true
        }
      ]
    });
  }

  getResponseArray(responses: QuestionResponseArray): FormArray {
    //  console.log("responses");

    return this.builder.array(
      responses.map(q => this.eachResponse(q), responses)
    );
  }

  eachResponse(responseInfo) {
    // console.log("responseInfo");
    // console.log(responseInfo);
    return this.builder.group({
      responseId: responseInfo.responseId,
      responseLabel: responseInfo.responseLabel,
      selected: responseInfo.selected,
      action: responseInfo.action
    });
  }

  get billingData(): FormArray {
    return this.questionsForm.get("billingData") as FormArray;
  }

  get billingDataFA(): FormArray {
    return this.questionsForm.get("billingData") as FormArray;
  }

  get BillingDataControls() {
    return (this.questionsForm.get("billingData") as FormGroup).controls;
  }

  controlAsFormControl(data: any): FormControl {
    console.log(data);
    return data.controls as FormControl;
  }

  controlAsFormGroup(data: any): FormGroup {
    // console.log(data);
    return data.controls as FormGroup;
  }

  getQuestionResponseJSON(data: any): QuestionResponseArray {
    // console.log("getQuestionResponseJSON");
    // console.log(data.controls.response.value);
    return data.controls.response.value as QuestionResponseArray;
  }

  getResponseLabel(data: any) : string {

    const rowSelectedVal = data.controls.responseSelected.value;

    const label = this.getQuestionResponseJSON(data).filter( row => 
      row.responseId===rowSelectedVal
    ).map(row => row.responseLabel)[0];

    console.log(label);

    
    return label;
  }

  checkboxchange(question) {
    if (question.controls.selected.value) {
      question.controls.minutes.enable();
      question.controls.responseSelected.enable();
    } else {
      question.controls.minutes.disable();
      question.controls.responseSelected.disable();
    }
  }
}