import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    IModel,
    ICustomModel,
    Setting,
    fetchPost,
    Protyle,
    openWindow,
    IOperation,
    Constants,
    openMobileFileById,
    lockScreen,
    ICard,
    ICardData,
    Lute
} from "siyuan";
import "./index.scss";
import { addScript } from "./utils";
import * as nunjucks from "nunjucks";


const TAB_TYPE = "nbviewer_tab";

export default class PluginSample extends Plugin {

    private nunjucksEnv: nunjucks.Environment;
    private lute: Lute;

    onload() {
        this.addIcons(`<symbol id="iconNb" viewBox="0 0 32 32" style="scale:2">
            <g fill="#EF6C00"><path d="M 29.3246 5.1749 v 24.1497 H 5.1749 V 5.1749 h 24.1497 m 2.3522 -2.3522 H 2.8227 v 28.6973 h 28.6973 l 0.1568 -28.6973 z M 25.8746 25.8746 l -8.4681 -6.7431 l -8.7817 6.7431 v -17.2498 h 17.2498 z"></path></g>
            </symbol>`);
        // Initialize the nunjucks environment
        this.nunjucksEnv = new nunjucks.Environment(new nunjucks.WebLoader(`plugins/${this.name}/templates/siyuanmd`, {useCache:true}), { autoescape: false });
        
        nunjucks.installJinjaCompat();

        this.nunjucksEnv.addFilter('multiline', function(strs) {
            // if strs is not an array, return it as is
            if (!Array.isArray(strs)) return strs;
            
            return strs.join('');
        });

        this.nunjucksEnv.addFilter('strip_ansi', function(source) {
            const ansiRegex = /\x1b\[\d*?[@-~]/g; // 适用于 JavaScript 的简化版 ANSI 正则表达式
            return source.replace(ansiRegex, "");
        });

        this.nunjucksEnv.addFilter('path2url', function(path) {
            // Split the path by the system's file separator, which in web contexts is typically "/"
            const parts = path.split('/');
            // Encode each part of the path to ensure it's valid for a URL and join them back with "/"
            return parts.map((part: string | number | boolean) => encodeURIComponent(part)).join('/');
        });

        this.nunjucksEnv.addFilter('rstrip_newline', function(str) {
            return str.replace(/\n$/, "");
        });

        this.nunjucksEnv.addFilter('log', function(obj) {
            console.log(obj);
        });

        // Initialize the Lute parser
        this.lute = window.Lute.New();
        // @ts-ignore
        this.lute.SetInlineMathAllowDigitAfterOpenMarker(true)
        // @ts-ignore
        this.lute.SetSuperBlock(true)
        // @ts-ignore
        this.lute.SetIndentCodeBlock(true)
        // @ts-ignore
        this.lute.SetCodeSyntaxHighlight(true)
        // @ts-ignore
        this.lute.SetCodeSyntaxHighlightDetectLang(true)
        // @ts-ignore
        this.lute.SetProtyleMarkNetImg(false)
        // @ts-ignore
        this.lute.__internal_object__.RenderOptions.AutoSpace = true
        // @ts-ignore
        this.lute.__internal_object__.RenderOptions.DataImage = true
        // @ts-ignore
        this.lute.__internal_object__.RenderOptions.FixTermTypo = true
        // @ts-ignore
        this.lute.__internal_object__.RenderOptions.ProtyleContenteditable = false
        // @ts-ignore
        this.lute.__internal_object__.RenderOptions.CodeSyntaxHighlightLineNum = true
        
        // Add the Protyle methods to the window object
        addScript(`/stage/build/export/protyle-method.js?${Constants.SIYUAN_VERSION}`, "protyleExportMethod");

        // Add a global click event listener to open the notebook viewer
        globalThis.addEventListener("click", this.openNbEventListener, true);
        
    }

    onLayoutReady() {
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
    }

    onunload() {
        console.log(this.i18n.byePlugin);
    }

    uninstall() {
        console.log("uninstall");
    }

    // Event listener to click on the notebook link
    private readonly openNbEventListener = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.getAttribute("data-type") === "a" && target.getAttribute("data-href").endsWith(".ipynb")) {
            e.preventDefault();
            e.stopPropagation();
            
            const nbId = window.Lute.NewNodeID();
            let linkAddress = window.Lute.EscapeHTMLStr(target.getAttribute("data-href"));
            
            if (linkAddress.startsWith("nbviewer")){
                linkAddress = linkAddress.slice(11); 
            }

            this.prepareNb(linkAddress).then(({notebookJson, nbId, nbName}) => {
                this.openNbViewTab(notebookJson, nbId, nbName);
            });
        }
    };

    private readonly fetchNotebook = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const notebookJson = await response.json();
            return notebookJson;
        } catch (error) {
            console.error('Error fetching the notebook:', error);
        }
    }

    // Get the Json of the notebook
    private readonly prepareNb = async (linkAddress: string) => {
        try {
            const nbName = decodeURIComponent(linkAddress.split("/").pop());
            const nbId = window.Lute.NewNodeID();
            const notebookJson = await this.fetchNotebook(linkAddress);
            
            // Convert the notebook to the latest version if it's in version 3
            if (notebookJson.nbformat === 3) {
                const convertResponse = await fetch("/api/convert/pandoc", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        "dir": `${nbId}`,
                        "args": ["--to", "ipynb", `${linkAddress}`, "-o", `${nbName}`]
                    })
                });
    
                if (!convertResponse.ok) {
                    throw new Error(`HTTP error! status: ${convertResponse.status}`);
                }
    
                const data = await convertResponse.json();
                const newLinkAddress = `${data.data["path"]}/${nbName}`;
    
                const fileResponse = await fetch("/api/file/getFile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({"path": newLinkAddress})
                });
    
                if (!fileResponse.ok) {
                    throw new Error(`HTTP error! status: ${fileResponse.status}`);
                }
    
                const fileData = await fileResponse.json();
                return { notebookJson: fileData, nbId, nbName };
    
            } else {
                return { notebookJson, nbId, nbName };
            }
        } catch (error) {
            console.error('Error in processing the notebook:', error);
        }
    };
    
    // Open the notebook in a new tab
    private readonly openNbViewTab = (notebookJson:any, nbId: string, nbName:string) => {

            const input = {nb: notebookJson, resources: {
                "global_content_filter": {
                    "include_code": true,
                    "include_markdown": true,
                    "include_raw": true,
                    "include_unknown": true,
                    "include_input": true,
                    "include_output": true,
                    "include_output_stdin": true,
                    "include_input_prompt": true,
                    "include_output_prompt": true,
                    "no_prompt": false,
                }
                }};
                
                console.log("Rendering the notebook:", input);

            this.nunjucksEnv.render("siyuan.md.njk", input, (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const nbHTML = this.lute.Md2BlockDOM(res);
                const tabHTML = `<div class="${this.name}__custom-tab"><div class="${this.name}__custom-viewer protyle-wysiwyg protyle-wysiwyg--attr">${nbHTML}</div></div>`;

                const parser = new DOMParser();
                const doc = parser.parseFromString(tabHTML, 'text/html');
                const tabElement = doc.body.firstChild as HTMLElement;


                // Remove all protyle-attr elements
                const protyleAttrs = Array.from(tabElement.querySelectorAll('.protyle-attr'));
                protyleAttrs.forEach((protyleAttr) => {
                    protyleAttr.remove();
                });

                // Add the necessary classes to the elements
                const codeElements = Array.from(tabElement.querySelectorAll('[data-type="NodeSuperBlock"]'));
                codeElements.forEach((codeElement) => {
                    codeElement.className = `${this.name}__codeblock`;
                    const isOutCodeBlock = codeElement.querySelector('[data-type="NodeCodeBlock"]').firstElementChild.firstElementChild.textContent === "output";
                    const isErrCodeBlock = codeElement.querySelector('[data-type="NodeCodeBlock"]').firstElementChild.firstElementChild.textContent === "error";

                    if (isOutCodeBlock) {

                        codeElement.querySelector('[data-type="NodeParagraph"]')?.classList.add(`${this.name}__jupyter-out-prompt`);
                        codeElement.querySelector('[data-type="NodeCodeBlock"]').removeAttribute("class");
                        
                        const content = codeElement.querySelector('div.hljs');
                        content.className = `p ${this.name}__jupyter-out`;

                        // Remove the hover menu
                        codeElement.querySelector('div.protyle-action').remove();                        
                    
                    } else if (isErrCodeBlock) {
                        codeElement.querySelector('[data-type="NodeParagraph"]').classList.add(`${this.name}__jupyter-err-prompt`);
                        codeElement.querySelector('[data-type="NodeCodeBlock"]').removeAttribute("class");
                        const content = codeElement.querySelector('div.hljs');
                        content.className = `p ${this.name}__jupyter-err`;
                        // Remove the hover menu
                        codeElement.querySelector('div.protyle-action').remove();
                    } else {
                        codeElement.querySelector('[data-type="NodeParagraph"]').classList.add(`${this.name}__jupyter-in-prompt`);

                    }
                        
                });

                // Render the notebook in SiYuan Style
                //@ts-ignore
                window.Protyle.highlightRender(tabElement, `${Constants.PROTYLE_CDN}`);
                //@ts-ignore
                window.Protyle.mathRender(tabElement, `${Constants.PROTYLE_CDN}`);
                //@ts-ignore
                window.Protyle.abcRender(tabElement, `${Constants.PROTYLE_CDN}`);
                //@ts-ignore
                window.Protyle.htmlRender(tabElement, `${Constants.PROTYLE_CDN}`);
                //@ts-ignore
                window.Protyle.plantumlRender(tabElement, `${Constants.PROTYLE_CDN}`);
                //@ts-ignore
                window.Protyle.mermaidRender(tabElement, `${Constants.PROTYLE_CDN}`);
                //@ts-ignore
                window.Protyle.flowchartRender(tabElement, `${Constants.PROTYLE_CDN}`);
                //@ts-ignore
                window.Protyle.chartRender(tabElement, `${Constants.PROTYLE_CDN}`);    
                //@ts-ignore
                window.Protyle.mindmapRender(tabElement, `${Constants.PROTYLE_CDN}`);
                //@ts-ignore
                window.Protyle.graphvizRender(tabElement, `${Constants.PROTYLE_CDN}`);
                
                // Rigister the tab
                this.addTab({
                    type: TAB_TYPE+"_"+nbName,
                    init() {
                        this.element.append(this.data.tabElement);
                    },
                    beforeDestroy() {
                        console.log("before destroy tab:", TAB_TYPE);
                    },
                    destroy() {

                        console.log("destroy tab:", TAB_TYPE);
                    }
                });

                openTab({
                    app: this.app,
                    custom: {
                        icon: "iconNb",
                        title: `${nbName}`,
                        data: {tabElement: tabElement},
                        id: this.name + TAB_TYPE + "_" + nbName,
                    },
                });

            });
    }
}