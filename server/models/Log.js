// /server/models/Log.js

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Log extends Model {}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // user_id (who did it)
    action: {
      type: DataTypes.STRING, // e.g., 'LOGIN_SUCCESS', 'CREATE_PURCHASE', 'UPDATE_TRANSFER'
      allowNull: false,
    },
    entity: {
      type: DataTypes.STRING, // e.g., 'Purchase', 'User', 'Asset'
      allowNull: true,
    },
    record_id: {
      type: DataTypes.INTEGER, // The ID of the Purchase, User, etc.
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT, // Optional: more details, e.g., old/new values
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Log",
    tableName: "logs",
    timestamps: false, // We have our own timestamp
  }
);

module.exports = Log;
