import cron from "node-cron";
import User from "../models/user.model";

cron.schedule("0 0 * * *", async () => {
  await User.updateMany(
    {
      isPremium: true,
      membershipValidity: { $lt: new Date() },
    },
    {
      $set: {
        isPremium: false,
        membershipType: "FREE",
        membershipValidity: null,
      },
    }
  );
});
