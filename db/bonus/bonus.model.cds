namespace com.bonus.bonus;
using com.bonus.target as target from '../target/target.model';
using com.bonus.participant as participant from '../participant/participant.model';
using { managed } from '@sap/cds/common';

// CALCULATION OF THE BONUS OF IS DONE WHEN IS LOCKED
// THE ITEMS ARE PROVIDED BY THE FRONTEND/ADMIN
// THE TARGET IS AN ARRAY OF INDIVIDAUL OBJECTS - USE THAT AND CREATE THEM IN THE TARGET TABLE

entity Bonus : managed {
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


