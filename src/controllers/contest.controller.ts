import { Request, Response } from "express";
import database from "../config/database";

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
  acceptTeam: Iaccepted[]
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
}

class ContestController {
  private async getContestName(CID: number): Promise<string | undefined> {
    try{
      const command = "SELECT name FROM `contest` WHERE cid = ?;";
      const db = await database;
      const result = await db.query(command, [CID]);
      return result[0].name;
    } catch(err) {
      console.log(err);
      return undefined;
    }
  }
  
  private async getContestTeams(CID: number): Promise<Array<Iteam>> {
    try {
      const db = await database;
  
      const command = `
        SELECT t.teamid AS teamId, 
               t.name AS teamName, 
               COUNT(s.teamid) AS submissionsTimes 
        FROM \`team\` t 
        INNER JOIN \`submission\` s ON t.teamid = s.teamid AND s.CID = ? 
        GROUP BY t.teamid 
        ORDER BY t.teamid;
      `;
      const teams: Array<Iteam> = await db.query<Iteam[]>(command, [CID]).then(results =>
        results.map(team => ({
          ...team,
          teamId: String(team.teamId), 
          submissionsTimes: Number(team.submissionsTimes) 
        }))
      );
  
      return teams;
    } catch (err) {
      console.error(err);
      throw err; 
    }
  }
  

  // private async getContestProblem(CID: number) : Promise<Array<Iproblem> | void> {
  //   try{
  //     const db = await database;
  //     const problemContestcommand = `SELECT * FROM \`scorecache\` WHERE cid = ? AND submissions_public > 0 order by probid;`;
  //     const problems : any[] = await db.query(problemContestcommand, [CID]);
  //     const ans : Iproblem[] = [];
  //     for(const problem of problems){
  //       if(ans.find(item => item.problemId == problem.probid) == undefined){
  //         ans.push(
  //           {
  //             problemId: problem.probid,
  //             problemName: "",
  //             acceptTeam: [
  //              {
  //               problemName: "",

  //              } 
  //             ]
  //           }
  //         )
          
  //       }
  //     }
  //     console.log(problems)

  //   }
  //   catch{

  //   }

  // }

  public async getContestInformation(req : Request, res : Response) : Promise<void>{
    const CID : number = Number(req.query.CID);
    const CNAME = await this.getContestName(CID);
    const CTEAM = await this.getContestTeams(CID);
    const CTEAMNUM = CTEAM?.length;
    // const CPROBLEM = await this.getContestProblem(CID);
    res.send({CID, CNAME, CTEAM, CTEAMNUM});
  }
}

export default ContestController;