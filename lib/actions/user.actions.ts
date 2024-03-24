"use server"


import { CreateUserParams,UpdateUserParams } from '@/types';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import User from '../database/models/user.model';
import Order from '../database/models/order.model';
import Event from '../database/models/event.model';
import { revalidatePath } from 'next/cache';
// import { createUser } from './user.actions';

//Here i have structured in a way that ensures that before any operation (create, read, update, delete) on a user is performed, the connection to the database is established. This approach is common in many server-side applications where it's necessary to establish a connection to the database before performing any database operation.
//Before performing any database operation, each function calls the connectToDatabase() function to establish a connection.



//====================================================Create
//This function takes a user object as input, connects to the database, creates a new user using the User.create() method, and then returns the newly created user after converting it to JSON format.

export const createUser = async (user: CreateUserParams) => {
    try {
        await connectToDatabase();
        const newUser = await User.create(user);

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error)
    }
}

//====================================================READ
//This function retrieves a user by their ID. It first connects to the database, then finds the user by ID using User.findById(), and returns the user if found, otherwise throws an error.
export async function getUserById(userId: string) {
    try {
        await connectToDatabase()

        const user = await User.findById(userId)

        if (!user) throw new Error('User not found')
        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        handleError(error)
    }
}
//====================================================UPDATE
//This function updates a user with the given clerkId using the provided user object. It connects to the database, finds the user by clerkId using User.findOneAndUpdate(), updates the user, and returns the updated user.

export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        await connectToDatabase()

        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

        if (!updatedUser) throw new Error('User update failed')
        return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
        handleError(error)
    }
}


//====================================================DELETE
//This function deletes a user with the given clerkId. It connects to the database, finds the user by clerkId, unlinks relationships (removes references to the user from related entities), deletes the user, and then returns the deleted user.

export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase()

        // Find user to delete
        const userToDelete = await User.findOne({ clerkId })

        if (!userToDelete) {
            throw new Error('User not found')
        }

        // Unlink relationships
        await Promise.all([
            // Update the 'events' collection to remove references to the user
            Event.updateMany(
                { _id: { $in: userToDelete.events } },
                { $pull: { organizer: userToDelete._id } }
            ),

            // Update the 'orders' collection to remove references to the user
            Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
        ])

        // Delete user
        // After deleting a user, the function revalidatePath('/') is called, possibly for cache revalidation or any other application-specific purpose.
        const deletedUser = await User.findByIdAndDelete(userToDelete._id)
        revalidatePath('/')

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
    } catch (error) {
        handleError(error)
    }
}