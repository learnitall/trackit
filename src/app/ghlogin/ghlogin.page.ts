import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataStoreGHService } from '../services/datastore-gh/datastore-gh.service';
import { BackendGHService } from '../services/backend-gh/backend-gh.service';

@Component({
  selector: 'app-ghlogin',
  templateUrl: './ghlogin.page.html',
  styleUrls: ['./ghlogin.page.scss'],
})
export class GhloginPage implements OnInit {

  public ghloginForm: FormGroup;
  public submitAttempt: boolean = false;
  public buttonDisabled: boolean = false;
  public statusText: string = "";
  public statusColor: string = "danger";
  public statusValue = 0;
  public statusBuffer = 1;
  public numTasks = 3;
  public taskPercentage = 1 / (this.numTasks + 1);

  public existingLogin: boolean;
  public configuredRepo: string;

  constructor(
    public formBuilder: FormBuilder, 
    public dataStoreGHService: DataStoreGHService,
    public backendGHService: BackendGHService
  ) { 
    this.ghloginForm = formBuilder.group({
      ghpr: [
        '',
        Validators.compose([
          Validators.required, 
          Validators.pattern('^.+\/.+$')
        ])
      ],
      ghpat: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9\_\:]{40}$')
        ])
      ]
    });

    this.resetAlreadyLoggedIn();
    this.checkAlreadyLoggedIn();
  }

  async checkAlreadyLoggedIn() {
    if (
      await this.backendGHService.testAuth() && 
      await this.backendGHService.testRepo()
    ) {
      this.existingLogin = true;
      this.configuredRepo = await this.dataStoreGHService.getConfig();
    }
  }

  resetAlreadyLoggedIn() {
    this.existingLogin = false;
    this.configuredRepo = "";
  }

  startProgress() {
    this.statusBuffer = 0;
    this.statusValue = 0;
    this.statusColor = "secondary";
    this.ghloginForm.disable();
    this.buttonDisabled = true;
  }

  stopProgress() {
    this.statusBuffer = 1;
    this.ghloginForm.enable();
    this.buttonDisabled = false;
  }

  errorHappened(msg: string) {
    this.statusColor = "danger";
    this.statusText = msg;
  }

  successHappened(msg: string) {
    this.statusColor = "success";
    this.statusText = msg;
  }

  async doSaving(): Promise<boolean> {
    this.statusValue += this.taskPercentage;
    this.statusText = "Saving...";
    
    if (
      await this.dataStoreGHService.setCreds(this.ghloginForm.value.ghpat) &&
      await this.dataStoreGHService.setConfig(this.ghloginForm.value.ghpr)
    ) {
      return true;
    } else {
      this.errorHappened("Unable to save given configuration.");
      return false;
    }
  }

  async doPAT(): Promise<boolean> {
    this.statusValue += this.taskPercentage;
    this.statusText = "Checking PAT...";
    var _this = this;
    await this.backendGHService.init();
    if (await this.backendGHService.testAuth()) {
      return true;
    } else {
      _this.errorHappened("Unable to authenticate using given PAT.");
      return false;
    }
  }

  async doRepo(): Promise<boolean> {
    this.statusValue += this.taskPercentage;
    this.statusText = "Checking for private repo...";
    var _this = this;
    if (await this.backendGHService.testRepo()) {
      return true;
    } else {
      _this.errorHappened("Unable to find given private repository.");
      return false;
    }
  }

  async save() {
    this.submitAttempt = true;
    this.resetAlreadyLoggedIn();
    var result: boolean;

    if (this.ghloginForm.valid) {
      this.startProgress();
      var result: boolean = (  // order matters here
        await this.doSaving() && 
        await this.doPAT() && 
        await this.doRepo()
      );
    } else {
      this.errorHappened("Please check input again, something doesn't look right.");
      result = false;
    }

    this.stopProgress();
    if (result) {
      this.statusValue += this.taskPercentage;
      this.successHappened("Everything looks good!");
    }

  }

  ngOnInit() {
  }

}
