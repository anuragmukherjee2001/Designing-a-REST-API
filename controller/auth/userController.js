import { User } from "../../models";
import CustonErrorHandler from "../../services/CustomErrorHandler";

const userController = {
  async me(req, res, next) {
    try {
      const user = await User.findOne({
        _id: req.user._id,
      }).select('-password -updatedAt -__v');

      console.log(user);

      if (!user) {
        return next(CustonErrorHandler.userNotFound());
      }

      res.json(user);
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
