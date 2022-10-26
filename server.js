import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";
import connectDatabase from "./config/database"

dotenv.config({ path: "config/config.env" });

const app = express();

app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

connectDatabase();

app.listen(process.env.PORT, () => {
	console.log("Hello");
});
