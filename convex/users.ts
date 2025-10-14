import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const syncUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        clerkId: v.string(),
        image: v.optional(v.string()),
    },
    handler: async(cxt, args) =>{
        const existingUser =await cxt.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
        .first();

        if(existingUser)return;
        return await cxt.db.insert("users", args)


    }
})
