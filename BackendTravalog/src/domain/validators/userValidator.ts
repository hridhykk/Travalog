import { z } from 'zod';


export const userSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters'),
  mobile: z.string()
    .regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
});

export type UserValidationSchema = z.infer<typeof userSchema>;
