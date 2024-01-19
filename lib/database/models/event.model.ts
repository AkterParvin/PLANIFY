import {  Document, Schema, model, models } from "mongoose";

export interface IEvent extends Document{
    _id: string;
    title: string;
    description?: string;
    location?: string;
    createdAt: Date;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    price?: string;
    isFree: boolean;
    url?: string;
    category: {_id:string,name:string};
    organizer: { _id: string, firstName: string,lastName:string }
}
//This code defines an interface (IEvent) that extends the Document interface from Mongoose. It specifies the structure of an event object. Events have properties like _id, title, description, location, etc.

const EventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    imageUrl: { type: String, required: true },
    startDateTime: { type: Date, default: Date.now },
    endDateTime: { type: Date, default: Date.now },
    price: { type: String },
    isFree: { type: Boolean, default: false },
    url: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

const Event = models.Event || model("Event", EventSchema);
//It creates a model for the event based on the defined schema. If the model named "Event" already exists in the models object, it uses that; otherwise, it creates a new model using the "Event" name and the previously defined EventSchema.

export default Event;
//this code sets up a Mongoose schema and model for an "Event" entity in a MongoDB database.It defines the structure of an event, including its properties and their types, and exports the corresponding Mongoose model for use in other parts of the application.