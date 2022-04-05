import { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';

function displayDuration(duration: number): string {
  let str = '';
  const days = Math.trunc(duration / 1000 / 60 / 60 / 24);
  const hours = Math.trunc((duration / 1000 / 60 / 60) % 24);
  const minutes = Math.trunc((duration / 1000 / 60) % 60);
  const seconds = Math.trunc((duration / 1000) % 60);
  const milliseconds = duration % 1000;
  days > 0 && (str += days + ' days ');
  hours > 0 && (str += hours + ' h ');
  minutes > 0 && (str += minutes + ' min ');
  seconds > 0 && (str += seconds + ' s ');
  milliseconds > 0 && (str += milliseconds + ' ms');
  return str;
}

class JsonReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private dateBegin = Date.now();

  onTestEnd(test: TestCase, result: TestResult) {
    switch (result.status) {
      case 'passed':
        this.passed++;
        break;
      case 'failed':
      case 'timedOut':
        this.failed++;
        break;
      case 'skipped':
        this.skipped++;
        break;
    }
  }

  onEnd(result: FullResult) {
    console.log(`::set-output name=success::${result.status === 'passed'}`);
    console.log(`::set-output name=total::${this.passed + this.failed + this.skipped}`);
    console.log(`::set-output name=duration::${displayDuration(Date.now() - this.dateBegin)}`);
    console.log(`::set-output name=passed::${this.passed}`);
    console.log(`::set-output name=failed::${this.failed}`);
    console.log(`::set-output name=skipped::${this.skipped}`);
  }
}

export default JsonReporter;
