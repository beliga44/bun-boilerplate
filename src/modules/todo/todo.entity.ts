import { Model, Schema, model, Types } from 'mongoose'

export interface Todo extends Document {
    _id: Types.ObjectId
    name: string
    description: string
}

const todoSchema = new Schema<Todo>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
})

export const TodoModel: Model<Todo> = model('todo', todoSchema)
