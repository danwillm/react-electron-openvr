import vr from 'nodeopenvr';
const { BrowserWindow } = require('electron');

interface VRWindowConstructorOptions
  extends Electron.BrowserWindowConstructorOptions {
  vr: {
    key: string;
    name: string;
  };
}

class VRWindow extends BrowserWindow {
  public handle: number | undefined;

  public overlay: any;

  constructor(opts: VRWindowConstructorOptions) {
    opts.frame = false;
    opts.transparent = true;
    opts.webPreferences = {
      ...(opts.webPreferences || {}),
      offscreen: true,
    };

    super(opts);

    this.setupOverlay(opts.vr);
  }

  static initVR() {
    vr.VR_Init(vr.EVRApplicationType.VRApplication_Overlay);
  }

  setupOverlay({ key = '', name = 'Electron VR App', fps = 60 }) {
    VRWindow.initVR();

    this.overlay = new vr.IVROverlay();

    this.handle = this.overlay.CreateOverlay(key, name);

    this.webContents.setFrameRate(fps);

    this.webContents.on('paint', async (...args) => {
      await this.draw();
    });

    this.webContents.on('dom-ready', async () => {
      await this.draw();

      this.overlay.ShowOverlay(this.handle);

      // force draw after a second, too
      setTimeout(() => {
        this.draw();
      }, 1000);
    });
  }

  async draw(force = false) {
    const image = await this.webContents.capturePage();

    const buf = image.toBitmap();

    if (buf.length === 0) {
      return;
    }

    const w = image.getSize().width;
    const h = image.getSize().height;

    this.overlay.SetOverlayTextureFromBuffer(this.handle, buf, w, h);
  }
}

export default VRWindow;
