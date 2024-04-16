namespace com.bonus.attendance;
using com.bonus.employee as employee from '../employee/employee.model';

entity Attendance {
    employee:       Association to employee.Employee;
    start_date:     Date;
    end_date:       Date;
}