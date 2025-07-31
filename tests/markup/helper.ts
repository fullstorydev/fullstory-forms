import { Model, SurveyModel, PanelModel, settings } from "@fullstory/form-core";
export interface MarkupTestDescriptor {
  name: string;
  json: any;
  event?: string;
  before?: () => void;
  afterRender?: (survey) => void;
  after?: () => void;
  snapshot?: string;
  excludePlatform?: string;
  etalon?: string;
  removeIds?: boolean;
  initSurvey?: (survey: Model) => void;
  getElement?: (element?: HTMLElement) => HTMLElement | undefined | null;
  getSnapshot?: (element: HTMLElement) => string;
  timeout?: number;
}

export var markupTests: Array<MarkupTestDescriptor> = []; //

export function registerMarkupTest(t: MarkupTestDescriptor): void {
  markupTests.push(t);
}
export function registerMarkupTests(tests: Array<MarkupTestDescriptor>): void {
  tests.forEach((t) => markupTests.push(t));
}

function format(html: string) {
  var tab = "\t";
  var result = "";
  var indent = "";

  html.split(/>\s*</).forEach(function (element) {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }

    result += indent + "<" + element + ">\r\n";

    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
      indent += tab;
    }
  });

  return result.substring(1, result.length - 3);
}

function sortAttributes(elements: Array<HTMLElement>) {
  for (var j = 0; j < elements.length; j++) {
    var attributes = [];
    for (var i = 0; i < elements[j].attributes.length; i++) {
      var name = elements[j].attributes[i].name;
      var value = elements[j].attributes[i].value;
      ["disabled", "controls"].forEach((tag) => {
        if (name == tag && value == tag) value = "";
      });
      attributes.push({
        name: name,
        value: value,
      });
    }

    var sortedAttributes = attributes.sort((a1, b1) => {
      let a = a1.name.toUpperCase();
      let b = b1.name.toUpperCase();
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    });

    for (var i = 0; i < sortedAttributes.length; i++) {
      elements[j].removeAttribute(sortedAttributes[i]["name"]);
    }

    for (var i = 0; i < sortedAttributes.length; i++) {
      elements[j].setAttribute(
        sortedAttributes[i]["name"],
        sortedAttributes[i]["value"]
      );
    }
  }
}

function addFullstorysnippet() {
  console.log("adding fs snippet");

  const script = document.createElement("script");
  script.innerHTML = `window['_fs_host'] = 'staging.fullstory.com';
    window['_fs_script'] = 'edge.staging.fullstory.com/s/fs.js';
    window['_fs_org'] = 'o-7TFN-na1';
    window['_fs_namespace'] = 'FS';
    !function(m,n,e,t,l,o,g,y){var s,f,a=function(h){
    return!(h in m)||(m.console&&m.console.log&&m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].'),!1)}(e)
    ;function p(b){var h,d=[];function j(){h&&(d.forEach((function(b){var d;try{d=b[h[0]]&&b[h[0]](h[1])}catch(h){return void(b[3]&&b[3](h))}
    d&&d.then?d.then(b[2],b[3]):b[2]&&b[2](d)})),d.length=0)}function r(b){return function(d){h||(h=[b,d],j())}}return b(r(0),r(1)),{
    then:function(b,h){return p((function(r,i){d.push([b,h,r,i]),j()}))}}}a&&(g=m[e]=function(){var b=function(b,d,j,r){function i(i,c){
    h(b,d,j,i,c,r)}r=r||2;var c,u=/Async$/;return u.test(b)?(b=b.replace(u,""),"function"==typeof Promise?new Promise(i):p(i)):h(b,d,j,c,c,r)}
    ;function h(h,d,j,r,i,c){return b._api?b._api(h,d,j,r,i,c):(b.q&&b.q.push([h,d,j,r,i,c]),null)}return b.q=[],b}(),y=function(b){function h(h){
    "function"==typeof h[4]&&h[4](new Error(b))}var d=g.q;if(d){for(var j=0;j<d.length;j++)h(d[j]);d.length=0,d.push=h}},function(){
    (o=n.createElement(t)).async=!0,o.crossOrigin="anonymous",o.src="https://"+l,o.onerror=function(){y("Error loading "+l)}
    ;var b=n.getElementsByTagName(t)[0];b&&b.parentNode?b.parentNode.insertBefore(o,b):n.head.appendChild(o)}(),function(){function b(){}
    function h(b,h,d){g(b,h,d,1)}function d(b,d,j){h("setProperties",{type:b,properties:d},j)}function j(b,h){d("user",b,h)}function r(b,h,d){j({
    uid:b},d),h&&j(h,d)}g.identify=r,g.setUserVars=j,g.identifyAccount=b,g.clearUserCookie=b,g.setVars=d,g.event=function(b,d,j){h("trackEvent",{
    name:b,properties:d},j)},g.anonymize=function(){r(!1)},g.shutdown=function(){h("shutdown")},g.restart=function(){h("restart")},
    g.log=function(b,d){h("log",{level:b,msg:d})},g.consent=function(b){h("setIdentity",{consent:!arguments.length||b})}}(),s="fetch",
    f="XMLHttpRequest",g._w={},g._w[f]=m[f],g._w[s]=m[s],m[s]&&(m[s]=function(){return g._w[s].apply(this,arguments)}),g._v="2.0.0")
    }(window,document,window._fs_namespace,"script",window._fs_script);`;

  script.onload = () => {
    console.log("FS script loaded and executed!");
  };
  document.head.appendChild(script);
}

function getFullStoryNs() {
  const namespace = window["_fs_namespace"];
  return namespace;
}

function getFullStoryInstance() {
  const namespace = getFullStoryNs();
  if (!namespace) {
    console.warn("FullStory namespace not found");
    return null;
  }

  const fs = window[namespace];
  if (!fs) {
    console.warn(`FullStory instance not found for namespace: ${namespace}`);
    return null;
  }

  return fs;
}

async function waitForFullStory(timeout = 10000): Promise<any> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkFullStory = () => {
      const fs = getFullStoryInstance();
      const session = getFullStorySessionUrl(fs);
      if (typeof fs === "function" && session !== null) {
        resolve(fs);
        return;
      }

      if (Date.now() - startTime > timeout) {
        console.log("FullStory could not find fs in time!");
        reject(new Error("FullStory failed to load within timeout"));
        return;
      }

      setTimeout(checkFullStory, 100);
    };

    checkFullStory();
  });
}

function getFullStorySessionUrl(fs: any): string {
  const sessionUrl = fs("getSession");
  return sessionUrl;
}

export async function testQuestionMarkup(
  assert: any,
  test: MarkupTestDescriptor,
  platform: any
): Promise<void> {
  console.log("TEST: ", test.name);
  console.log("SNAP: ", test.snapshot);
  var id = "surveyElement" + platform.name;
  var surveyElement = document.getElementById(id);
  var reportElement = document.getElementById(id + "_report");

  const ns = getFullStoryNs();
  if (!ns) {
    addFullstorysnippet();
  }

  try {
    await waitForFullStory();
  } catch (e) {
    console.log("cant get fullstory");
  }
  if (surveyElement) {
    surveyElement.innerHTML = "";
  } else {
    surveyElement = document.createElement("div");
    surveyElement.id = id;
    surveyElement.style.display = "none";
    document.body.appendChild(surveyElement);
    reportElement = document.createElement("div");
    reportElement.id = id + "_report";
    document.body.appendChild(reportElement);
  }
  var done = assert.async();
  settings.animationEnabled = false;
  if (test.before) test.before();
  platform.survey = platform.surveyFactory(test.json);
  platform.survey.textUpdateMode = "onTyping";
  platform.survey.updateButtonValuesCallBack = () => {};
  platform.survey[test.event || "onAfterRenderQuestion"].add(function (
    survey: SurveyModel,
    options: any
  ) {
    setTimeout(() => {
      let htmlElement = options.htmlElement;
      if (!!test.getElement) {
        htmlElement = test.getElement(options.htmlElement);
      }
      var all = htmlElement.getElementsByTagName("*");
      for (var i = 0, max = all.length; i < max; i++) {
        clearAttributes(all[i], test.removeIds);
        clearClasses(all[i]);
      }
      sortAttributes(all);
      let newEl = document.createElement("div");
      newEl.innerHTML = clearExtraElements(htmlElement.innerHTML);
      if (!test.getElement) {
        newEl = newEl.children[0] as any;
      }
      let str = newEl.innerHTML;
      if (newEl.getElementsByTagName("form").length) {
        str = newEl.getElementsByTagName("form")[0].innerHTML;
      }
      if (!!test.getSnapshot) {
        str = test.getSnapshot(options.htmlElement);
      }

      var re = /(<!--[\s\S]*?-->)/g;
      var newstr = str.replace(re, "");
      newstr = newstr.replace(/(>\s+<)/g, "><").trim();
      var oldStr =
        test.etalon || (!test.etalon && platform.getStrFromHtml(test.snapshot));
      oldStr = oldStr.replace(/(\r\n|\n|\r|\t)/gm, "");
      oldStr = oldStr.replace(/(> +<)/g, "><").trim();

      //temp
      newstr = sortClasses(newstr);
      oldStr = sortClasses(oldStr);
      newstr = sortInlineStyles(newstr);
      oldStr = sortInlineStyles(oldStr);

      assert.equal(
        newstr,
        oldStr,
        newstr == oldStr
          ? platform.name + " " + test.name + " rendered correctly"
          : platform.name +
              " " +
              test.name +
              " rendered incorrectly, see http://localhost:9876/debug.html#" +
              test.snapshot
      );
      settings.animationEnabled = true;
      if (test.after) {
        test.after();
      }
      if (platform.finish) platform.finish(surveyElement);
      if (newstr != oldStr) {
        var form = document.createElement("form");
        form.action = "https://text-compare.com/";
        form.target = "_blank";
        form.method = "post";
        form.id = test.snapshot;
        reportElement.appendChild(form);

        var testTitle = document.createElement("h1");
        testTitle.innerText = test.name + " (" + test.snapshot + ")";
        form.appendChild(testTitle);

        var table = document.createElement("table");
        form.appendChild(table);
        var tableRow = document.createElement("tr");
        table.appendChild(tableRow);
        var tableCell1 = document.createElement("td");
        var tableCell2 = document.createElement("td");
        var tableCell3 = document.createElement("td");
        tableRow.appendChild(tableCell1);
        tableRow.appendChild(tableCell2);
        tableRow.appendChild(tableCell3);

        var caption = document.createElement("h2");
        caption.innerText = "Expected:";
        tableCell1.appendChild(caption);
        var preEl = document.createElement("textarea");
        preEl.value = format(oldStr);
        preEl.name = "text1";
        tableCell1.appendChild(preEl);

        var caption2 = document.createElement("h2");
        caption2.innerText = "Actual:";
        tableCell2.appendChild(caption2);
        var preEl2 = document.createElement("textarea");
        preEl2.value = format(newstr);
        preEl2.name = "text2";
        tableCell2.appendChild(preEl2);

        var caption3 = document.createElement("h2");
        caption3.innerText = "Do:";
        tableCell3.appendChild(caption3);
        var submit = document.createElement("button");
        submit.innerText = "Compare on https://text-compare.com/";
        tableCell3.appendChild(submit);
        tableCell3.appendChild(document.createElement("br"));

        var download = document.createElement("a");
        download.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(format(newstr))
        );
        download.setAttribute("download", test.snapshot + ".snap.html");
        download.innerText = "Download snapshot";
        tableCell3.appendChild(download);
      }
      done();
    }, test.timeout || 10);
  });
  platform.survey.focusFirstQuestionAutomatic = false;
  if (test.initSurvey) test.initSurvey(platform.survey);
  platform.survey.getAllQuestions().map((q, i) => {
    q.id = "testid" + i;
    if (q.getType() === "paneldynamic") {
      q.panels.forEach((p, j) => {
        p.id = q.id + "panel" + j;
        p.questions.forEach((pq, k) => {
          pq.id = p.id + "question" + k;
        });
      });
    }
    if (q.getType() == "matrix" && platform.name == "Knockout") {
      //need to update rows full names
      q.onRowsChanged();
    }
    if (q.getType() === "matrixdynamic" || q.getType() === "matrixdropdown") {
      q.renderedTable.rows.forEach((row: any, rowIndex: number) => {
        if (row.row) {
          row.row.idValue = `${q.id}row${rowIndex}`;
        }
        row.cells.forEach((cell: any, cellIndex: number) => {
          if (cell.hasQuestion) {
            cell.question.id = `${q.id}row${rowIndex}cell${cellIndex}`;
          }
        });
      });
    }
    if (q.getType() === "file") {
      q.pages.forEach((p, j) => {
        p.id = q.id + "page" + j;
      });
    }
  });
  platform.survey.getAllPanels().map((p: PanelModel, i: number) => {
    p.id = "testidp" + i;
  });
  platform.survey.pages.map((p: PanelModel, i: number) => {
    p.id = "testidpage" + i;
  });
  platform.render(platform.survey, surveyElement);
}

const removeExtraElementsConditions: Array<
  (htmlElement: HTMLElement) => boolean
> = [
  (htmlElement: HTMLElement) =>
    htmlElement.classList.contains("sv-vue-title-additional-div"),
  (HTMLElement: HTMLElement) =>
    HTMLElement.tagName.toLowerCase().search(/^sv-/) > -1,
  // Remove FullStory wrapper divs - divs that contain only form elements and have no meaningful content
  (htmlElement: HTMLElement) => {
    if (htmlElement.tagName.toLowerCase() !== "div") return false;

    // Check if the div has any FullStory attributes
    const hasFullStoryAttrs = Array.from(htmlElement.attributes).some(
      (attr) =>
        attr.name.startsWith("data-fs-") ||
        attr.name.startsWith("data-checkbox-item-") ||
        attr.name.startsWith("data-imagepicker-item-") ||
        attr.name.startsWith("data-radio-item-") ||
        attr.name.startsWith("data-rating-item-")
    );

    // If no FullStory attributes, check if it's a simple wrapper with no classes/ids
    const isSimpleWrapper =
      !htmlElement.className &&
      !htmlElement.id &&
      htmlElement.attributes.length === 0;

    // Check if div contains only form elements (textarea, input, select, etc.)
    const children = Array.from(htmlElement.children);
    const hasOnlyFormElements =
      children.length > 0 &&
      children.every((child) => {
        const tagName = child.tagName.toLowerCase();
        return (
          ["textarea", "input", "select", "button"].indexOf(tagName) !== -1 ||
          child.classList.contains("sv-") || // SurveyJS components
          child.classList.contains("sd-")
        ); // SurveyJS components
      });

    return (hasFullStoryAttrs || isSimpleWrapper) && hasOnlyFormElements;
  },
];

function clearExtraElements(innerHTML: string): string {
  const container = document.createElement("div");
  container.innerHTML = innerHTML;
  container.querySelectorAll("*").forEach((el) => {
    if (
      removeExtraElementsConditions.some((condition) =>
        condition(<HTMLElement>el)
      )
    ) {
      removeExtraElement(<HTMLElement>el);
    }
  });
  return container.innerHTML;
}

function removeExtraElement(el: HTMLElement) {
  const parentEl = el.parentElement || el;
  let nextSibling: any = el.nextSibling;
  el.remove();
  while (el.children.length > 0) {
    const childEl = el.children[el.children.length - 1];
    parentEl.insertBefore(el.children[el.children.length - 1], nextSibling);
    nextSibling = childEl;
  }
}

function clearClasses(el: Element) {
  let classesToRemove: Array<string> = [];
  if (el.className !== "") {
    el.classList.forEach((className: string) => {
      if (className.search(/^ng-/) > -1) {
        classesToRemove.push(className);
      }
      if (
        ["top", "bottom"].filter(
          (direction) => className == `sv-popup--${direction}`
        ).length > 0
      ) {
        classesToRemove.push(className);
      }
    });
    el.classList.remove(...classesToRemove);
  }
  if (el.className === "") {
    el.removeAttribute("class");
  }
}

function removeFullStoryAttributes(el: Element) {
  // Remove all FullStory data attributes by pattern matching
  const attributesToRemove = [];
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    const name = attr.name;

    // Match FullStory patterns but preserve essential SurveyJS attributes:
    // - data-fs-* (general FullStory attributes)
    // - data-checkbox-item-* (checkbox specific attributes)
    // - data-imagepicker-item-* (imagepicker specific attributes)
    // - data-rating-item-* (rating specific attributes)
    // - data-radio-item-* (radio specific attributes)
    // Note: data-sv-drop-target-* are essential SurveyJS attributes, not FullStory
    if (
      name.startsWith("data-fs-") ||
      name.startsWith("data-checkbox-item-") ||
      name.startsWith("data-radio-item-") ||
      name.startsWith("data-imagepicker-item-") ||
      name.startsWith("data-rating-item-")
    ) {
      attributesToRemove.push(name);
    }
  }

  // Remove all matched attributes
  attributesToRemove.forEach((attr) => {
    el.removeAttribute(attr);
  });
}

function clearAttributes(el: Element, removeIds = false) {
  //el.removeAttribute("aria-labelledby");
  el.removeAttribute("survey");
  el.removeAttribute("data-bind");
  el.removeAttribute("data-key");
  el.removeAttribute("data-rendered");

  // Remove all FullStory data attributes
  removeFullStoryAttributes(el);

  if (!!removeIds) {
    el.removeAttribute("id");
  }
  //el.removeAttribute("aria-errormessage");
  //if(el.getAttribute("list")) el.removeAttribute("list");
  el.removeAttribute("fragment");
  if (el.getAttribute("style") === "") {
    el.removeAttribute("style");
  }
  if (
    (el.classList.contains("sv-popup__container") ||
      el.classList.contains("sv-popup__pointer")) &&
    el.hasAttribute("style")
  ) {
    el.removeAttribute("style");
  }
  if (el.getAttribute("src") === "") {
    el.removeAttribute("src");
  }
  if (
    el.classList.contains("sv-list__input") &&
    el.getAttribute("value") === ""
  ) {
    el.removeAttribute("value");
  }
  if ((<any>el).checked) {
    el.setAttribute("checked", "");
  }
  if ((<any>el).autoplay) {
    el.setAttribute("autoplay", "");
  }
  if ((<any>el).multiple) {
    el.setAttribute("multiple", "");
  }
  if (el.hasAttribute("readonly")) el.setAttribute("readonly", "");
  if (el.hasAttribute("required")) el.setAttribute("required", "");
  if (el.hasAttribute("disabled")) el.setAttribute("disabled", "");
  if (el.hasAttribute("ng-reflect-value")) {
    el.setAttribute("value", <string>el.getAttribute("ng-reflect-value"));
  }

  const attributesToRemove = [];
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (attr.name.search(/^(_ng|ng-|sv-ng)/) > -1) {
      attributesToRemove.push(el.attributes[i].name);
    }
  }
  attributesToRemove.forEach((attr) => {
    el.removeAttribute(attr);
  });
}

function sortClasses(str: string) {
  const div = document.createElement("div");
  div.innerHTML = str;
  div.querySelectorAll("*").forEach((el) => {
    if (el.className !== "") {
      const classList = el.classList.value.replace(/\s+/, " ").split(" ");
      el.classList.value = classList
        .sort((a: string, b: string) => a.localeCompare(b))
        .join(" ");
    }
  });
  return div.innerHTML;
}

function sortInlineStyles(str: string) {
  const div = document.createElement("div");
  div.innerHTML = str;
  div.querySelectorAll("*").forEach((el) => {
    if (!!el.getAttribute("style")) {
      const inlineStyle = (<string>el.getAttribute("style"))
        .replace(/(;)\s+|;$/g, "$1")
        .split(/;(?![^(]*\))/);
      if (el.tagName === "CANVAS") {
        const excludeStyles = ["touch-action: none", "touch-action: auto"];
        excludeStyles.forEach((excludeStyle) => {
          if (inlineStyle.indexOf(excludeStyle) !== -1) {
            inlineStyle.splice(inlineStyle.indexOf(excludeStyle), 1);
          }
        });
      }
      const flexRules = ["flex-grow", "flex-shrink", "flex-basis"];
      const flexStyles: Array<string> = [];
      flexRules.forEach((rule) => {
        const flexStyle = inlineStyle.filter((style) =>
          style.includes(rule)
        )[0];
        if (flexStyle) {
          flexStyles.push(flexStyle);
        }
      });
      if (flexStyles.length == 3) {
        inlineStyle.push(
          `flex:${flexStyles
            .map((style) => {
              inlineStyle.splice(inlineStyle.indexOf(style), 1);
              const match = style.replace(/\s*(:)\s*/, "$1").match(/:(.*)/);
              return match ? match[1] : "";
            })
            .join(" ")}`
        );
      }
      el.setAttribute(
        "style",
        inlineStyle
          .sort((a: string, b: string) => a.localeCompare(b))
          .map((style) =>
            style
              .replace(/\s*(:)\s*/, "$1")
              .replace(/url\(([^"].*[^"])\)/, 'url("$1")')
          )
          .join("; ") + ";"
      );
    }
  });
  return div.innerHTML;
}
