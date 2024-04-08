import "reflect-metadata";


import { createCombinedHandler } from "cds-routing-handlers";
import { Service } from "@sap/cds/apis/services";
import { BonusActionHandler, EditBonusHandler, DeleteBonusHandler, 
         LockBonusHandler, ExcludeParticipantHandler, OverridePayoutHandler } from "../../src/handlers/bonus/bonus.action";

module.exports = (srv: Service) => {
    const combinedHandler = createCombinedHandler({
        handler: [
           EditBonusHandler,
           BonusActionHandler,
           DeleteBonusHandler,
           LockBonusHandler,
           OverridePayoutHandler,
           ExcludeParticipantHandler
        ],
        middlewares: []
    });
    combinedHandler(srv);
};