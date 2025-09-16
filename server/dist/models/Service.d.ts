import { type Document } from 'mongoose';
export interface IService extends Document {
    title: string;
    description: string;
    icon?: string;
    featured: boolean;
    order?: number;
}
export declare const Service: import("mongoose").Model<IService, {}, {}, {}, Document<unknown, {}, IService, {}, {}> & IService & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Service.d.ts.map