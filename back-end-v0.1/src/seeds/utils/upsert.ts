import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';

/**
 * Faz upsert de UM registro com base em uma condição única (e.g. { nome: '...' }).
 * - Se existir, aplica o patch e salva.
 * - Se não existir, cria com (uniqueWhere + patch).
 * Garante o retorno como T (nunca T[]).
 */
export async function upsertUnique<T extends Record<string, any>>(
  repo: Repository<T>,
  uniqueWhere: FindOptionsWhere<T>,
  patch: DeepPartial<T>,
): Promise<T> {
  const existing = await repo.findOne({ where: uniqueWhere });

  if (existing) {
    // merge protege os campos já existentes e aplica apenas o patch
    const merged: T = repo.merge(existing, patch as DeepPartial<T>);
    // save com entidade única → Promise<T>
    return await repo.save(merged);
  }

  // Desambiguar para o overload "objeto" (não array)
  const toCreate: T = repo.create({
    ...(uniqueWhere as object),
    ...(patch as object),
  } as DeepPartial<T>);

  return await repo.save(toCreate);
}

/**
 * Variante opcional para múltiplos itens (array) com chave única.
 * Retorna um array de T; útil para seeds em lote.
 */
export async function upsertUniqueMany<T extends Record<string, any>>(
  repo: Repository<T>,
  items: Array<{ where: FindOptionsWhere<T>; patch: DeepPartial<T> }>,
): Promise<T[]> {
  const results: T[] = [];
  for (const { where, patch } of items) {
    const res = await upsertUnique(repo, where, patch);
    results.push(res);
  }
  return results;
}
