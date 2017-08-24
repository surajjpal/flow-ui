import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[] = null): any {
    let keys = [];
    console.log('Pipe value: ' + value);

    value.forEach((k: string, v: string) => {
      keys.push({ key: v, value: k });  // for some resone forEach reverses key value
    });

    console.log('Pipe keys:' + keys);
    return keys;
  }
}
