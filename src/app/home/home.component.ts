import { Component } from "@angular/core";

import { User } from "../_models";
import { AccountService } from "../_services";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { map } from "rxjs/operators";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {
  Question,
  QuestionArray,
  RangeInfoArray,
  QuestionResponseArray
} from "./data-model";
import { questionJson } from "./questions";
import { query } from "@angular/animations";
import { rangeDataJSON } from "./range-data";

const reducer = (accumulator, currentValue) =>
  Number(accumulator) + Number(currentValue);

@Component({ templateUrl: "home.component.html" })
export class HomeComponent {

    dropdownSettings :IDropdownSettings;


  between(x, min, max) {
    return x >= min && x <= max;
  }

  

  findRange() {}

  totalTime() {}

  user: User;

  questionsForm: FormGroup;

  questionData: QuestionArray;

  rangeData: RangeInfoArray;

  totalMinutes: number = 0;

  // myFormValueChanges$;

  ngOnInit() {
    this.questionFormInit();

     this.dropdownSettings = {
      singleSelection: false,
      idField: 'responseId',
      textField: 'responseLabel',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };

   

    // this.myFormValueChanges$ = this.questionsForm.controls[
    //   "minutes"
    // ].valueChanges;
    // // subscribe to the stream so listen to changes on units
    // this.myFormValueChanges$.subscribe(minutes =>
    //   this.updateTotalMinutes(minutes)
    // );

    // console.log(this.billingDataFA);
    // console.log(this.questionsForm);
  }

  questionFormInit() {
    this.questionData = questionJson;
    this.rangeData = rangeDataJSON;
    this.questionsForm = this.builder.group({
      billingData: this.getQuestionArray(this.questionData),
      totalMinutes: { value: this.totalMinutes, disabled: true }
    });

     // console.log(this.billingData.controls);

    this.questionsForm.get("billingData").valueChanges.subscribe(questions => {
      //   questions.filter(question => question.minutes).reduce(function (acc, score) {
      //   return acc + score;
      //  }, 0  )
      // this.totalMinutes = questions.filter(question => question.minutes)
      // .map(q=> q.minutes)
      // .reduce( reducer, 0);
      // console.log()
      this.questionsForm.get("totalMinutes").patchValue(
        questions
          .filter(question => question.minutes)
          .map(q => q.minutes)
          .reduce(reducer, 0)
      );
    });
  }

  constructor(
    private builder: FormBuilder,
    private accountService: AccountService
  ) {
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
      responseSelected: 
      {
        value: questionInfo.responseSelected,
        disabled: true
      }
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

  getResponseLabel(data: any): string {
    
    const rowSelectedVal = data.controls.responseSelected.value;
  console.log(rowSelectedVal);
    // const label = this.getQuestionResponseJSON(data)
    //   .filter(row => row.responseId === rowSelectedVal)
    //   .map(row => row.responseLabel)[0];
    const label = rowSelectedVal.map(row => row.responseLabel);

    console.log(rowSelectedVal.map(row => row.responseLabel));

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

  isDropdownDisabled(question) {
       if (question.controls.selected.value) {
         return false;
       }
       else {
         return true;
       }
  }

  totalChange(question) {
    console.log("totalChange" + question.controls.minutes.value);
    if (question.controls.minutes.value) {
      let totalUnitPrice = question.controls.minutes.value;
      console.log(totalUnitPrice);
      this.totalMinutes += totalUnitPrice;

      console.log(this.totalMinutes);
      this.questionsForm.get("totalMinutes").patchValue(this.totalMinutes);
    }
  }

  /**
   * Update prices as soon as something changed on units group
   */
  // private updateTotalMinutes(minutes: any) {
  //   // get our units group controll
  //   const control = <FormArray>this.questionsForm.controls["minutes"];
  //   // before recount total price need to be reset.
  //   this.totalMinutes = 0;
  //   for (let i in minutes) {
  //     let totalUnitPrice = minutes[i].minutes;
  //     // // now format total price with angular currency pipe
  //     // let totalUnitPriceFormatted = this.currencyPipe.transform(
  //     //   totalUnitPrice,
  //     //   "USD",
  //     //   "symbol-narrow",
  //     //   "1.2-2"
  //     // );
  //     // // update total sum field on unit and do not emit event myFormValueChanges$ in this case on units
  //     // control
  //     //   .at(+i)
  //     //   .get("unitTotalPrice")
  //     //   .setValue(totalUnitPriceFormatted, {
  //     //     onlySelf: true,
  //     //     emitEvent: false
  //     //   });
  //     // update total price for all units
  //     this.totalMinutes += totalUnitPrice;
  //   }
  // }
}
