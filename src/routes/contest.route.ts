import Route from './base.route'
import ContestController from '../controllers/contest.controller'

class ContestRoute extends Route{
  private contestController = new ContestController();

  constructor(){
    super();
    this.setRoutes();
  }

  protected setRoutes() : void{

  }
}

export default ContestRoute;