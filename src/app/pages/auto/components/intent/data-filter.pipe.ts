import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

import { IntentData } from '../../auto.model';

declare let moment: any;

@Pipe({
    name: 'dataFilter'
})
export class IntentDataFilterPipe implements PipeTransform {

    transform(array: IntentData[], query: string): IntentData[] {
        if (query) {
            return _.filter(array, row => {
                let result = false;
                if (row) {
                    for (const property in row) {
                        if (property) {
                            result = result || this.matchQuery(row, property, query);
                        }
                    }

                    if (!result && row.hasOwnProperty('body')) {
                        for (const property in row['body']) {
                            if (property) {
                                result = result || this.matchQuery(row['body'], property, query);
                            }
                        }
                    }
                }
                return result;
            });
        }
        return array;
    }

    private matchQuery(source: any, property: any, query: string): boolean {
        if (source && property && query) {
            if (source.hasOwnProperty(property) && source[property]) {
                const value = source[property];

                if (value instanceof String || typeof value === 'string' || typeof value === 'number') {
                    return value.toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
                }
                if (value instanceof Array) {
                    for (const innerValue of value) {
                        if (innerValue instanceof String || typeof innerValue === 'string') {
                            const result = innerValue.toLowerCase().indexOf(query.toLowerCase()) > -1;
                            if (result) {
                                return result;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }
}
