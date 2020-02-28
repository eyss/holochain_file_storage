# holochain-file-storage

Frontend package to upload and fetch chunked files from the file_storage zome in a holochain app.

This package assumes you have the `file_storage` zome exactly as is in your application.

> Disclaimer: with the current version of Holochain (`0.0.42-alpha5`) this process is very slow, 7 minutes for a 3MB file. We are waiting for holochain core to switch from WASMI to WASMER to improve performance.

> Right now the chunk size is hardcoded at 256KB since Holochain does not accept bigger chunks. This may change with the new WASM engine.

## Install

```bash
npm install holochain-file-storage
```

## Usage

### Upload a file

```ts
import { uploadFile } from 'holochain-file-storage';
import { connect } from '@holochain/hc-web-client';

const instanceName = 'test-instance';

async function upload(file) {
  const { callZome } = await connect({ url: 'ws://localhost:8888' });

  const fileAddress = await uploadFile(callZome, instanceName)(file);
}
```

### Fetch a file

```ts
import { fetchFile } from 'holochain-file-storage';
import { connect } from '@holochain/hc-web-client';

const instanceName = 'test-instance';

async function fetch(fileAddress) {
  const { callZome } = await connect({ url: 'ws://localhost:8888' });

  const file = await fetchFile(callZome, instanceName)(fileAddress);
}
```

## Next steps

- [ ] Add tests
- [ ] Integrate new version of holochain with new WASM engine
- [ ] Performance audits and improvements
- [ ] Create native elements to upload and fetch files
- [ ] Add the option to selectively retrieve parts of files
- [ ] Add configurable chunk size?
