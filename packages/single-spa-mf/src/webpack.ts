import { getMFAppEntry, getMFAppVar } from "./utils";

// @ts-ignore 
export const getMFAppConfig =({ app }:{app:string}) => ({
  name: getMFAppVar(app),
  filename: `${getMFAppEntry(app)}`,
});
