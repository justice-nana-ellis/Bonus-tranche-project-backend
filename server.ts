import "reflect-metadata";


import { Container } from 'typedi';
import { useContainer } from 'cds-routing-handlers';
import cds from '@sap/cds';

useContainer(Container);

const logger = cds.log("server")

cds.on('served', () => {
  try {
    console.log("Server started")
  } catch (error) {
    logger.error("Error on served: " + error)
  }
})

cds.on('shutdown', async () => {
  console.log(`server shutdown at:` + Date())
});

module.exports = cds.server;
