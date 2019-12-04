export interface IndexSpecification {
  
}

export interface LogEntry {
  source: string;
  operation: "created" | "deleted";
  data?: string;
  commitHash: string;
  previousHash: string;
  commitMessage: string;
  author: string;
  timestamp: string;
  branch: string;
}

export type FileTypes = "data" | "index";

export interface IDbClient {
  execute(sql: string): Promise<any>;
}

export async function processLogs(entries: LogEntry[]) {
  for (const entry of entries) {
    await processLog(entry);
  }
}

async function processLog(entry: LogEntry) {
  const table = getTableName(entry.source);
}

/*
  Delete all records associated with the file.
*/
async function processDeletion(entry: LogEntry)  {

}

/*
  New records need to be inserted.
*/
async function processCreation(entry: LogEntry) {

}

function getTableName(source: string) {
  return isDataFile(source) ? source.split("/")[0] : undefined;
}

function isDataFile(source: string) {
  return true;
}
