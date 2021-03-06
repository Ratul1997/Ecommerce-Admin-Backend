const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const authQuerry = require("../../Querry/authQuerry/authQuerry");
const {
	registerSchema,
	loginSchema,
} = require("../../helpers/ValidationSchema/authSchema");
const {
	encryptPassword,
	decreyptPassword,
} = require("../../helpers/ValidationSchema/encrypt");
const {
	matchTokenInfo,
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	deleteRefreshToken,
} = require("../../helpers/jwt_helper/jwt_token");
const HTTPStatus = require("../../HTTPStatus");

router.post("/register", async (req, res, next) => {
	// console.log(req.body);

	try {
		// validate eamil , password using joi
		console.log(req.body);
		const { name, phonenumber, email, password } =
			await registerSchema.validateAsync(req.body);
        
		// if (!email || !password) throw createError.BadRequest();

		// check user exist in database by email
		const UserExist = await authQuerry.isUserExist(email, phonenumber);
		if (UserExist.length > 0) {
			// res.send(UserExist[0].email);
			// if exist  send error conflict user already exist
			throw createError.Conflict("User already exist");
		} else {
			// crpty password
			const hashPassword = await encryptPassword(password);

			//  save user
			const response = await authQuerry.saveUser(
				name,
				phonenumber,
				email,
				hashPassword
			);
            const userId = response.insertId
            
			// generate access token for user
			if (!response) {
				throw createError.InternalServerError();
			}
			const accessToken = await signAccessToken(userId,email);

			// generate refresh token for user
			const refreshToken = await signRefreshToken(userId,email);
			// console.log("response", typeof toString(insertId));
			// now send sucess message
			res.status(HTTPStatus.CREATED).json({
				status: "Successful",
				message: "account created successfully",
				email:email,
				accessToken: accessToken,
				refreshToken: refreshToken,
			});
		}
	} catch (err) {
		if (err.isJoi == true) {
			// err.status = 422;
			next(createError.UnprocessableEntity(err.message));
		}
		next(err);
	}
});

router.post("/login", async (req, res, next) => {
	try {
		const { email, password } = await loginSchema.validateAsync(req.body);
		// check is user exist
		const UserExist = await authQuerry.isUserExist(email);
		if (UserExist.length > 0) {
			const { first_name, phone_number } = UserExist;
			// if exist, match password
			const isMatch = await decreyptPassword(password, UserExist[0].password);
			if (isMatch === true) {
				// successfully match now create token
				const accessToken = await signAccessToken(UserExist[0].id,email);

				// generate refresh token for user
				const refreshToken = await signRefreshToken(UserExist[0].id,email);
				// now send token

				res.status(HTTPStatus.OK).json({
					status: "successfull",
					message: `Wellcome back ${email}`,
					id:UserExist[0].id,
					email:email,
					firstName:UserExist[0].first_name?UserExist[0].first_name:null,
					lastName:UserExist[0].last_name?UserExist[0].last_name:null,
					profilePic:UserExist[0].profile_img?UserExist[0].profile_img:null,
					accessToken: accessToken,
					refreshToken: refreshToken,
				});
			} else {
				throw createError.NotFound("Username or password not valid");
			}
		} else {
			throw createError.NotFound("Username or password not valid");
		}
	} catch (err) {
		if (err.isJoi === true)
			next(createError.BadRequest("Invalid email/password"));
		next(err);
	}
});

router.post("/refresh-token", async (req, res, next) => {
	try {
		const { refreshToken } = req.body;
		// check req contain refersh token else bad request
		if (!refreshToken) {
			next(createError.BadRequest());
		}
		// get email
		const {userId,userEmail} = await verifyRefreshToken(refreshToken);
		// create new pair of accessToken and Refresh Token
		// console.log(email);
		const newAccessToken = await signAccessToken(userId,userEmail);
		const newRefreshToken = await signRefreshToken(userId,userEmail);

		res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
	} catch (err) {
		next(err);
	}
});

router.get('/testToken/:id', verifyAccessToken,async(req,res,next)=>{
	const userId= req.params.id
	const {authData} = req
	const data =await matchTokenInfo(userId,authData)
	if(data){
	res.status(HTTPStatus.OK).json({
		message:"Authorized User"
	})
    
	}
	else{
		next(createError.Unauthorized())
	}
	
   
})

router.post("/logout", async (req, res, next) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			next(createError.BadRequest());
		}
		const  {userId,userEmail} = await verifyRefreshToken(refreshToken);
		if (!userEmail) {
			next(createError.BadRequest());
		}
		const response = await deleteRefreshToken(userEmail);
		if (response) {
			res.status(202).json({
				status: 202,
				message: "Logout succssfully",
			});
		}
	} catch (err) {
		next(err);
	}
});

module.exports = router;
