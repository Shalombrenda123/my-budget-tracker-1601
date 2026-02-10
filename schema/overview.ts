import { z } from "zod";
import { differenceInDays } from "date-fns";

export const OverviewQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);

    // Limit the range to 90 days to prevent heavy database queries
    const isValidRange = days >= 0 && days <= 90;
    return isValidRange;
  }, {
    message: "The date range must be between 0 and 90 days",
  });