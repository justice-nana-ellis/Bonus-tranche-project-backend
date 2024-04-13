import "reflect-metadata";


import { Action, Handler, Req } from 'cds-routing-handlers';
import { Employee_ } from '../../../@cds-models/com/bonus/employee';
import { Bonu, Bonus } from '../../../@cds-models/com/bonus/bonus';
import { Attendance } from '../../../@cds-models/com/bonus/attendance';
import { Participant, Participant_ } from '../../../@cds-models/com/bonus/participant';
import { Department } from '../../../@cds-models/com/bonus/department';
import { Target } from '../../../@cds-models/com/bonus/target';
import cds, { Request, log } from '@sap/cds';
import { Service } from 'typedi';

const logger =  cds.log('Bonus Handlers 🪘🌄');

@Handler()
@Service()
export class BonusActionHandler {
  @Action('createbonus')
  public async createBonus (
    @Req() req: Request,
  ) : Promise<any> {
    logger.info('Create Bonus Handler 🪘🌄')
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
      return "Bonus & Participants Created Successfully 🪘🌄";
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
    logger.info('Edit Bonus Handler 🪘🌄')
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
  
        await Promise.all(
          targets.map(async(target_: any) => {      
            target_.bonus_ID = bonus.id
            await INSERT.into(Target).entries(target_);
          })
        );

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

        await Promise.all(
            participant__.map(async(participant: any) => { 
              await UPDATE(Participant.name, participant.ID).with({ ...participant });
            })
        );
      }
      return "Bonus & Targets Edit Successfully 🪘🌄";
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
    logger.info('Delete Bonus Handler 🪘🎊')
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

@Handler()
@Service()
export class LockBonusHandler {
  @Action('lockbonus')
  public async lockBonus (
    @Req() req: Request,
  ) : Promise<any> {
    logger.info('Lock Bonus Handler 🪘🌄')
    try {
      const bonus = { ...req.data };
      await UPDATE(Bonus.name, bonus.id).with({ status: "locked" });
      
      const participants = await SELECT.from(Participant.name).where({
        bonus_ID: bonus.id
      });
      let sum = 0;
      const targets_: Target[] = await SELECT.from(Target.name).where({
        bonus_ID: bonus.id
      });
      let sum_ = targets_.reduce((acc, target) => {
        return acc + target.weight
      }, 0);
      
      if (100 > sum_ || sum_ > 100) return "Target Weight must sum up to 100 ⚠️"
  
      await Promise.all(
        participants.map(async(participant_: any) => {   
          const department_bonus = await SELECT.from(Department.name).where({ name: participant_.department });
          const attendance = await SELECT.from(Attendance.name).where({
            employee_ID: participant_.localId
          });
          // employee general attendance
          let end_ = new Date(attendance[0].end_date);
          let start_ = new Date(attendance[0].start_date);
          
          const bonus_: Bonu | any = await SELECT.from(Bonus).where({
            ID: bonus.id
          });
          
          const payout_ = department_bonus[0].department_bonus * (bonus_[0].trancheWeight/100);
          console.log("PAYOUT",payout_);
          
          // duration of taranche
          let start__ = new Date(bonus_[0].beginDate);
          let end__ = new Date(bonus_[0].endDate);
          const duration__: any = (end__.getTime() - start__.getTime())/(1000 * 3600 * 24);
          
          let start___;
          let end___;
          console.log("B-S",start__, "B.E", end__, "A.S",start_, "A.E",end_);
          
          if ( start_ < start__ && start__ < end_) {
            start___ = start__
          } else if (start__ < start_ && start_ < end__) {
            start___ = start_ 
          } else if (start__ === start_) {
            start___ = start_ 
          } 

          if(end__ > end_) {
            end___ = end_
          } else if (end__ < end_) {
            end___ = end__
          } else {
            end___ = end_
          } 
          //console.log("THE END", end___);
          
          start___ = new Date(start___)
          end___ = new Date(end___)
          let att_dur_tranche: number = (end___.getTime() - start___.getTime())/(1000 * 3600 * 24);
          
          const ratio = att_dur_tranche/duration__
          //console.log("BONUS RATIO",ratio);
          
          const sum = targets_.reduce((acc, target) => {
            return acc + (payout_ * ratio * (target.achievement/100) * (target.weight/100));
          }, 0);
          //console.log("SUM", sum);
          
          await UPDATE(Participant.name, participant_.ID).with({ calculated_amount: Math.floor(sum) });
        })
      );
    
      return "Bonus Locked Successfully 🔒🪘";
    } catch (error) {
      logger.error('Error in lockbonus:', error);
      throw error;
    }
  }
}

@Handler()
@Service()
export class ExcludeParticipantHandler {
  @Action('exclude')
  public async lockBonus (
    @Req() req: Request,
  ) : Promise<any> {
    logger.info('Exclude Paticipant Handler 🪘🎊')
    try {
      const participant = { ...req.data };
      await UPDATE(Participant.name, participant.id).with({ excluded: true, final_amount: 0 })
      return "Paticipant Excluded Successfully 🪘🎊";
    } catch (error) {
      logger.error('Error in lockbonus:', error);
      throw error;
    }
  }
}

@Handler()
@Service()
export class OverridePayoutHandler {
  @Action('override')
  public async override (
    @Req() req: Request,
  ) : Promise<any> {
    logger.info('Override Payout Handler 🪘🎊')
    try {
      const override = { ...req.data };
      await UPDATE(Participant.name, override.id).with({ overruled: true, final_amount: override.amount, justification: override.justification })
      return "Override Payout Successfully 🪘🎊";
    } catch (error) {
      logger.error('Error in override payout:', error);
      throw error;
    }
  }
}