import { getEnv } from "../core/get-env";
import RememberTheMilk from "rtm-js";

const milkKey = getEnv("MILK_API_KEY");
const milkSecret = getEnv("MILK_SHARED_SECRET");

console.log({ milkKey, milkSecret });

const rtm = new RememberTheMilk(milkKey, milkSecret, "read");

export const getTasks = async () => {
  return await new Promise((accept, reject) => {
    rtm.get("rtm.tasks.getList", {}, (response, error) => {
      if (error) {
        reject(error);
      } else {
        accept(response);
      }
    });
  });
};
