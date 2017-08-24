import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
  transform(object, args: string[] = null): any {
    const keys = [];
    // console.log('Pipe value: ' + object);

    for (const property in object) {
      if (object.hasOwnProperty(property)) {
        keys.push({ key: property, value: object[property] });
      }
    }

    // object.forEach((k: string, v: string) => {
    //   keys.push({ key: v, value: k });  // for some resone forEach reverses key value
    // });

    // console.log('Pipe keys:' + keys);
    return keys;
  }
}
