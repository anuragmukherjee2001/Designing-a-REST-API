import Joi from "joi";
import { User, RefreshToken } from "../../models";
import CustonErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService";

const loginController = {
	async login(req, res, next) {
		const loginSchema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string()
				.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
				.required(),
		});

		const { error } = loginSchema.validate(req.body);

		if (error) {
			return next(error);
		}

		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user) {
				return next(CustonErrorHandler.cannotFindUser());
			}

			const matched = await bcrypt.compare(req.body.password, user.password);

			if (!matched) {
				return next(CustonErrorHandler.cannotFindUser());
			}

			// Token Generation

			const accessToken = JwtService.sign({
				_id: user._id,
				role: user.role,
			});

			const refreshToken = JwtService.sign({
				_id:user.id,
				role: user.role
			}, '1y', process.env.REFRESH_SECRET)


			await RefreshToken.create({token:refreshToken});

            res.json({accessToken, refreshToken}) 

		} catch (error) {
			return next(error);
		}
	},

	async logout(req, res, next){

		const refreshSchema = Joi.object({
			refresh_token: Joi.string().required(),
		  });
	  
		  const { error } = refreshSchema.validate(req.body);
	  
		  if (error) {
			return next(error);
		  }

		try {
			
			await RefreshToken.deleteOne({token:req.body.refreshToken});

		} catch (error) {
			return next(error);
		}

		res.json({status:1})

	}
};

export default loginController;
