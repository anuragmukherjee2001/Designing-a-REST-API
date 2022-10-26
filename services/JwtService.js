// import JWT_SECRET from "../config/config.env";
import Jwt from "jsonwebtoken";

class JwtService {
	static sign(payload, expiry = "60s", secret = process.env.JWT_SECRET) {
		return Jwt.sign(payload, secret, {
			expiresIn: expiry,
		});
	}

	static verify(token, secret = process.env.JWT_SECRET){
		return Jwt.verify(token, secret);
	}
}

export default JwtService;
