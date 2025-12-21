import { Document, SchemaTimestampsConfig, Types } from "mongoose";


export interface SavedListingDoc extends Document, SchemaTimestampsConfig{
    listing: Types.ObjectId;
    buyer: Types.ObjectId;
}