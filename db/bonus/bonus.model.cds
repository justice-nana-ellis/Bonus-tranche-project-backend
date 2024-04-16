namespace com.bonus.bonus;
using com.bonus.target as target from '../target/target.model';
using com.bonus.participant as participant from '../participant/participant.model';
using { managed, cuid } from '@sap/cds/common';

entity Bonus : managed, cuid {
    key ID:         UUID @(Core.Computed : true);
    name:           String;
    location:       String;
    status:         Status;
    beginDate:      Date;
    endDate:        Date;
    description:    String;
    trancheWeight:  Double;
    participant:    Association to many participant.Participant on participant.bonus = $self;
    target:         Association to many target.Target on target.bonus = $self;
}

type Status : String enum {
    locked; 
    running;
    completed; 
}


