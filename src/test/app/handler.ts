import { LogEntry, IDbClient, EditLogEntry } from "../..";
import * as crud from "../../crud";

export default async function(entries: LogEntry[], dbClient: IDbClient) {
  return entries.map(async e => {
    const [table, ...fileArr] = e.path.split("/");
    const file = fileArr.join("/");

    return e.operation === "create"
      ? await crud.insert(dbClient, e, record => ({
          title: record.title,
          content: record.content
        }))
      : // (async () => {
        //     // const id = [e.commitHash, e.dir, e.file, e.index].join("/");
        //     const record = JSON.parse(e.data);
        //     const values = {
        //       title: record.title,
        //       content: record.content
        //     };
        //     await insert(values, e);
        //     // const [table, tags] = getTable(e.dir);
        //   })()
        undefined;
  });
}

interface IPostRow {
  title: string;
  content: string;
}

export async function insertPosts(
  logEntry: EditLogEntry,
  table: string,
  fileArr: string[],
  dbClient: IDbClient
) {
  const row = JSON.parse(logEntry.data) as IPostRow;
  const id = await crud.insert(row, "posts", dbClient);
  await crud.updateLastCommit("posts", logEntry.commitHash);
  return id;
}

interface ICommentRow {
  post_id: string;
  content: string;
}

export async function insertComments(
  logEntry: EditLogEntry,
  table: string,
  fileArr: string[],
  dbClient: IDbClient
) {
  const row = JSON.parse(logEntry.data) as ICommentRow;
  const id = await crud.insert(row, "comments", dbClient);
  await crud.updateLastCommit("comments", logEntry.commitHash);
  return id;
}
