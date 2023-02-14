'use strict'

var webpackVersion = require('webpack/package.json').version;
var local = null;

function compilerHook (compilation) {
	if (webpackVersion < '4') {
		compilation.plugin('succeed-module', compilationHook);
	} else {
		compilation.hooks.succeedModule.tap('MonacoEditorChinesePlugin', compilationHook);
	}
};

function compilationHook (wpModule) {
	if(!wpModule.resource || !wpModule.resource.indexOf || wpModule.resource.replace(/\\+/g, "/").indexOf("esm/vs/nls.js")<0){
		return;
	}

	var langStr = local.getSelectLangStr();

	var endl = "\r\n";
	var code = wpModule._source._value;
	code = code.replace("export function localize", "       function _ocalize");

	code += endl + "function localize(data, message) {";
	code += endl + "	if(typeof(message) === 'string'){";
	code += endl + "		var idx = localize.mapLangIdx[message] || -1;";
	code += endl + "		var nlsLang = localize.mapNlsLang[localize.selectLang] || {};";
	code += endl + "";
	code += endl + "		if(idx in nlsLang){";
	code += endl + "			message = nlsLang[idx];";
	code += endl + "		}";
	if(local.options.logUnmatched){
		code += endl + "		else{";
		code += endl + "			console.info('unknown lang:' + message);";
		code += endl + "		}";
	}
	code += endl + "	}";
	code += endl + "";
	code += endl + "	var args = [];";
	code += endl + "	for(var i = 0; i < arguments.length; ++i){";
	code += endl + "		args.push(arguments[i]);";
	code += endl + "	}";
	code += endl + "	args[1] = message;";
	code += endl + "	return _ocalize.apply(this, args);";
	code += endl + "}";
	code += endl + "localize.selectLang = " + local.getSelectLangStr() + ";";
	if(langStr.indexOf('(') >= 0){
		code += endl + "try{ localize.selectLang = eval(localize.selectLang); }catch(ex){}";
	}
	code += endl + "localize.mapLangIdx = " + JSON.stringify(local.mapLangIdx) + ";";
	code += endl + "localize.mapNlsLang = " + JSON.stringify(local.lang) + ";";
	// code += endl + "var mapSelfLang = " + JSON.stringify(local.options.mapLanguages) + ";";
	code += endl + "";

	// wpModule._source = new OriginalSource(code, wpModule.identifier());
	wpModule._source._value = code;
};

// const { OriginalSource } = require("webpack-sources");
function MonacoEditorChinesePlugin(options = {}){
	this.options = {
		/**
		 * support languages list, .eg ["de"]
		 * embed language base on monaco-editor@0.14.6
		 * all available embed languages: de,es,fr,it,ja,ko,ru,zh-cn,zh-tw
		 * just add what you need to reduce the size
		 */
		languages: ['zh-cn'],
		/**
		 * default language name, .eg "de"
		 * use function string to set dynamic, .eg "$.cookie('language')"
		*/
		defaultLanguage: 'zh-cn',
		/**
		 * log on console if unmatched
		 */
		logUnmatched: options.logUnmatched || false,
		/**
		 * self languages map, .eg {"zh-cn": {"Find": "查找", "Search": "搜索"}, "de":{}, ... }
		 */
		mapLanguages: options.mapLanguages || {
      "zh-cn": {
        "Undo": "撤销",
        "Redo": "重做",
        "Select All": "全选",
        "Whether the editor text has focus (cursor is blinking)": "编辑器文本是否有焦点（光标在闪烁）",
        "Whether the editor or an editor widget has focus (e.g. focus is in the find widget)": "编辑器或编辑器小部件是否有焦点（例如，焦点在查找小部件中）",
        "Whether an editor or a rich text input has focus (cursor is blinking)": "编辑器或富文本输入是否有焦点（光标在闪烁）",
        "Whether the editor is read only": "编辑器是否只读",
        "Go to References": "转到引用",
        "Whether the context is a diff editor": "上下文是否是差异编辑器",
        "Whether `editor.columnSelection` is enabled": "是否启用了`editor.columnSelection`",
        "Whether the editor has text selected": "编辑器是否有选定的文本",
        "Whether the editor has multiple selections": "编辑器是否有多个选择",
        "Whether `Tab` will move focus out of the editor": "是否`Tab`将移动焦点出编辑器",
        "Whether the editor hover is visible": "编辑器悬停是否可见",
        "Whether the editor is part of a larger editor (e.g. notebooks)": "编辑器是否是较大编辑器的一部分（例如笔记本）",
        "The language identifier of the editor": "编辑器的语言标识符",
        "Whether the editor has a completion item provider": "编辑器是否具有完成项目提供程序",
        "Whether the editor has a code actions provider": "编辑器是否具有代码操作提供程序",
        "Whether the editor has a code lens provider": "编辑器是否具有代码透镜提供程序",
        "Whether the editor has a declaration provider": "编辑器是否具有声明提供程序",
        "Whether the editor has a definition provider": "编辑器是否具有定义提供程序",
        "Whether the editor has an implementation provider": "编辑器是否具有实现提供程序",
        "Whether the editor has a type definition provider": "编辑器是否具有类型定义提供程序",
        "Whether the editor has a document highlight provider": "编辑器是否具有文档高亮提供程序",
        "Whether the editor has a document symbol provider": "编辑器是否具有文档符号提供程序",
        "Whether the editor has a hover provider": "编辑器是否具有悬停提供程序",
        "Whether the editor has a reference provider": "编辑器是否具有引用提供程序",
        "Whether the editor has a rename provider": "编辑器是否具有重命名提供程序",
        "Whether the editor has a signature help provider": "编辑器是否具有签名帮助提供程序",
        "Whether the editor has an inline hints provider": "编辑器是否具有内联提示提供程序",
        "Whether the editor has a document formatting provider": "编辑器是否具有文档格式化提供程序",
        "Whether the editor has a document selection formatting provider": "编辑器是否具有文档选择格式化提供程序",
        "Whether the editor has multiple document formatting providers": "编辑器是否具有多个文档格式化提供程序",
        "Whether the editor has multiple document selection formatting providers": "编辑器是否具有多个文档选择格式化提供程序",
        "The editor will be permanently optimized for usage with a Screen Reader. Word wrapping will be disabled.": "编辑器将永久优化用于使用屏幕阅读器。将禁用自动换行。",
        "Controls whether the editor should run in a mode where it is optimized for screen readers. Setting to on will disable word wrapping.": "控制编辑器是否应运行在屏幕阅读器优化的模式下。设置为打开将禁用自动换行。",
        "Remove adjacent closing quotes or brackets only if they were automatically inserted.": "仅在自动插入的情况下删除相邻的右引号或方括号。",
        "Controls whether the editor should remove adjacent closing quotes or brackets when deleting.": "控制编辑器在删除时是否应删除相邻的右引号或括号。",
        "Peek": "查看",
        "Peek References": "查看引用",
      }
    },
	};

	this.langIdx = 0;
	this.mapLangIdx = {};
	this.lang = {};
	this.mapEmbedLangName = {};
	this.mapEmbedLangNameSelf = {};

	this.init();
	this.initLang();
}

module.exports = MonacoEditorChinesePlugin;

MonacoEditorChinesePlugin.prototype.apply = function(compiler) {
	local = this;

	if (webpackVersion < '4') {
		compiler.plugin("compilation", compilerHook);
	} else {
		compiler.hooks.compilation.tap('MonacoEditorChinesePlugin', compilerHook);
	}
}

MonacoEditorChinesePlugin.prototype.initLang = function(){
	var arr = this.options.languages;

	for(var i = 0 ;i < arr.length; ++i){
		if(!(arr[i] in this.mapEmbedLangName)) {
			return;
		}

		var obj = this.mapEmbedLangName[arr[i]];
		if(!obj){
			continue;
		}

		var rstObj = this.lang[arr[i]] || (this.lang[arr[i]] = {});
		this.initOneLang(rstObj, this.mapEmbedLangName["en"], obj);


		var objSelf = this.mapEmbedLangNameSelf[arr[i]];
		if(!objSelf){
			continue;
		}
		this.initSelfOneLang(rstObj, objSelf);

		objSelf = this.options.mapLanguages[arr[i]];
		if(!objSelf){
			continue;
		}
		this.initSelfOneLang(rstObj, objSelf);
	}
}

MonacoEditorChinesePlugin.prototype.initOneLang = function(rstObj, en, langObj){
	for (var key in en) {
		// console.info("aaa:", key, ",", !!en[key], ",", !!langObj);
		if (en && langObj && typeof(en[key]) === "string" && typeof(langObj[key]) === "string") {
			var idx = this.getLangIdx(en[key]);
			rstObj[idx] = langObj[key];
		} else if (en && langObj && en[key] && langObj[key] && typeof(en[key]) === "object" && typeof(langObj[key]) === "object") {
			this.initOneLang(rstObj, en[key], langObj[key]);
		}
	}
}

MonacoEditorChinesePlugin.prototype.initSelfOneLang = function(rstObj, obj){
	for (var key in obj) {
		var idx = this.getLangIdx(key);
		rstObj[idx] = obj[key];
	}
}

MonacoEditorChinesePlugin.prototype.getSelectLangStr = function(){
	var str = this.options.defaultLanguage;
	str = str.replace(/'/g, "\\'");
	str = str.replace(/\r\n/g, "\\r\\n");
	str = str.replace(/\n/g, "\\n");
	return "'" + str + "'";
	// return "'(" + str + ")'";
}

MonacoEditorChinesePlugin.prototype.getLangIdx = function(en){
	if(en in this.mapLangIdx){
		return this.mapLangIdx[en];
	}

	var idx = this.langIdx;
	this.mapLangIdx[en] = idx;
	this.langIdx++;

	return idx;
	// return "'(" + str + ")'";
}

MonacoEditorChinesePlugin.prototype.init = function(){
	//{en:index}
	this.mapLangIdx = {};

	//{de:{enIndex:"deLang"}, es:{}, ...}
	this.lang = { };

	this.mapEmbedLangName = {
		"zh-cn": require("./editor.main.nls.zh-cn"),
    "en": require("./editor.main.nls.en"),
	};

	//{"de":{"enLang":"deLang", ...}, es:{}, ...}
	this.mapEmbedLangNameSelf = {
		"zh-cn": {

		},
	}
}
