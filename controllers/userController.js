import DailyActivity from "../models/DailyActivity.js";
import Lead from "../models/Lead.js";
import Note from "../models/Note.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js"

export const startWorking = catchAsync(async (req, res, next) => {
    const newActivity = await DailyActivity.findOneAndUpdate(
        {user: req.user},
        {startTime: new Date().getTime(), status: 'active'},
        {new:true}
      );
      res.status(200).json({ success: true, data: newActivity });
});

export const pauseWorking = catchAsync(async (req, res, next) => {
    const rest = {
        reason: req.body.reason,
        time: new Date().getTime(),
    };

    // Fetch the activity to get the startTime
    const activity = await DailyActivity.findOne({ user: req.user, status: 'active' });

    if (!activity) {
        return res.status(404).json({ success: false, message: 'No active activity found for the user' });
    }

    const startTime = activity.startTime;

    // Perform the update
    const updatedActivity = await DailyActivity.findOneAndUpdate(
        { user: req.user, status: 'active' },
        { $set: { status: 'paused' }, $inc: { numberOfHours: new Date().getTime() - startTime }, $push: { breaks: rest } },
        { new: true }
    );

    res.status(200).json({ success: true, activity: updatedActivity });
});


export const resumeWorking = catchAsync(async (req, res, next) => {
    const activity = await DailyActivity.findOneAndUpdate(
        { user: req.user, status: 'paused' },
        {  startTime:new Date().getTime() , status:'active' },
        { new: true }
    );
    res.status(200).json({ success: true, activity: activity });
});

export const endWorking = catchAsync(async (req, res, next) => {
    // Fetch the activity to get the startTime
    const activity = await DailyActivity.findOne({ user: req.user, status: 'active' });

    if (!activity) {
        return res.status(404).json({ success: false, message: 'No active activity found for the user' });
    }

    const startTime = activity.startTime;

    // Perform the update
    const updatedActivity = await DailyActivity.findOneAndUpdate(
        { user: req.user, status: 'active' },
        { $set: { status: 'inactive' }, $inc: { numberOfHours: new Date().getTime() - startTime } },
        { new: true }
    );

    res.status(200).json({ success: true, activity: updatedActivity });
});

export const createLead = catchAsync(async (req, res, next) => {
    const createdLead =  await Lead.create({name:req.body.name , contact:req.body.contact , user:req.user});
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate()+ 1);
    currentDate.setMilliseconds(currentDate.getMilliseconds() - 1);
    const activity = await DailyActivity.findOne({
        createdAt: {
            $gte: new Date().getDate(),
            $lt: currentDate,
        },user:req.user
    })
    
    if(!activity)
    {
        throw  new AppError("No activity found",404);
    }
    else
    {activity.convertedLeads+=1;
    const note = await Note.create(req.body.note);
    createdLead.notes.push(note);
    await createdLead.save();
    await activity.save();
    res.json({ success: true, createdLead: createdLead});}
});

export const getLeads = catchAsync(async (req, res, next) => {
    const leads = await Lead.find({user: req.user}).populate('notes');
    res.json({ success: true, leads:leads});
});
