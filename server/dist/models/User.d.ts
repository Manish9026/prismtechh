import { type Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    passwordHash: string;
    name?: string;
    role: 'admin' | 'editor';
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map