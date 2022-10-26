import Joi from "joi";
import {RefreshToken, User} from "../../models"
import bcrypt from "bcrypt"
import CustonErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
// import {REFRESH_SECRET} from "../../config/config.env";

const registerController = {
	async register(req, res, next) {
		const registerSchema = Joi.object({
			name: Joi.string().min(3).max(30).required(),
			email: Joi.string().email().required(),
			password: Joi.string()
				.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
				.required(),
			repeat_password: Joi.ref("password"),
		});

		// console.log(req.body);
		const { error } = registerSchema.validate(req.body);
        // console.log(error);

		if (error) {
			return next(error);
		}

        // if user aready exists or not

        try {
            const exist = await User.exists({email: req.body.email});
            if(exist){
                return next(CustonErrorHandler.alreadyExist("Email Already Exists"));
            }
            
        } catch (error) {
            return next(error);
        }


		// Hashing the password

		const {name, email, password} = req.body;

		const hashedPass = await bcrypt.hash(password, 10);

		

		const user= new User({
			name,
			email,
			password: hashedPass
		})

		let accessToken;
		let refreshToken;
		try {
			const result = await user.save();

			accessToken = JwtService.sign({
				_id: result._id,
				role: result.role
			})

			refreshToken = JwtService.sign({
				_id:result.id,
				role: result.role
			}, '1y', process.env.REFRESH_SECRET)


			await RefreshToken.create({token:refreshToken});

		} catch (err) {
			return next(err);
		}

		res.json({
			accessToken,
			refreshToken
		});
	},
};

export default registerController;
