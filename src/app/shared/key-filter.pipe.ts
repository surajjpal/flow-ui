import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
  transform(object, justKeys?: boolean): any {
    const keys = [];

    for (const property in object) {
      if (object.hasOwnProperty(property)) {
        if (justKeys) {
          keys.push(property);
        } else {
          keys.push({ key: property, value: object[property] });
        }
      }
    }

    return keys;
  }
}
