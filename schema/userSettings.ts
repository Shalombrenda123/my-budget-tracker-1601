import { Currencies } from "@/lib/currencies";
import { z } from "zod";

export const UpdateUserCurrencySchema = z.object({
    // Fixed the spelling from 'currencu' to 'currency'
    currency: z.custom(value => {
        const found = Currencies.some((c) => c.value === value);
        if(!found) {
            // This is what was crashing your app because value was undefined
            throw new Error(`invalid currency: ${value}`);
        }

        return value;
    }),
});