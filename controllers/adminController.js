import catchAsync from "../utils/catchAsync.js";
import User from "../models/User.js";
import getLeadsForCurrentMonthByUser from "../utils/SummaryCalculator.js";
import DailyActivity from "../models/DailyActivity.js";
import AppError from "../utils/AppError.js";

// Complete Info
export const getAgentProfile = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user)
    {
       throw (new AppError("No such user", 404));
    }
    else
    {
        return (
            res.json({
                success: true,
                user:user,
                message: 'Agent profile'
            })
        )
    }
});

// Limited Info
export const getAllAgentsProfiles = catchAsync(async (req, res, next) => {
    const users=await User.find({role:'agent'});
    return (
        res.json({
            success: true,
            users:users,
            message: 'Agent profiles',
            length:users.length,
        })
    )
});

export const createActivity = catchAsync(async (req, res, next) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate()+ 1);
    currentDate.setMilliseconds(currentDate.getMilliseconds() - 1);
    const alreadyCreated= await DailyActivity.findOne({
        createdAt: {
            $gte: new Date().getDate(),
            $lt: currentDate,
        },user:req.body.user
    })
    console.log(alreadyCreated);
    if(alreadyCreated)
    {
        throw  new AppError("Activity for this user is already created for edit kindly edit the existing one",404);
    }
    const activity={
        user:req.body.user,
        targetLeads : req.body.targetLeads,
    }
    const newActivity = await DailyActivity.create(activity);
    

    return (
        res.status(201).json({
            success: true,
            message: 'Activity created successfully',
            activity: newActivity
        })
    )
});

// Of particular Date
export const getSummaryByDate = catchAsync(async (req, res, next) => {
    // Extract the date from the request parameters and convert it to a date object
    const requestedDate = new Date(req.params.date);
    console.log(requestedDate)
    // Set the date to the next day and subtract 1 millisecond to get the end of the day
    requestedDate.setDate(requestedDate.getDate() + 1);
    requestedDate.setMilliseconds(requestedDate.getMilliseconds() - 1);
    // console.log(requestedDate)
    // Find DailyActivity documents created on the specified date
    const activities = await DailyActivity.find({
        createdAt: {
            $gte: new Date(req.params.date),
            $lt: requestedDate,
        }
    }).populate('user');

    console.log(activities.map(activity => activity.createdAt));

    if (!activities || activities.length === 0) {
        throw new AppError("No activities found for the mentioned date", 404);
    } else {
        return res.status(201).json({
            success: true,
            message: 'Summary for the date ' + requestedDate.toISOString().split('T')[0],
            activity: activities,
        });
    }
});






export const getMonthSummary = catchAsync(async (req, res, next) => {
    const date = new Date();
    const m = date.getMonth();
    
    const users = await User.find({role:'agent'});
    const details = await Promise.all(users.map( async user =>{
        return await getLeadsForCurrentMonthByUser(user.id);
    })
    );
    return res.json({
        success:true,
        message:"details fetched successfully",
        monthlySummary:details
    });
    
});