import pino from "pino";
import app from "./lib/app.mjs";

const { PORT = 8888 } = process.env;

const logger = pino();

app.set("logger", logger);


/**
 * Start the server
 */
app.listen(PORT, function () {
  logger.info("Listening on port %s", PORT);
});


