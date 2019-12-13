import { IDbClient } from ".";

export interface ISaveOptions {
  commitHash: string;
}

export async function insert(
  row: any,
  table: string,
  options: ISaveOptions,
  dbClient: IDbClient
) {}

export async function update(dbClient: IDbClient) {}

export async function remove(dbClient: IDbClient) {}

export async function select(dbClient: IDbClient) {}
