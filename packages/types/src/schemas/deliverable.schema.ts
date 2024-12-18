import { z } from "zod";

const getData = z.object({
    id: z.number(),
    comment: z.string(),
    blobName: z.string(),
    createdAt: z.coerce.date(),
    eventId: z.number(),
    trainingDiaryId: z.number(),
});

const DeliverableSchema = {
    getData,
};

export { DeliverableSchema };