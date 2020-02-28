import { getEntry } from './common';
import { base64StringToBlob } from 'blob-util';

/**
 * Fetch a file from the file_storage zome, aggregating all its chunks
 *
 * @param callZome function used to call the file_storage zome
 * @param instanceName instance name of the happ
 * @param fileAddress address of the file to fetch
 */
export const fetchFile = (callZome, instanceName: string) => async (
  fileAddress: String
): Promise<File> => {
  const fileEntry = await getEntry(callZome, instanceName)(fileAddress);

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
