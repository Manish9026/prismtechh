import { type Document } from 'mongoose';
export interface IMessage extends Document {
    name: string;
    email: string;
    message: string;
    status: 'unread' | 'read';
}
export declare const Message: import("mongoose").Model<IMessage, {}, {}, {}, Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Message.d.ts.map