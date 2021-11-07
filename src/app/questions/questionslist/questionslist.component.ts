import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AdminService } from 'src/app/shared/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-questionslist',
  templateUrl: './questionslist.component.html',
  styleUrls: ['./questionslist.component.css']
})
export class QuestionslistComponent implements OnInit {
  pageTitle: string= 'Questions List';
  TextBox:boolean = false;
  radioType:boolean = false;
  questionInfo:FormGroup;
  submitted = false;
  userId: any;
  isRowEdit:any;
  questionsList:any;
  rowId:any;
  radioQuestion: any = [];
  constructor(private spinner: NgxSpinnerService,
    private fb:FormBuilder,  
    private activatedRouterServices: ActivatedRoute,
    private toastr: NotificationService,
    private _adminService: AdminService,) {
    this.questionInfo = this.fb.group({
      qtnType: ['', Validators.required],
      question:['', Validators.required],
      radios: ['']
    })


   }


   get form(){
     return this.questionInfo.controls;
   }

  ngOnInit(): void {

    this.userId = localStorage.getItem("userId");
    this.getQuestionsList();
  }

  questionType(event:any){
    console.log("event", event.target.value);
    const trigger = event.target.value;
    if(trigger === 'TextBox'){
      this.TextBox = true;
      this.radioType = false;
    }else{
      this.TextBox = false;
      this.radioType = true;
    }
  }

  addPhone(): void {
    this.radioQuestion.push(this.questionInfo.value.radios);
    this.questionInfo.controls['radios'].reset();
   console.log(this.radioQuestion);
    // (this.questionInfo.get('radios') as FormArray).push(
    //   this.fb.control(null)
    // );
  }
  removePhone(index:any) {
    (this.questionInfo.get('radios') as FormArray).removeAt(index);
  }

  getPhonesFormControls(): AbstractControl[] {
    return (<FormArray> this.questionInfo.get('radios')).controls
  }

  getQuestionsList(){
    this.spinner.show();
    this._adminService.getQuestions(this.userId).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.questionsList = res.result;
        console.log("country countryList", this.questionsList);
      }
    })
  }

  onSubmit(){
    //console.log("questionInfo",this.questionInfo.value);

    this.submitted = true;
    this.spinner.show();
    if (this.questionInfo.invalid) {
      this.spinner.hide();
      return;
    }
    const obj = 
            {
              qtnType: this.questionInfo.value.qtnType,
              question: this.questionInfo.value.question,
              radios: this.radioQuestion
            }
 
    this._adminService.addQuestions(this.userId, obj).pipe(finalize(() => {
      this.spinner.hide();
    })).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.radioQuestion = [];
        this.radioType = false;
        this.toastr.showSuccess(res.message, 'Success');
        this.questionInfo.reset();
        this.getQuestionsList();
      }
    });


  }

  rowDelete(id: any) {
    console.log("delete", id);

    this._adminService.deleteQuestions(this.userId, id).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.toastr.showSuccess(result.message, 'Success');
       this.getQuestionsList();
      }
    });
  }

  editRow(row:any) {
    this.isRowEdit = true;
    console.log("row id", row.id);
    console.log("row", row);
    this.rowId = row.id;
    this.questionInfo.controls['qtnType'].setValue(row.qtnType);
    this.questionInfo.controls['question'].setValue(row.question);
    // this.selectCountry(row.name);
    console.log("rowupdated form value", this.questionInfo.value);
  }

}
