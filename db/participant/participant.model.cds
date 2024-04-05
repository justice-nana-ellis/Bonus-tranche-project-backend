namespace com.bonus.participant;
using com.bonus.bonus as bonus from '../bonus/bonus.model';

entity Participant {
    key ID :                UUID @(Core.Computed : true);
    localId:                String;
    name:                   String;
    department:             String;
    bonus:                  Association to bonus.Bonus;
    status:                 Status;
    location:               String;
    startDate:              Date;
    endDate:                Date;
    weight:                 Double;
    calculated_amount:      Double;
    final_amount:           Double;
    excluded:               Boolean default false;
    justification:          String;
    overruled:              Boolean default false; 
}

type Status : String enum {
    locked; 
    running;
    completed; 
}