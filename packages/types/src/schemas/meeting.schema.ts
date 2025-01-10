import { z } from "zod";
import { UserSchema } from "./user.schema";
import { EventSchema } from "./event.schema";

const getData = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    presenter: z.array(UserSchema.getData),
    jury: z.array(UserSchema.getData),
    events: z.array(EventSchema.getData).optional(),
    createdAt: z.date(),
});

const MeetingSchema = {
  getData,
};

export { MeetingSchema };