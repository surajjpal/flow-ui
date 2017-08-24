import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

    transform(array: Map<string, string>[], query: string): any {
        if (query) {
            const newMap = _.filter(array, row => {
                let result = false;
                if (row) {
                    row.forEach((key: string, value: string) => {
                        // console.log('Key: ' + key + ' Value: ' + value + ' Query: ' + query + ' Result: ' + (key.toLowerCase().indexOf(query.toLowerCase()) > -1));
                        if (key.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                            result = true;
                        }
                    });
                }
                return result;
            });

            console.log(newMap);
            return(newMap);
        }
        console.log(array);
        return array;
    }
}
