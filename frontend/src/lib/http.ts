export async function getJson(
  path: string,
  signal?: AbortSignal,
): Promise<unknown> {
  const response = await fetch("/api" + path, { signal });
  if (!response.ok)
    throw new Error(
      "Não foi possível carregar os dados. Tente novamente em instantes.",
    );
  return response.json();
}
