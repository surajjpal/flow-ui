import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

import { Episode } from '../../auto.model';

declare let moment: any;

@Pipe({
    name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

    transform(array: Episode[], query: string): Episode[] {
        if (query) {
            return _.filter(array, row => {
                let result = false;
                if (row) {
                    for (const property in row) {
                        if (property) {
                            result = result || this.matchQuery(row, property, query);
                        }
                    }

                    if (!result && row.hasOwnProperty('_source') && row['_source']) {
                        const source = row['_source'];
                        for (const property in source) {
                            if (property) {
                                result = result || this.matchQuery(source, property, query);
                            }
                        }

                        if (!result && source.hasOwnProperty('intents') && source['intents']) {
                            const intents = source['intents'];
                            for (const property in intents) {
                                if (property) {
                                    result = result || this.matchQuery(intents, property, query);
                                }
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
                let value = source[property];
                
                if (value instanceof String || typeof value === 'string') {
                    if (property.indexOf('startTime') || property.indexOf('endTime')) {
                        value = moment(value).format('dd/MM/y, h:mm:ss a');
                    }

                    return value.toLowerCase().indexOf(query.toLowerCase()) > -1;
                }
                if (value instanceof Array) {
                    for (let innerValue of value) {
                        
                        if (innerValue instanceof String || typeof innerValue === 'string') {
                            if (property.indexOf('startTime') || property.indexOf('endTime')) {
                                innerValue = moment(innerValue).format('dd/MM/y, h:mm:ss a');
                            }
                            
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
