"use strict";(self["webpackChunkeasygpt"]=self["webpackChunkeasygpt"]||[]).push([[297],{2088:function(e,t,n){n.a(e,(async function(e,l){try{var o=n(3396),a=n(7139),s=n(4870),c=n(9242),i=n(2483),r=n(7877),u=n(5216),m=e([r]);r=(m.then?(await m)():m)[0];const d=e=>((0,o.dD)("data-v-5779fa7c"),e=e(),(0,o.Cn)(),e),f={class:"setting-scroll"},p={class:"setting"},h={class:"block"},b={class:"item"},v=d((()=>(0,o._)("h3",null,"主题（ 暗 / 亮 ）",-1))),g={class:"item"},w=d((()=>(0,o._)("h3",null,"字体大小",-1))),y={class:"custom-button"},B={class:"block"},_={class:"item"},k=d((()=>(0,o._)("h3",null,"API KEY",-1))),C={class:"item"},W=d((()=>(0,o._)("h3",null,"启用代理",-1))),x={class:"item"},S=d((()=>(0,o._)("h3",null,"模型",-1))),V=d((()=>(0,o._)("option",null,"gpt-3.5-turbo",-1))),T=d((()=>(0,o._)("option",null,"gpt-4",-1))),z=[V,T],P={class:"item"},U=d((()=>(0,o._)("h3",null,"余额",-1))),D={style:{color:"#1989FA","font-weight":"bold"}},N={class:"item"},O=d((()=>(0,o._)("h3",null,"随机性",-1))),Z={class:"custom-button"},A={class:"item"},H=d((()=>(0,o._)("h3",null,"Token限制",-1))),I={class:"custom-button"},G={class:"item"},E=d((()=>(0,o._)("h3",null,"携带历史消息数",-1))),F={class:"custom-button"},J={class:"block"},Y={class:"item"},j=d((()=>(0,o._)("h3",null,"关于 EasyGPT",-1))),M={class:"item"},K=d((()=>(0,o._)("h3",null,"帮助文档",-1))),$={class:"item"},q=d((()=>(0,o._)("h3",null,"打赏",-1)));t.Z={__name:"Setting",setup(e){const t=(0,i.tv)(),n=(0,s.qj)({});function l(e){const t=JSON.parse(e||'{"theme":true,"fontSize":1,"key":"","baseUrl":"https://api.openai.com","model":"gpt-3.5-turbo","balance":0,"temperature":1,"maxToken":2000,"historyNumber":2}');n.theme=t.theme,n.balance=t.balance,n.fontSize=t.fontSize,n.useMarkdownView=t.useMarkdownView,n.key=t.key,n.baseUrl=t.baseUrl,n.model=t.model,n.balance=t.balance,n.temperature=t.temperature,n.maxToken=t.maxToken,n.historyNumber=t.historyNumber}return(0,o.bv)((async()=>{l(localStorage.setting),(0,o.YP)(n,(()=>{localStorage.setting=JSON.stringify(n)})),(0,o.YP)((()=>n.model),(e=>{"gpt-4"==e&&(0,u.WD)({message:"GPT4 的价格约为 GPT3.5 的 30 倍以上，你确定要使用吗 ?"}).then((()=>{})).catch((()=>{n.model="gpt-3.5-turbo"}))})),(0,o.YP)((()=>n.theme),(()=>{window.$5PlusAPI&&window.$5PlusAPI.switchTheme(n.theme)})),n.balance=(await(0,r.sb)()).total_granted})),(e,i)=>{const r=(0,o.up)("van-nav-bar"),u=(0,o.up)("van-switch"),m=(0,o.up)("van-slider"),d=(0,o.up)("van-field"),V=(0,o.up)("van-icon"),T=(0,o.up)("van-button");return(0,o.wg)(),(0,o.iD)("div",{class:(0,a.C_)(["container",n.theme?"bright":"dark"]),style:(0,a.j5)("font-size:"+n.fontSize+"em")},[(0,o.Wm)(r,{title:"GPT相关配置","left-arrow":"",onClickLeft:i[0]||(i[0]=e=>(0,s.SU)(t).back())}),(0,o._)("div",f,[(0,o._)("div",p,[(0,o._)("div",h,[(0,o._)("div",b,[v,(0,o.Wm)(u,{modelValue:n.theme,"onUpdate:modelValue":i[1]||(i[1]=e=>n.theme=e)},null,8,["modelValue"])]),(0,o._)("div",g,[w,(0,o.Wm)(m,{modelValue:n.fontSize,"onUpdate:modelValue":i[2]||(i[2]=e=>n.fontSize=e),max:"1.3",min:"0.8",step:"0.01"},{button:(0,o.w5)((()=>[(0,o._)("div",y,(0,a.zw)(n.fontSize),1)])),_:1},8,["modelValue"])])]),(0,o._)("div",B,[(0,o._)("div",_,[k,(0,o.Wm)(d,{modelValue:n.key,"onUpdate:modelValue":i[3]||(i[3]=e=>n.key=e),placeholder:"输入您的 KEY"},null,8,["modelValue"])]),(0,o._)("div",C,[W,(0,o.Wm)(d,{modelValue:n.baseUrl,"onUpdate:modelValue":i[4]||(i[4]=e=>n.baseUrl=e),placeholder:"https://api.openai.com"},null,8,["modelValue"])]),(0,o._)("div",x,[S,(0,o.wy)((0,o._)("select",{"onUpdate:modelValue":i[5]||(i[5]=e=>n.model=e)},z,512),[[c.bM,n.model]])]),(0,o._)("div",P,[U,(0,o._)("span",D,"剩余 "+(0,a.zw)(n.balance)+" P",1)]),(0,o._)("div",N,[O,(0,o.Wm)(m,{modelValue:n.temperature,"onUpdate:modelValue":i[6]||(i[6]=e=>n.temperature=e),max:"2",min:"0",step:"0.1"},{button:(0,o.w5)((()=>[(0,o._)("div",Z,(0,a.zw)(n.temperature),1)])),_:1},8,["modelValue"])]),(0,o._)("div",A,[H,(0,o.Wm)(m,{modelValue:n.maxToken,"onUpdate:modelValue":i[7]||(i[7]=e=>n.maxToken=e),max:"4000",min:"100",step:"100"},{button:(0,o.w5)((()=>[(0,o._)("div",I,(0,a.zw)(n.maxToken),1)])),_:1},8,["modelValue"])]),(0,o._)("div",G,[E,(0,o.Wm)(m,{modelValue:n.historyNumber,"onUpdate:modelValue":i[8]||(i[8]=e=>n.historyNumber=e),max:"10",min:"0",step:"1"},{button:(0,o.w5)((()=>[(0,o._)("div",F,(0,a.zw)(n.historyNumber),1)])),_:1},8,["modelValue"])])]),(0,o._)("div",J,[(0,o._)("div",Y,[j,(0,o.Wm)(V,{name:"arrow"})]),(0,o._)("div",M,[K,(0,o.Wm)(V,{name:"arrow"})]),(0,o._)("div",$,[q,(0,o.Wm)(V,{name:"arrow"})])]),(0,o.Wm)(T,{type:"primary",onClick:i[9]||(i[9]=e=>l())},{default:(0,o.w5)((()=>[(0,o.Uk)("恢复默认值")])),_:1})])])],6)}}},l()}catch(d){l(d)}}))},3297:function(e,t,n){n.a(e,(async function(e,l){try{n.r(t);var o=n(2904),a=(n(5043),n(89)),s=e([o]);o=(s.then?(await s)():s)[0];const c=(0,a.Z)(o.Z,[["__scopeId","data-v-5779fa7c"]]);t["default"]=c,l()}catch(c){l(c)}}))},5043:function(){},2904:function(e,t,n){n.a(e,(async function(e,l){try{n.d(t,{Z:function(){return o.Z}});var o=n(2088),a=e([o]);o=(a.then?(await a)():a)[0],l()}catch(s){l(s)}}))},5216:function(e,t,n){n.d(t,{WD:function(){return Y},vC:function(){return J}});var l=n(3396),o=n(2220),a=n(7548),s=n(4870),c=n(9242),i=n(610),r=n(5323),u=n(9951),m=n(6491),d=n(5322),f=n(6048),p=n(4877),h=n(6305),b=n(9545),v=n(1404),g=n(253),w=n(4373);const[y,B]=(0,i["do"])("action-bar"),_=Symbol(y),k={placeholder:Boolean,safeAreaInsetBottom:r.J5};var C=(0,l.aZ)({name:y,props:k,setup(e,{slots:t}){const n=(0,s.iH)(),o=(0,w.J)(n,B),{linkChildren:a}=(0,g.$E)(_);a();const c=()=>{var o;return(0,l.Wm)("div",{ref:n,class:[B(),{"van-safe-area-bottom":e.safeAreaInsetBottom}]},[null==(o=t.default)?void 0:o.call(t)])};return()=>e.placeholder?o(c):c()}});const W=(0,v.n)(C);var x=n(3444),S=n(6014);const[V,T]=(0,i["do"])("action-bar-button"),z=(0,o.l7)({},S.g2,{type:String,text:String,icon:String,color:String,loading:Boolean,disabled:Boolean});var P=(0,l.aZ)({name:V,props:z,setup(e,{slots:t}){const n=(0,S.yj)(),{parent:o,index:a}=(0,g.NB)(_),s=(0,l.Fl)((()=>{if(o){const e=o.children[a.value-1];return!(e&&"isButton"in e)}})),c=(0,l.Fl)((()=>{if(o){const e=o.children[a.value+1];return!(e&&"isButton"in e)}}));return(0,x.F)({isButton:!0}),()=>{const{type:o,icon:a,text:i,color:r,loading:u,disabled:m}=e;return(0,l.Wm)(b.zx,{class:T([o,{last:c.value,first:s.value}]),size:"large",type:o,icon:a,color:r,loading:u,disabled:m,onClick:n},{default:()=>[t.default?t.default():i]})}}});const U=(0,v.n)(P);const[D,N,O]=(0,i["do"])("dialog"),Z=(0,o.l7)({},p.W,{title:String,theme:String,width:r.Or,message:[String,Function],callback:Function,allowHtml:Boolean,className:r.Vg,transition:(0,r.SQ)("van-dialog-bounce"),messageAlign:String,closeOnPopstate:r.J5,showCancelButton:Boolean,cancelButtonText:String,cancelButtonColor:String,cancelButtonDisabled:Boolean,confirmButtonText:String,confirmButtonColor:String,confirmButtonDisabled:Boolean,showConfirmButton:r.J5,closeOnClickOverlay:Boolean}),A=[...p.m,"transition","closeOnPopstate"];var H=(0,l.aZ)({name:D,props:Z,emits:["confirm","cancel","keydown","update:show"],setup(e,{emit:t,slots:n}){const a=(0,s.iH)(),i=(0,s.qj)({confirm:!1,cancel:!1}),r=e=>t("update:show",e),p=t=>{var n;r(!1),null==(n=e.callback)||n.call(e,t)},v=n=>()=>{e.show&&(t(n),e.beforeClose?(i[n]=!0,(0,u.I)(e.beforeClose,{args:[n],done(){p(n),i[n]=!1},canceled(){i[n]=!1}})):p(n))},g=v("cancel"),w=v("confirm"),y=(0,c.D2)((n=>{var l,s;if(n.target!==(null==(s=null==(l=a.value)?void 0:l.popupRef)?void 0:s.value))return;const c={Enter:e.showConfirmButton?w:o.ZT,Escape:e.showCancelButton?g:o.ZT};c[n.key](),t("keydown",n)}),["enter","esc"]),B=()=>{const t=n.title?n.title():e.title;if(t)return(0,l.Wm)("div",{class:N("header",{isolated:!e.message&&!n.default})},[t])},_=t=>{const{message:n,allowHtml:o,messageAlign:a}=e,s=N("message",{"has-title":t,[a]:a}),c=(0,m.mf)(n)?n():n;return o&&"string"===typeof c?(0,l.Wm)("div",{class:s,innerHTML:c},null):(0,l.Wm)("div",{class:s},[c])},k=()=>{if(n.default)return(0,l.Wm)("div",{class:N("content")},[n.default()]);const{title:t,message:o,allowHtml:a}=e;if(o){const e=!(!t&&!n.title);return(0,l.Wm)("div",{key:a?1:0,class:N("content",{isolated:!e})},[_(e)])}},C=()=>(0,l.Wm)("div",{class:[d.k7,N("footer")]},[e.showCancelButton&&(0,l.Wm)(b.zx,{size:"large",text:e.cancelButtonText||O("cancel"),class:N("cancel"),style:{color:e.cancelButtonColor},loading:i.cancel,disabled:e.cancelButtonDisabled,onClick:g},null),e.showConfirmButton&&(0,l.Wm)(b.zx,{size:"large",text:e.confirmButtonText||O("confirm"),class:[N("confirm"),{[d.a8]:e.showCancelButton}],style:{color:e.confirmButtonColor},loading:i.confirm,disabled:e.confirmButtonDisabled,onClick:w},null)]),x=()=>(0,l.Wm)(W,{class:N("footer")},{default:()=>[e.showCancelButton&&(0,l.Wm)(U,{type:"warning",text:e.cancelButtonText||O("cancel"),class:N("cancel"),color:e.cancelButtonColor,loading:i.cancel,disabled:e.cancelButtonDisabled,onClick:g},null),e.showConfirmButton&&(0,l.Wm)(U,{type:"danger",text:e.confirmButtonText||O("confirm"),class:N("confirm"),color:e.confirmButtonColor,loading:i.confirm,disabled:e.confirmButtonDisabled,onClick:w},null)]}),S=()=>n.footer?n.footer():"round-button"===e.theme?x():C();return()=>{const{width:t,title:n,theme:s,message:c,className:i}=e;return(0,l.Wm)(h.GI,(0,l.dG)({ref:a,role:"dialog",class:[N([s]),i],style:{width:(0,f.Nn)(t)},tabindex:0,"aria-labelledby":n||c,onKeydown:y,"onUpdate:show":r},(0,o.ei)(e,A)),{default:()=>[B(),k(),S()]})}}});let I;const G={title:"",width:"",theme:null,message:"",overlay:!0,callback:null,teleport:"body",className:"",allowHtml:!1,lockScroll:!0,transition:void 0,beforeClose:null,overlayClass:"",overlayStyle:void 0,messageAlign:"",cancelButtonText:"",cancelButtonColor:null,cancelButtonDisabled:!1,confirmButtonText:"",confirmButtonColor:null,confirmButtonDisabled:!1,showConfirmButton:!0,showCancelButton:!1,closeOnPopstate:!0,closeOnClickOverlay:!1};let E=(0,o.l7)({},G);function F(){const e={setup(){const{state:e,toggle:t}=(0,a.o)();return()=>(0,l.Wm)(H,(0,l.dG)(e,{"onUpdate:show":t}),null)}};({instance:I}=(0,a.H)(e))}function J(e){return o._f?new Promise(((t,n)=>{I||F(),I.open((0,o.l7)({},E,e,{callback:e=>{("confirm"===e?t:n)(e)}}))})):Promise.resolve()}const Y=e=>J((0,o.l7)({showCancelButton:!0},e))}}]);
//# sourceMappingURL=297.dea19391.js.map