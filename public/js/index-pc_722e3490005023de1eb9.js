(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{109:function(t,e,n){t.exports=n(212)},212:function(t,e,n){n(213),t.exports=n(47).parseInt},213:function(t,e,n){var s=n(59),i=n(214);s(s.G+s.F*(parseInt!=i),{parseInt:i})},214:function(t,e,n){var s=n(76).parseInt,i=n(185).trim,a=n(161),r=/^[-+]?0[xX]/;t.exports=8!==s(a+"08")||22!==s(a+"0x16")?function(t,e){var n=i(String(t),3);return s(n,e>>>0||(r.test(n)?16:10))}:s},348:function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"back-top",rawName:"v-back-top"}],staticClass:"index-page layout-a scroll",attrs:{nobar:"",pc:""},on:{scroll:t.onScroll}},[n("Header",{attrs:{theme:"dark",hideSide:"",backgroundColor:t.backgroundColor},on:{"on-search":function(e){return t._openSearch(1,t.condition.key)}},model:{value:t.condition.key,callback:function(e){t.$set(t.condition,"key",e)},expression:"condition.key"}}),t._v(" "),n("div",{staticClass:"sign"},[n("div",{staticClass:"stars"}),t._v(" "),n("div",{staticClass:"sign-container"},[n("div",{staticClass:"brand"},[n("MNote",{ref:"logo",attrs:{size:t.mNoteSize,weight:6}}),t._v(" "),n("p",{staticClass:"p2"},[t._v("从此便捷写笔记")])],1),t._v(" "),n("div",{staticClass:"main"},[n("h4",{staticClass:"title"},[n("div",{staticClass:"nav",class:{active:"signIn"===t.active},on:{click:function(e){t.active="signIn"}}},[t._v("登录")]),t._v(" "),n("b",[t._v("·")]),t._v(" "),n("div",{staticClass:"nav",class:{active:"signUp"===t.active},on:{click:function(e){t.active="signUp"}}},[t._v("注册")])]),t._v(" "),"signIn"===t.active?n("Form",{key:"signIn",ref:"signInForm",attrs:{model:t.signInForm,rules:t.signInRules},nativeOn:{submit:function(t){t.preventDefault()}}},[n("FormItem",{attrs:{prop:"email"}},[n("Input",{attrs:{clearable:"",autofocus:""},on:{"on-enter":function(e){return t._inputFocus("password")}},model:{value:t.signInForm.email,callback:function(e){t.$set(t.signInForm,"email",e)},expression:"signInForm.email"}},[n("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("邮箱")])])],1),t._v(" "),n("FormItem",{attrs:{prop:"password"}},[n("Input",{ref:"password",attrs:{type:"password",clearable:""},on:{"on-enter":t.signIn},model:{value:t.signInForm.password,callback:function(e){t.$set(t.signInForm,"password",e)},expression:"signInForm.password"}},[n("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("密码")])])],1),t._v(" "),n("FormItem",[n("Button",{attrs:{type:"primary",long:""},on:{click:t.signIn}},[t._v("登录")])],1),t._v(" "),n("FormItem",[n("div",{staticClass:"forget"},[t._v("忘记密码?")])])],1):n("Form",{key:"signOut",ref:"signUpForm",attrs:{model:t.signUpForm,rules:t.signUpRules},nativeOn:{submit:function(t){t.preventDefault()}}},[n("FormItem",{attrs:{prop:"name"}},[n("Input",{attrs:{clearable:"",autofocus:""},on:{"on-enter":function(e){return t._inputFocus("email")}},model:{value:t.signUpForm.name,callback:function(e){t.$set(t.signUpForm,"name",e)},expression:"signUpForm.name"}},[n("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("昵称")])])],1),t._v(" "),n("FormItem",{attrs:{prop:"email"}},[n("Input",{ref:"email",attrs:{clearable:""},on:{"on-enter":function(e){return t._inputFocus("password")}},model:{value:t.signUpForm.email,callback:function(e){t.$set(t.signUpForm,"email",e)},expression:"signUpForm.email"}},[n("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("邮箱")])])],1),t._v(" "),n("FormItem",{attrs:{prop:"password"}},[n("Input",{ref:"password",attrs:{clearable:"",type:"password"},on:{"on-enter":t.signUp},model:{value:t.signUpForm.password,callback:function(e){t.$set(t.signUpForm,"password",e)},expression:"signUpForm.password"}},[n("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("密码")])])],1),t._v(" "),n("FormItem",[n("Button",{attrs:{btn:"",type:"primary",long:""},on:{click:t.signUp}},[t._v("创建账号")])],1)],1)],1)])]),t._v(" "),n("div",{staticClass:"slide-container"},[t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),n("div",{staticClass:"bottom slide"},[n("div",{staticClass:"layout-wrapper"},[n("MNote",{attrs:{size:46,weight:6}}),t._v(" "),n("p",{staticClass:"slogan"},[t._v("从此便捷写笔记")])],1)])])],1)},i=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"slide"},[s("div",{staticClass:"layout-wrapper"},[s("h1",[t._v("随意切换编辑模式")]),t._v(" "),s("h2",[t._v("所见即所得")]),t._v(" "),s("p",[t._v("所见即所得模式对不熟悉 Markdown 的用户较为友好，熟悉 Markdown 的话也可以无缝使用。")]),t._v(" "),s("img",{staticClass:"img-w100",attrs:{src:n(415)}}),t._v(" "),s("h2",[t._v("即时渲染")]),t._v(" "),s("p",[t._v("即时渲染模式对熟悉 Typora 的用户应该不会感到陌生，理论上这是最优雅的 Markdown 编辑方式。")]),t._v(" "),s("img",{staticClass:"img-w100",attrs:{src:n(416)}}),t._v(" "),s("h2",[t._v("分屏预览")]),t._v(" "),s("p",[t._v("传统的分屏预览模式适合大屏下的 Markdown 编辑。")]),t._v(" "),s("img",{staticClass:"img-w100",attrs:{src:n(417)}})])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"slide"},[n("div",{staticClass:"layout-wrapper"},[n("h1",[t._v("丰富主题样式")]),t._v(" "),n("h2",[t._v("4种内容主题")]),t._v(" "),n("div",{staticClass:"space-between"},[n("img",{attrs:{src:"//mnote.tingkl.com/file/0NQA8i4rIIaCmxxOh6cBgg.png?w=370"}}),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/BH8fCgrlbvSm2T4O5YvtwQ.png?w=370"}}),t._v(" "),n("img",{staticClass:"img-theme-mb",attrs:{src:"//mnote.tingkl.com/file/YpXiWGor6OP_V7ckuCONdQ.png"}})]),t._v(" "),n("h2",[t._v("37种代码高亮样式")]),t._v(" "),n("div",{staticClass:"space-between"},[n("img",{attrs:{src:"//mnote.tingkl.com/file/wYc1q889YUw3swNCxZzCAw.png?w=370"}}),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/Wnf0KAI0jZf3HkRd8zl99g.png?w=370"}})]),t._v(" "),n("h2",[t._v("个性化颜色定制")]),t._v(" "),n("p",[t._v("让界面符合你的feel~")]),t._v(" "),n("div",{staticClass:"absolute"},[n("img",{staticClass:"img-color",attrs:{src:"//mnote.tingkl.com/file/8NCUo_bDYy1aN4RHqsqCug.png?w=180"}}),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/ArZ0Fd7VBXczrWchekzQ2w.png?w=750"}})])])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"slide"},[n("div",{staticClass:"layout-wrapper"},[n("h1",[t._v("核心功能")]),t._v(" "),n("h2",[t._v("服务级图片缩放")]),t._v(" "),n("p",[t._v("\n                    3r0JrsFhwHVuICBySXWZHQ.jpeg?w=200"),n("br"),t._v("\n                    3r0JrsFhwHVuICBySXWZHQ.jpeg?h=100\n                ")]),t._v(" "),n("div",{staticClass:"space-between"},[n("div",[n("img",{attrs:{src:"/file/3r0JrsFhwHVuICBySXWZHQ.jpeg"}}),t._v(" "),n("blockquote",[n("p",[t._v("原始尺寸 400*300")])])]),t._v(" "),n("div",[n("img",{attrs:{src:"/file/3r0JrsFhwHVuICBySXWZHQ.jpeg?w=200"}}),t._v(" "),n("blockquote",[n("p",[t._v("指定宽度w200px")])])]),t._v(" "),n("div",{staticStyle:{width:"133px"}},[n("img",{attrs:{src:"/file/3r0JrsFhwHVuICBySXWZHQ.jpeg?h=100"}}),t._v(" "),n("blockquote",[n("p",[t._v("指定高度h100px")])])])]),t._v(" "),n("h2",[t._v("一键博客+全文检索")]),t._v(" "),n("p",[t._v("笔记公开为文章，全局大纲导航")]),t._v(" "),n("div",{staticClass:"space-between"},[n("img",{attrs:{src:"//mnote.tingkl.com/file/8Awiu4dhoapQuW31QzBwUQ.png?h=344"}}),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/Jk3X6xAFRjFZGvQMo1cx9Q.png?w=538"}})]),t._v(" "),n("div",{staticClass:"space-between"},[n("img",{attrs:{src:"//mnote.tingkl.com/file/0BOE5aKFAKTOgjvbsuyORA.png?h=344"}}),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/0caMuYehPJ1ebFJ5eTkyEA.png?w=538"}})]),t._v(" "),n("h2",[t._v("加密分享")]),t._v(" "),n("div",{staticClass:"jm"},[n("img",{staticClass:"img-a",attrs:{src:"//mnote.tingkl.com/file/RhcGlpWNAHgNKN3djF6jkA.png?h=90"}}),t._v(" "),n("img",{staticClass:"img-b",attrs:{src:"//mnote.tingkl.com/file/ZJKxKJiUDbEDU9xscsh04A.png?h=130"}}),t._v(" "),n("img",{staticClass:"img-w100",attrs:{src:"//mnote.tingkl.com/file/MptL_5bLaSM1saa3z8QWxQ.png"}})]),t._v(" "),n("div",{staticClass:"space-between"},[n("img",{attrs:{src:"//mnote.tingkl.com/file/BVL4YDChGQmknkQC1fIGSQ.png?w=240"}}),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/IdETTN_f7ZJrutGxTdCnCw.png?w=240"}}),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/YlKJGz-IZ6AqbqVd3ODbWw.png?w=240"}})]),t._v(" "),n("h2",[t._v("导入导出")]),t._v(" "),n("p",[t._v("无缝迁移")]),t._v(" "),n("div",{staticClass:"absolute"},[n("img",{staticClass:"img-share",attrs:{src:"//mnote.tingkl.com/file/6dC6n2mvuoKDcu6Qlb9SNA.png?w=240"}}),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/1QVmMorC4g20SU5HncyITw.png?w=750"}})]),t._v(" "),n("h2",[t._v("语法支持")]),t._v(" "),n("p",[t._v("\n                    所有 CommonMark 语法：分隔线、ATX 标题、Setext 标题、缩进代码块、围栏代码块、HTML 块、链接引用定义、段落、块引用、列表、反斜杠转义、HTML 实体、行级代码、强调、加粗、链接、图片、行级 HTML、硬换行、软换行和纯文本。"),n("br"),t._v("\n                    所有 GFM 语法：表格、任务列表项、删除线、自动链接、XSS 过滤"),n("br"),t._v("\n                    常用 Markdown 扩展语法：脚注、ToC、自定义标题 ID"),n("br")]),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/TMlMs7iToKZSNwn8KwRutg.png?w=750"}})])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"slide"},[n("div",{staticClass:"layout-wrapper"},[n("h1",[t._v("公式与图表")]),t._v(" "),n("h2",[t._v("数学公式")]),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/0B0VvT9OrWn34WlncYgnjw.png?w=750"}}),t._v(" "),n("h2",[t._v("脑图")]),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/4BF3b0Y1eDezlUqSiv3ehQ.jpeg?w=750"}}),t._v(" "),n("h2",[t._v("流程图")]),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/p77rXXUnHYl9efhzr4727A.jpeg?w=750"}}),t._v(" "),n("h2",[t._v("时序图")]),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/JqDSjNx8oihO_KOLDV514g.jpeg?w=750"}}),t._v(" "),n("h2",[t._v("甘特图")]),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/LaEHLcOMQgbq6E6M1sOomw.jpeg?w=750"}}),t._v(" "),n("h2",[t._v("EChart")]),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/TZAqYKruTY2ExI2kgZcqrQ.jpeg?w=750"}}),t._v(" "),n("h2",[t._v("Graphviz")]),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/BTlQiTI_bJdoLGQD0wwvHg.jpeg?w=750"}}),t._v(" "),n("h2",[t._v("五线谱")]),t._v(" "),n("img",{attrs:{src:"//mnote.tingkl.com/file/pCR6z5fiFvNu8_M0eH6XVQ.jpeg?w=750"}})])])}];s._withStripped=!0;var a=n(404),r=n(184),o={mixins:[n(405).a],components:{MNote:r.a,Header:a.a}},c=(n(418),n(3)),l=Object(c.a)(o,s,i,!1,null,null,null);l.options.__file="src/index/pc.vue";e.default=l.exports},356:function(t,e,n){},361:function(t,e,n){},363:function(t,e,n){"use strict";var s=function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"icon-text",attrs:{mb:this.mb}},[e("awesome",{attrs:{icon:this.icon,size:this.size}}),this._t("default",[this._v(this._s(this.text))])],2)};s._withStripped=!0;var i={props:{mb:Boolean,icon:String,text:String,size:{type:Number,default:14}}},a=(n(364),n(3)),r=Object(a.a)(i,s,[],!1,null,null,null);r.options.__file="src/component/common/icon-text.vue";e.a=r.exports},364:function(t,e,n){"use strict";var s=n(356);n.n(s).a},365:function(t,e,n){},371:function(t,e,n){"use strict";var s=n(361);n.n(s).a},374:function(t,e,n){"use strict";var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"search",attrs:{state:t.proxy?"focus":t.state}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.proxy,expression:"proxy"}],ref:"input",attrs:{placeholder:"搜索"},domProps:{value:t.proxy},on:{blur:function(e){t.state="blur"},focus:function(e){t.state="focus"},keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.$emit("on-search")},input:function(e){e.target.composing||(t.proxy=e.target.value)}}}),t._v(" "),n("div",{staticClass:"icon"},[n("Icon",{attrs:{type:"ios-search"},nativeOn:{click:function(e){return e.preventDefault(),t.$emit("on-search")}}})],1),t._v(" "),n("transition",{attrs:{name:"fade"}},[t.proxy&&"focus"===t.state?n("Icon",{attrs:{type:"ios-close-circle"},nativeOn:{click:function(e){t.proxy=""}}}):t._e()],1)],1)};s._withStripped=!0;var i={props:{value:{type:String,default:""},autofocus:{type:Boolean,default:!0}},watch:{state:function(t){"blur"===t&&this.$emit("on-blur")},value:function(t){this.proxy=t},proxy:function(t){this.$emit("input",t)}},mounted:function(){this.$refs.input.focus()},data:function(){return{state:"",proxy:this.value}}},a=(n(371),n(3)),r=Object(a.a)(i,s,[],!1,null,"52e0b41e",null);r.options.__file="src/component/common/search.vue";e.a=r.exports},379:function(t,e,n){"use strict";var s=n(365);n.n(s).a},380:function(t,e,n){},404:function(t,e,n){"use strict";var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"header layout-header",style:t.style,attrs:{theme:t.theme}},[n("div",{staticClass:"layout-limit"},[n("div",{staticClass:"layout-wrapper-side"},[t.hideSide?t._e():n("m-note",{nativeOn:{click:function(e){return t._openIndex()}}})],1),t._v(" "),n("div",{staticClass:"layout-wrapper"},[n("div",{staticClass:"nav",class:{active:"home"===t.active},on:{click:function(e){return t._openIndex(!1)}}},[n("IconText",{attrs:{icon:t._icon.home,size:"20"}},[t._v("首页")])],1),t._v(" "),n("Search",{attrs:{theme:t.theme,autofocus:""},on:{"on-search":function(e){return t.$emit("on-search")}},model:{value:t.proxy,callback:function(e){t.proxy=e},expression:"proxy"}})],1),t._v(" "),n("div",{staticClass:"layout-wrapper-side"},[t.account?n("IconText",{staticClass:"hover-primary-20",attrs:{icon:t._icon.write,size:"20"},nativeOn:{click:function(e){return t._openMain()}}},[t._v("写笔记")]):t.hideSide?t._e():n("div",{staticClass:"opts"},[t.signIn?t._e():n("span",{on:{click:function(e){return t._linkTo("sign.html")}}},[t._v("登录")]),t._v(" "),t.signIn||t.signUp?t._e():[t._v(" | ")],t._v(" "),t.signUp?t._e():n("span",{on:{click:function(e){return t._linkTo("sign.html",{up:1})}}},[t._v("注册")])],2)],1)])])};s._withStripped=!0;var i=n(184),a=n(363),r={components:{Search:n(374).a,IconText:a.a,MNote:i.a},props:{backgroundColor:{type:String,default:""},hideSide:{type:Boolean,default:!1},value:{type:String,default:null},theme:{type:String,default:"dark"},signIn:{type:Boolean,default:!1},signUp:{type:Boolean,default:!1},active:{type:String,default:""}},data:function(){return{proxy:this.value}},watch:{value:function(t){this.proxy=t},proxy:function(t){this.$emit("input",t)}},computed:{account:function(){return this.$store.state.account},style:function(){var t={};return this.backgroundColor&&(t.backgroundColor=this.backgroundColor),t}}},o=(n(379),n(3)),c=Object(o.a)(r,s,[],!1,null,null,null);c.options.__file="src/component/business/header.vue";e.a=c.exports},405:function(t,e,n){"use strict";var s=n(10),i=n.n(s),a=n(14),r=n.n(a),o=n(8),c=n.n(o),l=n(9),p=n.n(l),u=n(7),v=n.n(u),m=n(11),g=n.n(m),_=n(13),d=n.n(_),f=n(1),h=function(t,e){if(!t)return e(t);var s=window.G.saltForm,i=""+s.charAt(0)+s.charAt(2)+t+s.charAt(5)+s.charAt(4);n.e(14).then(n.t.bind(null,446,7)).then((function(t){var n=t.default;e(n(i))}))};function w(t,e){var n=g()(t);if(v.a){var s=v()(t);e&&(s=s.filter((function(e){return p()(t,e).enumerable}))),n.push.apply(n,s)}return n}function k(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?w(n,!0).forEach((function(e){d()(t,e,n[e])})):c.a?r()(t,c()(n)):w(n).forEach((function(e){i()(t,e,p()(n,e))}))}return t}e.a={data:function(){var t=f.a.util.query2Json();return{backgroundColor:"rgba(10, 12, 16, 0)",mNoteSize:Math.round(.1*document.documentElement.offsetHeight),condition:{key:""},isMobile:f.a.util.isMobile,active:t.up?"signUp":"signIn",signInForm:{email:"",password:""},signInRules:{email:[{required:!0,message:"邮箱必填",trigger:"change"},{type:"email",message:"邮箱格式有误",trigger:"change"}],password:[{required:!0,message:"密码必填",trigger:"change"},{type:"string",min:8,message:"密码至少8位",trigger:"blur"}]},signUpRules:{email:[{required:!0,message:"邮箱必填",trigger:"change"},{type:"email",message:"邮箱格式有误",trigger:"change"}],password:[{required:!0,message:"密码必填",trigger:"change"},{type:"string",min:8,message:"密码至少8位",trigger:"blur"}],name:[{required:!0,message:"用户名必填",trigger:"change"}]},signUpForm:{email:"",password:"",name:""}}},methods:{onScroll:function(t){var e="0",n=t.target.scrollTop;n>600?e="1":(e=(n/600).toFixed(1),0===n&&this.$refs.logo.animate()),this.backgroundColor="rgba(10, 12, 16, ".concat(e,")")},signIn:function(){var t=this;this._validateForm("signInForm",(function(){h(t.signInForm.password,(function(e){f.a.user.signIn(k({},t.signInForm,{password:e})).then((function(e){var n=e.code;e.data;0===n&&(t.isMobile?t._linkTo("search.html"):t._linkTo("main.html"))}))}))}))},signUp:function(){var t=this;this._validateForm("signUpForm",(function(e){h(t.signUpForm.password,(function(e){f.a.user.signUp(k({},t.signUpForm,{password:e})).then((function(e){var n=e.code;e.data;0===n&&(t.$Modal.success({title:"创建成功",content:"账号:"+t.signUpForm.email+"<br/>密码:"+t.signUpForm.password}),t.active="signIn")}))}))}))}}}},415:function(t,e,n){t.exports=n.p+"image/wysiwyg.0695c839ffe9c49d0309b2332fb60182.gif"},416:function(t,e,n){t.exports=n.p+"image/ir.cac1ebd8bdc7346de66d94832bd4b031.gif"},417:function(t,e,n){t.exports=n.p+"image/sv.b9c8af39ccb8d2a991d3e9994783b043.gif"},418:function(t,e,n){"use strict";var s=n(380);n.n(s).a}}]);