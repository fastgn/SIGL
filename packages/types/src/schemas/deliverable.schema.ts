import { z } from "zod";
import { ApprenticeSchema } from "./apprentice.schema";

const getData = z.object({
    id: z.number(),
    comment: z.string(),
    blobName: z.string(),
    createdAt: z.coerce.date(),
    eventId: z.number(),
    trainingDiaryId: z.number(),
    trainingDiary: z.object({
        id: z.number(),
        apprentice: ApprenticeSchema.getData,
    }),
});

const getFromEvent = z.object({
    id: z.number(),
    comment: z.string(),
    blobName: z.string(),
    createdAt: z.coerce.date(),
    trainingDiary: z.object({
        id: z.number(),
        apprentice: ApprenticeSchema.getData,
    }),
});

const DeliverableSchema = {
    getData,
    getFromEvent,
};

export { DeliverableSchema };