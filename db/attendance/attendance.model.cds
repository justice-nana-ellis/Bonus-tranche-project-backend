namespace com.bonus.attendance;
using com.bonus.employee as employee from '../employee/employee.model';

entity Attendance {
    key ID:         UUID @(Core.Computed : true);
    employee:       Association to employee.Employee;
    start_date:     Date;
    end_date:       Date;
}