import { booking } from "../../models/Cabs/cab_booking_model.js";

import cron from "node-cron";
cron.schedule("*/10 * * * *", async () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    try {
      const result = await booking.updateMany(
        { status: "pending", created_at: { $lt: twoHoursAgo } },
        { $set: { status: "cancelled" } }
      );
  
      if (result.modifiedCount > 0) {
        console.log(`[CRON] Auto-cancelled ${result.modifiedCount} old pending bookings.`);
      }
    } catch (err) {
      console.error("[CRON] Error:", err.message);
    }
  });