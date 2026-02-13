const config = require("./config/env");
const { connectToDatabase } = require("./db/connection");
const app = require("./app");

async function bootstrap() {
  await connectToDatabase();

  app.listen(config.app.port, () => {
    console.log(`Portfolio server running at http://localhost:${config.app.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Server bootstrap failed:", error.message);
  process.exit(1);
});
