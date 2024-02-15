import { Request, Response } from "express";
import database from "../config/database"
import { Connection } from "mariadb";
import { count } from "console";

interface Iaccepted{
  problemName?:string,
  teamName: string,
  // 都沒 ac 過就是 undefined
  acceptTime: number | undefined,
  // try times
  submissionTimes: number
}

interface Iproblem{
  problemId: number,
  problemName :string,
  // 依照 acceptTime 由小到大排列
  acceptTeam: Iaccepted
}

interface Iteam{
  teamId: string,
  teamName: string,
  submissionsTimes: number
}


interface Icontest{
  contestId: number,
  contestName: string,
  Problems: Iproblem[],
  // 有 submission 至少一題的隊伍數
  teamNum: number,
  teams: Iteam[]
};

class ContestController {
  private async getContestName(CID: number): Promise<string | undefined> {
    let command = `SELECT name FROM \`contest\` WHERE cid = ?;`;
    return database.then(
      (db : Connection) => db.query(command, [CID])
    ).then((result : Array<any>) => {
      return result[0].name;
    }).catch((error) => {
      console.log(error);
      return undefined;
    })
  }
  private async getContestTeams(CID: number): Promise<Array<Iteam>> {
    const db = await database;

    const teamNumsCommand = `SELECT DISTINCT teamid FROM \`submission\` WHERE ?;`
    const teamsId : Array<number> = (await db.query(teamNumsCommand, [CID])).map(
      (team : any ) => team.teamid
    );

    const teamIdString = teamsId.join(', ');
    const teamsCommand = `SELECT teamid, name FROM \`team\` where teamid IN (${teamIdString}) ORDER BY teamid`;

    const teams : Array<any> = await db.query(teamsCommand);

    const submissionTimesCommand = `SELECT teamid, COUNT(*) as count FROM \`submission\` WHERE CID = ? AND teamid IN (${teamIdString}) GROUP BY teamid ORDER BY teamid`;
    
    const submissionTimes = (await db.query(submissionTimesCommand, [CID])).map((team : any) => ({
      ...team,
      count: Number(team.count)
    }))

    teams.map(
      (team : any, index : number ) => team.submissionsTimes = submissionTimes[index].count
    )
    
    return teams;
  }
  public async getContestInformation(req : Request, res : Response) : Promise<void>{
    const CID : number = Number(req.query.CID);
    const CNAME = await this.getContestName(CID);
    const CTEAN = await this.getContestTeams(CID);
    res.send({CID, CNAME, CTEAN})
  }
}

export default ContestController