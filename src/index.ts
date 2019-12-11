import exception from "./exception";

/*
  
  No Foreign Keys
  ---------------
  Even though Sqlite allows foreign keys, we are not going to support this.
  We drop data in tables from time to time (for example during git delete ops); so it doesn't make sense to have foreign keys.
*/

export interface IDbIndex {
  name: string;
  columns: {
    [name: string]: "asc" | "desc";
  };
}

export interface IDbColumn {
  name: string;
  dataType: string;
  maxLength: number;
  nullable: boolean;
}

export interface IDbTable {
  name: string;
  columns: IDbColumn[];
  indexes: IDbIndex[];
}

export interface IDbConfig {}

export interface IndexSpecification {}

export interface LogEntryBase {
  dir: string;
  file: string;
  operation: "create" | "update" | "delete";
  commitHash: string;
  previousHash: string;
  message: string;
  author: string;
  time: string;
  branch: string;
}

export interface EditLogEntry extends LogEntryBase {
  data: string;
  index: number;
  operation: "create" | "update";
}

export interface DeleteLogEntry extends LogEntryBase {
  operation: "delete";
}

export type LogEntry = EditLogEntry | DeleteLogEntry;

export type FileTypes = "data" | "index";

export interface IDbClient {
  execute(sql: string): Promise<any>;
}

export async function initDatabase(dbConfig: IDbConfig, dbClient: IDbClient) {}

export async function processLogs(entries: LogEntry[], dbClient: IDbClient) {
  async function processLog(entry: LogEntry) {
    return entry.operation === "create"
      ? processCreation(entry)
      : entry.operation === "delete"
      ? processDeletion(entry)
      : entry.operation === "update"
      ? processUpdation(entry)
      : exception(
          `Invalid operation ('${entry.operation}') in commit ${entry.commitHash}:${entry.source}.`
        );
  }
  /*
    New records need to be inserted.
  */
  async function processCreation(entry: LogEntry) {
    const [table, file] = getTableAndFile(entry.source);
    const query = `DELETE * FROM ${table} WHERE gista_file='${file}';`;
    await dbClient.execute(query);
  }

  /*
    New records need to be inserted.
  */
  async function processUpdation(entry: LogEntry) {
    const [table, file] = getTableAndFile(entry.source);
    const query = `DELETE * FROM ${table} WHERE gista_file='${file}';`;
    await dbClient.execute(query);
  }

  /*
    Delete all records associated with the file.
  */
  async function processDeletion(entry: LogEntry) {
    const [table, file] = getTableAndFile(entry.source);
    const query = `DELETE * FROM ${table} WHERE gista_file='${file}';`;
    await dbClient.execute(query);
  }

  for (const entry of entries) {
    await processLog(entry);
  }
}

type LogTarget = [string?, string?];

function getTableAndFile(source: string): LogTarget {
  const [table, ...file] = source.split("/");
  return isDataFile(source) ? [table, file.join("/")] : ([] as LogTarget);
}

function isDataFile(source: string) {
  return true;
}
