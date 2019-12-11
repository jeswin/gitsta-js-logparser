import { LogEntry } from "../..";

export default async function(entries: LogEntry[]) {
  return entries.map(async e => {
    return e.operation === "create"
      ? await insert(e, record => ({
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
