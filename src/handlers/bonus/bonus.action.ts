import "reflect-metadata";


import { Action, Handler, Req } from 'cds-routing-handlers';
import { Employee_ } from '../../../@cds-models/com/bonus/employee';
import { Bonus } from '../../../@cds-models/com/bonus/bonus';
import { Participant, Participant_ } from '../../../@cds-models/com/bonus/participant';
import { Department } from '../../../@cds-models/com/bonus/department';
import { Target } from '../../../@cds-models/com/bonus/target';
import cds, { Request, log } from '@sap/cds';
import { Service } from 'typedi';

const logger =  cds.log('createBonus');

@Handler()
@Service()
export class BonusActionHandler {
  @Action('createbonus')
  public async createBonus (
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
    
     targets.map(async(target_: any) => {      
         target_.bonus_ID = insertedBonus[0].ID
         await INSERT.into(Target).entries(target_);
      });

     const employees = await SELECT.from(Employee_.name);

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
      logger.error('Error in createbonus:', error);
      throw error;
    }
  }
}


@Handler()
@Service()
export class EditBonusHandler {
  @Action('editbonus')
  public async editBonus (
    @Req() req: Request,
  ) : Promise<any> {
    logger.info('Edit Bonus Handler')
    try {
      const bonus = { ...req.data };
      const targets = bonus?.target;

      await UPDATE(Bonus.name, bonus.id).with({ ...req.data });

      const bonus__ = await SELECT.from(Bonus).where({
        ID: bonus.id
      });

      if (bonus__[0]?.status === 'running' || bonus__[0]?.status === 'locked') {

        await DELETE(Target).where({
          bonus_ID: bonus.id,
        });
  
        const target__ = await targets.map(async(target_: any) => {      
          target_.bonus_ID = bonus.id
          await INSERT.into(Target).entries(target_);
        });
  
        await Promise.all(target__);

      } else if (bonus__[0]?.status === 'completed') {

        const participant__ = await SELECT.from(Participant_).where({
          bonus_ID: bonus.id
        });

        for (let i = 0; i < participant__.length-1; i++) {
          if (participant__[i].excluded === false && participant__[i].overruled === false) {
            participant__[i].final_amount = participant__[i].calculated_amount
          } else if (participant__[i].excluded === true) {
            participant__[i].final_amount = 0;
          }
        }
      }
      
      return "Bonus & Targets Edit Successfully 🎊";
    } catch (error) {
      logger.error('Error in editbonus:', error);
      throw error;
    }
  }
}

@Handler()
@Service()
export class DeleteBonusHandler {
  @Action('deletebonus')
  public async deleteBonus (
    @Req() req: Request,
  ) : Promise<any> {
    logger.info('Delete Bonus Handler')
    try {
      const bonus = { ...req.data };
    
      await DELETE(Bonus).where({
        ID: bonus.id,
      });
      
      await DELETE(Target).where({
        bonus_ID: bonus.id,
      });

      await DELETE(Participant).where({
        bonus_ID: bonus.id,
      });
    
      return "Bonus & Targets Delete Successfully 🎊";
    } catch (error) {
      logger.error('Error in deletebonus:', error);
      throw error;
    }
  }
}

