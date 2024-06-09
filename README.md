[中文](https://github.com/duanxianpi/siyuan-plugin-nbviewer/blob/main/README_zh_CN.md)

# SiYuan Jupyter Notebook Viewer

The SiYuan Jupyter Notebook Viewer is a plugin for SiYuan that enables users to view Jupyter Notebooks directly within the SiYuan Note. This integration provides a seamless experience for those who want to read Jupyter Notebooks while managing their notes and documents in SiYuan.

## Features

- **Notebook Viewing**: Easily view the content of Jupyter Notebooks, including Markdown, code cells, and outputs within SiYuan.
- **Cross-Platform Support**: Works on Windows, macOS, and Linux.

## Usage

After installation and activation, follow these steps to view a Jupyter Notebook in SiYuan:

### Local Assets

1. Drag and drop a Jupyter Notebook file into SiYuan as an attachment 
2. Click on the attachment to open the file.

**NOTE**: For local assets, inserting attachments with hard links supports file cloud synchronization and cross-device access.

### File URL

1. Alt + Drag and drop a Jupyter Notebook file into SiYuan will create a file URL
2. Click on the file URL to open the file.

**Note**: If you had installed webview plugin, please add `nbviewer://` to the beginning of the file URL.

### Web URL

1. Copy the URL of a Jupyter Notebook file
2. Paste the URL into SiYuan as a link

**Note**: If you had installed webview plugin, please add `nbviewer://` to the beginning of the web URL.

## Compatibility

- This plugin is compatible with Jupyter Notebooks Format 4.0 and above.
- For Jupiter Notebook Format 3.x versions, the plugin will automatically convert them to 4.x versions using Pandoc (the source file will not be modified).
- Mobile devices do not support Jupiter Notebook Format 3.x versions.

## Contributing

Contributions to the SiYuan Jupyter Notebook Viewer are welcome. Please feel free to fork the repository, make changes, and submit pull requests. You can also open issues for bugs or feature requests.

## License

This plugin is released under the [MIT License](LICENSE).

## Support

For support, questions, or more information, please visit [our GitHub issues page](/issues).

## Sponsor

If you like this plugin, you can support me in the following ways:

### Buy me a coffee & PayPal
<div style="display:flex; align-items: center; flex-direction:;">
<a href="https://www.buymeacoffee.com/duanxianpi" target="_blank" title="buymeacoffee">
  <img src="https://iili.io/JoQ0zN9.md.png"  alt="buymeacoffee-orange-badge" style="width: 200px;">
</a>
<!-- <a href="https://www.paypal.com/paypalme/duanxianpi" target="_blank" title="paypal">
  <img src="https://raw.githubusercontent.com/aha999/DonateButtons/master/Paypal.png"  alt="paypal" style="width: 210px;">
</a> -->
</div>

### WeChat Pay & Alipay

<div>
  <img src="https://raw.githubusercontent.com/duanxianpi/siyuan-plugin-nbviewer/main/assets/wechat.png" alt="wechatpay" style="width: 250px;">
  <img src="https://raw.githubusercontent.com/duanxianpi/siyuan-plugin-nbviewer/main/assets/zfb.jpg" alt="alipay" style="width: 250px;">
</div>