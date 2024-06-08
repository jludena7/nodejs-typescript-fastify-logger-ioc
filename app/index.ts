import app from "./app";
import { NUMBER } from "./src/common/constants/app.constants";
import ENV from "./src/common/env";
import appLogger from "./src/common/logger";

app.listen({ port: ENV.APP_PORT }, (error: Error): void => {
	if (error) {
		appLogger.info(`App error:`, error);
		process.exit(NUMBER.ONE);
	}
	appLogger.info(`App running on http://localhost:${ENV.APP_PORT}`);
});
