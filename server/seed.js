// /server/seed.js

require("dotenv").config();
const { sequelize, User, Base, Asset, Inventory } = require("./models");

// Initial data
const users = [
  {
    name: "Admin User",
    email: "admin@mams.com",
    password_hash: "AdminPass123", // Hook will hash this
    role: "Admin",
  },
  {
    name: "Cmdr. Sarah Johnson",
    email: "sarah.j@mams.com",
    password_hash: "BasePass123",
    role: "Base Commander",
  },
  {
    name: "Logistics Officer Mike",
    email: "mike.l@mams.com",
    password_hash: "LogiPass123",
    role: "Logistics Officer",
  },
];

const bases = [
  { name: "Base Alpha", location: "Sector 1" },
  { name: "Base Bravo", location: "Sector 4" },
  { name: "Forward Operating Base (FOB)", location: "Sector 7" },
];

const assets = [
  { name: "M4 Rifle", type: "Weapon", unit: "units" },
  { name: "Humvee", type: "Vehicle", unit: "units" },
  { name: "5.56mm Rounds", type: "Ammunition", unit: "rounds" },
  { name: "Medical Kit", type: "Supply", unit: "kits" },
  { name: "JP-8 Fuel", type: "Fuel", unit: "liters" },
];

// The seed function
const seedDatabase = async () => {
  console.log("Seeding database...");
  try {
    // Force: true will drop all tables and recreate them
    await sequelize.sync({ force: true });
    console.log("Database synced (forced).");

    // Create records
    const createdBases = await Base.bulkCreate(bases, { returning: true });
    const createdAssets = await Asset.bulkCreate(assets, { returning: true });
    await User.bulkCreate(users, { individualHooks: true });
    console.log("Created Users, Bases, and Assets.");

    // Create initial inventory records
    // Give Base Alpha some assets
    const baseAlpha = createdBases[0];
    const rifleAsset = createdAssets[0];
    const humveeAsset = createdAssets[1];
    const ammoAsset = createdAssets[2];
    const fuelAsset = createdAssets[4];

    await Inventory.bulkCreate([
      {
        base_id: baseAlpha.id,
        asset_id: rifleAsset.id,
        opening_balance: 500,
        closing_balance: 500,
      },
      {
        base_id: baseAlpha.id,
        asset_id: humveeAsset.id,
        opening_balance: 50,
        closing_balance: 50,
      },
      {
        base_id: baseAlpha.id,
        asset_id: ammoAsset.id,
        opening_balance: 100000,
        closing_balance: 100000,
      },
      {
        base_id: baseAlpha.id,
        asset_id: fuelAsset.id,
        opening_balance: 50000,
        closing_balance: 50000,
      },
    ]);

    // Give Base Bravo some assets
    const baseBravo = createdBases[1];
    await Inventory.bulkCreate([
      {
        base_id: baseBravo.id,
        asset_id: rifleAsset.id,
        opening_balance: 300,
        closing_balance: 300,
      },
      {
        base_id: baseBravo.id,
        asset_id: fuelAsset.id,
        opening_balance: 20000,
        closing_balance: 20000,
      },
    ]);

    console.log("Initial inventory created.");
    console.log("Database seeded successfully! 🌱");
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

// Run the seed function
seedDatabase();
