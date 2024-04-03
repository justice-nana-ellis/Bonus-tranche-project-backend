import { createCombinedHandler } from "cds-routing-handlers";
import { Service } from "@sap/cds/apis/services";
import { BonusActionHandler } from "../../src/handlers/bonus/bonus.action";

module.exports = (srv: Service) => {
    const combinedHandler = createCombinedHandler({
        handler: [
           //BonusHandler,
           BonusActionHandler
        ],
        middlewares: []
    });
    combinedHandler(srv);
};