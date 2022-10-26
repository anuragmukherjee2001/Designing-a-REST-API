import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustonErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";

const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    let refreshtoken;
    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });

      if (!refreshtoken) {
        return next(
          CustonErrorHandler.unAuthorisedUser("Invalid Refresh Token")
        );
      }

      let userID;

      try {
        const { _id } = await JwtService.verify(
          refreshtoken.token,
          process.env.REFRESH_SECRET
        );
        userID = _id;
      } catch (error) {
        return next(
          CustonErrorHandler.unAuthorisedUser("Invalid Refresh Token")
        );
      }

      const user = await User.findOne({ _id: userID });
      if (!user) {
        return next(CustonErrorHandler.unAuthorisedUser("No user found"));
      }

      const accessToken = JwtService.sign({
        _id: user._id,
        role: user.role,
      });

      const refreshToken = JwtService.sign(
        {
          _id: user.id,
          role: user.role,
        },
        "1y",
        process.env.REFRESH_SECRET
      );

      await RefreshToken.create({ token: refreshToken });

      res.json({ accessToken, refreshToken });
    } catch (error) {
      return next(error);
    }
  },
};

export default refreshController;
