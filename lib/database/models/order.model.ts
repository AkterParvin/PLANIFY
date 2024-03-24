import { Schema, model, models } from 'mongoose';
// import { IOrder } from './order.model';


//This interface defines the structure of an order document. It includes properties like createdAt, stripeId, totalAmount, event, and buyer. These properties represent the data fields of an order.
export interface IOrder extends Document{
    createdAt: Date
    stripeId: string
    totalAmount: string
    event: {
        _id: string
        title:string
    }
    buyer: {
        _id: string
        firstName: string
        lastName: string
        
    }
}

//This type defines the structure of an order item. It seems to be a simpler representation of an order, containing fewer details compared to the IOrder interface.
export type IOrderItem = {
    _id: string
    totalAmount: string
    createdAt: Date
    eventTitle: string
    eventId: string
    buyer:string
    
}

//This is the Mongoose schema for the order document. It defines the structure of the order data and its validation rules.
//It includes fields like createdAt, stripeId, totalAmount, event, and buyer.Some fields reference other models using Schema.Types.ObjectId.
const OrderSchema = new Schema({
    createdAt: {
        type: Date,
        default:Date.now,
    },
    stripeId: {
        type: String,
        required: true,
        unique:true,
    },
    totalAmount: {
        type:String,
    },
    event: {
        type: Schema.Types.ObjectId,
        ref:"Event"
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        
    },
})

//The Order model is created using model() function provided by Mongoose.The line const Order = models.order || model('Order', OrderSchema) checks if the model already exists in the models object.If it does, it uses that model; otherwise, it creates a new model named 'Order' using the OrderSchema.
const Order = models.order || model('Order', OrderSchema)

export default Order;