namespace com.bonus.employee;
using { cuid } from '@sap/cds/common';

using com.bonus.department as department from '../department/department.model';

entity Employee: cuid {
    key ID:             UUID @(Core.Computed : true);
    first_name:         String;
    last_name:          String;
    email:              String;
    department:         Association to department.Department;
    bonus_percentage:   Double;
}