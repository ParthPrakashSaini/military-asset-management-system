// /server/models/index.js

const { sequelize } = require("../config/db");
const User = require("./User");
const Base = require("./Base");
const Asset = require("./Asset");
const Inventory = require("./Inventory");
const Purchase = require("./Purchase");
const Transfer = require("./Transfer");
const Assignment = require("./Assignment");
const Log = require("./Log");

// --- Define Relationships ---

// User <-> Log (One-to-Many)
User.hasMany(Log, { foreignKey: "user_id" });
Log.belongsTo(User, { foreignKey: "user_id" });

// User <-> Transactions (One-to-Many)
User.hasMany(Purchase, { foreignKey: "user_id" });
Purchase.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Transfer, { foreignKey: "user_id" });
Transfer.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Assignment, { foreignKey: "user_id" });
Assignment.belongsTo(User, { foreignKey: "user_id" });

// Base <-> Inventory (One-to-Many)
Base.hasMany(Inventory, { foreignKey: "base_id" });
Inventory.belongsTo(Base, { foreignKey: "base_id" });

// Asset <-> Inventory (One-to-Many)
Asset.hasMany(Inventory, { foreignKey: "asset_id" });
Inventory.belongsTo(Asset, { foreignKey: "asset_id" });

// Base <-> Purchase (One-to-Many)
Base.hasMany(Purchase, { foreignKey: "base_id" });
Purchase.belongsTo(Base, { foreignKey: "base_id" });

// Asset <-> Purchase (One-to-Many)
Asset.hasMany(Purchase, { foreignKey: "asset_id" });
Purchase.belongsTo(Asset, { foreignKey: "asset_id" });

// Base <-> Assignment (One-to-Many)
Base.hasMany(Assignment, { foreignKey: "base_id" });
Assignment.belongsTo(Base, { foreignKey: "base_id" });

// Asset <-> Assignment (One-to-Many)
Asset.hasMany(Assignment, { foreignKey: "asset_id" });
Assignment.belongsTo(Asset, { foreignKey: "asset_id" });

// Base <-> Transfer (Source and Destination)
Base.hasMany(Transfer, { foreignKey: "source_base_id", as: "SourceTransfers" });
Transfer.belongsTo(Base, { foreignKey: "source_base_id", as: "SourceBase" });

Base.hasMany(Transfer, {
  foreignKey: "dest_base_id",
  as: "DestinationTransfers",
});
Transfer.belongsTo(Base, { foreignKey: "dest_base_id", as: "DestinationBase" });

// Asset <-> Transfer (One-to-Many)
Asset.hasMany(Transfer, { foreignKey: "asset_id" });
Transfer.belongsTo(Asset, { foreignKey: "asset_id" });

// --- Export All Models ---
module.exports = {
  sequelize,
  User,
  Base,
  Asset,
  Inventory,
  Purchase,
  Transfer,
  Assignment,
  Log,
};
