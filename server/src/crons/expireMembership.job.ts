import cron from "node-cron";
import User from "../models/user.model.js";

/**
 * Runs once a day at midnight — downgrades any membership whose
 * `membershipValidTill` has passed back to a free account.
 */
cron.schedule("0 0 * * *", async () => {
    const result = await User.updateMany(
        { isPremium: true, membershipValidTill: { $lt: new Date() } },
        { $set: { isPremium: false, memberShipType: null, membershipValidTill: null } }
    );

    if (result.modifiedCount > 0) {
        console.log(`Expired premium membership for ${result.modifiedCount} user(s)`);
    }
});
