// /server/models/User.js

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const bcrypt = require("bcryptjs");

class User extends Model {
  // Instance method to check password
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password_hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Base Commander", "Logistics Officer"),
      allowNull: false,
      defaultValue: "Logistics Officer",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true, // Adds createdAt and updatedAt
    hooks: {
      // Hash password before user is created
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      // You can also add a beforeUpdate hook if you allow password changes
    },
  }
);

module.exports = User;
