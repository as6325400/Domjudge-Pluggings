import { Request, Response } from "express";

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
  acceptTeam: Iaccepted,


}

interface Iteam{
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
  public getContestInformatiom(CID : number) : Icontest | any{
    
  }
}

export default ContestController