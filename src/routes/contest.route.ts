import Route from './base.route'
import ContestController from '../controllers/contest.controller'

class ContestRoute extends Route{
  private contestController = new ContestController();

  constructor(){
    super();
    this.prefix = "/contest";
    this.setRoutes();
  }

  protected setRoutes() : void{
    this.router.get("/", this.contestController.getContestInformatiom)
  }
}

export default ContestRoute;