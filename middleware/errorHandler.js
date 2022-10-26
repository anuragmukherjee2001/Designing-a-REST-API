import express from "express";
import dotenv from "dotenv";
import { ValidationError } from "joi";
import CustonErrorHandler from "../services/CustomErrorHandler";
dotenv.config({ path: "../config/config.env" });

const errorHandler = (err, req, res, next) => {
	let statusCode = 500;
	let data = {
		message: "Internal server Error",
		...(process.env.DEBUG_MODE === "true" && { originalError: err.message }),
	};

	if (err instanceof ValidationError) {
		statusCode = 422;
		data = {
			message: err.message,
		};
	}

	if (err instanceof CustonErrorHandler) {
		statusCode = err.status;
		data = { 
            message: err.message
        };
	}

	return res.status(422).json(data);
};

export default errorHandler;
