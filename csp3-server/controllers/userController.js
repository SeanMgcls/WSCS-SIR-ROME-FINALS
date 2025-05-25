const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);
const auth = require("../auth");

module.exports.registerUser = (req, res) => {
	// checks if the email is in the right format
	if (!req.body.email.includes("@")) {
		return res.status(400).send({ error: "Email invalid" });
	}
	// checks if the mobile number has the correct number of characters
	else if (req.body.mobileNo.length !== 11) {
		return res.status(400).send({ error: "Mobile number invalid" });
	}
	// checks if the password has at least 8 characters
	else if (req.body.password.length < 8) {
		return res.status(400).send({ error: "Password must be at least 8 characters" });
	}
	// if all needed formats are achieved
	else {
		let newUser = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			mobileNo: req.body.mobileNo,
			password: bcrypt.hashSync(req.body.password, 10)
		});
		newUser.save()
			.then((user) => res.status(201).send({ message: "Registered Successfully" }))
			.catch(err => res.status(500).send({ error: "Error in saving" }));
	}
};

module.exports.loginUser = (req, res) => {
	if (req.body.email.includes("@")) {
		User.findOne({ email: req.body.email })
			.then(result => {
				if (result == null) {
					return res.status(404).send({ error: "No Email Found" });
				} else {
					const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
					if (isPasswordCorrect) {
						return res.status(200).send({ access: auth.createAccessToken(result) });
					} else {
						return res.status(401).send({ error: "Email and password do not match" });
					}
				}
			})
			.catch(err => res.status(500).send({ error: "Error in find" }));
	}
	else {
		return res.status(400).send({ error: "Invalid Email" });
	}
};

module.exports.getProfile = (req, res) => {
	const userId = req.user.id;

	return User.findById(userId)
		.then(user => {
			if (!user) {
				return res.status(404).send({ error: 'User not found' });
			}
			user.password = undefined;
			return res.status(200).send(user);
		})
		.catch(err => res.status(500).send({ error: 'Failed to fetch user profile', details: err }));
};

module.exports.resetPassword = async (req, res) => {
	const userId = req.user.id;
	const { newPassword } = req.body;

	try {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
		await User.findByIdAndUpdate(userId, { password: hashedPassword });
		res.status(200).send({ message: 'Password reset successful' });
	} catch (err) {
		res.status(500).send({ error: 'Failed to reset password', details: err.message });
	}
};

module.exports.setAsAdmin = (req, res) => {
	console.log(req.params.id);
	return User.findById(req.params.id)
		.then(result => {
			console.log(result);
			if (result === null) {
				return res.status(404).send({ error: "User not Found" });
			} else {
				result.isAdmin = true;
				return result.save()
					.then((updatedUser) => res.status(200).send({ updatedUser }))
					.catch(err => res.status(500).send({ error: 'Failed in Saving', details: err }));
			}
		})
		.catch(err => res.status(500).send({ error: 'Failed in Find', details: err }));
};

module.exports.editProfile = async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, email, mobileNo, image } = req.body;

  // Optional: validate fields as in registerUser
  if (email && !email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" });
  }
  if (mobileNo && mobileNo.length !== 11) {
    return res.status(400).send({ error: "Mobile number invalid" });
  }
  // Optionally, validate image URL format here.

  try {
    // Only update provided fields
    const updateFields = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (email !== undefined) updateFields.email = email;
    if (mobileNo !== undefined) updateFields.mobileNo = mobileNo;
    if (image !== undefined) updateFields.image = image;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).send({ error: "User not found" });
    }

    return res.status(200).send({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).send({ error: "Failed to update profile", details: err.message });
  }
};