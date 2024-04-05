// Importing the necessary modules using TypeScript syntax
import Strapi from "@strapi/strapi";
import fs from "fs";

// Declaring the instance variable with a type. We use `any` here due to the lack of specific types for the Strapi instance.
let instance: any;

async function setupStrapi(): Promise<any> {
  if (!instance) {
    // Assuming Strapi().load() correctly initializes and returns the Strapi instance.
    // You might need to adjust this depending on the actual API and how you're supposed to use Strapi in a testing environment.
    instance = await Strapi().load();
    console.log("strapi is here:",Strapi().load() )

    await instance.server.mount();
  }
  return instance;
}

async function cleanupStrapi(): Promise<void> {
  if (!instance) {
    console.warn('Strapi instance not found');
    return;
  }

  const dbSettings = instance.config.get("database.connection");

  // Close server to release the database file
  await instance.server.httpServer.close();

  // Close the connection to the database before deletion
  await instance.db.connection.destroy();

  // Delete test database after all tests have completed
  if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
    const tmpDbFile = dbSettings.connection.filename;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
}

// Exporting the functions using TypeScript syntax
export { setupStrapi, cleanupStrapi };
