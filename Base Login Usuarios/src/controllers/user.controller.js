import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const { username, email, state } = req.query;
    const filter = {
      state: 1
    };

    if (username) {
      filter.username = { $regex: new RegExp(username, "i") };
    }
    if (email) {
      filter.email = { $regex: new RegExp(email, "i") };
    }
    if (state !== undefined) {
      filter.state = state;
    }

    const users = await User.find(filter);
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const encryptedPassword = await User.encryptPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: encryptedPassword
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const isCurrentUser = userId === req.userId;

    if (!isCurrentUser) {
      return res.status(403).json({ error: "Permission denied. You are not allowed to update this user." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};