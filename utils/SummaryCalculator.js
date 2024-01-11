import DailyActivity from "../models/DailyActivity.js";

async function getLeadsForCurrentMonthByUser(userId) {
  try {
    // Get the current month and year
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based
    const currentYear = new Date().getFullYear();

    // Fetch daily activities for the current month for a specific user
    const userDailyActivities = await DailyActivity.find({
      user: userId,
      createdAt: {
        $gte: new Date(`${currentYear}-${currentMonth}-01`),
        $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
      }
    });

    // Initialize counters for target and converted leads
    let totalTargetLeads = 0;
    let totalConvertedLeads = 0;
    // Iterate through user's daily activities
    for (const activity of userDailyActivities) {
      // Increment counters based on daily activity data
      totalTargetLeads += activity.targetLeads;
      totalConvertedLeads += activity.convertedLeads;
    }

    // Return the results for the specific user
    return { userId, totalTargetLeads, totalConvertedLeads };
  } catch (error) {
    // Handle any errors
    console.error(`Error fetching daily activities for user ${userId}:`, error);
    throw error;
  }
}
export default getLeadsForCurrentMonthByUser;
