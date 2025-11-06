// /server/models/Base.js

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Base extends Model {}

Base.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true, // Location might be optional
    },
  },
  {
    sequelize,
    modelName: "Base",
    tableName: "bases",
    timestamps: false, // We don't really need timestamps for bases
  }
);

module.exports = Base;
