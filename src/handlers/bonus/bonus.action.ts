import { Action, Handler, ParamObj, Req } from 'cds-routing-handlers';
import { Employee, Employee_ } from '../../../@cds-models/com/bonus/employee';
import { Bonus } from '../../../@cds-models/com/bonus/bonus';
import { Participant } from '../../../@cds-models/com/bonus/participant';
import { Department } from '../../../@cds-models/com/bonus/department';
import { Target } from '../../../@cds-models/com/bonus/target';
import cds, { Request } from '@sap/cds';
import { Service } from 'typedi';

const logger =  cds.log('createBonus');
//@ts-ignore
@Handler()
@Service()
export class BonusActionHandler {
  //@ts-ignore
  @Action('createbonus')
  public async createBonus (
    //@ts-ignore
    @Req() req: Request,
  ) : Promise<any> {
    logger.info('Create Bonus Handler')
    try {
      const bonus = { ...req.data };
      const targets = bonus?.target;
      
      const [result] = await INSERT.into(Bonus.name).entries(bonus);
      const insertedBonus = await SELECT.from(Bonus).where({
        ID: result.ID,
      });
      //console.log("INSERTED BONUS",insertedBonus[0].ID);
    
     targets.map(async(target_: any) => {      
         target_.bonus_ID = insertedBonus[0].ID
         const [result] = await INSERT.into(Target).entries(target_);
      });

     const employees = await SELECT.from(Employee_.name);
     //console.log('EMPLOYEES!!!!!!!', employees);
      for (let i = 0; i <= employees.length-1; i++) {
           const employee_department = await SELECT.from(Department.name).where({
           ID: employees[i].department_ID,
         });
    
         await INSERT.into(Participant.name).entries({
          localId: employees[i].ID,
          //@ts-ignore
          name: employees[i].first_name + " " + employees[i].last_name,
          bonus_ID: insertedBonus[0].ID,
          status: insertedBonus[0].status,
          location: insertedBonus[0].location,
          startDate: insertedBonus[0].beginDate,
          endDate: insertedBonus[0].endDate,
          weight: insertedBonus[0].trancheWeight,
          department: employee_department[0].name,
          excluded: false,
          final_amount: 0.00,
          calculated_amount: 0.00,
          justification: ""
        });
      }
      return "Bonus & Participants Created Successfully 🎊";
    } catch (error) {
      //console.log(error);
      
    }
    
  }
}
