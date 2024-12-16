const user = require("../models/user");
const { sendActivationEmail } = require("../utils/SendEmail");
const { sendResetPasswordEmail } = require("./../utils/SendEmail");
const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
exports.signup = async (req, res) => {
  try {
    const createdUser = await user.create(req.body); //create user from the info in req.body
    const userToken = await createdUser.createActivationToken(); //HERE we create the activation token
    await sendActivationEmail({
      email: createdUser.email,
      token: userToken,
    });
    createdUser.save({ validateBeforeSave: false });
    res.send("done");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const currentUser = await user
      .findOne({ email })
      .select("+password status");
    console.log(currentUser);
    if (!currentUser) {
      return res.status(500).send("user not found");
    }
    const correctPassword = await currentUser.correctPassword(
      password,
      currentUser.password
    );
    console.log(correctPassword);
    if (!correctPassword) {
      return res.status(500).send("wrong password");
    }
    if (currentUser.status === "inactive") {
      return res.status(500).send("user is inactive");
    }
    const userToken = jwt.sign(
      {
        id: currentUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: 3 * 24 * 60 * 60 * 1000,
      }
    );
    res.send(userToken);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const curruntUser = await user.findOne({ email });
    if (!curruntUser) {
      res.status(500).send("there is no user found");
      return;
    }
    const userToken = curruntUser.createPasswordRestToken();
    sendResetPasswordEmail({
      email: curruntUser.email,
      restToken: userToken,
    });
    curruntUser.save({ validateBeforeSave: false });
    res.send("done");
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.resendactivationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUser = await user.findOne({ email });
    if (!currentUser) {
      res.status(500).send("there is no user found");
      return;
    }
    const userToken = currentUser.createActivationToken(); // take the token from method in user model
    await sendActivationEmail({
      // make activate for email
      email: currentUser.email,
      token: userToken,
      name: currentUser.userName,
    });
    currentUser.save({ validateBeforeSave: false });
    console.log(userToken);
    res.send("done");
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { email, token } = req.body;
    const currUser = await user.findOne({ email });

    if (!currUser) {
      res.status(500).send("the user does not exist");
      return;
    }

    const tokenHashed = crypto.createHash("sha256").update(token).digest("hex");
    if (currUser.activationToken !== tokenHashed) {
      res.status(500).send("the token does not match");
      return;
    }
    currUser.status = "active";
    currUser.save({ validateBeforeSave: false });
    res.send("done");
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, password, confirmPassword } = req.body;
    const currrUser = await user.findOne({ email }).select("+password");
    if (!currrUser) {
      res.status(500).send("there is no user found");
      return;
    }
    const newToken = crypto.createHash("sha256").update(token).digest("hex");
    if (currrUser.passwordResetToken !== newToken) {
      res.status(500).send("token not match");
      return;
    }

    currrUser.password = password;
    currrUser.confirmPassword = confirmPassword;

    currrUser.save();
    res.send(currrUser.password);
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.me = async (req, res) => {
  const token = req.headers["authorization"];
  const userToken = token.split(" ")[1];
  const { id } = jwtDecode(userToken);
  console.log(id);
  console.log(id);

  const currenttUser = await user.findOne({ _id: id });
  if (!currenttUser) {
    res.status(500).send("user not found");
    return;
  }
  res.send(currenttUser);
  //console.log(token)
};

exports.deleteCurrentUser = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).send("Authorization token missing");

    const userToken = token.split(" ")[1];
    const { id } = jwtDecode(userToken);

    const deletedUser = await user.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).send("User not found");

    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

exports.updateCurrentUser = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).send("Authorization token missing");

    const userToken = token.split(" ")[1];
    const { id } = jwtDecode(userToken);

    const updatedUser = await user.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).send("User not found");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
