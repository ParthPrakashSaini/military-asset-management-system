// /server/models/Inventory.js

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Inventory extends Model {}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Foreign keys will be added by associations
    // base_id
    // asset_id
    opening_balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    closing_balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // We can add more fields here if needed, e.g., 'last_updated'
  },
  {
    sequelize,
    modelName: "Inventory",
    tableName: "inventory",
    timestamps: true, // Shows when the record was last updated
    // Create a unique key on base_id and asset_id
    // This ensures you can only have one row for "Rifles at Base Alpha"
    indexes: [
      {
        unique: true,
        fields: ["base_id", "asset_id"],
      },
    ],
  }
);

module.exports = Inventory;
