using com.bonus.bonus as bonus from '../../db/bonus/bonus.model';
using com.bonus.participant as participant from '../../db/participant/participant.model';
using com.bonus.target as target from '../../db/target/target.model';
using com.bonus.employee as employee from '../../db/employee/employee.model';
using com.bonus.attendance as attendance from '../../db/attendance/attendance.model';

using com.bonus.department as department from '../../db/department/department.model';

service BonusService @(path: '/bonus') {
    entity Bonus as projection on bonus.Bonus;
    entity Target as projection on target.Target;
    entity Employee as projection on employee.Employee;
    entity Attendance as projection on attendance.Attendance;
    entity Department as projection on department.Department;
    entity Participant as projection on participant.Participant;

    action createbonus (
        name: String,
        location: String,
        status: String,
        beginDate: String,
        endDate: String,
        description: String,
        trancheWeight: Integer,
        target: many Target
    ) returns String;

    action create_participant (
        localId: String,
        name: String,
        department: String,
        tranche: String,
        status: String,
        location: String,
        startDate: Date,
        endDate: Date,
        weight: String,
        calculated_amount: String,
        final_amount: String,
        extended: Boolean,
        justification: String,
    ) returns String;
   
};
