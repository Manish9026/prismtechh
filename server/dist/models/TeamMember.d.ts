import { type Document } from 'mongoose';
export interface ITeamMember extends Document {
    name: string;
    role: string;
    bio?: string;
    photo?: string;
    order?: number;
}
export declare const TeamMember: import("mongoose").Model<ITeamMember, {}, {}, {}, Document<unknown, {}, ITeamMember, {}, {}> & ITeamMember & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TeamMember.d.ts.map