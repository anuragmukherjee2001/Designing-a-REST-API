import mongoose from "mongoose";

// const DB_URI = process.env.DB_URI
// const URL_DB = "mongo://localhost:27017/Ecommerce"

const connectDatabase = () => {
	mongoose
		.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then((data) => {
			console.log("DataBase is connected");
		})
		
};

export default connectDatabase