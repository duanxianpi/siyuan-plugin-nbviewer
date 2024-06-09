# SiYuan Jupyter Notebook 查看器

SiYuan Jupyter Notebook 查看器是一个适用于 SiYuan 的插件，使用户可以直接在 SiYuan 笔记中查看 Jupyter Notebook。为那些想要在 SiYuan 中浏览 Jupyter Notebook 的用户提供了无缝体验。

## 功能

- **笔记本查看**：轻松查看 Jupyter Notebook 的内容，包括 Markdown、代码单元和输出。
- **跨平台支持**：支持 Windows、macOS 和 Linux。

## 使用方法

安装并激活后，按照以下步骤在 SiYuan 中查看 Jupyter Notebook：

### 本地 assets

1. 将 Jupyter Notebook 文件拖放到 SiYuan 中作为附件
2. 点击附件打开文件。

**推荐**：插入附件时用硬链接的方式可以支持**文件同步修改**和**跨设备**访问。

### 文件 URL

1. 按 Alt + 拖放一个 Jupyter Notebook 文件到 SiYuan 会创建一个文件 URL
2. 点击文件 URL 打开文件。

**注意**：如果您安装了 webview 插件，请在文件 URL 开头添加 `nbviewer://`。

### 网络 URL

1. 复制一个 Jupyter Notebook 文件的 URL
2. 将 URL 粘贴到 SiYuan 作为链接

**注意**：如果您安装了 webview 插件，请在网页 URL 开头添加 `nbviewer://`。

## 兼容性

- 该插件兼容 Jupyter Notebooks Format 4.0 及以上版本。
- 对于 Jupiter Notebook Format 3.x 版本，插件会用 Pandoc 自动将其转换为 4.x 版本（源文件不会被修改）
- 移动端不支持 Jupiter Notebook Format 3.x 版本。

## 贡献

欢迎对 SiYuan Jupyter Notebook 查看器进行贡献。请随意 fork 仓库，进行更改，并提交 pull 请求。您也可以开设问题报告 bugs 或功能请求。

## 许可证

该插件在 [MIT 许可证](LICENSE) 下发布。

## 支持

如需支持、问题或更多信息，请访问 [我们的 GitHub 问题页面](/issues)。

## 赞助

如果您喜欢这个插件，可以通过以下方式支持我：

### 请我喝咖啡 & PayPal
<div style="display:flex; align-items: center; flex-direction:;">
<a href="https://www.buymeacoffee.com/duanxianpi" target="_blank" title="buymeacoffee">
  <img src="https://iili.io/JoQ0zN9.md.png"  alt="buymeacoffee-orange-badge" style="width: 200px;">
</a>
</div>

### 微信支付 & 支付宝

<div>
  <img src="https://raw.githubusercontent.com/duanxianpi/siyuan-plugin-nbviewer/main/assets/wechat.png" alt="wechatpay" style="width: 250px;">
  <img src="https://raw.githubusercontent.com/duanxianpi/siyuan-plugin-nbviewer/main/assets/zfb.jpg" alt="alipay" style="width: 250px;">
</div>