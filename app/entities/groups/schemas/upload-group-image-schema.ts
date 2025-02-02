import { z } from "zod";

const uploadGroupImageSchema = z.object({
	imageUrl: z.instanceof(File).optional(),
});

export type UploadGroupImageParams = z.infer<typeof uploadGroupImageSchema>;

export default uploadGroupImageSchema;
