import { Container } from 'typedi';
import { Application } from 'express';

import { useContainer } from 'cds-routing-handlers';
import cds from '@sap/cds';
import proxy from '@sap/cds-odata-v2-adapter-proxy';
import "reflect-metadata";
import { exec } from 'child_process';

// - enable dependency injection
useContainer(Container);

const logger = cds.log("server")

cds.on('bootstrap', (app: Application) => {
  // app.use(proxy({ caseInsensitive: true }));
});

cds.on('served', () => {
  try {
    console.log("Server started")
  } catch (error) {
    logger.error("Error on served: " + error)
  }
})

cds.on('shutdown', async () => {
  console.log(`server shutdown at:` + Date())
  //await restartServer()
});

// async function restartServer() {
//   console.log('Restarting the server...');
//   // await exec("npm run start:dev", (error, stdout, stderr) => {
//   await exec("cf rs sovanta-innovation-factory-backend-srv", (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error restarting server: ${error.message}`);
//       return;
//     }
//     console.log(`Server restarted successfully.`, stdout);
//   });
// }

module.exports = cds.server;
