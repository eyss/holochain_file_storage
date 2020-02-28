import { CHUNK_SIZE, parseResponse } from './common';
import { blobToBase64String } from 'blob-util';

export const uploadFile = (callZome, instanceName: string) => async (
  file: File,
  chunkSize: number = CHUNK_SIZE
): Promise<string> => {
  const chunks = getChunks(file, chunkSize);

  const promises = chunks.map(async chunk => {
    const buffer = await blobToBase64String(chunk);

    return callZome(
      instanceName,
      'file_storage',
      'create_chunk'
    )({ chunk: buffer });
  });

  const chunksResponses = await Promise.all(promises);

  const chunksAddresses = chunksResponses.map(parseResponse);

  const fileInput = {
    name: file.name,
    size: file.size,
    last_modified: file.lastModified,
    type: file.type,
    chunks: chunksAddresses
  };

  const fileResponse = await callZome(
    instanceName,
    'file_storage',
    'create_file'
  )({ file: fileInput });

  return parseResponse(fileResponse);
};

export function getChunks(file: File, chunkSize: number): Blob[] {
  let offset = 0;
  const chunks: Blob[] = [];

  while (file.size > offset) {
    const chunk = file.slice(offset, offset + chunkSize);
    offset += chunkSize;
    chunks.push(chunk);
  }

  return chunks;
}
