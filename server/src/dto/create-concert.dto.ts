import { z } from 'zod';

export const concertSchema = z.object({
  concertName: z
    .string()
    .min(3, { message: 'Concert name requires a minimum of 3 characters.' }),
  totalSeat: z
    .number()
    .min(10, { message: 'Total seats must be more than 10.' })
    .max(10000, { message: 'The maximum number of seats is 10,000.' }),
  description: z
    .string()
    .max(500, { message: 'The description is too long; it must not exceed 500 characters.' })
    .optional()
    .or(z.literal('')),
});

export type CreateConcertDto = z.infer<typeof concertSchema>;