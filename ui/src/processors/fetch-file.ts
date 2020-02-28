import { getEntry } from './common';
import { base64StringToBlob } from 'blob-util';

export const fetchFile = (callZome, instanceName: string) => async (
  address: String
): Promise<File> => {
  const fileEntry = await getEntry(callZome, instanceName)(address);

  const chunksPromises = fileEntry.chunks.map(async chunk => {
    const chunkEntry = await getEntry(callZome, instanceName)(chunk);
    return base64StringToBlob(chunkEntry);
  });

  const chunks: Blob[] = await Promise.all(chunksPromises);

  return new File(chunks, fileEntry.name, {
    type: fileEntry.type,
    lastModified: fileEntry.last_modified
  });
};
