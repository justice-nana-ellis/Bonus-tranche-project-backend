namespace com.bonus.department;
using { cuid } from '@sap/cds/common';


entity Department: cuid {
    key ID:             UUID @(Core.Computed : true);
    name:               String;
    department_bonus:   Double;
}