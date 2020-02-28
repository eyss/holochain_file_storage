import { HcFileUpload } from '../dist/holochain-file-storage.es5.js';
customElements.define(
  'hc-file-upload',
  HcFileUpload('ws://localhost:8888', 'test-instance')
);
