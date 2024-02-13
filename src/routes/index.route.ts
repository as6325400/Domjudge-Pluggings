import Route from "./base.route";
import ContestRoute from "./contest.route";

export const router: Array<Route> = [
  new ContestRoute()
]

export default router