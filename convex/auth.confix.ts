import { AuthConfig } from "convex/server";

export default {
  providers: [
    {

      domain: "https://funny-airedale-17.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;