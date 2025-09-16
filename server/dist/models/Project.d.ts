import { type Document } from 'mongoose';
export interface IProject extends Document {
    title: string;
    description: string;
    category: 'Web App' | 'CMS' | 'Cybersecurity' | 'Cloud';
    image?: string;
    images?: string[];
    link?: string;
    clientName?: string;
    clientEmail?: string;
    timeline?: string;
    status: 'Draft' | 'In Progress' | 'Completed' | 'Archived';
    featured: boolean;
    startDate?: Date;
    endDate?: Date;
    order?: number;
}
export declare const Project: import("mongoose").Model<IProject, {}, {}, {}, Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Project.d.ts.map