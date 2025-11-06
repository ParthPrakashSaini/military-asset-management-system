// /server/models/Purchase.js

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Purchase extends Model {}

Purchase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // base_id (where it was purchased)
    // asset_id (what was purchased)
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // We should log who made the purchase
    // user_id
  },
  {
    sequelize,
    modelName: "Purchase",
    tableName: "purchases",
    timestamps: true, // automatically adds createdAt/updatedAt
  }
);

module.exports = Purchase;
