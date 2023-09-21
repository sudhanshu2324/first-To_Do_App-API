import ErrorHandler from "../middlewares/error.js";
import { TASK } from "../models/task.js";


export const newTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        await TASK.create({
            title: title,
            description: description,
            user: req.user,
        })
        res.status(200).json({
            success: true,
            message: "Your Task is added"
        })
    } catch (error) {
        next(error)
    }

}

export const getMyTask = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await TASK.find({ user: userId })
        res.status(200).json({
            success: true,
            tasks,
        })
    } catch (error) {
        next(error)
    }

}
export const updateTask = async (req, res, next) => {
    try {
        const task = await TASK.findById(req.params.id)

        if (!task) return next(new ErrorHandler("task not found", 404))
    
        task.isCompleted = !task.isCompleted

        await task.save()
        
        res.status(200).json({
            success: true,
            message: "Task Updated",
        })
    } catch (error) {
        next(error)
    }

}
export const deleteTask = async (req, res, next) => {
    try {
        const task = await TASK.findById(req.params.id);

        if (!task) return next(new ErrorHandler("task not found", 404))
    
        await task.deleteOne()
        
        res.status(200).json({
            success: true,
            message: "Task Deleted",
        })
    } catch (error) {
        next(error)
    }

}