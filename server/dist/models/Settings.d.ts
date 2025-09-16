import { type Document } from 'mongoose';
export interface ISettings extends Document {
    logo?: string;
    favicon?: string;
    theme?: 'prism-dark';
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
    social?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
    };
    home?: {
        headline?: string;
        tagline?: string;
        background?: string;
        ctas?: {
            label: string;
            href: string;
        }[];
    };
    about?: {
        mission?: string;
        vision?: string;
        values?: string[];
    };
    testimonials?: {
        name: string;
        role?: string;
        quote: string;
        photo?: string;
    }[];
}
export declare const Settings: import("mongoose").Model<ISettings, {}, {}, {}, Document<unknown, {}, ISettings, {}, {}> & ISettings & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Settings.d.ts.map