// /server/models/Transfer.js

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Transfer extends Model {}

Transfer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // asset_id (what was transferred)
    // source_base_id (from where)
    // dest_base_id (to where)
    // user_id (who authorized it)
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("Pending", "In-Transit", "Completed", "Cancelled"),
      defaultValue: "Completed",
    },
  },
  {
    sequelize,
    modelName: "Transfer",
    tableName: "transfers",
    timestamps: true,
  }
);

module.exports = Transfer;
