import { z } from 'zod';

export const concertSchema = z.object({
  concertName: z
    .string()
    .min(3, { message: 'ชื่อคอนเสิร์ตต้องมีอย่างน้อย 3 ตัวอักษร' })
    .max(100, { message: 'ชื่อคอนเสิร์ตยาวเกินไป' }),
    
  totalSeat: z
    .number()
    .min(10, { message: 'จำนวนที่นั่งต้องมากกว่า 10' })
    .max(10000, { message: 'จำนวนที่นั่งสูงสุดคือ 10,000' }),
    
  description: z
    .string()
    .max(500, { message: 'คำอธิบายยาวเกิน 500 ตัวอักษร' })
    .optional(),
});