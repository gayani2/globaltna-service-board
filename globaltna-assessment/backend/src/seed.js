/**
 * Seed Script
 * Run: npm run seed
 * Clears the jobRequests collection and inserts 10 sample documents.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const JobRequest = require("./models/JobRequest");

const sampleJobs = [
  {
    title: "Leaking kitchen tap needs fixing",
    description: "My kitchen tap has been dripping for two weeks. The drip has gotten worse and I can hear it from the next room. Need someone ASAP.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Sarah Mitchell",
    contactEmail: "sarah.mitchell@example.com",
    status: "Open",
  },
  {
    title: "Faulty plug socket in living room",
    description: "One of my double sockets sparks when I plug something in. It's been tripping the breaker occasionally. Would like it replaced safely.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "James Patel",
    contactEmail: "james.patel@example.com",
    status: "Open",
  },
  {
    title: "Full exterior house repaint",
    description: "Looking for quotes to repaint the exterior of a 3-bed semi-detached. Render walls, white finish preferred. Scaffolding may be needed.",
    category: "Painting",
    location: "Manchester",
    contactName: "Anna Byrne",
    contactEmail: "anna.byrne@example.com",
    status: "In Progress",
  },
  {
    title: "Garden gate hinge replacement",
    description: "The wooden garden gate has two broken hinges and the latch is bent. Needs to be re-hung properly so it closes flush.",
    category: "Joinery",
    location: "Leeds",
    contactName: "Tom Okafor",
    contactEmail: "tom.okafor@example.com",
    status: "Open",
  },
  {
    title: "Bathroom ceiling light stopped working",
    description: "The ceiling light in the main bathroom has stopped working. Changed the bulb but still nothing. Could be the fixture or wiring.",
    category: "Electrical",
    location: "Birmingham",
    contactName: "Claire Hughes",
    contactEmail: "claire.hughes@example.com",
    status: "Open",
  },
  {
    title: "Kitchen interior refresh – walls and ceiling",
    description: "Kitchen needs a full repaint. Ceiling is smoke-stained and the walls are marked. Would like eggshell finish on walls, matt white ceiling.",
    category: "Painting",
    location: "Glasgow",
    contactName: "Derek Saunders",
    contactEmail: "derek.saunders@example.com",
    status: "Closed",
  },
  {
    title: "Burst pipe under kitchen sink",
    description: "Woke up this morning to water under the sink. The pipe connecting to the waste has split. Need an emergency fix today if possible.",
    category: "Plumbing",
    location: "London",
    contactName: "Maria Costa",
    contactEmail: "maria.costa@example.com",
    status: "In Progress",
  },
  {
    title: "Bespoke wardrobe fitted in master bedroom",
    description: "Need a carpenter to build and fit a floor-to-ceiling wardrobe in the master bedroom alcove. Approx 2.2m wide, painted MDF finish.",
    category: "Joinery",
    location: "Bristol",
    contactName: "Oliver Tan",
    contactEmail: "oliver.tan@example.com",
    status: "Open",
  },
  {
    title: "Consumer unit upgrade required",
    description: "Old fuse board needs replacing with a modern consumer unit with RCDs. House is a 4-bed. Part P certified electrician required.",
    category: "Electrical",
    location: "Sheffield",
    contactName: "Priya Nair",
    contactEmail: "priya.nair@example.com",
    status: "Open",
  },
  {
    title: "Radiator making banging noises",
    description: "Two radiators upstairs make loud banging noises when the heating comes on. The system was last serviced 5 years ago and may need bleeding or balancing.",
    category: "Plumbing",
    location: "Newcastle",
    contactName: "Gary Walsh",
    contactEmail: "gary.walsh@example.com",
    status: "Open",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await JobRequest.deleteMany({});
    console.log("🗑️  Cleared existing job requests");

    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`🌱 Seeded ${inserted.length} job requests`);

    await mongoose.disconnect();
    console.log("✅ Done. Database connection closed.");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
