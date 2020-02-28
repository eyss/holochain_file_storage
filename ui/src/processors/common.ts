export const CHUNK_SIZE = 256000;

export function parseResponse(response) {
  const result = JSON.parse(response);
  if (result.Err)
    throw new Error(`Error when calling a zome function: ${response['Err']}`);
  return result.Ok;
}

export const getEntry = (callZome, instanceName: string) => async (
  address: String
) => {
  const entryResponse = await callZome(
    instanceName,
    'file_storage',
    'get_entry'
  )({ address });

  const result = parseResponse(entryResponse);

  let entry = result.App[1];

  try {
    entry = JSON.parse(entry);
  } catch (e) {}

  return entry;
};
