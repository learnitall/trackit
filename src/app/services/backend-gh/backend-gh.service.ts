import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import { throttling } from '@octokit/plugin-throttling';
import { VERSION } from '../../version';
import { BackendService } from '../backend/backend.service';
import { DataStoreGHService } from '../datastore-gh/datastore-gh.service';

@Injectable({
  providedIn: 'root'
})
export class BackendGHService extends BackendService {

  private octokit: Octokit = null;
  constructor(public dataStoreGHService: DataStoreGHService) { 
    super(); 
  }

  createOctokit(pat: string): void {
    this.octokit = new Octokit({
      userAgent: `studyit ${VERSION}`,
      baseUrl: "https://api.github.com",
      auth: pat,
      log: {
        debug: () => {},
        info: console.info,
        warn: console.warn,
        error: console.error
      },
      throttle: {
        onRateLimit: (retryAfter, options) => {
          this.octokit.log.warn(
            `Request quota exhausted for request ${options.method} ${options.url}`
          );
    
          if (options.request.retryCount === 0) {
            // only retries once
            this.octokit.log.info(`Retrying after ${retryAfter} seconds!`);
            return true;
          }
        },
        onAbuseLimit: (retryAfter, options) => {
          // does not retry, only logs a warning
          this.octokit.log.warn(
            `Abuse detected for request ${options.method} ${options.url}`
          );
        },
      },
      retry: {
        doNotRetry: ["429"],
      },
    });
  }

  async init() {
    this.createOctokit(await this.dataStoreGHService.getCreds());
  }

  async testAuth(): Promise<boolean> {
    if (this.octokit == null) {
      return false;
    }
    const repoPromise: Promise<any> = this.octokit.repos.listForAuthenticatedUser();
    return repoPromise.then(
      function(result) {
        console.log("Successfully authenticated using PAT.");
        return true;
      },
      function(error) {
        console.log(`Unable to authenticate using PAT: ${error.status}`);
        if (error.exception !== "") console.log(error.exception);
        return false;
      }
    )
  }
  async testRepo(): Promise<boolean> {
    if (this.octokit == null) {
      return false;
    }
    const repoList = await this.octokit.repos.listForAuthenticatedUser({
      visibility: "private",
      affiliation: "owner"
    });
    var repoName = await this.dataStoreGHService.getConfig();
    var foundRepo: boolean = false;
  
    repoList.data.forEach(item => {
      if (item.full_name == repoName) {
        foundRepo = true;
      }
    });

    return foundRepo;
  }
  async test(): Promise<boolean> { return await this.testAuth() && await this.testRepo() }

  async getEvents(): Promise<CalendarEvent[]> { return null; }
  async setEvents(events: CalendarEvent[]) {}

}
