import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            // console.log('Query: ' + query);
            return _.filter(array, row => {
                // console.log('Machine Type: ' + row.machineType + ', Version: ' + row.version + ', Status Code: ' + row.statusCd);
                // console.log('Query Output: ' + ((row.machineType.indexOf(query) > -1) || (row.version.indexOf(query) > -1) || (row.statusCd.indexOf(query) > -1)));
                return ((row.machineType.toLowerCase().indexOf(query.toLowerCase()) > -1) || (row.version.toLowerCase().indexOf(query.toLowerCase()) > -1) || (row.statusCd.toLowerCase().indexOf(query.toLowerCase()) > -1));
            });
        }
        return array;
    }
}