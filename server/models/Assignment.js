// /server/models/Assignment.js

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Assignment extends Model {}

Assignment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // base_id (where it was assigned from)
    // asset_id (what was assigned)
    // user_id (who made the assignment)
    personnel_name: {
      type: DataTypes.STRING,
      allowNull: false, // Could be a unit name or individual
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    // 'true' means it was ammo fired, fuel used, etc.
    // 'false' means it's a rifle checked out to a soldier
    expended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Assignment",
    tableName: "assignments",
    timestamps: true,
  }
);

module.exports = Assignment;
