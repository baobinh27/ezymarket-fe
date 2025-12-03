import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "EzyMarket",
  slug: "ezymarket",
  extra: {
    BASE_API: process.env.BASE_API
  },
});
