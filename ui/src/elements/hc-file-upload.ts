import { LitElement, property, html, css } from 'lit-element';
import '@material/mwc-button';
import { uploadFile } from '../processors/upload-file';
import { connect } from '@holochain/hc-web-client';
import { fetchFile } from 'src/processors/fetch-file';

export function HcFileUpload(
  url: string,
  instanceName: string
): typeof HTMLElement {
  class HcFileUpload extends LitElement {
    callZome = undefined;

    @property()
    address = undefined;

    async firstUpdated() {
      this.getCallZome();
    }

    async getCallZome() {
      if (this.callZome) return this.callZome;
      else {
        const { callZome } = await connect({ url: url });

        this.callZome = callZome;
        return callZome;
      }
    }

    async uploadFiles() {
      const fileInput: HTMLInputElement = this.shadowRoot.getElementById(
        'file-input'
      ) as HTMLInputElement;

      const callZome = await this.getCallZome();
      this.address = await uploadFile(
        callZome,
        instanceName
      )(fileInput.files[0]);
    }

    async downloadFile() {
      const callZome = await this.getCallZome();

      const file = await fetchFile(callZome, instanceName)(this.address);

      const url = window.URL.createObjectURL(file);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // the filename you want
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }

    render() {
      return html`
        <input
          id="file-input"
          name="file"
          type="file"
          multiple
          @change=${() => this.uploadFiles()}
        />

        ${this.address
          ? html`
              <mwc-button @click=${() => this.downloadFile()}
                >Download</mwc-button
              >
            `
          : html``}
      `;
    }
  }
  return HcFileUpload;
}
