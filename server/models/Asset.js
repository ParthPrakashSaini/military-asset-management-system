// /server/models/Asset.js

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Asset extends Model {}

Asset.init(
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
    // We can categorize assets, e.g., 'Vehicle', 'Weapon', 'Ammunition'
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // e.g., 'units', 'rounds', 'liters'
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "units",
    },
  },
  {
    sequelize,
    modelName: "Asset",
    tableName: "assets",
    timestamps: false,
  }
);

module.exports = Asset;
