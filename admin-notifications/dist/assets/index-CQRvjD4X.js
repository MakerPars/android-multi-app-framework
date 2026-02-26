(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const u of o)if(u.type==="childList")for(const h of u.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const u={};return o.integrity&&(u.integrity=o.integrity),o.referrerPolicy&&(u.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?u.credentials="include":o.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function s(o){if(o.ep)return;o.ep=!0;const u=t(o);fetch(o.href,u)}})();function Ly(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Qh={exports:{}},Sa={},Yh={exports:{}},ke={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Km;function fw(){if(Km)return ke;Km=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),u=Symbol.for("react.provider"),h=Symbol.for("react.context"),m=Symbol.for("react.forward_ref"),y=Symbol.for("react.suspense"),v=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),A=Symbol.iterator;function R(O){return O===null||typeof O!="object"?null:(O=A&&O[A]||O["@@iterator"],typeof O=="function"?O:null)}var j={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},J=Object.assign,X={};function Q(O,H,Te){this.props=O,this.context=H,this.refs=X,this.updater=Te||j}Q.prototype.isReactComponent={},Q.prototype.setState=function(O,H){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,H,"setState")},Q.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function Ee(){}Ee.prototype=Q.prototype;function ge(O,H,Te){this.props=O,this.context=H,this.refs=X,this.updater=Te||j}var Ce=ge.prototype=new Ee;Ce.constructor=ge,J(Ce,Q.prototype),Ce.isPureReactComponent=!0;var Oe=Array.isArray,be=Object.prototype.hasOwnProperty,Ve={current:null},N={key:!0,ref:!0,__self:!0,__source:!0};function S(O,H,Te){var B,Z={},ue=null,Ie=null;if(H!=null)for(B in H.ref!==void 0&&(Ie=H.ref),H.key!==void 0&&(ue=""+H.key),H)be.call(H,B)&&!N.hasOwnProperty(B)&&(Z[B]=H[B]);var Se=arguments.length-2;if(Se===1)Z.children=Te;else if(1<Se){for(var Me=Array(Se),zt=0;zt<Se;zt++)Me[zt]=arguments[zt+2];Z.children=Me}if(O&&O.defaultProps)for(B in Se=O.defaultProps,Se)Z[B]===void 0&&(Z[B]=Se[B]);return{$$typeof:r,type:O,key:ue,ref:Ie,props:Z,_owner:Ve.current}}function C(O,H){return{$$typeof:r,type:O.type,key:H,ref:O.ref,props:O.props,_owner:O._owner}}function V(O){return typeof O=="object"&&O!==null&&O.$$typeof===r}function P(O){var H={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(Te){return H[Te]})}var x=/\/+/g;function I(O,H){return typeof O=="object"&&O!==null&&O.key!=null?P(""+O.key):H.toString(36)}function ye(O,H,Te,B,Z){var ue=typeof O;(ue==="undefined"||ue==="boolean")&&(O=null);var Ie=!1;if(O===null)Ie=!0;else switch(ue){case"string":case"number":Ie=!0;break;case"object":switch(O.$$typeof){case r:case e:Ie=!0}}if(Ie)return Ie=O,Z=Z(Ie),O=B===""?"."+I(Ie,0):B,Oe(Z)?(Te="",O!=null&&(Te=O.replace(x,"$&/")+"/"),ye(Z,H,Te,"",function(zt){return zt})):Z!=null&&(V(Z)&&(Z=C(Z,Te+(!Z.key||Ie&&Ie.key===Z.key?"":(""+Z.key).replace(x,"$&/")+"/")+O)),H.push(Z)),1;if(Ie=0,B=B===""?".":B+":",Oe(O))for(var Se=0;Se<O.length;Se++){ue=O[Se];var Me=B+I(ue,Se);Ie+=ye(ue,H,Te,Me,Z)}else if(Me=R(O),typeof Me=="function")for(O=Me.call(O),Se=0;!(ue=O.next()).done;)ue=ue.value,Me=B+I(ue,Se++),Ie+=ye(ue,H,Te,Me,Z);else if(ue==="object")throw H=String(O),Error("Objects are not valid as a React child (found: "+(H==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":H)+"). If you meant to render a collection of children, use an array instead.");return Ie}function Je(O,H,Te){if(O==null)return O;var B=[],Z=0;return ye(O,B,"","",function(ue){return H.call(Te,ue,Z++)}),B}function it(O){if(O._status===-1){var H=O._result;H=H(),H.then(function(Te){(O._status===0||O._status===-1)&&(O._status=1,O._result=Te)},function(Te){(O._status===0||O._status===-1)&&(O._status=2,O._result=Te)}),O._status===-1&&(O._status=0,O._result=H)}if(O._status===1)return O._result.default;throw O._result}var qe={current:null},te={transition:null},he={ReactCurrentDispatcher:qe,ReactCurrentBatchConfig:te,ReactCurrentOwner:Ve};function ie(){throw Error("act(...) is not supported in production builds of React.")}return ke.Children={map:Je,forEach:function(O,H,Te){Je(O,function(){H.apply(this,arguments)},Te)},count:function(O){var H=0;return Je(O,function(){H++}),H},toArray:function(O){return Je(O,function(H){return H})||[]},only:function(O){if(!V(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},ke.Component=Q,ke.Fragment=t,ke.Profiler=o,ke.PureComponent=ge,ke.StrictMode=s,ke.Suspense=y,ke.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=he,ke.act=ie,ke.cloneElement=function(O,H,Te){if(O==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+O+".");var B=J({},O.props),Z=O.key,ue=O.ref,Ie=O._owner;if(H!=null){if(H.ref!==void 0&&(ue=H.ref,Ie=Ve.current),H.key!==void 0&&(Z=""+H.key),O.type&&O.type.defaultProps)var Se=O.type.defaultProps;for(Me in H)be.call(H,Me)&&!N.hasOwnProperty(Me)&&(B[Me]=H[Me]===void 0&&Se!==void 0?Se[Me]:H[Me])}var Me=arguments.length-2;if(Me===1)B.children=Te;else if(1<Me){Se=Array(Me);for(var zt=0;zt<Me;zt++)Se[zt]=arguments[zt+2];B.children=Se}return{$$typeof:r,type:O.type,key:Z,ref:ue,props:B,_owner:Ie}},ke.createContext=function(O){return O={$$typeof:h,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},O.Provider={$$typeof:u,_context:O},O.Consumer=O},ke.createElement=S,ke.createFactory=function(O){var H=S.bind(null,O);return H.type=O,H},ke.createRef=function(){return{current:null}},ke.forwardRef=function(O){return{$$typeof:m,render:O}},ke.isValidElement=V,ke.lazy=function(O){return{$$typeof:w,_payload:{_status:-1,_result:O},_init:it}},ke.memo=function(O,H){return{$$typeof:v,type:O,compare:H===void 0?null:H}},ke.startTransition=function(O){var H=te.transition;te.transition={};try{O()}finally{te.transition=H}},ke.unstable_act=ie,ke.useCallback=function(O,H){return qe.current.useCallback(O,H)},ke.useContext=function(O){return qe.current.useContext(O)},ke.useDebugValue=function(){},ke.useDeferredValue=function(O){return qe.current.useDeferredValue(O)},ke.useEffect=function(O,H){return qe.current.useEffect(O,H)},ke.useId=function(){return qe.current.useId()},ke.useImperativeHandle=function(O,H,Te){return qe.current.useImperativeHandle(O,H,Te)},ke.useInsertionEffect=function(O,H){return qe.current.useInsertionEffect(O,H)},ke.useLayoutEffect=function(O,H){return qe.current.useLayoutEffect(O,H)},ke.useMemo=function(O,H){return qe.current.useMemo(O,H)},ke.useReducer=function(O,H,Te){return qe.current.useReducer(O,H,Te)},ke.useRef=function(O){return qe.current.useRef(O)},ke.useState=function(O){return qe.current.useState(O)},ke.useSyncExternalStore=function(O,H,Te){return qe.current.useSyncExternalStore(O,H,Te)},ke.useTransition=function(){return qe.current.useTransition()},ke.version="18.3.1",ke}var Qm;function jd(){return Qm||(Qm=1,Yh.exports=fw()),Yh.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ym;function pw(){if(Ym)return Sa;Ym=1;var r=jd(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function h(m,y,v){var w,A={},R=null,j=null;v!==void 0&&(R=""+v),y.key!==void 0&&(R=""+y.key),y.ref!==void 0&&(j=y.ref);for(w in y)s.call(y,w)&&!u.hasOwnProperty(w)&&(A[w]=y[w]);if(m&&m.defaultProps)for(w in y=m.defaultProps,y)A[w]===void 0&&(A[w]=y[w]);return{$$typeof:e,type:m,key:R,ref:j,props:A,_owner:o.current}}return Sa.Fragment=t,Sa.jsx=h,Sa.jsxs=h,Sa}var Jm;function mw(){return Jm||(Jm=1,Qh.exports=pw()),Qh.exports}var z=mw(),_t=jd();const gw=Ly(_t);var wu={},Jh={exports:{}},Qt={},Xh={exports:{}},Zh={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Xm;function yw(){return Xm||(Xm=1,(function(r){function e(te,he){var ie=te.length;te.push(he);e:for(;0<ie;){var O=ie-1>>>1,H=te[O];if(0<o(H,he))te[O]=he,te[ie]=H,ie=O;else break e}}function t(te){return te.length===0?null:te[0]}function s(te){if(te.length===0)return null;var he=te[0],ie=te.pop();if(ie!==he){te[0]=ie;e:for(var O=0,H=te.length,Te=H>>>1;O<Te;){var B=2*(O+1)-1,Z=te[B],ue=B+1,Ie=te[ue];if(0>o(Z,ie))ue<H&&0>o(Ie,Z)?(te[O]=Ie,te[ue]=ie,O=ue):(te[O]=Z,te[B]=ie,O=B);else if(ue<H&&0>o(Ie,ie))te[O]=Ie,te[ue]=ie,O=ue;else break e}}return he}function o(te,he){var ie=te.sortIndex-he.sortIndex;return ie!==0?ie:te.id-he.id}if(typeof performance=="object"&&typeof performance.now=="function"){var u=performance;r.unstable_now=function(){return u.now()}}else{var h=Date,m=h.now();r.unstable_now=function(){return h.now()-m}}var y=[],v=[],w=1,A=null,R=3,j=!1,J=!1,X=!1,Q=typeof setTimeout=="function"?setTimeout:null,Ee=typeof clearTimeout=="function"?clearTimeout:null,ge=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Ce(te){for(var he=t(v);he!==null;){if(he.callback===null)s(v);else if(he.startTime<=te)s(v),he.sortIndex=he.expirationTime,e(y,he);else break;he=t(v)}}function Oe(te){if(X=!1,Ce(te),!J)if(t(y)!==null)J=!0,it(be);else{var he=t(v);he!==null&&qe(Oe,he.startTime-te)}}function be(te,he){J=!1,X&&(X=!1,Ee(S),S=-1),j=!0;var ie=R;try{for(Ce(he),A=t(y);A!==null&&(!(A.expirationTime>he)||te&&!P());){var O=A.callback;if(typeof O=="function"){A.callback=null,R=A.priorityLevel;var H=O(A.expirationTime<=he);he=r.unstable_now(),typeof H=="function"?A.callback=H:A===t(y)&&s(y),Ce(he)}else s(y);A=t(y)}if(A!==null)var Te=!0;else{var B=t(v);B!==null&&qe(Oe,B.startTime-he),Te=!1}return Te}finally{A=null,R=ie,j=!1}}var Ve=!1,N=null,S=-1,C=5,V=-1;function P(){return!(r.unstable_now()-V<C)}function x(){if(N!==null){var te=r.unstable_now();V=te;var he=!0;try{he=N(!0,te)}finally{he?I():(Ve=!1,N=null)}}else Ve=!1}var I;if(typeof ge=="function")I=function(){ge(x)};else if(typeof MessageChannel<"u"){var ye=new MessageChannel,Je=ye.port2;ye.port1.onmessage=x,I=function(){Je.postMessage(null)}}else I=function(){Q(x,0)};function it(te){N=te,Ve||(Ve=!0,I())}function qe(te,he){S=Q(function(){te(r.unstable_now())},he)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(te){te.callback=null},r.unstable_continueExecution=function(){J||j||(J=!0,it(be))},r.unstable_forceFrameRate=function(te){0>te||125<te?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<te?Math.floor(1e3/te):5},r.unstable_getCurrentPriorityLevel=function(){return R},r.unstable_getFirstCallbackNode=function(){return t(y)},r.unstable_next=function(te){switch(R){case 1:case 2:case 3:var he=3;break;default:he=R}var ie=R;R=he;try{return te()}finally{R=ie}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(te,he){switch(te){case 1:case 2:case 3:case 4:case 5:break;default:te=3}var ie=R;R=te;try{return he()}finally{R=ie}},r.unstable_scheduleCallback=function(te,he,ie){var O=r.unstable_now();switch(typeof ie=="object"&&ie!==null?(ie=ie.delay,ie=typeof ie=="number"&&0<ie?O+ie:O):ie=O,te){case 1:var H=-1;break;case 2:H=250;break;case 5:H=1073741823;break;case 4:H=1e4;break;default:H=5e3}return H=ie+H,te={id:w++,callback:he,priorityLevel:te,startTime:ie,expirationTime:H,sortIndex:-1},ie>O?(te.sortIndex=ie,e(v,te),t(y)===null&&te===t(v)&&(X?(Ee(S),S=-1):X=!0,qe(Oe,ie-O))):(te.sortIndex=H,e(y,te),J||j||(J=!0,it(be))),te},r.unstable_shouldYield=P,r.unstable_wrapCallback=function(te){var he=R;return function(){var ie=R;R=he;try{return te.apply(this,arguments)}finally{R=ie}}}})(Zh)),Zh}var Zm;function _w(){return Zm||(Zm=1,Xh.exports=yw()),Xh.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eg;function vw(){if(eg)return Qt;eg=1;var r=jd(),e=_w();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function u(n,i){h(n,i),h(n+"Capture",i)}function h(n,i){for(o[n]=i,n=0;n<i.length;n++)s.add(i[n])}var m=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),y=Object.prototype.hasOwnProperty,v=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,w={},A={};function R(n){return y.call(A,n)?!0:y.call(w,n)?!1:v.test(n)?A[n]=!0:(w[n]=!0,!1)}function j(n,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function J(n,i,a,c){if(i===null||typeof i>"u"||j(n,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function X(n,i,a,c,d,f,_){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=f,this.removeEmptyString=_}var Q={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Q[n]=new X(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];Q[i]=new X(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){Q[n]=new X(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Q[n]=new X(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Q[n]=new X(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){Q[n]=new X(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){Q[n]=new X(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){Q[n]=new X(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){Q[n]=new X(n,5,!1,n.toLowerCase(),null,!1,!1)});var Ee=/[\-:]([a-z])/g;function ge(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(Ee,ge);Q[i]=new X(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(Ee,ge);Q[i]=new X(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(Ee,ge);Q[i]=new X(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){Q[n]=new X(n,1,!1,n.toLowerCase(),null,!1,!1)}),Q.xlinkHref=new X("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){Q[n]=new X(n,1,!1,n.toLowerCase(),null,!0,!0)});function Ce(n,i,a,c){var d=Q.hasOwnProperty(i)?Q[i]:null;(d!==null?d.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(J(i,a,d,c)&&(a=null),c||d===null?R(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(i=d.attributeName,c=d.attributeNamespace,a===null?n.removeAttribute(i):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,c?n.setAttributeNS(c,i,a):n.setAttribute(i,a))))}var Oe=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,be=Symbol.for("react.element"),Ve=Symbol.for("react.portal"),N=Symbol.for("react.fragment"),S=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),V=Symbol.for("react.provider"),P=Symbol.for("react.context"),x=Symbol.for("react.forward_ref"),I=Symbol.for("react.suspense"),ye=Symbol.for("react.suspense_list"),Je=Symbol.for("react.memo"),it=Symbol.for("react.lazy"),qe=Symbol.for("react.offscreen"),te=Symbol.iterator;function he(n){return n===null||typeof n!="object"?null:(n=te&&n[te]||n["@@iterator"],typeof n=="function"?n:null)}var ie=Object.assign,O;function H(n){if(O===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);O=i&&i[1]||""}return`
`+O+n}var Te=!1;function B(n,i){if(!n||Te)return"";Te=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(F){var c=F}Reflect.construct(n,[],i)}else{try{i.call()}catch(F){c=F}n.call(i.prototype)}else{try{throw Error()}catch(F){c=F}n()}}catch(F){if(F&&c&&typeof F.stack=="string"){for(var d=F.stack.split(`
`),f=c.stack.split(`
`),_=d.length-1,T=f.length-1;1<=_&&0<=T&&d[_]!==f[T];)T--;for(;1<=_&&0<=T;_--,T--)if(d[_]!==f[T]){if(_!==1||T!==1)do if(_--,T--,0>T||d[_]!==f[T]){var k=`
`+d[_].replace(" at new "," at ");return n.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",n.displayName)),k}while(1<=_&&0<=T);break}}}finally{Te=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?H(n):""}function Z(n){switch(n.tag){case 5:return H(n.type);case 16:return H("Lazy");case 13:return H("Suspense");case 19:return H("SuspenseList");case 0:case 2:case 15:return n=B(n.type,!1),n;case 11:return n=B(n.type.render,!1),n;case 1:return n=B(n.type,!0),n;default:return""}}function ue(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case N:return"Fragment";case Ve:return"Portal";case C:return"Profiler";case S:return"StrictMode";case I:return"Suspense";case ye:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case P:return(n.displayName||"Context")+".Consumer";case V:return(n._context.displayName||"Context")+".Provider";case x:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Je:return i=n.displayName||null,i!==null?i:ue(n.type)||"Memo";case it:i=n._payload,n=n._init;try{return ue(n(i))}catch{}}return null}function Ie(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ue(i);case 8:return i===S?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Se(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Me(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function zt(n){var i=Me(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,f=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return d.call(this)},set:function(_){c=""+_,f.call(this,_)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(_){c=""+_},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function ys(n){n._valueTracker||(n._valueTracker=zt(n))}function No(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return n&&(c=Me(n)?n.checked?"true":"false":n.value),n=c,n!==a?(i.setValue(n),!0):!1}function xr(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function _s(n,i){var a=i.checked;return ie({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function ol(n,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=Se(i.value!=null?i.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function vs(n,i){i=i.checked,i!=null&&Ce(n,"checked",i,!1)}function Ci(n,i){vs(n,i);var a=Se(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?ct(n,i.type,a):i.hasOwnProperty("defaultValue")&&ct(n,i.type,Se(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function Do(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function ct(n,i,a){(i!=="number"||xr(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var st=Array.isArray;function _n(n,i,a,c){if(n=n.options,i){i={};for(var d=0;d<a.length;d++)i["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=i.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&c&&(n[a].defaultSelected=!0)}else{for(a=""+Se(a),i=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,c&&(n[d].defaultSelected=!0);return}i!==null||n[d].disabled||(i=n[d])}i!==null&&(i.selected=!0)}}function Vo(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return ie({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function xo(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(st(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:Se(a)}}function al(n,i){var a=Se(i.value),c=Se(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function Or(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function Oo(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Es(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?Oo(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Lr,ll=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,d){MSApp.execUnsafeLocalFunction(function(){return n(i,a,c,d)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(Lr=Lr||document.createElement("div"),Lr.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=Lr.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function ki(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var br={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ul=["Webkit","ms","Moz","O"];Object.keys(br).forEach(function(n){ul.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),br[i]=br[n]})});function Mr(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||br.hasOwnProperty(n)&&br[n]?(""+i).trim():i+"px"}function ws(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,d=Mr(a,i[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,d):n[a]=d}}var Lo=ie({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function vn(n,i){if(i){if(Lo[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function Ts(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Fr=null;function Is(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var or=null,ar=null,nt=null;function bo(n){if(n=ua(n)){if(typeof or!="function")throw Error(t(280));var i=n.stateNode;i&&(i=bl(i),or(n.stateNode,n.type,i))}}function Ur(n){ar?nt?nt.push(n):nt=[n]:ar=n}function jr(){if(ar){var n=ar,i=nt;if(nt=ar=null,bo(n),i)for(n=0;n<i.length;n++)bo(i[n])}}function cl(n,i){return n(i)}function hl(){}var Ln=!1;function dl(n,i,a){if(Ln)return n(i,a);Ln=!0;try{return cl(n,i,a)}finally{Ln=!1,(ar!==null||nt!==null)&&(hl(),jr())}}function Pi(n,i){var a=n.stateNode;if(a===null)return null;var c=bl(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var zr=!1;if(m)try{var Br={};Object.defineProperty(Br,"passive",{get:function(){zr=!0}}),window.addEventListener("test",Br,Br),window.removeEventListener("test",Br,Br)}catch{zr=!1}function fl(n,i,a,c,d,f,_,T,k){var F=Array.prototype.slice.call(arguments,3);try{i.apply(a,F)}catch(G){this.onError(G)}}var lr=!1,bn=null,Ss=!1,an=null,pl={onError:function(n){lr=!0,bn=n}};function ml(n,i,a,c,d,f,_,T,k){lr=!1,bn=null,fl.apply(pl,arguments)}function Mo(n,i,a,c,d,f,_,T,k){if(ml.apply(this,arguments),lr){if(lr){var F=bn;lr=!1,bn=null}else throw Error(t(198));Ss||(Ss=!0,an=F)}}function En(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function Fo(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function gl(n){if(En(n)!==n)throw Error(t(188))}function yl(n){var i=n.alternate;if(!i){if(i=En(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,c=i;;){var d=a.return;if(d===null)break;var f=d.alternate;if(f===null){if(c=d.return,c!==null){a=c;continue}break}if(d.child===f.child){for(f=d.child;f;){if(f===a)return gl(d),n;if(f===c)return gl(d),i;f=f.sibling}throw Error(t(188))}if(a.return!==c.return)a=d,c=f;else{for(var _=!1,T=d.child;T;){if(T===a){_=!0,a=d,c=f;break}if(T===c){_=!0,c=d,a=f;break}T=T.sibling}if(!_){for(T=f.child;T;){if(T===a){_=!0,a=f,c=d;break}if(T===c){_=!0,c=f,a=d;break}T=T.sibling}if(!_)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function _l(n){return n=yl(n),n!==null?Ni(n):null}function Ni(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=Ni(n);if(i!==null)return i;n=n.sibling}return null}var Uo=e.unstable_scheduleCallback,As=e.unstable_cancelCallback,Di=e.unstable_shouldYield,ur=e.unstable_requestPaint,Ke=e.unstable_now,Rc=e.unstable_getCurrentPriorityLevel,Rs=e.unstable_ImmediatePriority,jo=e.unstable_UserBlockingPriority,Vi=e.unstable_NormalPriority,zo=e.unstable_LowPriority,Cs=e.unstable_IdlePriority,xi=null,Jt=null;function vl(n){if(Jt&&typeof Jt.onCommitFiberRoot=="function")try{Jt.onCommitFiberRoot(xi,n,void 0,(n.current.flags&128)===128)}catch{}}var Xt=Math.clz32?Math.clz32:Oi,Mn=Math.log,ln=Math.LN2;function Oi(n){return n>>>=0,n===0?32:31-(Mn(n)/ln|0)|0}var Fn=64,$r=4194304;function je(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function cr(n,i){var a=n.pendingLanes;if(a===0)return 0;var c=0,d=n.suspendedLanes,f=n.pingedLanes,_=a&268435455;if(_!==0){var T=_&~d;T!==0?c=je(T):(f&=_,f!==0&&(c=je(f)))}else _=a&~d,_!==0?c=je(_):f!==0&&(c=je(f));if(c===0)return 0;if(i!==0&&i!==c&&(i&d)===0&&(d=c&-c,f=i&-i,d>=f||d===16&&(f&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)a=31-Xt(i),d=1<<a,c|=n[a],i&=~d;return c}function Li(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function bi(n,i){for(var a=n.suspendedLanes,c=n.pingedLanes,d=n.expirationTimes,f=n.pendingLanes;0<f;){var _=31-Xt(f),T=1<<_,k=d[_];k===-1?((T&a)===0||(T&c)!==0)&&(d[_]=Li(T,i)):k<=i&&(n.expiredLanes|=T),f&=~T}}function Bo(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function $o(){var n=Fn;return Fn<<=1,(Fn&4194240)===0&&(Fn=64),n}function qo(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function Mi(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Xt(i),n[i]=a}function Cc(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-Xt(a),f=1<<d;i[d]=0,c[d]=-1,n[d]=-1,a&=~f}}function Ho(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var c=31-Xt(a),d=1<<c;d&i|n[c]&i&&(n[c]|=i),a&=~d}}var xe=0;function Un(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var Wo,ks,Go,Ko,Qo,jn=!1,Ps=[],zn=null,Bn=null,St=null,Fi=new Map,hr=new Map,Zt=[],El="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function qr(n,i){switch(n){case"focusin":case"focusout":zn=null;break;case"dragenter":case"dragleave":Bn=null;break;case"mouseover":case"mouseout":St=null;break;case"pointerover":case"pointerout":Fi.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":hr.delete(i.pointerId)}}function wn(n,i,a,c,d,f){return n===null||n.nativeEvent!==f?(n={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:f,targetContainers:[d]},i!==null&&(i=ua(i),i!==null&&ks(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,d!==null&&i.indexOf(d)===-1&&i.push(d),n)}function wl(n,i,a,c,d){switch(i){case"focusin":return zn=wn(zn,n,i,a,c,d),!0;case"dragenter":return Bn=wn(Bn,n,i,a,c,d),!0;case"mouseover":return St=wn(St,n,i,a,c,d),!0;case"pointerover":var f=d.pointerId;return Fi.set(f,wn(Fi.get(f)||null,n,i,a,c,d)),!0;case"gotpointercapture":return f=d.pointerId,hr.set(f,wn(hr.get(f)||null,n,i,a,c,d)),!0}return!1}function Ns(n){var i=Bi(n.target);if(i!==null){var a=En(i);if(a!==null){if(i=a.tag,i===13){if(i=Fo(a),i!==null){n.blockedOn=i,Qo(n.priority,function(){Go(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function $e(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=Ds(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);Fr=c,a.target.dispatchEvent(c),Fr=null}else return i=ua(a),i!==null&&ks(i),n.blockedOn=a,!1;i.shift()}return!0}function Tl(n,i,a){$e(n)&&a.delete(i)}function kc(){jn=!1,zn!==null&&$e(zn)&&(zn=null),Bn!==null&&$e(Bn)&&(Bn=null),St!==null&&$e(St)&&(St=null),Fi.forEach(Tl),hr.forEach(Tl)}function Hr(n,i){n.blockedOn===i&&(n.blockedOn=null,jn||(jn=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,kc)))}function Wr(n){function i(d){return Hr(d,n)}if(0<Ps.length){Hr(Ps[0],n);for(var a=1;a<Ps.length;a++){var c=Ps[a];c.blockedOn===n&&(c.blockedOn=null)}}for(zn!==null&&Hr(zn,n),Bn!==null&&Hr(Bn,n),St!==null&&Hr(St,n),Fi.forEach(i),hr.forEach(i),a=0;a<Zt.length;a++)c=Zt[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<Zt.length&&(a=Zt[0],a.blockedOn===null);)Ns(a),a.blockedOn===null&&Zt.shift()}var dr=Oe.ReactCurrentBatchConfig,fr=!0;function $n(n,i,a,c){var d=xe,f=dr.transition;dr.transition=null;try{xe=1,Yo(n,i,a,c)}finally{xe=d,dr.transition=f}}function Il(n,i,a,c){var d=xe,f=dr.transition;dr.transition=null;try{xe=4,Yo(n,i,a,c)}finally{xe=d,dr.transition=f}}function Yo(n,i,a,c){if(fr){var d=Ds(n,i,a,c);if(d===null)Uc(n,i,c,qn,a),qr(n,c);else if(wl(d,n,i,a,c))c.stopPropagation();else if(qr(n,c),i&4&&-1<El.indexOf(n)){for(;d!==null;){var f=ua(d);if(f!==null&&Wo(f),f=Ds(n,i,a,c),f===null&&Uc(n,i,c,qn,a),f===d)break;d=f}d!==null&&c.stopPropagation()}else Uc(n,i,c,null,a)}}var qn=null;function Ds(n,i,a,c){if(qn=null,n=Is(c),n=Bi(n),n!==null)if(i=En(n),i===null)n=null;else if(a=i.tag,a===13){if(n=Fo(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return qn=n,null}function Vs(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Rc()){case Rs:return 1;case jo:return 4;case Vi:case zo:return 16;case Cs:return 536870912;default:return 16}default:return 16}}var en=null,xs=null,pr=null;function Sl(){if(pr)return pr;var n,i=xs,a=i.length,c,d="value"in en?en.value:en.textContent,f=d.length;for(n=0;n<a&&i[n]===d[n];n++);var _=a-n;for(c=1;c<=_&&i[a-c]===d[f-c];c++);return pr=d.slice(n,1<c?1-c:void 0)}function Ui(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function Hn(){return!0}function Jo(){return!1}function Dt(n){function i(a,c,d,f,_){this._reactName=a,this._targetInst=d,this.type=c,this.nativeEvent=f,this.target=_,this.currentTarget=null;for(var T in n)n.hasOwnProperty(T)&&(a=n[T],this[T]=a?a(f):f[T]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?Hn:Jo,this.isPropagationStopped=Jo,this}return ie(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Hn)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Hn)},persist:function(){},isPersistent:Hn}),i}var Wn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ji=Dt(Wn),Gr=ie({},Wn,{view:0,detail:0}),Os=Dt(Gr),Ls,bs,tn,zi=ie({},Gr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ae,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==tn&&(tn&&n.type==="mousemove"?(Ls=n.screenX-tn.screenX,bs=n.screenY-tn.screenY):bs=Ls=0,tn=n),Ls)},movementY:function(n){return"movementY"in n?n.movementY:bs}}),Xo=Dt(zi),Al=ie({},zi,{dataTransfer:0}),Rl=Dt(Al),Ms=ie({},Gr,{relatedTarget:0}),At=Dt(Ms),Cl=ie({},Wn,{animationName:0,elapsedTime:0,pseudoElement:0}),kl=Dt(Cl),Kr=ie({},Wn,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),l=Dt(Kr),p=ie({},Wn,{data:0}),g=Dt(p),E={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},b={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},U={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function ee(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=U[n])?!!i[n]:!1}function Ae(){return ee}var ot=ie({},Gr,{key:function(n){if(n.key){var i=E[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=Ui(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?b[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ae,charCode:function(n){return n.type==="keypress"?Ui(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Ui(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Be=Dt(ot),ht=ie({},zi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),nn=Dt(ht),mr=ie({},Gr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ae}),Gn=Dt(mr),Kn=ie({},Wn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Fs=Dt(Kn),Zo=ie({},zi,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),aE=Dt(Zo),lE=[9,13,27,32],Pc=m&&"CompositionEvent"in window,ea=null;m&&"documentMode"in document&&(ea=document.documentMode);var uE=m&&"TextEvent"in window&&!ea,jf=m&&(!Pc||ea&&8<ea&&11>=ea),zf=" ",Bf=!1;function $f(n,i){switch(n){case"keyup":return lE.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function qf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var Us=!1;function cE(n,i){switch(n){case"compositionend":return qf(i);case"keypress":return i.which!==32?null:(Bf=!0,zf);case"textInput":return n=i.data,n===zf&&Bf?null:n;default:return null}}function hE(n,i){if(Us)return n==="compositionend"||!Pc&&$f(n,i)?(n=Sl(),pr=xs=en=null,Us=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return jf&&i.locale!=="ko"?null:i.data;default:return null}}var dE={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Hf(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!dE[n.type]:i==="textarea"}function Wf(n,i,a,c){Ur(c),i=xl(i,"onChange"),0<i.length&&(a=new ji("onChange","change",null,a,c),n.push({event:a,listeners:i}))}var ta=null,na=null;function fE(n){cp(n,0)}function Pl(n){var i=qs(n);if(No(i))return n}function pE(n,i){if(n==="change")return i}var Gf=!1;if(m){var Nc;if(m){var Dc="oninput"in document;if(!Dc){var Kf=document.createElement("div");Kf.setAttribute("oninput","return;"),Dc=typeof Kf.oninput=="function"}Nc=Dc}else Nc=!1;Gf=Nc&&(!document.documentMode||9<document.documentMode)}function Qf(){ta&&(ta.detachEvent("onpropertychange",Yf),na=ta=null)}function Yf(n){if(n.propertyName==="value"&&Pl(na)){var i=[];Wf(i,na,n,Is(n)),dl(fE,i)}}function mE(n,i,a){n==="focusin"?(Qf(),ta=i,na=a,ta.attachEvent("onpropertychange",Yf)):n==="focusout"&&Qf()}function gE(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Pl(na)}function yE(n,i){if(n==="click")return Pl(i)}function _E(n,i){if(n==="input"||n==="change")return Pl(i)}function vE(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var Tn=typeof Object.is=="function"?Object.is:vE;function ra(n,i){if(Tn(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var d=a[c];if(!y.call(i,d)||!Tn(n[d],i[d]))return!1}return!0}function Jf(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Xf(n,i){var a=Jf(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=i&&c>=i)return{node:a,offset:i-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Jf(a)}}function Zf(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?Zf(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function ep(){for(var n=window,i=xr();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=xr(n.document)}return i}function Vc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function EE(n){var i=ep(),a=n.focusedElem,c=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&Zf(a.ownerDocument.documentElement,a)){if(c!==null&&Vc(a)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,f=Math.min(c.start,d);c=c.end===void 0?f:Math.min(c.end,d),!n.extend&&f>c&&(d=c,c=f,f=d),d=Xf(a,f);var _=Xf(a,c);d&&_&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==_.node||n.focusOffset!==_.offset)&&(i=i.createRange(),i.setStart(d.node,d.offset),n.removeAllRanges(),f>c?(n.addRange(i),n.extend(_.node,_.offset)):(i.setEnd(_.node,_.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var wE=m&&"documentMode"in document&&11>=document.documentMode,js=null,xc=null,ia=null,Oc=!1;function tp(n,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Oc||js==null||js!==xr(c)||(c=js,"selectionStart"in c&&Vc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),ia&&ra(ia,c)||(ia=c,c=xl(xc,"onSelect"),0<c.length&&(i=new ji("onSelect","select",null,i,a),n.push({event:i,listeners:c}),i.target=js)))}function Nl(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var zs={animationend:Nl("Animation","AnimationEnd"),animationiteration:Nl("Animation","AnimationIteration"),animationstart:Nl("Animation","AnimationStart"),transitionend:Nl("Transition","TransitionEnd")},Lc={},np={};m&&(np=document.createElement("div").style,"AnimationEvent"in window||(delete zs.animationend.animation,delete zs.animationiteration.animation,delete zs.animationstart.animation),"TransitionEvent"in window||delete zs.transitionend.transition);function Dl(n){if(Lc[n])return Lc[n];if(!zs[n])return n;var i=zs[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in np)return Lc[n]=i[a];return n}var rp=Dl("animationend"),ip=Dl("animationiteration"),sp=Dl("animationstart"),op=Dl("transitionend"),ap=new Map,lp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Qr(n,i){ap.set(n,i),u(i,[n])}for(var bc=0;bc<lp.length;bc++){var Mc=lp[bc],TE=Mc.toLowerCase(),IE=Mc[0].toUpperCase()+Mc.slice(1);Qr(TE,"on"+IE)}Qr(rp,"onAnimationEnd"),Qr(ip,"onAnimationIteration"),Qr(sp,"onAnimationStart"),Qr("dblclick","onDoubleClick"),Qr("focusin","onFocus"),Qr("focusout","onBlur"),Qr(op,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),u("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),u("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),u("onBeforeInput",["compositionend","keypress","textInput","paste"]),u("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var sa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),SE=new Set("cancel close invalid load scroll toggle".split(" ").concat(sa));function up(n,i,a){var c=n.type||"unknown-event";n.currentTarget=a,Mo(c,i,void 0,n),n.currentTarget=null}function cp(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],d=c.event;c=c.listeners;e:{var f=void 0;if(i)for(var _=c.length-1;0<=_;_--){var T=c[_],k=T.instance,F=T.currentTarget;if(T=T.listener,k!==f&&d.isPropagationStopped())break e;up(d,T,F),f=k}else for(_=0;_<c.length;_++){if(T=c[_],k=T.instance,F=T.currentTarget,T=T.listener,k!==f&&d.isPropagationStopped())break e;up(d,T,F),f=k}}}if(Ss)throw n=an,Ss=!1,an=null,n}function Qe(n,i){var a=i[Hc];a===void 0&&(a=i[Hc]=new Set);var c=n+"__bubble";a.has(c)||(hp(i,n,2,!1),a.add(c))}function Fc(n,i,a){var c=0;i&&(c|=4),hp(a,n,c,i)}var Vl="_reactListening"+Math.random().toString(36).slice(2);function oa(n){if(!n[Vl]){n[Vl]=!0,s.forEach(function(a){a!=="selectionchange"&&(SE.has(a)||Fc(a,!1,n),Fc(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[Vl]||(i[Vl]=!0,Fc("selectionchange",!1,i))}}function hp(n,i,a,c){switch(Vs(i)){case 1:var d=$n;break;case 4:d=Il;break;default:d=Yo}a=d.bind(null,i,a,n),d=void 0,!zr||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(d=!0),c?d!==void 0?n.addEventListener(i,a,{capture:!0,passive:d}):n.addEventListener(i,a,!0):d!==void 0?n.addEventListener(i,a,{passive:d}):n.addEventListener(i,a,!1)}function Uc(n,i,a,c,d){var f=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var _=c.tag;if(_===3||_===4){var T=c.stateNode.containerInfo;if(T===d||T.nodeType===8&&T.parentNode===d)break;if(_===4)for(_=c.return;_!==null;){var k=_.tag;if((k===3||k===4)&&(k=_.stateNode.containerInfo,k===d||k.nodeType===8&&k.parentNode===d))return;_=_.return}for(;T!==null;){if(_=Bi(T),_===null)return;if(k=_.tag,k===5||k===6){c=f=_;continue e}T=T.parentNode}}c=c.return}dl(function(){var F=f,G=Is(a),K=[];e:{var W=ap.get(n);if(W!==void 0){var re=ji,ae=n;switch(n){case"keypress":if(Ui(a)===0)break e;case"keydown":case"keyup":re=Be;break;case"focusin":ae="focus",re=At;break;case"focusout":ae="blur",re=At;break;case"beforeblur":case"afterblur":re=At;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":re=Xo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":re=Rl;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":re=Gn;break;case rp:case ip:case sp:re=kl;break;case op:re=Fs;break;case"scroll":re=Os;break;case"wheel":re=aE;break;case"copy":case"cut":case"paste":re=l;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":re=nn}var le=(i&4)!==0,at=!le&&n==="scroll",L=le?W!==null?W+"Capture":null:W;le=[];for(var D=F,M;D!==null;){M=D;var Y=M.stateNode;if(M.tag===5&&Y!==null&&(M=Y,L!==null&&(Y=Pi(D,L),Y!=null&&le.push(aa(D,Y,M)))),at)break;D=D.return}0<le.length&&(W=new re(W,ae,null,a,G),K.push({event:W,listeners:le}))}}if((i&7)===0){e:{if(W=n==="mouseover"||n==="pointerover",re=n==="mouseout"||n==="pointerout",W&&a!==Fr&&(ae=a.relatedTarget||a.fromElement)&&(Bi(ae)||ae[gr]))break e;if((re||W)&&(W=G.window===G?G:(W=G.ownerDocument)?W.defaultView||W.parentWindow:window,re?(ae=a.relatedTarget||a.toElement,re=F,ae=ae?Bi(ae):null,ae!==null&&(at=En(ae),ae!==at||ae.tag!==5&&ae.tag!==6)&&(ae=null)):(re=null,ae=F),re!==ae)){if(le=Xo,Y="onMouseLeave",L="onMouseEnter",D="mouse",(n==="pointerout"||n==="pointerover")&&(le=nn,Y="onPointerLeave",L="onPointerEnter",D="pointer"),at=re==null?W:qs(re),M=ae==null?W:qs(ae),W=new le(Y,D+"leave",re,a,G),W.target=at,W.relatedTarget=M,Y=null,Bi(G)===F&&(le=new le(L,D+"enter",ae,a,G),le.target=M,le.relatedTarget=at,Y=le),at=Y,re&&ae)t:{for(le=re,L=ae,D=0,M=le;M;M=Bs(M))D++;for(M=0,Y=L;Y;Y=Bs(Y))M++;for(;0<D-M;)le=Bs(le),D--;for(;0<M-D;)L=Bs(L),M--;for(;D--;){if(le===L||L!==null&&le===L.alternate)break t;le=Bs(le),L=Bs(L)}le=null}else le=null;re!==null&&dp(K,W,re,le,!1),ae!==null&&at!==null&&dp(K,at,ae,le,!0)}}e:{if(W=F?qs(F):window,re=W.nodeName&&W.nodeName.toLowerCase(),re==="select"||re==="input"&&W.type==="file")var ce=pE;else if(Hf(W))if(Gf)ce=_E;else{ce=gE;var fe=mE}else(re=W.nodeName)&&re.toLowerCase()==="input"&&(W.type==="checkbox"||W.type==="radio")&&(ce=yE);if(ce&&(ce=ce(n,F))){Wf(K,ce,a,G);break e}fe&&fe(n,W,F),n==="focusout"&&(fe=W._wrapperState)&&fe.controlled&&W.type==="number"&&ct(W,"number",W.value)}switch(fe=F?qs(F):window,n){case"focusin":(Hf(fe)||fe.contentEditable==="true")&&(js=fe,xc=F,ia=null);break;case"focusout":ia=xc=js=null;break;case"mousedown":Oc=!0;break;case"contextmenu":case"mouseup":case"dragend":Oc=!1,tp(K,a,G);break;case"selectionchange":if(wE)break;case"keydown":case"keyup":tp(K,a,G)}var pe;if(Pc)e:{switch(n){case"compositionstart":var _e="onCompositionStart";break e;case"compositionend":_e="onCompositionEnd";break e;case"compositionupdate":_e="onCompositionUpdate";break e}_e=void 0}else Us?$f(n,a)&&(_e="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(_e="onCompositionStart");_e&&(jf&&a.locale!=="ko"&&(Us||_e!=="onCompositionStart"?_e==="onCompositionEnd"&&Us&&(pe=Sl()):(en=G,xs="value"in en?en.value:en.textContent,Us=!0)),fe=xl(F,_e),0<fe.length&&(_e=new g(_e,n,null,a,G),K.push({event:_e,listeners:fe}),pe?_e.data=pe:(pe=qf(a),pe!==null&&(_e.data=pe)))),(pe=uE?cE(n,a):hE(n,a))&&(F=xl(F,"onBeforeInput"),0<F.length&&(G=new g("onBeforeInput","beforeinput",null,a,G),K.push({event:G,listeners:F}),G.data=pe))}cp(K,i)})}function aa(n,i,a){return{instance:n,listener:i,currentTarget:a}}function xl(n,i){for(var a=i+"Capture",c=[];n!==null;){var d=n,f=d.stateNode;d.tag===5&&f!==null&&(d=f,f=Pi(n,a),f!=null&&c.unshift(aa(n,f,d)),f=Pi(n,i),f!=null&&c.push(aa(n,f,d))),n=n.return}return c}function Bs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function dp(n,i,a,c,d){for(var f=i._reactName,_=[];a!==null&&a!==c;){var T=a,k=T.alternate,F=T.stateNode;if(k!==null&&k===c)break;T.tag===5&&F!==null&&(T=F,d?(k=Pi(a,f),k!=null&&_.unshift(aa(a,k,T))):d||(k=Pi(a,f),k!=null&&_.push(aa(a,k,T)))),a=a.return}_.length!==0&&n.push({event:i,listeners:_})}var AE=/\r\n?/g,RE=/\u0000|\uFFFD/g;function fp(n){return(typeof n=="string"?n:""+n).replace(AE,`
`).replace(RE,"")}function Ol(n,i,a){if(i=fp(i),fp(n)!==i&&a)throw Error(t(425))}function Ll(){}var jc=null,zc=null;function Bc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var $c=typeof setTimeout=="function"?setTimeout:void 0,CE=typeof clearTimeout=="function"?clearTimeout:void 0,pp=typeof Promise=="function"?Promise:void 0,kE=typeof queueMicrotask=="function"?queueMicrotask:typeof pp<"u"?function(n){return pp.resolve(null).then(n).catch(PE)}:$c;function PE(n){setTimeout(function(){throw n})}function qc(n,i){var a=i,c=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(c===0){n.removeChild(d),Wr(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=d}while(a);Wr(i)}function Yr(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function mp(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var $s=Math.random().toString(36).slice(2),Qn="__reactFiber$"+$s,la="__reactProps$"+$s,gr="__reactContainer$"+$s,Hc="__reactEvents$"+$s,NE="__reactListeners$"+$s,DE="__reactHandles$"+$s;function Bi(n){var i=n[Qn];if(i)return i;for(var a=n.parentNode;a;){if(i=a[gr]||a[Qn]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=mp(n);n!==null;){if(a=n[Qn])return a;n=mp(n)}return i}n=a,a=n.parentNode}return null}function ua(n){return n=n[Qn]||n[gr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function qs(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function bl(n){return n[la]||null}var Wc=[],Hs=-1;function Jr(n){return{current:n}}function Ye(n){0>Hs||(n.current=Wc[Hs],Wc[Hs]=null,Hs--)}function He(n,i){Hs++,Wc[Hs]=n.current,n.current=i}var Xr={},Vt=Jr(Xr),qt=Jr(!1),$i=Xr;function Ws(n,i){var a=n.type.contextTypes;if(!a)return Xr;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var d={},f;for(f in a)d[f]=i[f];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=d),d}function Ht(n){return n=n.childContextTypes,n!=null}function Ml(){Ye(qt),Ye(Vt)}function gp(n,i,a){if(Vt.current!==Xr)throw Error(t(168));He(Vt,i),He(qt,a)}function yp(n,i,a){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var d in c)if(!(d in i))throw Error(t(108,Ie(n)||"Unknown",d));return ie({},a,c)}function Fl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Xr,$i=Vt.current,He(Vt,n),He(qt,qt.current),!0}function _p(n,i,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=yp(n,i,$i),c.__reactInternalMemoizedMergedChildContext=n,Ye(qt),Ye(Vt),He(Vt,n)):Ye(qt),He(qt,a)}var yr=null,Ul=!1,Gc=!1;function vp(n){yr===null?yr=[n]:yr.push(n)}function VE(n){Ul=!0,vp(n)}function Zr(){if(!Gc&&yr!==null){Gc=!0;var n=0,i=xe;try{var a=yr;for(xe=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}yr=null,Ul=!1}catch(d){throw yr!==null&&(yr=yr.slice(n+1)),Uo(Rs,Zr),d}finally{xe=i,Gc=!1}}return null}var Gs=[],Ks=0,jl=null,zl=0,un=[],cn=0,qi=null,_r=1,vr="";function Hi(n,i){Gs[Ks++]=zl,Gs[Ks++]=jl,jl=n,zl=i}function Ep(n,i,a){un[cn++]=_r,un[cn++]=vr,un[cn++]=qi,qi=n;var c=_r;n=vr;var d=32-Xt(c)-1;c&=~(1<<d),a+=1;var f=32-Xt(i)+d;if(30<f){var _=d-d%5;f=(c&(1<<_)-1).toString(32),c>>=_,d-=_,_r=1<<32-Xt(i)+d|a<<d|c,vr=f+n}else _r=1<<f|a<<d|c,vr=n}function Kc(n){n.return!==null&&(Hi(n,1),Ep(n,1,0))}function Qc(n){for(;n===jl;)jl=Gs[--Ks],Gs[Ks]=null,zl=Gs[--Ks],Gs[Ks]=null;for(;n===qi;)qi=un[--cn],un[cn]=null,vr=un[--cn],un[cn]=null,_r=un[--cn],un[cn]=null}var rn=null,sn=null,Xe=!1,In=null;function wp(n,i){var a=pn(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Tp(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,rn=n,sn=Yr(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,rn=n,sn=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=qi!==null?{id:_r,overflow:vr}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=pn(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,rn=n,sn=null,!0):!1;default:return!1}}function Yc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Jc(n){if(Xe){var i=sn;if(i){var a=i;if(!Tp(n,i)){if(Yc(n))throw Error(t(418));i=Yr(a.nextSibling);var c=rn;i&&Tp(n,i)?wp(c,a):(n.flags=n.flags&-4097|2,Xe=!1,rn=n)}}else{if(Yc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Xe=!1,rn=n}}}function Ip(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;rn=n}function Bl(n){if(n!==rn)return!1;if(!Xe)return Ip(n),Xe=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Bc(n.type,n.memoizedProps)),i&&(i=sn)){if(Yc(n))throw Sp(),Error(t(418));for(;i;)wp(n,i),i=Yr(i.nextSibling)}if(Ip(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){sn=Yr(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}sn=null}}else sn=rn?Yr(n.stateNode.nextSibling):null;return!0}function Sp(){for(var n=sn;n;)n=Yr(n.nextSibling)}function Qs(){sn=rn=null,Xe=!1}function Xc(n){In===null?In=[n]:In.push(n)}var xE=Oe.ReactCurrentBatchConfig;function ca(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var d=c,f=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===f?i.ref:(i=function(_){var T=d.refs;_===null?delete T[f]:T[f]=_},i._stringRef=f,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function $l(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function Ap(n){var i=n._init;return i(n._payload)}function Rp(n){function i(L,D){if(n){var M=L.deletions;M===null?(L.deletions=[D],L.flags|=16):M.push(D)}}function a(L,D){if(!n)return null;for(;D!==null;)i(L,D),D=D.sibling;return null}function c(L,D){for(L=new Map;D!==null;)D.key!==null?L.set(D.key,D):L.set(D.index,D),D=D.sibling;return L}function d(L,D){return L=ai(L,D),L.index=0,L.sibling=null,L}function f(L,D,M){return L.index=M,n?(M=L.alternate,M!==null?(M=M.index,M<D?(L.flags|=2,D):M):(L.flags|=2,D)):(L.flags|=1048576,D)}function _(L){return n&&L.alternate===null&&(L.flags|=2),L}function T(L,D,M,Y){return D===null||D.tag!==6?(D=$h(M,L.mode,Y),D.return=L,D):(D=d(D,M),D.return=L,D)}function k(L,D,M,Y){var ce=M.type;return ce===N?G(L,D,M.props.children,Y,M.key):D!==null&&(D.elementType===ce||typeof ce=="object"&&ce!==null&&ce.$$typeof===it&&Ap(ce)===D.type)?(Y=d(D,M.props),Y.ref=ca(L,D,M),Y.return=L,Y):(Y=fu(M.type,M.key,M.props,null,L.mode,Y),Y.ref=ca(L,D,M),Y.return=L,Y)}function F(L,D,M,Y){return D===null||D.tag!==4||D.stateNode.containerInfo!==M.containerInfo||D.stateNode.implementation!==M.implementation?(D=qh(M,L.mode,Y),D.return=L,D):(D=d(D,M.children||[]),D.return=L,D)}function G(L,D,M,Y,ce){return D===null||D.tag!==7?(D=Zi(M,L.mode,Y,ce),D.return=L,D):(D=d(D,M),D.return=L,D)}function K(L,D,M){if(typeof D=="string"&&D!==""||typeof D=="number")return D=$h(""+D,L.mode,M),D.return=L,D;if(typeof D=="object"&&D!==null){switch(D.$$typeof){case be:return M=fu(D.type,D.key,D.props,null,L.mode,M),M.ref=ca(L,null,D),M.return=L,M;case Ve:return D=qh(D,L.mode,M),D.return=L,D;case it:var Y=D._init;return K(L,Y(D._payload),M)}if(st(D)||he(D))return D=Zi(D,L.mode,M,null),D.return=L,D;$l(L,D)}return null}function W(L,D,M,Y){var ce=D!==null?D.key:null;if(typeof M=="string"&&M!==""||typeof M=="number")return ce!==null?null:T(L,D,""+M,Y);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case be:return M.key===ce?k(L,D,M,Y):null;case Ve:return M.key===ce?F(L,D,M,Y):null;case it:return ce=M._init,W(L,D,ce(M._payload),Y)}if(st(M)||he(M))return ce!==null?null:G(L,D,M,Y,null);$l(L,M)}return null}function re(L,D,M,Y,ce){if(typeof Y=="string"&&Y!==""||typeof Y=="number")return L=L.get(M)||null,T(D,L,""+Y,ce);if(typeof Y=="object"&&Y!==null){switch(Y.$$typeof){case be:return L=L.get(Y.key===null?M:Y.key)||null,k(D,L,Y,ce);case Ve:return L=L.get(Y.key===null?M:Y.key)||null,F(D,L,Y,ce);case it:var fe=Y._init;return re(L,D,M,fe(Y._payload),ce)}if(st(Y)||he(Y))return L=L.get(M)||null,G(D,L,Y,ce,null);$l(D,Y)}return null}function ae(L,D,M,Y){for(var ce=null,fe=null,pe=D,_e=D=0,Tt=null;pe!==null&&_e<M.length;_e++){pe.index>_e?(Tt=pe,pe=null):Tt=pe.sibling;var Ue=W(L,pe,M[_e],Y);if(Ue===null){pe===null&&(pe=Tt);break}n&&pe&&Ue.alternate===null&&i(L,pe),D=f(Ue,D,_e),fe===null?ce=Ue:fe.sibling=Ue,fe=Ue,pe=Tt}if(_e===M.length)return a(L,pe),Xe&&Hi(L,_e),ce;if(pe===null){for(;_e<M.length;_e++)pe=K(L,M[_e],Y),pe!==null&&(D=f(pe,D,_e),fe===null?ce=pe:fe.sibling=pe,fe=pe);return Xe&&Hi(L,_e),ce}for(pe=c(L,pe);_e<M.length;_e++)Tt=re(pe,L,_e,M[_e],Y),Tt!==null&&(n&&Tt.alternate!==null&&pe.delete(Tt.key===null?_e:Tt.key),D=f(Tt,D,_e),fe===null?ce=Tt:fe.sibling=Tt,fe=Tt);return n&&pe.forEach(function(li){return i(L,li)}),Xe&&Hi(L,_e),ce}function le(L,D,M,Y){var ce=he(M);if(typeof ce!="function")throw Error(t(150));if(M=ce.call(M),M==null)throw Error(t(151));for(var fe=ce=null,pe=D,_e=D=0,Tt=null,Ue=M.next();pe!==null&&!Ue.done;_e++,Ue=M.next()){pe.index>_e?(Tt=pe,pe=null):Tt=pe.sibling;var li=W(L,pe,Ue.value,Y);if(li===null){pe===null&&(pe=Tt);break}n&&pe&&li.alternate===null&&i(L,pe),D=f(li,D,_e),fe===null?ce=li:fe.sibling=li,fe=li,pe=Tt}if(Ue.done)return a(L,pe),Xe&&Hi(L,_e),ce;if(pe===null){for(;!Ue.done;_e++,Ue=M.next())Ue=K(L,Ue.value,Y),Ue!==null&&(D=f(Ue,D,_e),fe===null?ce=Ue:fe.sibling=Ue,fe=Ue);return Xe&&Hi(L,_e),ce}for(pe=c(L,pe);!Ue.done;_e++,Ue=M.next())Ue=re(pe,L,_e,Ue.value,Y),Ue!==null&&(n&&Ue.alternate!==null&&pe.delete(Ue.key===null?_e:Ue.key),D=f(Ue,D,_e),fe===null?ce=Ue:fe.sibling=Ue,fe=Ue);return n&&pe.forEach(function(dw){return i(L,dw)}),Xe&&Hi(L,_e),ce}function at(L,D,M,Y){if(typeof M=="object"&&M!==null&&M.type===N&&M.key===null&&(M=M.props.children),typeof M=="object"&&M!==null){switch(M.$$typeof){case be:e:{for(var ce=M.key,fe=D;fe!==null;){if(fe.key===ce){if(ce=M.type,ce===N){if(fe.tag===7){a(L,fe.sibling),D=d(fe,M.props.children),D.return=L,L=D;break e}}else if(fe.elementType===ce||typeof ce=="object"&&ce!==null&&ce.$$typeof===it&&Ap(ce)===fe.type){a(L,fe.sibling),D=d(fe,M.props),D.ref=ca(L,fe,M),D.return=L,L=D;break e}a(L,fe);break}else i(L,fe);fe=fe.sibling}M.type===N?(D=Zi(M.props.children,L.mode,Y,M.key),D.return=L,L=D):(Y=fu(M.type,M.key,M.props,null,L.mode,Y),Y.ref=ca(L,D,M),Y.return=L,L=Y)}return _(L);case Ve:e:{for(fe=M.key;D!==null;){if(D.key===fe)if(D.tag===4&&D.stateNode.containerInfo===M.containerInfo&&D.stateNode.implementation===M.implementation){a(L,D.sibling),D=d(D,M.children||[]),D.return=L,L=D;break e}else{a(L,D);break}else i(L,D);D=D.sibling}D=qh(M,L.mode,Y),D.return=L,L=D}return _(L);case it:return fe=M._init,at(L,D,fe(M._payload),Y)}if(st(M))return ae(L,D,M,Y);if(he(M))return le(L,D,M,Y);$l(L,M)}return typeof M=="string"&&M!==""||typeof M=="number"?(M=""+M,D!==null&&D.tag===6?(a(L,D.sibling),D=d(D,M),D.return=L,L=D):(a(L,D),D=$h(M,L.mode,Y),D.return=L,L=D),_(L)):a(L,D)}return at}var Ys=Rp(!0),Cp=Rp(!1),ql=Jr(null),Hl=null,Js=null,Zc=null;function eh(){Zc=Js=Hl=null}function th(n){var i=ql.current;Ye(ql),n._currentValue=i}function nh(n,i,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===a)break;n=n.return}}function Xs(n,i){Hl=n,Zc=Js=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(Wt=!0),n.firstContext=null)}function hn(n){var i=n._currentValue;if(Zc!==n)if(n={context:n,memoizedValue:i,next:null},Js===null){if(Hl===null)throw Error(t(308));Js=n,Hl.dependencies={lanes:0,firstContext:n}}else Js=Js.next=n;return i}var Wi=null;function rh(n){Wi===null?Wi=[n]:Wi.push(n)}function kp(n,i,a,c){var d=i.interleaved;return d===null?(a.next=a,rh(i)):(a.next=d.next,d.next=a),i.interleaved=a,Er(n,c)}function Er(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var ei=!1;function ih(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Pp(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function wr(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function ti(n,i,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(Fe&2)!==0){var d=c.pending;return d===null?i.next=i:(i.next=d.next,d.next=i),c.pending=i,Er(n,a)}return d=c.interleaved,d===null?(i.next=i,rh(c)):(i.next=d.next,d.next=i),c.interleaved=i,Er(n,a)}function Wl(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,Ho(n,a)}}function Np(n,i){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var d=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var _={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};f===null?d=f=_:f=f.next=_,a=a.next}while(a!==null);f===null?d=f=i:f=f.next=i}else d=f=i;a={baseState:c.baseState,firstBaseUpdate:d,lastBaseUpdate:f,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function Gl(n,i,a,c){var d=n.updateQueue;ei=!1;var f=d.firstBaseUpdate,_=d.lastBaseUpdate,T=d.shared.pending;if(T!==null){d.shared.pending=null;var k=T,F=k.next;k.next=null,_===null?f=F:_.next=F,_=k;var G=n.alternate;G!==null&&(G=G.updateQueue,T=G.lastBaseUpdate,T!==_&&(T===null?G.firstBaseUpdate=F:T.next=F,G.lastBaseUpdate=k))}if(f!==null){var K=d.baseState;_=0,G=F=k=null,T=f;do{var W=T.lane,re=T.eventTime;if((c&W)===W){G!==null&&(G=G.next={eventTime:re,lane:0,tag:T.tag,payload:T.payload,callback:T.callback,next:null});e:{var ae=n,le=T;switch(W=i,re=a,le.tag){case 1:if(ae=le.payload,typeof ae=="function"){K=ae.call(re,K,W);break e}K=ae;break e;case 3:ae.flags=ae.flags&-65537|128;case 0:if(ae=le.payload,W=typeof ae=="function"?ae.call(re,K,W):ae,W==null)break e;K=ie({},K,W);break e;case 2:ei=!0}}T.callback!==null&&T.lane!==0&&(n.flags|=64,W=d.effects,W===null?d.effects=[T]:W.push(T))}else re={eventTime:re,lane:W,tag:T.tag,payload:T.payload,callback:T.callback,next:null},G===null?(F=G=re,k=K):G=G.next=re,_|=W;if(T=T.next,T===null){if(T=d.shared.pending,T===null)break;W=T,T=W.next,W.next=null,d.lastBaseUpdate=W,d.shared.pending=null}}while(!0);if(G===null&&(k=K),d.baseState=k,d.firstBaseUpdate=F,d.lastBaseUpdate=G,i=d.shared.interleaved,i!==null){d=i;do _|=d.lane,d=d.next;while(d!==i)}else f===null&&(d.shared.lanes=0);Qi|=_,n.lanes=_,n.memoizedState=K}}function Dp(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],d=c.callback;if(d!==null){if(c.callback=null,c=a,typeof d!="function")throw Error(t(191,d));d.call(c)}}}var ha={},Yn=Jr(ha),da=Jr(ha),fa=Jr(ha);function Gi(n){if(n===ha)throw Error(t(174));return n}function sh(n,i){switch(He(fa,i),He(da,n),He(Yn,ha),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Es(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=Es(i,n)}Ye(Yn),He(Yn,i)}function Zs(){Ye(Yn),Ye(da),Ye(fa)}function Vp(n){Gi(fa.current);var i=Gi(Yn.current),a=Es(i,n.type);i!==a&&(He(da,n),He(Yn,a))}function oh(n){da.current===n&&(Ye(Yn),Ye(da))}var Ze=Jr(0);function Kl(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var ah=[];function lh(){for(var n=0;n<ah.length;n++)ah[n]._workInProgressVersionPrimary=null;ah.length=0}var Ql=Oe.ReactCurrentDispatcher,uh=Oe.ReactCurrentBatchConfig,Ki=0,et=null,gt=null,Et=null,Yl=!1,pa=!1,ma=0,OE=0;function xt(){throw Error(t(321))}function ch(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!Tn(n[a],i[a]))return!1;return!0}function hh(n,i,a,c,d,f){if(Ki=f,et=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Ql.current=n===null||n.memoizedState===null?FE:UE,n=a(c,d),pa){f=0;do{if(pa=!1,ma=0,25<=f)throw Error(t(301));f+=1,Et=gt=null,i.updateQueue=null,Ql.current=jE,n=a(c,d)}while(pa)}if(Ql.current=Zl,i=gt!==null&&gt.next!==null,Ki=0,Et=gt=et=null,Yl=!1,i)throw Error(t(300));return n}function dh(){var n=ma!==0;return ma=0,n}function Jn(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Et===null?et.memoizedState=Et=n:Et=Et.next=n,Et}function dn(){if(gt===null){var n=et.alternate;n=n!==null?n.memoizedState:null}else n=gt.next;var i=Et===null?et.memoizedState:Et.next;if(i!==null)Et=i,gt=n;else{if(n===null)throw Error(t(310));gt=n,n={memoizedState:gt.memoizedState,baseState:gt.baseState,baseQueue:gt.baseQueue,queue:gt.queue,next:null},Et===null?et.memoizedState=Et=n:Et=Et.next=n}return Et}function ga(n,i){return typeof i=="function"?i(n):i}function fh(n){var i=dn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=gt,d=c.baseQueue,f=a.pending;if(f!==null){if(d!==null){var _=d.next;d.next=f.next,f.next=_}c.baseQueue=d=f,a.pending=null}if(d!==null){f=d.next,c=c.baseState;var T=_=null,k=null,F=f;do{var G=F.lane;if((Ki&G)===G)k!==null&&(k=k.next={lane:0,action:F.action,hasEagerState:F.hasEagerState,eagerState:F.eagerState,next:null}),c=F.hasEagerState?F.eagerState:n(c,F.action);else{var K={lane:G,action:F.action,hasEagerState:F.hasEagerState,eagerState:F.eagerState,next:null};k===null?(T=k=K,_=c):k=k.next=K,et.lanes|=G,Qi|=G}F=F.next}while(F!==null&&F!==f);k===null?_=c:k.next=T,Tn(c,i.memoizedState)||(Wt=!0),i.memoizedState=c,i.baseState=_,i.baseQueue=k,a.lastRenderedState=c}if(n=a.interleaved,n!==null){d=n;do f=d.lane,et.lanes|=f,Qi|=f,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function ph(n){var i=dn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,d=a.pending,f=i.memoizedState;if(d!==null){a.pending=null;var _=d=d.next;do f=n(f,_.action),_=_.next;while(_!==d);Tn(f,i.memoizedState)||(Wt=!0),i.memoizedState=f,i.baseQueue===null&&(i.baseState=f),a.lastRenderedState=f}return[f,c]}function xp(){}function Op(n,i){var a=et,c=dn(),d=i(),f=!Tn(c.memoizedState,d);if(f&&(c.memoizedState=d,Wt=!0),c=c.queue,mh(Mp.bind(null,a,c,n),[n]),c.getSnapshot!==i||f||Et!==null&&Et.memoizedState.tag&1){if(a.flags|=2048,ya(9,bp.bind(null,a,c,d,i),void 0,null),wt===null)throw Error(t(349));(Ki&30)!==0||Lp(a,i,d)}return d}function Lp(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=et.updateQueue,i===null?(i={lastEffect:null,stores:null},et.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function bp(n,i,a,c){i.value=a,i.getSnapshot=c,Fp(i)&&Up(n)}function Mp(n,i,a){return a(function(){Fp(i)&&Up(n)})}function Fp(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!Tn(n,a)}catch{return!0}}function Up(n){var i=Er(n,1);i!==null&&Cn(i,n,1,-1)}function jp(n){var i=Jn();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ga,lastRenderedState:n},i.queue=n,n=n.dispatch=ME.bind(null,et,n),[i.memoizedState,n]}function ya(n,i,a,c){return n={tag:n,create:i,destroy:a,deps:c,next:null},i=et.updateQueue,i===null?(i={lastEffect:null,stores:null},et.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,i.lastEffect=n)),n}function zp(){return dn().memoizedState}function Jl(n,i,a,c){var d=Jn();et.flags|=n,d.memoizedState=ya(1|i,a,void 0,c===void 0?null:c)}function Xl(n,i,a,c){var d=dn();c=c===void 0?null:c;var f=void 0;if(gt!==null){var _=gt.memoizedState;if(f=_.destroy,c!==null&&ch(c,_.deps)){d.memoizedState=ya(i,a,f,c);return}}et.flags|=n,d.memoizedState=ya(1|i,a,f,c)}function Bp(n,i){return Jl(8390656,8,n,i)}function mh(n,i){return Xl(2048,8,n,i)}function $p(n,i){return Xl(4,2,n,i)}function qp(n,i){return Xl(4,4,n,i)}function Hp(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function Wp(n,i,a){return a=a!=null?a.concat([n]):null,Xl(4,4,Hp.bind(null,i,n),a)}function gh(){}function Gp(n,i){var a=dn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&ch(i,c[1])?c[0]:(a.memoizedState=[n,i],n)}function Kp(n,i){var a=dn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&ch(i,c[1])?c[0]:(n=n(),a.memoizedState=[n,i],n)}function Qp(n,i,a){return(Ki&21)===0?(n.baseState&&(n.baseState=!1,Wt=!0),n.memoizedState=a):(Tn(a,i)||(a=$o(),et.lanes|=a,Qi|=a,n.baseState=!0),i)}function LE(n,i){var a=xe;xe=a!==0&&4>a?a:4,n(!0);var c=uh.transition;uh.transition={};try{n(!1),i()}finally{xe=a,uh.transition=c}}function Yp(){return dn().memoizedState}function bE(n,i,a){var c=si(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Jp(n))Xp(i,a);else if(a=kp(n,i,a,c),a!==null){var d=$t();Cn(a,n,c,d),Zp(a,i,c)}}function ME(n,i,a){var c=si(n),d={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Jp(n))Xp(i,d);else{var f=n.alternate;if(n.lanes===0&&(f===null||f.lanes===0)&&(f=i.lastRenderedReducer,f!==null))try{var _=i.lastRenderedState,T=f(_,a);if(d.hasEagerState=!0,d.eagerState=T,Tn(T,_)){var k=i.interleaved;k===null?(d.next=d,rh(i)):(d.next=k.next,k.next=d),i.interleaved=d;return}}catch{}finally{}a=kp(n,i,d,c),a!==null&&(d=$t(),Cn(a,n,c,d),Zp(a,i,c))}}function Jp(n){var i=n.alternate;return n===et||i!==null&&i===et}function Xp(n,i){pa=Yl=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function Zp(n,i,a){if((a&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,Ho(n,a)}}var Zl={readContext:hn,useCallback:xt,useContext:xt,useEffect:xt,useImperativeHandle:xt,useInsertionEffect:xt,useLayoutEffect:xt,useMemo:xt,useReducer:xt,useRef:xt,useState:xt,useDebugValue:xt,useDeferredValue:xt,useTransition:xt,useMutableSource:xt,useSyncExternalStore:xt,useId:xt,unstable_isNewReconciler:!1},FE={readContext:hn,useCallback:function(n,i){return Jn().memoizedState=[n,i===void 0?null:i],n},useContext:hn,useEffect:Bp,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,Jl(4194308,4,Hp.bind(null,i,n),a)},useLayoutEffect:function(n,i){return Jl(4194308,4,n,i)},useInsertionEffect:function(n,i){return Jl(4,2,n,i)},useMemo:function(n,i){var a=Jn();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var c=Jn();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=bE.bind(null,et,n),[c.memoizedState,n]},useRef:function(n){var i=Jn();return n={current:n},i.memoizedState=n},useState:jp,useDebugValue:gh,useDeferredValue:function(n){return Jn().memoizedState=n},useTransition:function(){var n=jp(!1),i=n[0];return n=LE.bind(null,n[1]),Jn().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var c=et,d=Jn();if(Xe){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),wt===null)throw Error(t(349));(Ki&30)!==0||Lp(c,i,a)}d.memoizedState=a;var f={value:a,getSnapshot:i};return d.queue=f,Bp(Mp.bind(null,c,f,n),[n]),c.flags|=2048,ya(9,bp.bind(null,c,f,a,i),void 0,null),a},useId:function(){var n=Jn(),i=wt.identifierPrefix;if(Xe){var a=vr,c=_r;a=(c&~(1<<32-Xt(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=ma++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=OE++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},UE={readContext:hn,useCallback:Gp,useContext:hn,useEffect:mh,useImperativeHandle:Wp,useInsertionEffect:$p,useLayoutEffect:qp,useMemo:Kp,useReducer:fh,useRef:zp,useState:function(){return fh(ga)},useDebugValue:gh,useDeferredValue:function(n){var i=dn();return Qp(i,gt.memoizedState,n)},useTransition:function(){var n=fh(ga)[0],i=dn().memoizedState;return[n,i]},useMutableSource:xp,useSyncExternalStore:Op,useId:Yp,unstable_isNewReconciler:!1},jE={readContext:hn,useCallback:Gp,useContext:hn,useEffect:mh,useImperativeHandle:Wp,useInsertionEffect:$p,useLayoutEffect:qp,useMemo:Kp,useReducer:ph,useRef:zp,useState:function(){return ph(ga)},useDebugValue:gh,useDeferredValue:function(n){var i=dn();return gt===null?i.memoizedState=n:Qp(i,gt.memoizedState,n)},useTransition:function(){var n=ph(ga)[0],i=dn().memoizedState;return[n,i]},useMutableSource:xp,useSyncExternalStore:Op,useId:Yp,unstable_isNewReconciler:!1};function Sn(n,i){if(n&&n.defaultProps){i=ie({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function yh(n,i,a,c){i=n.memoizedState,a=a(c,i),a=a==null?i:ie({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var eu={isMounted:function(n){return(n=n._reactInternals)?En(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var c=$t(),d=si(n),f=wr(c,d);f.payload=i,a!=null&&(f.callback=a),i=ti(n,f,d),i!==null&&(Cn(i,n,d,c),Wl(i,n,d))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var c=$t(),d=si(n),f=wr(c,d);f.tag=1,f.payload=i,a!=null&&(f.callback=a),i=ti(n,f,d),i!==null&&(Cn(i,n,d,c),Wl(i,n,d))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=$t(),c=si(n),d=wr(a,c);d.tag=2,i!=null&&(d.callback=i),i=ti(n,d,c),i!==null&&(Cn(i,n,c,a),Wl(i,n,c))}};function em(n,i,a,c,d,f,_){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,f,_):i.prototype&&i.prototype.isPureReactComponent?!ra(a,c)||!ra(d,f):!0}function tm(n,i,a){var c=!1,d=Xr,f=i.contextType;return typeof f=="object"&&f!==null?f=hn(f):(d=Ht(i)?$i:Vt.current,c=i.contextTypes,f=(c=c!=null)?Ws(n,d):Xr),i=new i(a,f),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=eu,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=f),i}function nm(n,i,a,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==n&&eu.enqueueReplaceState(i,i.state,null)}function _h(n,i,a,c){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},ih(n);var f=i.contextType;typeof f=="object"&&f!==null?d.context=hn(f):(f=Ht(i)?$i:Vt.current,d.context=Ws(n,f)),d.state=n.memoizedState,f=i.getDerivedStateFromProps,typeof f=="function"&&(yh(n,i,f,a),d.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(i=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),i!==d.state&&eu.enqueueReplaceState(d,d.state,null),Gl(n,a,d,c),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function eo(n,i){try{var a="",c=i;do a+=Z(c),c=c.return;while(c);var d=a}catch(f){d=`
Error generating stack: `+f.message+`
`+f.stack}return{value:n,source:i,stack:d,digest:null}}function vh(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function Eh(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var zE=typeof WeakMap=="function"?WeakMap:Map;function rm(n,i,a){a=wr(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){au||(au=!0,Lh=c),Eh(n,i)},a}function im(n,i,a){a=wr(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var d=i.value;a.payload=function(){return c(d)},a.callback=function(){Eh(n,i)}}var f=n.stateNode;return f!==null&&typeof f.componentDidCatch=="function"&&(a.callback=function(){Eh(n,i),typeof c!="function"&&(ri===null?ri=new Set([this]):ri.add(this));var _=i.stack;this.componentDidCatch(i.value,{componentStack:_!==null?_:""})}),a}function sm(n,i,a){var c=n.pingCache;if(c===null){c=n.pingCache=new zE;var d=new Set;c.set(i,d)}else d=c.get(i),d===void 0&&(d=new Set,c.set(i,d));d.has(a)||(d.add(a),n=tw.bind(null,n,i,a),i.then(n,n))}function om(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function am(n,i,a,c,d){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=wr(-1,1),i.tag=2,ti(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var BE=Oe.ReactCurrentOwner,Wt=!1;function Bt(n,i,a,c){i.child=n===null?Cp(i,null,a,c):Ys(i,n.child,a,c)}function lm(n,i,a,c,d){a=a.render;var f=i.ref;return Xs(i,d),c=hh(n,i,a,c,f,d),a=dh(),n!==null&&!Wt?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Tr(n,i,d)):(Xe&&a&&Kc(i),i.flags|=1,Bt(n,i,c,d),i.child)}function um(n,i,a,c,d){if(n===null){var f=a.type;return typeof f=="function"&&!Bh(f)&&f.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=f,cm(n,i,f,c,d)):(n=fu(a.type,null,c,i,i.mode,d),n.ref=i.ref,n.return=i,i.child=n)}if(f=n.child,(n.lanes&d)===0){var _=f.memoizedProps;if(a=a.compare,a=a!==null?a:ra,a(_,c)&&n.ref===i.ref)return Tr(n,i,d)}return i.flags|=1,n=ai(f,c),n.ref=i.ref,n.return=i,i.child=n}function cm(n,i,a,c,d){if(n!==null){var f=n.memoizedProps;if(ra(f,c)&&n.ref===i.ref)if(Wt=!1,i.pendingProps=c=f,(n.lanes&d)!==0)(n.flags&131072)!==0&&(Wt=!0);else return i.lanes=n.lanes,Tr(n,i,d)}return wh(n,i,a,c,d)}function hm(n,i,a){var c=i.pendingProps,d=c.children,f=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},He(no,on),on|=a;else{if((a&1073741824)===0)return n=f!==null?f.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,He(no,on),on|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=f!==null?f.baseLanes:a,He(no,on),on|=c}else f!==null?(c=f.baseLanes|a,i.memoizedState=null):c=a,He(no,on),on|=c;return Bt(n,i,d,a),i.child}function dm(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function wh(n,i,a,c,d){var f=Ht(a)?$i:Vt.current;return f=Ws(i,f),Xs(i,d),a=hh(n,i,a,c,f,d),c=dh(),n!==null&&!Wt?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Tr(n,i,d)):(Xe&&c&&Kc(i),i.flags|=1,Bt(n,i,a,d),i.child)}function fm(n,i,a,c,d){if(Ht(a)){var f=!0;Fl(i)}else f=!1;if(Xs(i,d),i.stateNode===null)nu(n,i),tm(i,a,c),_h(i,a,c,d),c=!0;else if(n===null){var _=i.stateNode,T=i.memoizedProps;_.props=T;var k=_.context,F=a.contextType;typeof F=="object"&&F!==null?F=hn(F):(F=Ht(a)?$i:Vt.current,F=Ws(i,F));var G=a.getDerivedStateFromProps,K=typeof G=="function"||typeof _.getSnapshotBeforeUpdate=="function";K||typeof _.UNSAFE_componentWillReceiveProps!="function"&&typeof _.componentWillReceiveProps!="function"||(T!==c||k!==F)&&nm(i,_,c,F),ei=!1;var W=i.memoizedState;_.state=W,Gl(i,c,_,d),k=i.memoizedState,T!==c||W!==k||qt.current||ei?(typeof G=="function"&&(yh(i,a,G,c),k=i.memoizedState),(T=ei||em(i,a,T,c,W,k,F))?(K||typeof _.UNSAFE_componentWillMount!="function"&&typeof _.componentWillMount!="function"||(typeof _.componentWillMount=="function"&&_.componentWillMount(),typeof _.UNSAFE_componentWillMount=="function"&&_.UNSAFE_componentWillMount()),typeof _.componentDidMount=="function"&&(i.flags|=4194308)):(typeof _.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=k),_.props=c,_.state=k,_.context=F,c=T):(typeof _.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{_=i.stateNode,Pp(n,i),T=i.memoizedProps,F=i.type===i.elementType?T:Sn(i.type,T),_.props=F,K=i.pendingProps,W=_.context,k=a.contextType,typeof k=="object"&&k!==null?k=hn(k):(k=Ht(a)?$i:Vt.current,k=Ws(i,k));var re=a.getDerivedStateFromProps;(G=typeof re=="function"||typeof _.getSnapshotBeforeUpdate=="function")||typeof _.UNSAFE_componentWillReceiveProps!="function"&&typeof _.componentWillReceiveProps!="function"||(T!==K||W!==k)&&nm(i,_,c,k),ei=!1,W=i.memoizedState,_.state=W,Gl(i,c,_,d);var ae=i.memoizedState;T!==K||W!==ae||qt.current||ei?(typeof re=="function"&&(yh(i,a,re,c),ae=i.memoizedState),(F=ei||em(i,a,F,c,W,ae,k)||!1)?(G||typeof _.UNSAFE_componentWillUpdate!="function"&&typeof _.componentWillUpdate!="function"||(typeof _.componentWillUpdate=="function"&&_.componentWillUpdate(c,ae,k),typeof _.UNSAFE_componentWillUpdate=="function"&&_.UNSAFE_componentWillUpdate(c,ae,k)),typeof _.componentDidUpdate=="function"&&(i.flags|=4),typeof _.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof _.componentDidUpdate!="function"||T===n.memoizedProps&&W===n.memoizedState||(i.flags|=4),typeof _.getSnapshotBeforeUpdate!="function"||T===n.memoizedProps&&W===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=ae),_.props=c,_.state=ae,_.context=k,c=F):(typeof _.componentDidUpdate!="function"||T===n.memoizedProps&&W===n.memoizedState||(i.flags|=4),typeof _.getSnapshotBeforeUpdate!="function"||T===n.memoizedProps&&W===n.memoizedState||(i.flags|=1024),c=!1)}return Th(n,i,a,c,f,d)}function Th(n,i,a,c,d,f){dm(n,i);var _=(i.flags&128)!==0;if(!c&&!_)return d&&_p(i,a,!1),Tr(n,i,f);c=i.stateNode,BE.current=i;var T=_&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&_?(i.child=Ys(i,n.child,null,f),i.child=Ys(i,null,T,f)):Bt(n,i,T,f),i.memoizedState=c.state,d&&_p(i,a,!0),i.child}function pm(n){var i=n.stateNode;i.pendingContext?gp(n,i.pendingContext,i.pendingContext!==i.context):i.context&&gp(n,i.context,!1),sh(n,i.containerInfo)}function mm(n,i,a,c,d){return Qs(),Xc(d),i.flags|=256,Bt(n,i,a,c),i.child}var Ih={dehydrated:null,treeContext:null,retryLane:0};function Sh(n){return{baseLanes:n,cachePool:null,transitions:null}}function gm(n,i,a){var c=i.pendingProps,d=Ze.current,f=!1,_=(i.flags&128)!==0,T;if((T=_)||(T=n!==null&&n.memoizedState===null?!1:(d&2)!==0),T?(f=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),He(Ze,d&1),n===null)return Jc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(_=c.children,n=c.fallback,f?(c=i.mode,f=i.child,_={mode:"hidden",children:_},(c&1)===0&&f!==null?(f.childLanes=0,f.pendingProps=_):f=pu(_,c,0,null),n=Zi(n,c,a,null),f.return=i,n.return=i,f.sibling=n,i.child=f,i.child.memoizedState=Sh(a),i.memoizedState=Ih,n):Ah(i,_));if(d=n.memoizedState,d!==null&&(T=d.dehydrated,T!==null))return $E(n,i,_,c,T,d,a);if(f){f=c.fallback,_=i.mode,d=n.child,T=d.sibling;var k={mode:"hidden",children:c.children};return(_&1)===0&&i.child!==d?(c=i.child,c.childLanes=0,c.pendingProps=k,i.deletions=null):(c=ai(d,k),c.subtreeFlags=d.subtreeFlags&14680064),T!==null?f=ai(T,f):(f=Zi(f,_,a,null),f.flags|=2),f.return=i,c.return=i,c.sibling=f,i.child=c,c=f,f=i.child,_=n.child.memoizedState,_=_===null?Sh(a):{baseLanes:_.baseLanes|a,cachePool:null,transitions:_.transitions},f.memoizedState=_,f.childLanes=n.childLanes&~a,i.memoizedState=Ih,c}return f=n.child,n=f.sibling,c=ai(f,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=c,i.memoizedState=null,c}function Ah(n,i){return i=pu({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function tu(n,i,a,c){return c!==null&&Xc(c),Ys(i,n.child,null,a),n=Ah(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function $E(n,i,a,c,d,f,_){if(a)return i.flags&256?(i.flags&=-257,c=vh(Error(t(422))),tu(n,i,_,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(f=c.fallback,d=i.mode,c=pu({mode:"visible",children:c.children},d,0,null),f=Zi(f,d,_,null),f.flags|=2,c.return=i,f.return=i,c.sibling=f,i.child=c,(i.mode&1)!==0&&Ys(i,n.child,null,_),i.child.memoizedState=Sh(_),i.memoizedState=Ih,f);if((i.mode&1)===0)return tu(n,i,_,null);if(d.data==="$!"){if(c=d.nextSibling&&d.nextSibling.dataset,c)var T=c.dgst;return c=T,f=Error(t(419)),c=vh(f,c,void 0),tu(n,i,_,c)}if(T=(_&n.childLanes)!==0,Wt||T){if(c=wt,c!==null){switch(_&-_){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(c.suspendedLanes|_))!==0?0:d,d!==0&&d!==f.retryLane&&(f.retryLane=d,Er(n,d),Cn(c,n,d,-1))}return zh(),c=vh(Error(t(421))),tu(n,i,_,c)}return d.data==="$?"?(i.flags|=128,i.child=n.child,i=nw.bind(null,n),d._reactRetry=i,null):(n=f.treeContext,sn=Yr(d.nextSibling),rn=i,Xe=!0,In=null,n!==null&&(un[cn++]=_r,un[cn++]=vr,un[cn++]=qi,_r=n.id,vr=n.overflow,qi=i),i=Ah(i,c.children),i.flags|=4096,i)}function ym(n,i,a){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),nh(n.return,i,a)}function Rh(n,i,a,c,d){var f=n.memoizedState;f===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:d}:(f.isBackwards=i,f.rendering=null,f.renderingStartTime=0,f.last=c,f.tail=a,f.tailMode=d)}function _m(n,i,a){var c=i.pendingProps,d=c.revealOrder,f=c.tail;if(Bt(n,i,c.children,a),c=Ze.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&ym(n,a,i);else if(n.tag===19)ym(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(He(Ze,c),(i.mode&1)===0)i.memoizedState=null;else switch(d){case"forwards":for(a=i.child,d=null;a!==null;)n=a.alternate,n!==null&&Kl(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=i.child,i.child=null):(d=a.sibling,a.sibling=null),Rh(i,!1,d,a,f);break;case"backwards":for(a=null,d=i.child,i.child=null;d!==null;){if(n=d.alternate,n!==null&&Kl(n)===null){i.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}Rh(i,!0,a,null,f);break;case"together":Rh(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function nu(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Tr(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),Qi|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=ai(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=ai(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function qE(n,i,a){switch(i.tag){case 3:pm(i),Qs();break;case 5:Vp(i);break;case 1:Ht(i.type)&&Fl(i);break;case 4:sh(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,d=i.memoizedProps.value;He(ql,c._currentValue),c._currentValue=d;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(He(Ze,Ze.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?gm(n,i,a):(He(Ze,Ze.current&1),n=Tr(n,i,a),n!==null?n.sibling:null);He(Ze,Ze.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(n.flags&128)!==0){if(c)return _m(n,i,a);i.flags|=128}if(d=i.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),He(Ze,Ze.current),c)break;return null;case 22:case 23:return i.lanes=0,hm(n,i,a)}return Tr(n,i,a)}var vm,Ch,Em,wm;vm=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},Ch=function(){},Em=function(n,i,a,c){var d=n.memoizedProps;if(d!==c){n=i.stateNode,Gi(Yn.current);var f=null;switch(a){case"input":d=_s(n,d),c=_s(n,c),f=[];break;case"select":d=ie({},d,{value:void 0}),c=ie({},c,{value:void 0}),f=[];break;case"textarea":d=Vo(n,d),c=Vo(n,c),f=[];break;default:typeof d.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Ll)}vn(a,c);var _;a=null;for(F in d)if(!c.hasOwnProperty(F)&&d.hasOwnProperty(F)&&d[F]!=null)if(F==="style"){var T=d[F];for(_ in T)T.hasOwnProperty(_)&&(a||(a={}),a[_]="")}else F!=="dangerouslySetInnerHTML"&&F!=="children"&&F!=="suppressContentEditableWarning"&&F!=="suppressHydrationWarning"&&F!=="autoFocus"&&(o.hasOwnProperty(F)?f||(f=[]):(f=f||[]).push(F,null));for(F in c){var k=c[F];if(T=d!=null?d[F]:void 0,c.hasOwnProperty(F)&&k!==T&&(k!=null||T!=null))if(F==="style")if(T){for(_ in T)!T.hasOwnProperty(_)||k&&k.hasOwnProperty(_)||(a||(a={}),a[_]="");for(_ in k)k.hasOwnProperty(_)&&T[_]!==k[_]&&(a||(a={}),a[_]=k[_])}else a||(f||(f=[]),f.push(F,a)),a=k;else F==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,T=T?T.__html:void 0,k!=null&&T!==k&&(f=f||[]).push(F,k)):F==="children"?typeof k!="string"&&typeof k!="number"||(f=f||[]).push(F,""+k):F!=="suppressContentEditableWarning"&&F!=="suppressHydrationWarning"&&(o.hasOwnProperty(F)?(k!=null&&F==="onScroll"&&Qe("scroll",n),f||T===k||(f=[])):(f=f||[]).push(F,k))}a&&(f=f||[]).push("style",a);var F=f;(i.updateQueue=F)&&(i.flags|=4)}},wm=function(n,i,a,c){a!==c&&(i.flags|=4)};function _a(n,i){if(!Xe)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function Ot(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(i)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags&14680064,c|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags,c|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=c,n.childLanes=a,i}function HE(n,i,a){var c=i.pendingProps;switch(Qc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ot(i),null;case 1:return Ht(i.type)&&Ml(),Ot(i),null;case 3:return c=i.stateNode,Zs(),Ye(qt),Ye(Vt),lh(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(Bl(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,In!==null&&(Fh(In),In=null))),Ch(n,i),Ot(i),null;case 5:oh(i);var d=Gi(fa.current);if(a=i.type,n!==null&&i.stateNode!=null)Em(n,i,a,c,d),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return Ot(i),null}if(n=Gi(Yn.current),Bl(i)){c=i.stateNode,a=i.type;var f=i.memoizedProps;switch(c[Qn]=i,c[la]=f,n=(i.mode&1)!==0,a){case"dialog":Qe("cancel",c),Qe("close",c);break;case"iframe":case"object":case"embed":Qe("load",c);break;case"video":case"audio":for(d=0;d<sa.length;d++)Qe(sa[d],c);break;case"source":Qe("error",c);break;case"img":case"image":case"link":Qe("error",c),Qe("load",c);break;case"details":Qe("toggle",c);break;case"input":ol(c,f),Qe("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!f.multiple},Qe("invalid",c);break;case"textarea":xo(c,f),Qe("invalid",c)}vn(a,f),d=null;for(var _ in f)if(f.hasOwnProperty(_)){var T=f[_];_==="children"?typeof T=="string"?c.textContent!==T&&(f.suppressHydrationWarning!==!0&&Ol(c.textContent,T,n),d=["children",T]):typeof T=="number"&&c.textContent!==""+T&&(f.suppressHydrationWarning!==!0&&Ol(c.textContent,T,n),d=["children",""+T]):o.hasOwnProperty(_)&&T!=null&&_==="onScroll"&&Qe("scroll",c)}switch(a){case"input":ys(c),Do(c,f,!0);break;case"textarea":ys(c),Or(c);break;case"select":case"option":break;default:typeof f.onClick=="function"&&(c.onclick=Ll)}c=d,i.updateQueue=c,c!==null&&(i.flags|=4)}else{_=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Oo(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=_.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=_.createElement(a,{is:c.is}):(n=_.createElement(a),a==="select"&&(_=n,c.multiple?_.multiple=!0:c.size&&(_.size=c.size))):n=_.createElementNS(n,a),n[Qn]=i,n[la]=c,vm(n,i,!1,!1),i.stateNode=n;e:{switch(_=Ts(a,c),a){case"dialog":Qe("cancel",n),Qe("close",n),d=c;break;case"iframe":case"object":case"embed":Qe("load",n),d=c;break;case"video":case"audio":for(d=0;d<sa.length;d++)Qe(sa[d],n);d=c;break;case"source":Qe("error",n),d=c;break;case"img":case"image":case"link":Qe("error",n),Qe("load",n),d=c;break;case"details":Qe("toggle",n),d=c;break;case"input":ol(n,c),d=_s(n,c),Qe("invalid",n);break;case"option":d=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},d=ie({},c,{value:void 0}),Qe("invalid",n);break;case"textarea":xo(n,c),d=Vo(n,c),Qe("invalid",n);break;default:d=c}vn(a,d),T=d;for(f in T)if(T.hasOwnProperty(f)){var k=T[f];f==="style"?ws(n,k):f==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,k!=null&&ll(n,k)):f==="children"?typeof k=="string"?(a!=="textarea"||k!=="")&&ki(n,k):typeof k=="number"&&ki(n,""+k):f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&f!=="autoFocus"&&(o.hasOwnProperty(f)?k!=null&&f==="onScroll"&&Qe("scroll",n):k!=null&&Ce(n,f,k,_))}switch(a){case"input":ys(n),Do(n,c,!1);break;case"textarea":ys(n),Or(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Se(c.value));break;case"select":n.multiple=!!c.multiple,f=c.value,f!=null?_n(n,!!c.multiple,f,!1):c.defaultValue!=null&&_n(n,!!c.multiple,c.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=Ll)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return Ot(i),null;case 6:if(n&&i.stateNode!=null)wm(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(a=Gi(fa.current),Gi(Yn.current),Bl(i)){if(c=i.stateNode,a=i.memoizedProps,c[Qn]=i,(f=c.nodeValue!==a)&&(n=rn,n!==null))switch(n.tag){case 3:Ol(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Ol(c.nodeValue,a,(n.mode&1)!==0)}f&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[Qn]=i,i.stateNode=c}return Ot(i),null;case 13:if(Ye(Ze),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Xe&&sn!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Sp(),Qs(),i.flags|=98560,f=!1;else if(f=Bl(i),c!==null&&c.dehydrated!==null){if(n===null){if(!f)throw Error(t(318));if(f=i.memoizedState,f=f!==null?f.dehydrated:null,!f)throw Error(t(317));f[Qn]=i}else Qs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;Ot(i),f=!1}else In!==null&&(Fh(In),In=null),f=!0;if(!f)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(Ze.current&1)!==0?yt===0&&(yt=3):zh())),i.updateQueue!==null&&(i.flags|=4),Ot(i),null);case 4:return Zs(),Ch(n,i),n===null&&oa(i.stateNode.containerInfo),Ot(i),null;case 10:return th(i.type._context),Ot(i),null;case 17:return Ht(i.type)&&Ml(),Ot(i),null;case 19:if(Ye(Ze),f=i.memoizedState,f===null)return Ot(i),null;if(c=(i.flags&128)!==0,_=f.rendering,_===null)if(c)_a(f,!1);else{if(yt!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(_=Kl(n),_!==null){for(i.flags|=128,_a(f,!1),c=_.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)f=a,n=c,f.flags&=14680066,_=f.alternate,_===null?(f.childLanes=0,f.lanes=n,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=_.childLanes,f.lanes=_.lanes,f.child=_.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=_.memoizedProps,f.memoizedState=_.memoizedState,f.updateQueue=_.updateQueue,f.type=_.type,n=_.dependencies,f.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return He(Ze,Ze.current&1|2),i.child}n=n.sibling}f.tail!==null&&Ke()>ro&&(i.flags|=128,c=!0,_a(f,!1),i.lanes=4194304)}else{if(!c)if(n=Kl(_),n!==null){if(i.flags|=128,c=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),_a(f,!0),f.tail===null&&f.tailMode==="hidden"&&!_.alternate&&!Xe)return Ot(i),null}else 2*Ke()-f.renderingStartTime>ro&&a!==1073741824&&(i.flags|=128,c=!0,_a(f,!1),i.lanes=4194304);f.isBackwards?(_.sibling=i.child,i.child=_):(a=f.last,a!==null?a.sibling=_:i.child=_,f.last=_)}return f.tail!==null?(i=f.tail,f.rendering=i,f.tail=i.sibling,f.renderingStartTime=Ke(),i.sibling=null,a=Ze.current,He(Ze,c?a&1|2:a&1),i):(Ot(i),null);case 22:case 23:return jh(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(on&1073741824)!==0&&(Ot(i),i.subtreeFlags&6&&(i.flags|=8192)):Ot(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function WE(n,i){switch(Qc(i),i.tag){case 1:return Ht(i.type)&&Ml(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return Zs(),Ye(qt),Ye(Vt),lh(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return oh(i),null;case 13:if(Ye(Ze),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));Qs()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Ye(Ze),null;case 4:return Zs(),null;case 10:return th(i.type._context),null;case 22:case 23:return jh(),null;case 24:return null;default:return null}}var ru=!1,Lt=!1,GE=typeof WeakSet=="function"?WeakSet:Set,oe=null;function to(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){rt(n,i,c)}else a.current=null}function kh(n,i,a){try{a()}catch(c){rt(n,i,c)}}var Tm=!1;function KE(n,i){if(jc=fr,n=ep(),Vc(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var d=c.anchorOffset,f=c.focusNode;c=c.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break e}var _=0,T=-1,k=-1,F=0,G=0,K=n,W=null;t:for(;;){for(var re;K!==a||d!==0&&K.nodeType!==3||(T=_+d),K!==f||c!==0&&K.nodeType!==3||(k=_+c),K.nodeType===3&&(_+=K.nodeValue.length),(re=K.firstChild)!==null;)W=K,K=re;for(;;){if(K===n)break t;if(W===a&&++F===d&&(T=_),W===f&&++G===c&&(k=_),(re=K.nextSibling)!==null)break;K=W,W=K.parentNode}K=re}a=T===-1||k===-1?null:{start:T,end:k}}else a=null}a=a||{start:0,end:0}}else a=null;for(zc={focusedElem:n,selectionRange:a},fr=!1,oe=i;oe!==null;)if(i=oe,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,oe=n;else for(;oe!==null;){i=oe;try{var ae=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(ae!==null){var le=ae.memoizedProps,at=ae.memoizedState,L=i.stateNode,D=L.getSnapshotBeforeUpdate(i.elementType===i.type?le:Sn(i.type,le),at);L.__reactInternalSnapshotBeforeUpdate=D}break;case 3:var M=i.stateNode.containerInfo;M.nodeType===1?M.textContent="":M.nodeType===9&&M.documentElement&&M.removeChild(M.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Y){rt(i,i.return,Y)}if(n=i.sibling,n!==null){n.return=i.return,oe=n;break}oe=i.return}return ae=Tm,Tm=!1,ae}function va(n,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var d=c=c.next;do{if((d.tag&n)===n){var f=d.destroy;d.destroy=void 0,f!==void 0&&kh(i,a,f)}d=d.next}while(d!==c)}}function iu(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function Ph(n){var i=n.ref;if(i!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof i=="function"?i(n):i.current=n}}function Im(n){var i=n.alternate;i!==null&&(n.alternate=null,Im(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[Qn],delete i[la],delete i[Hc],delete i[NE],delete i[DE])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Sm(n){return n.tag===5||n.tag===3||n.tag===4}function Am(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Sm(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Nh(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=Ll));else if(c!==4&&(n=n.child,n!==null))for(Nh(n,i,a),n=n.sibling;n!==null;)Nh(n,i,a),n=n.sibling}function Dh(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Dh(n,i,a),n=n.sibling;n!==null;)Dh(n,i,a),n=n.sibling}var Rt=null,An=!1;function ni(n,i,a){for(a=a.child;a!==null;)Rm(n,i,a),a=a.sibling}function Rm(n,i,a){if(Jt&&typeof Jt.onCommitFiberUnmount=="function")try{Jt.onCommitFiberUnmount(xi,a)}catch{}switch(a.tag){case 5:Lt||to(a,i);case 6:var c=Rt,d=An;Rt=null,ni(n,i,a),Rt=c,An=d,Rt!==null&&(An?(n=Rt,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):Rt.removeChild(a.stateNode));break;case 18:Rt!==null&&(An?(n=Rt,a=a.stateNode,n.nodeType===8?qc(n.parentNode,a):n.nodeType===1&&qc(n,a),Wr(n)):qc(Rt,a.stateNode));break;case 4:c=Rt,d=An,Rt=a.stateNode.containerInfo,An=!0,ni(n,i,a),Rt=c,An=d;break;case 0:case 11:case 14:case 15:if(!Lt&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){d=c=c.next;do{var f=d,_=f.destroy;f=f.tag,_!==void 0&&((f&2)!==0||(f&4)!==0)&&kh(a,i,_),d=d.next}while(d!==c)}ni(n,i,a);break;case 1:if(!Lt&&(to(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(T){rt(a,i,T)}ni(n,i,a);break;case 21:ni(n,i,a);break;case 22:a.mode&1?(Lt=(c=Lt)||a.memoizedState!==null,ni(n,i,a),Lt=c):ni(n,i,a);break;default:ni(n,i,a)}}function Cm(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new GE),i.forEach(function(c){var d=rw.bind(null,n,c);a.has(c)||(a.add(c),c.then(d,d))})}}function Rn(n,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var d=a[c];try{var f=n,_=i,T=_;e:for(;T!==null;){switch(T.tag){case 5:Rt=T.stateNode,An=!1;break e;case 3:Rt=T.stateNode.containerInfo,An=!0;break e;case 4:Rt=T.stateNode.containerInfo,An=!0;break e}T=T.return}if(Rt===null)throw Error(t(160));Rm(f,_,d),Rt=null,An=!1;var k=d.alternate;k!==null&&(k.return=null),d.return=null}catch(F){rt(d,i,F)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)km(i,n),i=i.sibling}function km(n,i){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Rn(i,n),Xn(n),c&4){try{va(3,n,n.return),iu(3,n)}catch(le){rt(n,n.return,le)}try{va(5,n,n.return)}catch(le){rt(n,n.return,le)}}break;case 1:Rn(i,n),Xn(n),c&512&&a!==null&&to(a,a.return);break;case 5:if(Rn(i,n),Xn(n),c&512&&a!==null&&to(a,a.return),n.flags&32){var d=n.stateNode;try{ki(d,"")}catch(le){rt(n,n.return,le)}}if(c&4&&(d=n.stateNode,d!=null)){var f=n.memoizedProps,_=a!==null?a.memoizedProps:f,T=n.type,k=n.updateQueue;if(n.updateQueue=null,k!==null)try{T==="input"&&f.type==="radio"&&f.name!=null&&vs(d,f),Ts(T,_);var F=Ts(T,f);for(_=0;_<k.length;_+=2){var G=k[_],K=k[_+1];G==="style"?ws(d,K):G==="dangerouslySetInnerHTML"?ll(d,K):G==="children"?ki(d,K):Ce(d,G,K,F)}switch(T){case"input":Ci(d,f);break;case"textarea":al(d,f);break;case"select":var W=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!f.multiple;var re=f.value;re!=null?_n(d,!!f.multiple,re,!1):W!==!!f.multiple&&(f.defaultValue!=null?_n(d,!!f.multiple,f.defaultValue,!0):_n(d,!!f.multiple,f.multiple?[]:"",!1))}d[la]=f}catch(le){rt(n,n.return,le)}}break;case 6:if(Rn(i,n),Xn(n),c&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,f=n.memoizedProps;try{d.nodeValue=f}catch(le){rt(n,n.return,le)}}break;case 3:if(Rn(i,n),Xn(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{Wr(i.containerInfo)}catch(le){rt(n,n.return,le)}break;case 4:Rn(i,n),Xn(n);break;case 13:Rn(i,n),Xn(n),d=n.child,d.flags&8192&&(f=d.memoizedState!==null,d.stateNode.isHidden=f,!f||d.alternate!==null&&d.alternate.memoizedState!==null||(Oh=Ke())),c&4&&Cm(n);break;case 22:if(G=a!==null&&a.memoizedState!==null,n.mode&1?(Lt=(F=Lt)||G,Rn(i,n),Lt=F):Rn(i,n),Xn(n),c&8192){if(F=n.memoizedState!==null,(n.stateNode.isHidden=F)&&!G&&(n.mode&1)!==0)for(oe=n,G=n.child;G!==null;){for(K=oe=G;oe!==null;){switch(W=oe,re=W.child,W.tag){case 0:case 11:case 14:case 15:va(4,W,W.return);break;case 1:to(W,W.return);var ae=W.stateNode;if(typeof ae.componentWillUnmount=="function"){c=W,a=W.return;try{i=c,ae.props=i.memoizedProps,ae.state=i.memoizedState,ae.componentWillUnmount()}catch(le){rt(c,a,le)}}break;case 5:to(W,W.return);break;case 22:if(W.memoizedState!==null){Dm(K);continue}}re!==null?(re.return=W,oe=re):Dm(K)}G=G.sibling}e:for(G=null,K=n;;){if(K.tag===5){if(G===null){G=K;try{d=K.stateNode,F?(f=d.style,typeof f.setProperty=="function"?f.setProperty("display","none","important"):f.display="none"):(T=K.stateNode,k=K.memoizedProps.style,_=k!=null&&k.hasOwnProperty("display")?k.display:null,T.style.display=Mr("display",_))}catch(le){rt(n,n.return,le)}}}else if(K.tag===6){if(G===null)try{K.stateNode.nodeValue=F?"":K.memoizedProps}catch(le){rt(n,n.return,le)}}else if((K.tag!==22&&K.tag!==23||K.memoizedState===null||K===n)&&K.child!==null){K.child.return=K,K=K.child;continue}if(K===n)break e;for(;K.sibling===null;){if(K.return===null||K.return===n)break e;G===K&&(G=null),K=K.return}G===K&&(G=null),K.sibling.return=K.return,K=K.sibling}}break;case 19:Rn(i,n),Xn(n),c&4&&Cm(n);break;case 21:break;default:Rn(i,n),Xn(n)}}function Xn(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(Sm(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var d=c.stateNode;c.flags&32&&(ki(d,""),c.flags&=-33);var f=Am(n);Dh(n,f,d);break;case 3:case 4:var _=c.stateNode.containerInfo,T=Am(n);Nh(n,T,_);break;default:throw Error(t(161))}}catch(k){rt(n,n.return,k)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function QE(n,i,a){oe=n,Pm(n)}function Pm(n,i,a){for(var c=(n.mode&1)!==0;oe!==null;){var d=oe,f=d.child;if(d.tag===22&&c){var _=d.memoizedState!==null||ru;if(!_){var T=d.alternate,k=T!==null&&T.memoizedState!==null||Lt;T=ru;var F=Lt;if(ru=_,(Lt=k)&&!F)for(oe=d;oe!==null;)_=oe,k=_.child,_.tag===22&&_.memoizedState!==null?Vm(d):k!==null?(k.return=_,oe=k):Vm(d);for(;f!==null;)oe=f,Pm(f),f=f.sibling;oe=d,ru=T,Lt=F}Nm(n)}else(d.subtreeFlags&8772)!==0&&f!==null?(f.return=d,oe=f):Nm(n)}}function Nm(n){for(;oe!==null;){var i=oe;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:Lt||iu(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!Lt)if(a===null)c.componentDidMount();else{var d=i.elementType===i.type?a.memoizedProps:Sn(i.type,a.memoizedProps);c.componentDidUpdate(d,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var f=i.updateQueue;f!==null&&Dp(i,f,c);break;case 3:var _=i.updateQueue;if(_!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}Dp(i,_,a)}break;case 5:var T=i.stateNode;if(a===null&&i.flags&4){a=T;var k=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":k.autoFocus&&a.focus();break;case"img":k.src&&(a.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var F=i.alternate;if(F!==null){var G=F.memoizedState;if(G!==null){var K=G.dehydrated;K!==null&&Wr(K)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Lt||i.flags&512&&Ph(i)}catch(W){rt(i,i.return,W)}}if(i===n){oe=null;break}if(a=i.sibling,a!==null){a.return=i.return,oe=a;break}oe=i.return}}function Dm(n){for(;oe!==null;){var i=oe;if(i===n){oe=null;break}var a=i.sibling;if(a!==null){a.return=i.return,oe=a;break}oe=i.return}}function Vm(n){for(;oe!==null;){var i=oe;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{iu(4,i)}catch(k){rt(i,a,k)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var d=i.return;try{c.componentDidMount()}catch(k){rt(i,d,k)}}var f=i.return;try{Ph(i)}catch(k){rt(i,f,k)}break;case 5:var _=i.return;try{Ph(i)}catch(k){rt(i,_,k)}}}catch(k){rt(i,i.return,k)}if(i===n){oe=null;break}var T=i.sibling;if(T!==null){T.return=i.return,oe=T;break}oe=i.return}}var YE=Math.ceil,su=Oe.ReactCurrentDispatcher,Vh=Oe.ReactCurrentOwner,fn=Oe.ReactCurrentBatchConfig,Fe=0,wt=null,dt=null,Ct=0,on=0,no=Jr(0),yt=0,Ea=null,Qi=0,ou=0,xh=0,wa=null,Gt=null,Oh=0,ro=1/0,Ir=null,au=!1,Lh=null,ri=null,lu=!1,ii=null,uu=0,Ta=0,bh=null,cu=-1,hu=0;function $t(){return(Fe&6)!==0?Ke():cu!==-1?cu:cu=Ke()}function si(n){return(n.mode&1)===0?1:(Fe&2)!==0&&Ct!==0?Ct&-Ct:xE.transition!==null?(hu===0&&(hu=$o()),hu):(n=xe,n!==0||(n=window.event,n=n===void 0?16:Vs(n.type)),n)}function Cn(n,i,a,c){if(50<Ta)throw Ta=0,bh=null,Error(t(185));Mi(n,a,c),((Fe&2)===0||n!==wt)&&(n===wt&&((Fe&2)===0&&(ou|=a),yt===4&&oi(n,Ct)),Kt(n,c),a===1&&Fe===0&&(i.mode&1)===0&&(ro=Ke()+500,Ul&&Zr()))}function Kt(n,i){var a=n.callbackNode;bi(n,i);var c=cr(n,n===wt?Ct:0);if(c===0)a!==null&&As(a),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(a!=null&&As(a),i===1)n.tag===0?VE(Om.bind(null,n)):vp(Om.bind(null,n)),kE(function(){(Fe&6)===0&&Zr()}),a=null;else{switch(Un(c)){case 1:a=Rs;break;case 4:a=jo;break;case 16:a=Vi;break;case 536870912:a=Cs;break;default:a=Vi}a=Bm(a,xm.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function xm(n,i){if(cu=-1,hu=0,(Fe&6)!==0)throw Error(t(327));var a=n.callbackNode;if(io()&&n.callbackNode!==a)return null;var c=cr(n,n===wt?Ct:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=du(n,c);else{i=c;var d=Fe;Fe|=2;var f=bm();(wt!==n||Ct!==i)&&(Ir=null,ro=Ke()+500,Ji(n,i));do try{ZE();break}catch(T){Lm(n,T)}while(!0);eh(),su.current=f,Fe=d,dt!==null?i=0:(wt=null,Ct=0,i=yt)}if(i!==0){if(i===2&&(d=Bo(n),d!==0&&(c=d,i=Mh(n,d))),i===1)throw a=Ea,Ji(n,0),oi(n,c),Kt(n,Ke()),a;if(i===6)oi(n,c);else{if(d=n.current.alternate,(c&30)===0&&!JE(d)&&(i=du(n,c),i===2&&(f=Bo(n),f!==0&&(c=f,i=Mh(n,f))),i===1))throw a=Ea,Ji(n,0),oi(n,c),Kt(n,Ke()),a;switch(n.finishedWork=d,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:Xi(n,Gt,Ir);break;case 3:if(oi(n,c),(c&130023424)===c&&(i=Oh+500-Ke(),10<i)){if(cr(n,0)!==0)break;if(d=n.suspendedLanes,(d&c)!==c){$t(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=$c(Xi.bind(null,n,Gt,Ir),i);break}Xi(n,Gt,Ir);break;case 4:if(oi(n,c),(c&4194240)===c)break;for(i=n.eventTimes,d=-1;0<c;){var _=31-Xt(c);f=1<<_,_=i[_],_>d&&(d=_),c&=~f}if(c=d,c=Ke()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*YE(c/1960))-c,10<c){n.timeoutHandle=$c(Xi.bind(null,n,Gt,Ir),c);break}Xi(n,Gt,Ir);break;case 5:Xi(n,Gt,Ir);break;default:throw Error(t(329))}}}return Kt(n,Ke()),n.callbackNode===a?xm.bind(null,n):null}function Mh(n,i){var a=wa;return n.current.memoizedState.isDehydrated&&(Ji(n,i).flags|=256),n=du(n,i),n!==2&&(i=Gt,Gt=a,i!==null&&Fh(i)),n}function Fh(n){Gt===null?Gt=n:Gt.push.apply(Gt,n)}function JE(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var d=a[c],f=d.getSnapshot;d=d.value;try{if(!Tn(f(),d))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function oi(n,i){for(i&=~xh,i&=~ou,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Xt(i),c=1<<a;n[a]=-1,i&=~c}}function Om(n){if((Fe&6)!==0)throw Error(t(327));io();var i=cr(n,0);if((i&1)===0)return Kt(n,Ke()),null;var a=du(n,i);if(n.tag!==0&&a===2){var c=Bo(n);c!==0&&(i=c,a=Mh(n,c))}if(a===1)throw a=Ea,Ji(n,0),oi(n,i),Kt(n,Ke()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,Xi(n,Gt,Ir),Kt(n,Ke()),null}function Uh(n,i){var a=Fe;Fe|=1;try{return n(i)}finally{Fe=a,Fe===0&&(ro=Ke()+500,Ul&&Zr())}}function Yi(n){ii!==null&&ii.tag===0&&(Fe&6)===0&&io();var i=Fe;Fe|=1;var a=fn.transition,c=xe;try{if(fn.transition=null,xe=1,n)return n()}finally{xe=c,fn.transition=a,Fe=i,(Fe&6)===0&&Zr()}}function jh(){on=no.current,Ye(no)}function Ji(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,CE(a)),dt!==null)for(a=dt.return;a!==null;){var c=a;switch(Qc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&Ml();break;case 3:Zs(),Ye(qt),Ye(Vt),lh();break;case 5:oh(c);break;case 4:Zs();break;case 13:Ye(Ze);break;case 19:Ye(Ze);break;case 10:th(c.type._context);break;case 22:case 23:jh()}a=a.return}if(wt=n,dt=n=ai(n.current,null),Ct=on=i,yt=0,Ea=null,xh=ou=Qi=0,Gt=wa=null,Wi!==null){for(i=0;i<Wi.length;i++)if(a=Wi[i],c=a.interleaved,c!==null){a.interleaved=null;var d=c.next,f=a.pending;if(f!==null){var _=f.next;f.next=d,c.next=_}a.pending=c}Wi=null}return n}function Lm(n,i){do{var a=dt;try{if(eh(),Ql.current=Zl,Yl){for(var c=et.memoizedState;c!==null;){var d=c.queue;d!==null&&(d.pending=null),c=c.next}Yl=!1}if(Ki=0,Et=gt=et=null,pa=!1,ma=0,Vh.current=null,a===null||a.return===null){yt=1,Ea=i,dt=null;break}e:{var f=n,_=a.return,T=a,k=i;if(i=Ct,T.flags|=32768,k!==null&&typeof k=="object"&&typeof k.then=="function"){var F=k,G=T,K=G.tag;if((G.mode&1)===0&&(K===0||K===11||K===15)){var W=G.alternate;W?(G.updateQueue=W.updateQueue,G.memoizedState=W.memoizedState,G.lanes=W.lanes):(G.updateQueue=null,G.memoizedState=null)}var re=om(_);if(re!==null){re.flags&=-257,am(re,_,T,f,i),re.mode&1&&sm(f,F,i),i=re,k=F;var ae=i.updateQueue;if(ae===null){var le=new Set;le.add(k),i.updateQueue=le}else ae.add(k);break e}else{if((i&1)===0){sm(f,F,i),zh();break e}k=Error(t(426))}}else if(Xe&&T.mode&1){var at=om(_);if(at!==null){(at.flags&65536)===0&&(at.flags|=256),am(at,_,T,f,i),Xc(eo(k,T));break e}}f=k=eo(k,T),yt!==4&&(yt=2),wa===null?wa=[f]:wa.push(f),f=_;do{switch(f.tag){case 3:f.flags|=65536,i&=-i,f.lanes|=i;var L=rm(f,k,i);Np(f,L);break e;case 1:T=k;var D=f.type,M=f.stateNode;if((f.flags&128)===0&&(typeof D.getDerivedStateFromError=="function"||M!==null&&typeof M.componentDidCatch=="function"&&(ri===null||!ri.has(M)))){f.flags|=65536,i&=-i,f.lanes|=i;var Y=im(f,T,i);Np(f,Y);break e}}f=f.return}while(f!==null)}Fm(a)}catch(ce){i=ce,dt===a&&a!==null&&(dt=a=a.return);continue}break}while(!0)}function bm(){var n=su.current;return su.current=Zl,n===null?Zl:n}function zh(){(yt===0||yt===3||yt===2)&&(yt=4),wt===null||(Qi&268435455)===0&&(ou&268435455)===0||oi(wt,Ct)}function du(n,i){var a=Fe;Fe|=2;var c=bm();(wt!==n||Ct!==i)&&(Ir=null,Ji(n,i));do try{XE();break}catch(d){Lm(n,d)}while(!0);if(eh(),Fe=a,su.current=c,dt!==null)throw Error(t(261));return wt=null,Ct=0,yt}function XE(){for(;dt!==null;)Mm(dt)}function ZE(){for(;dt!==null&&!Di();)Mm(dt)}function Mm(n){var i=zm(n.alternate,n,on);n.memoizedProps=n.pendingProps,i===null?Fm(n):dt=i,Vh.current=null}function Fm(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=HE(a,i,on),a!==null){dt=a;return}}else{if(a=WE(a,i),a!==null){a.flags&=32767,dt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{yt=6,dt=null;return}}if(i=i.sibling,i!==null){dt=i;return}dt=i=n}while(i!==null);yt===0&&(yt=5)}function Xi(n,i,a){var c=xe,d=fn.transition;try{fn.transition=null,xe=1,ew(n,i,a,c)}finally{fn.transition=d,xe=c}return null}function ew(n,i,a,c){do io();while(ii!==null);if((Fe&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var f=a.lanes|a.childLanes;if(Cc(n,f),n===wt&&(dt=wt=null,Ct=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||lu||(lu=!0,Bm(Vi,function(){return io(),null})),f=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||f){f=fn.transition,fn.transition=null;var _=xe;xe=1;var T=Fe;Fe|=4,Vh.current=null,KE(n,a),km(a,n),EE(zc),fr=!!jc,zc=jc=null,n.current=a,QE(a),ur(),Fe=T,xe=_,fn.transition=f}else n.current=a;if(lu&&(lu=!1,ii=n,uu=d),f=n.pendingLanes,f===0&&(ri=null),vl(a.stateNode),Kt(n,Ke()),i!==null)for(c=n.onRecoverableError,a=0;a<i.length;a++)d=i[a],c(d.value,{componentStack:d.stack,digest:d.digest});if(au)throw au=!1,n=Lh,Lh=null,n;return(uu&1)!==0&&n.tag!==0&&io(),f=n.pendingLanes,(f&1)!==0?n===bh?Ta++:(Ta=0,bh=n):Ta=0,Zr(),null}function io(){if(ii!==null){var n=Un(uu),i=fn.transition,a=xe;try{if(fn.transition=null,xe=16>n?16:n,ii===null)var c=!1;else{if(n=ii,ii=null,uu=0,(Fe&6)!==0)throw Error(t(331));var d=Fe;for(Fe|=4,oe=n.current;oe!==null;){var f=oe,_=f.child;if((oe.flags&16)!==0){var T=f.deletions;if(T!==null){for(var k=0;k<T.length;k++){var F=T[k];for(oe=F;oe!==null;){var G=oe;switch(G.tag){case 0:case 11:case 15:va(8,G,f)}var K=G.child;if(K!==null)K.return=G,oe=K;else for(;oe!==null;){G=oe;var W=G.sibling,re=G.return;if(Im(G),G===F){oe=null;break}if(W!==null){W.return=re,oe=W;break}oe=re}}}var ae=f.alternate;if(ae!==null){var le=ae.child;if(le!==null){ae.child=null;do{var at=le.sibling;le.sibling=null,le=at}while(le!==null)}}oe=f}}if((f.subtreeFlags&2064)!==0&&_!==null)_.return=f,oe=_;else e:for(;oe!==null;){if(f=oe,(f.flags&2048)!==0)switch(f.tag){case 0:case 11:case 15:va(9,f,f.return)}var L=f.sibling;if(L!==null){L.return=f.return,oe=L;break e}oe=f.return}}var D=n.current;for(oe=D;oe!==null;){_=oe;var M=_.child;if((_.subtreeFlags&2064)!==0&&M!==null)M.return=_,oe=M;else e:for(_=D;oe!==null;){if(T=oe,(T.flags&2048)!==0)try{switch(T.tag){case 0:case 11:case 15:iu(9,T)}}catch(ce){rt(T,T.return,ce)}if(T===_){oe=null;break e}var Y=T.sibling;if(Y!==null){Y.return=T.return,oe=Y;break e}oe=T.return}}if(Fe=d,Zr(),Jt&&typeof Jt.onPostCommitFiberRoot=="function")try{Jt.onPostCommitFiberRoot(xi,n)}catch{}c=!0}return c}finally{xe=a,fn.transition=i}}return!1}function Um(n,i,a){i=eo(a,i),i=rm(n,i,1),n=ti(n,i,1),i=$t(),n!==null&&(Mi(n,1,i),Kt(n,i))}function rt(n,i,a){if(n.tag===3)Um(n,n,a);else for(;i!==null;){if(i.tag===3){Um(i,n,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(ri===null||!ri.has(c))){n=eo(a,n),n=im(i,n,1),i=ti(i,n,1),n=$t(),i!==null&&(Mi(i,1,n),Kt(i,n));break}}i=i.return}}function tw(n,i,a){var c=n.pingCache;c!==null&&c.delete(i),i=$t(),n.pingedLanes|=n.suspendedLanes&a,wt===n&&(Ct&a)===a&&(yt===4||yt===3&&(Ct&130023424)===Ct&&500>Ke()-Oh?Ji(n,0):xh|=a),Kt(n,i)}function jm(n,i){i===0&&((n.mode&1)===0?i=1:(i=$r,$r<<=1,($r&130023424)===0&&($r=4194304)));var a=$t();n=Er(n,i),n!==null&&(Mi(n,i,a),Kt(n,a))}function nw(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),jm(n,a)}function rw(n,i){var a=0;switch(n.tag){case 13:var c=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),jm(n,a)}var zm;zm=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||qt.current)Wt=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return Wt=!1,qE(n,i,a);Wt=(n.flags&131072)!==0}else Wt=!1,Xe&&(i.flags&1048576)!==0&&Ep(i,zl,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;nu(n,i),n=i.pendingProps;var d=Ws(i,Vt.current);Xs(i,a),d=hh(null,i,c,n,d,a);var f=dh();return i.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Ht(c)?(f=!0,Fl(i)):f=!1,i.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,ih(i),d.updater=eu,i.stateNode=d,d._reactInternals=i,_h(i,c,n,a),i=Th(null,i,c,!0,f,a)):(i.tag=0,Xe&&f&&Kc(i),Bt(null,i,d,a),i=i.child),i;case 16:c=i.elementType;e:{switch(nu(n,i),n=i.pendingProps,d=c._init,c=d(c._payload),i.type=c,d=i.tag=sw(c),n=Sn(c,n),d){case 0:i=wh(null,i,c,n,a);break e;case 1:i=fm(null,i,c,n,a);break e;case 11:i=lm(null,i,c,n,a);break e;case 14:i=um(null,i,c,Sn(c.type,n),a);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:Sn(c,d),wh(n,i,c,d,a);case 1:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:Sn(c,d),fm(n,i,c,d,a);case 3:e:{if(pm(i),n===null)throw Error(t(387));c=i.pendingProps,f=i.memoizedState,d=f.element,Pp(n,i),Gl(i,c,null,a);var _=i.memoizedState;if(c=_.element,f.isDehydrated)if(f={element:c,isDehydrated:!1,cache:_.cache,pendingSuspenseBoundaries:_.pendingSuspenseBoundaries,transitions:_.transitions},i.updateQueue.baseState=f,i.memoizedState=f,i.flags&256){d=eo(Error(t(423)),i),i=mm(n,i,c,a,d);break e}else if(c!==d){d=eo(Error(t(424)),i),i=mm(n,i,c,a,d);break e}else for(sn=Yr(i.stateNode.containerInfo.firstChild),rn=i,Xe=!0,In=null,a=Cp(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(Qs(),c===d){i=Tr(n,i,a);break e}Bt(n,i,c,a)}i=i.child}return i;case 5:return Vp(i),n===null&&Jc(i),c=i.type,d=i.pendingProps,f=n!==null?n.memoizedProps:null,_=d.children,Bc(c,d)?_=null:f!==null&&Bc(c,f)&&(i.flags|=32),dm(n,i),Bt(n,i,_,a),i.child;case 6:return n===null&&Jc(i),null;case 13:return gm(n,i,a);case 4:return sh(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=Ys(i,null,c,a):Bt(n,i,c,a),i.child;case 11:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:Sn(c,d),lm(n,i,c,d,a);case 7:return Bt(n,i,i.pendingProps,a),i.child;case 8:return Bt(n,i,i.pendingProps.children,a),i.child;case 12:return Bt(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,d=i.pendingProps,f=i.memoizedProps,_=d.value,He(ql,c._currentValue),c._currentValue=_,f!==null)if(Tn(f.value,_)){if(f.children===d.children&&!qt.current){i=Tr(n,i,a);break e}}else for(f=i.child,f!==null&&(f.return=i);f!==null;){var T=f.dependencies;if(T!==null){_=f.child;for(var k=T.firstContext;k!==null;){if(k.context===c){if(f.tag===1){k=wr(-1,a&-a),k.tag=2;var F=f.updateQueue;if(F!==null){F=F.shared;var G=F.pending;G===null?k.next=k:(k.next=G.next,G.next=k),F.pending=k}}f.lanes|=a,k=f.alternate,k!==null&&(k.lanes|=a),nh(f.return,a,i),T.lanes|=a;break}k=k.next}}else if(f.tag===10)_=f.type===i.type?null:f.child;else if(f.tag===18){if(_=f.return,_===null)throw Error(t(341));_.lanes|=a,T=_.alternate,T!==null&&(T.lanes|=a),nh(_,a,i),_=f.sibling}else _=f.child;if(_!==null)_.return=f;else for(_=f;_!==null;){if(_===i){_=null;break}if(f=_.sibling,f!==null){f.return=_.return,_=f;break}_=_.return}f=_}Bt(n,i,d.children,a),i=i.child}return i;case 9:return d=i.type,c=i.pendingProps.children,Xs(i,a),d=hn(d),c=c(d),i.flags|=1,Bt(n,i,c,a),i.child;case 14:return c=i.type,d=Sn(c,i.pendingProps),d=Sn(c.type,d),um(n,i,c,d,a);case 15:return cm(n,i,i.type,i.pendingProps,a);case 17:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:Sn(c,d),nu(n,i),i.tag=1,Ht(c)?(n=!0,Fl(i)):n=!1,Xs(i,a),tm(i,c,d),_h(i,c,d,a),Th(null,i,c,!0,n,a);case 19:return _m(n,i,a);case 22:return hm(n,i,a)}throw Error(t(156,i.tag))};function Bm(n,i){return Uo(n,i)}function iw(n,i,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function pn(n,i,a,c){return new iw(n,i,a,c)}function Bh(n){return n=n.prototype,!(!n||!n.isReactComponent)}function sw(n){if(typeof n=="function")return Bh(n)?1:0;if(n!=null){if(n=n.$$typeof,n===x)return 11;if(n===Je)return 14}return 2}function ai(n,i){var a=n.alternate;return a===null?(a=pn(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function fu(n,i,a,c,d,f){var _=2;if(c=n,typeof n=="function")Bh(n)&&(_=1);else if(typeof n=="string")_=5;else e:switch(n){case N:return Zi(a.children,d,f,i);case S:_=8,d|=8;break;case C:return n=pn(12,a,i,d|2),n.elementType=C,n.lanes=f,n;case I:return n=pn(13,a,i,d),n.elementType=I,n.lanes=f,n;case ye:return n=pn(19,a,i,d),n.elementType=ye,n.lanes=f,n;case qe:return pu(a,d,f,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case V:_=10;break e;case P:_=9;break e;case x:_=11;break e;case Je:_=14;break e;case it:_=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=pn(_,a,i,d),i.elementType=n,i.type=c,i.lanes=f,i}function Zi(n,i,a,c){return n=pn(7,n,c,i),n.lanes=a,n}function pu(n,i,a,c){return n=pn(22,n,c,i),n.elementType=qe,n.lanes=a,n.stateNode={isHidden:!1},n}function $h(n,i,a){return n=pn(6,n,null,i),n.lanes=a,n}function qh(n,i,a){return i=pn(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function ow(n,i,a,c,d){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=qo(0),this.expirationTimes=qo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=qo(0),this.identifierPrefix=c,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function Hh(n,i,a,c,d,f,_,T,k){return n=new ow(n,i,a,T,k),i===1?(i=1,f===!0&&(i|=8)):i=0,f=pn(3,null,null,i),n.current=f,f.stateNode=n,f.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},ih(f),n}function aw(n,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ve,key:c==null?null:""+c,children:n,containerInfo:i,implementation:a}}function $m(n){if(!n)return Xr;n=n._reactInternals;e:{if(En(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Ht(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(Ht(a))return yp(n,a,i)}return i}function qm(n,i,a,c,d,f,_,T,k){return n=Hh(a,c,!0,n,d,f,_,T,k),n.context=$m(null),a=n.current,c=$t(),d=si(a),f=wr(c,d),f.callback=i??null,ti(a,f,d),n.current.lanes=d,Mi(n,d,c),Kt(n,c),n}function mu(n,i,a,c){var d=i.current,f=$t(),_=si(d);return a=$m(a),i.context===null?i.context=a:i.pendingContext=a,i=wr(f,_),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=ti(d,i,_),n!==null&&(Cn(n,d,_,f),Wl(n,d,_)),_}function gu(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Hm(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function Wh(n,i){Hm(n,i),(n=n.alternate)&&Hm(n,i)}function lw(){return null}var Wm=typeof reportError=="function"?reportError:function(n){console.error(n)};function Gh(n){this._internalRoot=n}yu.prototype.render=Gh.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));mu(n,i,null,null)},yu.prototype.unmount=Gh.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Yi(function(){mu(null,n,null,null)}),i[gr]=null}};function yu(n){this._internalRoot=n}yu.prototype.unstable_scheduleHydration=function(n){if(n){var i=Ko();n={blockedOn:null,target:n,priority:i};for(var a=0;a<Zt.length&&i!==0&&i<Zt[a].priority;a++);Zt.splice(a,0,n),a===0&&Ns(n)}};function Kh(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function _u(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Gm(){}function uw(n,i,a,c,d){if(d){if(typeof c=="function"){var f=c;c=function(){var F=gu(_);f.call(F)}}var _=qm(i,c,n,0,null,!1,!1,"",Gm);return n._reactRootContainer=_,n[gr]=_.current,oa(n.nodeType===8?n.parentNode:n),Yi(),_}for(;d=n.lastChild;)n.removeChild(d);if(typeof c=="function"){var T=c;c=function(){var F=gu(k);T.call(F)}}var k=Hh(n,0,!1,null,null,!1,!1,"",Gm);return n._reactRootContainer=k,n[gr]=k.current,oa(n.nodeType===8?n.parentNode:n),Yi(function(){mu(i,k,a,c)}),k}function vu(n,i,a,c,d){var f=a._reactRootContainer;if(f){var _=f;if(typeof d=="function"){var T=d;d=function(){var k=gu(_);T.call(k)}}mu(i,_,n,d)}else _=uw(a,i,n,d,c);return gu(_)}Wo=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=je(i.pendingLanes);a!==0&&(Ho(i,a|1),Kt(i,Ke()),(Fe&6)===0&&(ro=Ke()+500,Zr()))}break;case 13:Yi(function(){var c=Er(n,1);if(c!==null){var d=$t();Cn(c,n,1,d)}}),Wh(n,1)}},ks=function(n){if(n.tag===13){var i=Er(n,134217728);if(i!==null){var a=$t();Cn(i,n,134217728,a)}Wh(n,134217728)}},Go=function(n){if(n.tag===13){var i=si(n),a=Er(n,i);if(a!==null){var c=$t();Cn(a,n,i,c)}Wh(n,i)}},Ko=function(){return xe},Qo=function(n,i){var a=xe;try{return xe=n,i()}finally{xe=a}},or=function(n,i,a){switch(i){case"input":if(Ci(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==n&&c.form===n.form){var d=bl(c);if(!d)throw Error(t(90));No(c),Ci(c,d)}}}break;case"textarea":al(n,a);break;case"select":i=a.value,i!=null&&_n(n,!!a.multiple,i,!1)}},cl=Uh,hl=Yi;var cw={usingClientEntryPoint:!1,Events:[ua,qs,bl,Ur,jr,Uh]},Ia={findFiberByHostInstance:Bi,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},hw={bundleType:Ia.bundleType,version:Ia.version,rendererPackageName:Ia.rendererPackageName,rendererConfig:Ia.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Oe.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=_l(n),n===null?null:n.stateNode},findFiberByHostInstance:Ia.findFiberByHostInstance||lw,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Eu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Eu.isDisabled&&Eu.supportsFiber)try{xi=Eu.inject(hw),Jt=Eu}catch{}}return Qt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=cw,Qt.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Kh(i))throw Error(t(200));return aw(n,i,null,a)},Qt.createRoot=function(n,i){if(!Kh(n))throw Error(t(299));var a=!1,c="",d=Wm;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(d=i.onRecoverableError)),i=Hh(n,1,!1,null,null,a,!1,c,d),n[gr]=i.current,oa(n.nodeType===8?n.parentNode:n),new Gh(i)},Qt.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=_l(i),n=n===null?null:n.stateNode,n},Qt.flushSync=function(n){return Yi(n)},Qt.hydrate=function(n,i,a){if(!_u(i))throw Error(t(200));return vu(null,n,i,!0,a)},Qt.hydrateRoot=function(n,i,a){if(!Kh(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,d=!1,f="",_=Wm;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(f=a.identifierPrefix),a.onRecoverableError!==void 0&&(_=a.onRecoverableError)),i=qm(i,null,n,1,a??null,d,!1,f,_),n[gr]=i.current,oa(n),c)for(n=0;n<c.length;n++)a=c[n],d=a._getVersion,d=d(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,d]:i.mutableSourceEagerHydrationData.push(a,d);return new yu(i)},Qt.render=function(n,i,a){if(!_u(i))throw Error(t(200));return vu(null,n,i,!1,a)},Qt.unmountComponentAtNode=function(n){if(!_u(n))throw Error(t(40));return n._reactRootContainer?(Yi(function(){vu(null,null,n,!1,function(){n._reactRootContainer=null,n[gr]=null})}),!0):!1},Qt.unstable_batchedUpdates=Uh,Qt.unstable_renderSubtreeIntoContainer=function(n,i,a,c){if(!_u(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return vu(n,i,a,!1,c)},Qt.version="18.3.1-next-f1338f8080-20240426",Qt}var tg;function Ew(){if(tg)return Jh.exports;tg=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Jh.exports=vw(),Jh.exports}var ng;function ww(){if(ng)return wu;ng=1;var r=Ew();return wu.createRoot=r.createRoot,wu.hydrateRoot=r.hydrateRoot,wu}var Tw=ww();const Iw=Ly(Tw),Sw=()=>{};var rg={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const by=function(r){const e=[];let t=0;for(let s=0;s<r.length;s++){let o=r.charCodeAt(s);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&s+1<r.length&&(r.charCodeAt(s+1)&64512)===56320?(o=65536+((o&1023)<<10)+(r.charCodeAt(++s)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},Aw=function(r){const e=[];let t=0,s=0;for(;t<r.length;){const o=r[t++];if(o<128)e[s++]=String.fromCharCode(o);else if(o>191&&o<224){const u=r[t++];e[s++]=String.fromCharCode((o&31)<<6|u&63)}else if(o>239&&o<365){const u=r[t++],h=r[t++],m=r[t++],y=((o&7)<<18|(u&63)<<12|(h&63)<<6|m&63)-65536;e[s++]=String.fromCharCode(55296+(y>>10)),e[s++]=String.fromCharCode(56320+(y&1023))}else{const u=r[t++],h=r[t++];e[s++]=String.fromCharCode((o&15)<<12|(u&63)<<6|h&63)}}return e.join("")},My={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let o=0;o<r.length;o+=3){const u=r[o],h=o+1<r.length,m=h?r[o+1]:0,y=o+2<r.length,v=y?r[o+2]:0,w=u>>2,A=(u&3)<<4|m>>4;let R=(m&15)<<2|v>>6,j=v&63;y||(j=64,h||(R=64)),s.push(t[w],t[A],t[R],t[j])}return s.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(by(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):Aw(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let o=0;o<r.length;){const u=t[r.charAt(o++)],m=o<r.length?t[r.charAt(o)]:0;++o;const v=o<r.length?t[r.charAt(o)]:64;++o;const A=o<r.length?t[r.charAt(o)]:64;if(++o,u==null||m==null||v==null||A==null)throw new Rw;const R=u<<2|m>>4;if(s.push(R),v!==64){const j=m<<4&240|v>>2;if(s.push(j),A!==64){const J=v<<6&192|A;s.push(J)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Rw extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Cw=function(r){const e=by(r);return My.encodeByteArray(e,!0)},Bu=function(r){return Cw(r).replace(/\./g,"")},Fy=function(r){try{return My.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kw(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pw=()=>kw().__FIREBASE_DEFAULTS__,Nw=()=>{if(typeof process>"u"||typeof rg>"u")return;const r=rg.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Dw=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Fy(r[1]);return e&&JSON.parse(e)},oc=()=>{try{return Sw()||Pw()||Nw()||Dw()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Uy=r=>{var e,t;return(t=(e=oc())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},Vw=r=>{const e=Uy(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},jy=()=>{var r;return(r=oc())==null?void 0:r.config},zy=r=>{var e;return(e=oc())==null?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xw{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function To(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function By(r){return(await fetch(r,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ow(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",o=r.iat||0,u=r.sub||r.user_id;if(!u)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h={iss:`https://securetoken.google.com/${s}`,aud:s,iat:o,exp:o+3600,auth_time:o,sub:u,user_id:u,firebase:{sign_in_provider:"custom",identities:{}},...r};return[Bu(JSON.stringify(t)),Bu(JSON.stringify(h)),""].join(".")}const Da={};function Lw(){const r={prod:[],emulator:[]};for(const e of Object.keys(Da))Da[e]?r.emulator.push(e):r.prod.push(e);return r}function bw(r){let e=document.getElementById(r),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",r),t=!0),{created:t,element:e}}let ig=!1;function $y(r,e){if(typeof window>"u"||typeof document>"u"||!To(window.location.host)||Da[r]===e||Da[r]||ig)return;Da[r]=e;function t(R){return`__firebase__banner__${R}`}const s="__firebase__banner",u=Lw().prod.length>0;function h(){const R=document.getElementById(s);R&&R.remove()}function m(R){R.style.display="flex",R.style.background="#7faaf0",R.style.position="fixed",R.style.bottom="5px",R.style.left="5px",R.style.padding=".5em",R.style.borderRadius="5px",R.style.alignItems="center"}function y(R,j){R.setAttribute("width","24"),R.setAttribute("id",j),R.setAttribute("height","24"),R.setAttribute("viewBox","0 0 24 24"),R.setAttribute("fill","none"),R.style.marginLeft="-6px"}function v(){const R=document.createElement("span");return R.style.cursor="pointer",R.style.marginLeft="16px",R.style.fontSize="24px",R.innerHTML=" &times;",R.onclick=()=>{ig=!0,h()},R}function w(R,j){R.setAttribute("id",j),R.innerText="Learn more",R.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",R.setAttribute("target","__blank"),R.style.paddingLeft="5px",R.style.textDecoration="underline"}function A(){const R=bw(s),j=t("text"),J=document.getElementById(j)||document.createElement("span"),X=t("learnmore"),Q=document.getElementById(X)||document.createElement("a"),Ee=t("preprendIcon"),ge=document.getElementById(Ee)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(R.created){const Ce=R.element;m(Ce),w(Q,X);const Oe=v();y(ge,Ee),Ce.append(ge,J,Q,Oe),document.body.appendChild(Ce)}u?(J.innerText="Preview backend disconnected.",ge.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(ge.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,J.innerText="Preview backend running in this workspace."),J.setAttribute("id",j)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",A):A()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ut(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Mw(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ut())}function Fw(){var e;const r=(e=oc())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Uw(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function jw(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function zw(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Bw(){const r=Ut();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function $w(){return!Fw()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function qw(){try{return typeof indexedDB=="object"}catch{return!1}}function Hw(){return new Promise((r,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(s);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(s),r(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var u;e(((u=o.error)==null?void 0:u.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ww="FirebaseError";class Vr extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=Ww,Object.setPrototypeOf(this,Vr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Qa.prototype.create)}}class Qa{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},o=`${this.service}/${e}`,u=this.errors[e],h=u?Gw(u,s):"Error",m=`${this.serviceName}: ${h} (${o}).`;return new Vr(o,m,s)}}function Gw(r,e){return r.replace(Kw,(t,s)=>{const o=e[s];return o!=null?String(o):`<${s}?>`})}const Kw=/\{\$([^}]+)}/g;function Qw(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function as(r,e){if(r===e)return!0;const t=Object.keys(r),s=Object.keys(e);for(const o of t){if(!s.includes(o))return!1;const u=r[o],h=e[o];if(sg(u)&&sg(h)){if(!as(u,h))return!1}else if(u!==h)return!1}for(const o of s)if(!t.includes(o))return!1;return!0}function sg(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ya(r){const e=[];for(const[t,s]of Object.entries(r))Array.isArray(s)?s.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Yw(r,e){const t=new Jw(r,e);return t.subscribe.bind(t)}class Jw{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let o;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");Xw(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:s},o.next===void 0&&(o.next=ed),o.error===void 0&&(o.error=ed),o.complete===void 0&&(o.complete=ed);const u=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),u}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Xw(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function ed(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(r){return r&&r._delegate?r._delegate:r}class ls{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ts="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zw{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new xw;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&s.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(t0(e))try{this.getOrInitializeService({instanceIdentifier:ts})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const u=this.getOrInitializeService({instanceIdentifier:o});s.resolve(u)}catch{}}}}clearInstance(e=ts){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ts){return this.instances.has(e)}getOptions(e=ts){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[u,h]of this.instancesDeferred.entries()){const m=this.normalizeInstanceIdentifier(u);s===m&&h.resolve(o)}return o}onInit(e,t){const s=this.normalizeInstanceIdentifier(t),o=this.onInitCallbacks.get(s)??new Set;o.add(e),this.onInitCallbacks.set(s,o);const u=this.instances.get(s);return u&&e(u,s),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const o of s)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:e0(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=ts){return this.component?this.component.multipleInstances?e:ts:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function e0(r){return r===ts?void 0:r}function t0(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n0{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Zw(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pe;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Pe||(Pe={}));const r0={debug:Pe.DEBUG,verbose:Pe.VERBOSE,info:Pe.INFO,warn:Pe.WARN,error:Pe.ERROR,silent:Pe.SILENT},i0=Pe.INFO,s0={[Pe.DEBUG]:"log",[Pe.VERBOSE]:"log",[Pe.INFO]:"info",[Pe.WARN]:"warn",[Pe.ERROR]:"error"},o0=(r,e,...t)=>{if(e<r.logLevel)return;const s=new Date().toISOString(),o=s0[e];if(o)console[o](`[${s}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class zd{constructor(e){this.name=e,this._logLevel=i0,this._logHandler=o0,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Pe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?r0[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Pe.DEBUG,...e),this._logHandler(this,Pe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Pe.VERBOSE,...e),this._logHandler(this,Pe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Pe.INFO,...e),this._logHandler(this,Pe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Pe.WARN,...e),this._logHandler(this,Pe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Pe.ERROR,...e),this._logHandler(this,Pe.ERROR,...e)}}const a0=(r,e)=>e.some(t=>r instanceof t);let og,ag;function l0(){return og||(og=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function u0(){return ag||(ag=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const qy=new WeakMap,md=new WeakMap,Hy=new WeakMap,td=new WeakMap,Bd=new WeakMap;function c0(r){const e=new Promise((t,s)=>{const o=()=>{r.removeEventListener("success",u),r.removeEventListener("error",h)},u=()=>{t(pi(r.result)),o()},h=()=>{s(r.error),o()};r.addEventListener("success",u),r.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&qy.set(t,r)}).catch(()=>{}),Bd.set(e,r),e}function h0(r){if(md.has(r))return;const e=new Promise((t,s)=>{const o=()=>{r.removeEventListener("complete",u),r.removeEventListener("error",h),r.removeEventListener("abort",h)},u=()=>{t(),o()},h=()=>{s(r.error||new DOMException("AbortError","AbortError")),o()};r.addEventListener("complete",u),r.addEventListener("error",h),r.addEventListener("abort",h)});md.set(r,e)}let gd={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return md.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Hy.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return pi(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function d0(r){gd=r(gd)}function f0(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=r.call(nd(this),e,...t);return Hy.set(s,e.sort?e.sort():[e]),pi(s)}:u0().includes(r)?function(...e){return r.apply(nd(this),e),pi(qy.get(this))}:function(...e){return pi(r.apply(nd(this),e))}}function p0(r){return typeof r=="function"?f0(r):(r instanceof IDBTransaction&&h0(r),a0(r,l0())?new Proxy(r,gd):r)}function pi(r){if(r instanceof IDBRequest)return c0(r);if(td.has(r))return td.get(r);const e=p0(r);return e!==r&&(td.set(r,e),Bd.set(e,r)),e}const nd=r=>Bd.get(r);function m0(r,e,{blocked:t,upgrade:s,blocking:o,terminated:u}={}){const h=indexedDB.open(r,e),m=pi(h);return s&&h.addEventListener("upgradeneeded",y=>{s(pi(h.result),y.oldVersion,y.newVersion,pi(h.transaction),y)}),t&&h.addEventListener("blocked",y=>t(y.oldVersion,y.newVersion,y)),m.then(y=>{u&&y.addEventListener("close",()=>u()),o&&y.addEventListener("versionchange",v=>o(v.oldVersion,v.newVersion,v))}).catch(()=>{}),m}const g0=["get","getKey","getAll","getAllKeys","count"],y0=["put","add","delete","clear"],rd=new Map;function lg(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(rd.get(e))return rd.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,o=y0.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(o||g0.includes(t)))return;const u=async function(h,...m){const y=this.transaction(h,o?"readwrite":"readonly");let v=y.store;return s&&(v=v.index(m.shift())),(await Promise.all([v[t](...m),o&&y.done]))[0]};return rd.set(e,u),u}d0(r=>({...r,get:(e,t,s)=>lg(e,t)||r.get(e,t,s),has:(e,t)=>!!lg(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _0{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(v0(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function v0(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const yd="@firebase/app",ug="0.14.8";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kr=new zd("@firebase/app"),E0="@firebase/app-compat",w0="@firebase/analytics-compat",T0="@firebase/analytics",I0="@firebase/app-check-compat",S0="@firebase/app-check",A0="@firebase/auth",R0="@firebase/auth-compat",C0="@firebase/database",k0="@firebase/data-connect",P0="@firebase/database-compat",N0="@firebase/functions",D0="@firebase/functions-compat",V0="@firebase/installations",x0="@firebase/installations-compat",O0="@firebase/messaging",L0="@firebase/messaging-compat",b0="@firebase/performance",M0="@firebase/performance-compat",F0="@firebase/remote-config",U0="@firebase/remote-config-compat",j0="@firebase/storage",z0="@firebase/storage-compat",B0="@firebase/firestore",$0="@firebase/ai",q0="@firebase/firestore-compat",H0="firebase",W0="12.9.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _d="[DEFAULT]",G0={[yd]:"fire-core",[E0]:"fire-core-compat",[T0]:"fire-analytics",[w0]:"fire-analytics-compat",[S0]:"fire-app-check",[I0]:"fire-app-check-compat",[A0]:"fire-auth",[R0]:"fire-auth-compat",[C0]:"fire-rtdb",[k0]:"fire-data-connect",[P0]:"fire-rtdb-compat",[N0]:"fire-fn",[D0]:"fire-fn-compat",[V0]:"fire-iid",[x0]:"fire-iid-compat",[O0]:"fire-fcm",[L0]:"fire-fcm-compat",[b0]:"fire-perf",[M0]:"fire-perf-compat",[F0]:"fire-rc",[U0]:"fire-rc-compat",[j0]:"fire-gcs",[z0]:"fire-gcs-compat",[B0]:"fire-fst",[q0]:"fire-fst-compat",[$0]:"fire-vertex","fire-js":"fire-js",[H0]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fa=new Map,K0=new Map,vd=new Map;function cg(r,e){try{r.container.addComponent(e)}catch(t){kr.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function mo(r){const e=r.name;if(vd.has(e))return kr.debug(`There were multiple attempts to register component ${e}.`),!1;vd.set(e,r);for(const t of Fa.values())cg(t,r);for(const t of K0.values())cg(t,r);return!0}function $d(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function kn(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q0={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},mi=new Qa("app","Firebase",Q0);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y0{constructor(e,t,s){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new ls("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw mi.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Io=W0;function Wy(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const s={name:_d,automaticDataCollectionEnabled:!0,...e},o=s.name;if(typeof o!="string"||!o)throw mi.create("bad-app-name",{appName:String(o)});if(t||(t=jy()),!t)throw mi.create("no-options");const u=Fa.get(o);if(u){if(as(t,u.options)&&as(s,u.config))return u;throw mi.create("duplicate-app",{appName:o})}const h=new n0(o);for(const y of vd.values())h.addComponent(y);const m=new Y0(t,s,h);return Fa.set(o,m),m}function Gy(r=_d){const e=Fa.get(r);if(!e&&r===_d&&jy())return Wy();if(!e)throw mi.create("no-app",{appName:r});return e}function J0(){return Array.from(Fa.values())}function gi(r,e,t){let s=G0[r]??r;t&&(s+=`-${t}`);const o=s.match(/\s|\//),u=e.match(/\s|\//);if(o||u){const h=[`Unable to register library "${s}" with version "${e}":`];o&&h.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&u&&h.push("and"),u&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),kr.warn(h.join(" "));return}mo(new ls(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X0="firebase-heartbeat-database",Z0=1,Ua="firebase-heartbeat-store";let id=null;function Ky(){return id||(id=m0(X0,Z0,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(Ua)}catch(t){console.warn(t)}}}}).catch(r=>{throw mi.create("idb-open",{originalErrorMessage:r.message})})),id}async function eT(r){try{const t=(await Ky()).transaction(Ua),s=await t.objectStore(Ua).get(Qy(r));return await t.done,s}catch(e){if(e instanceof Vr)kr.warn(e.message);else{const t=mi.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});kr.warn(t.message)}}}async function hg(r,e){try{const s=(await Ky()).transaction(Ua,"readwrite");await s.objectStore(Ua).put(e,Qy(r)),await s.done}catch(t){if(t instanceof Vr)kr.warn(t.message);else{const s=mi.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});kr.warn(s.message)}}}function Qy(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tT=1024,nT=30;class rT{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new sT(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),u=dg();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===u||this._heartbeatsCache.heartbeats.some(h=>h.date===u))return;if(this._heartbeatsCache.heartbeats.push({date:u,agent:o}),this._heartbeatsCache.heartbeats.length>nT){const h=oT(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){kr.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=dg(),{heartbeatsToSend:s,unsentEntries:o}=iT(this._heartbeatsCache.heartbeats),u=Bu(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),u}catch(t){return kr.warn(t),""}}}function dg(){return new Date().toISOString().substring(0,10)}function iT(r,e=tT){const t=[];let s=r.slice();for(const o of r){const u=t.find(h=>h.agent===o.agent);if(u){if(u.dates.push(o.date),fg(t)>e){u.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),fg(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class sT{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return qw()?Hw().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await eT(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return hg(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return hg(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function fg(r){return Bu(JSON.stringify({version:2,heartbeats:r})).length}function oT(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let s=1;s<r.length;s++)r[s].date<t&&(t=r[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aT(r){mo(new ls("platform-logger",e=>new _0(e),"PRIVATE")),mo(new ls("heartbeat",e=>new rT(e),"PRIVATE")),gi(yd,ug,r),gi(yd,ug,"esm2020"),gi("fire-js","")}aT("");function Yy(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const lT=Yy,Jy=new Qa("auth","Firebase",Yy());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $u=new zd("@firebase/auth");function uT(r,...e){$u.logLevel<=Pe.WARN&&$u.warn(`Auth (${Io}): ${r}`,...e)}function Nu(r,...e){$u.logLevel<=Pe.ERROR&&$u.error(`Auth (${Io}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ir(r,...e){throw Hd(r,...e)}function Dn(r,...e){return Hd(r,...e)}function qd(r,e,t){const s={...lT(),[e]:t};return new Qa("auth","Firebase",s).create(e,{appName:r.name})}function is(r){return qd(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function cT(r,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&ir(r,"argument-error"),qd(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Hd(r,...e){if(typeof r!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=r.name),r._errorFactory.create(t,...s)}return Jy.create(r,...e)}function ve(r,e,...t){if(!r)throw Hd(e,...t)}function Ar(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Nu(e),new Error(e)}function Pr(r,e){r||Ar(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ed(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function hT(){return pg()==="http:"||pg()==="https:"}function pg(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dT(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(hT()||jw()||"connection"in navigator)?navigator.onLine:!0}function fT(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ja{constructor(e,t){this.shortDelay=e,this.longDelay=t,Pr(t>e,"Short delay should be less than long delay!"),this.isMobile=Mw()||zw()}get(){return dT()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wd(r,e){Pr(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xy{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ar("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ar("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ar("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pT={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mT=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],gT=new Ja(3e4,6e4);function Gd(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function So(r,e,t,s,o={}){return Zy(r,o,async()=>{let u={},h={};s&&(e==="GET"?h=s:u={body:JSON.stringify(s)});const m=Ya({key:r.config.apiKey,...h}).slice(1),y=await r._getAdditionalHeaders();y["Content-Type"]="application/json",r.languageCode&&(y["X-Firebase-Locale"]=r.languageCode);const v={method:e,headers:y,...u};return Uw()||(v.referrerPolicy="no-referrer"),r.emulatorConfig&&To(r.emulatorConfig.host)&&(v.credentials="include"),Xy.fetch()(await e_(r,r.config.apiHost,t,m),v)})}async function Zy(r,e,t){r._canInitEmulator=!1;const s={...pT,...e};try{const o=new _T(r),u=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await u.json();if("needConfirmation"in h)throw Tu(r,"account-exists-with-different-credential",h);if(u.ok&&!("errorMessage"in h))return h;{const m=u.ok?h.errorMessage:h.error.message,[y,v]=m.split(" : ");if(y==="FEDERATED_USER_ID_ALREADY_LINKED")throw Tu(r,"credential-already-in-use",h);if(y==="EMAIL_EXISTS")throw Tu(r,"email-already-in-use",h);if(y==="USER_DISABLED")throw Tu(r,"user-disabled",h);const w=s[y]||y.toLowerCase().replace(/[_\s]+/g,"-");if(v)throw qd(r,w,v);ir(r,w)}}catch(o){if(o instanceof Vr)throw o;ir(r,"network-request-failed",{message:String(o)})}}async function yT(r,e,t,s,o={}){const u=await So(r,e,t,s,o);return"mfaPendingCredential"in u&&ir(r,"multi-factor-auth-required",{_serverResponse:u}),u}async function e_(r,e,t,s){const o=`${e}${t}?${s}`,u=r,h=u.config.emulator?Wd(r.config,o):`${r.config.apiScheme}://${o}`;return mT.includes(t)&&(await u._persistenceManagerAvailable,u._getPersistenceType()==="COOKIE")?u._getPersistence()._getFinalTarget(h).toString():h}class _T{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(Dn(this.auth,"network-request-failed")),gT.get())})}}function Tu(r,e,t){const s={appName:r.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const o=Dn(r,e,s);return o.customData._tokenResponse=t,o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vT(r,e){return So(r,"POST","/v1/accounts:delete",e)}async function qu(r,e){return So(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Va(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function ET(r,e=!1){const t=jt(r),s=await t.getIdToken(e),o=Kd(s);ve(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const u=typeof o.firebase=="object"?o.firebase:void 0,h=u==null?void 0:u.sign_in_provider;return{claims:o,token:s,authTime:Va(sd(o.auth_time)),issuedAtTime:Va(sd(o.iat)),expirationTime:Va(sd(o.exp)),signInProvider:h||null,signInSecondFactor:(u==null?void 0:u.sign_in_second_factor)||null}}function sd(r){return Number(r)*1e3}function Kd(r){const[e,t,s]=r.split(".");if(e===void 0||t===void 0||s===void 0)return Nu("JWT malformed, contained fewer than 3 sections"),null;try{const o=Fy(t);return o?JSON.parse(o):(Nu("Failed to decode base64 JWT payload"),null)}catch(o){return Nu("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function mg(r){const e=Kd(r);return ve(e,"internal-error"),ve(typeof e.exp<"u","internal-error"),ve(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ja(r,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof Vr&&wT(s)&&r.auth.currentUser===r&&await r.auth.signOut(),s}}function wT({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TT{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const s=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Va(this.lastLoginAt),this.creationTime=Va(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hu(r){var A;const e=r.auth,t=await r.getIdToken(),s=await ja(r,qu(e,{idToken:t}));ve(s==null?void 0:s.users.length,e,"internal-error");const o=s.users[0];r._notifyReloadListener(o);const u=(A=o.providerUserInfo)!=null&&A.length?t_(o.providerUserInfo):[],h=ST(r.providerData,u),m=r.isAnonymous,y=!(r.email&&o.passwordHash)&&!(h!=null&&h.length),v=m?y:!1,w={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new wd(o.createdAt,o.lastLoginAt),isAnonymous:v};Object.assign(r,w)}async function IT(r){const e=jt(r);await Hu(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ST(r,e){return[...r.filter(s=>!e.some(o=>o.providerId===s.providerId)),...e]}function t_(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function AT(r,e){const t=await Zy(r,{},async()=>{const s=Ya({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:u}=r.config,h=await e_(r,o,"/v1/token",`key=${u}`),m=await r._getAdditionalHeaders();m["Content-Type"]="application/x-www-form-urlencoded";const y={method:"POST",headers:m,body:s};return r.emulatorConfig&&To(r.emulatorConfig.host)&&(y.credentials="include"),Xy.fetch()(h,y)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function RT(r,e){return So(r,"POST","/v2/accounts:revokeToken",Gd(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uo{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){ve(e.idToken,"internal-error"),ve(typeof e.idToken<"u","internal-error"),ve(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):mg(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){ve(e.length!==0,"internal-error");const t=mg(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(ve(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:o,expiresIn:u}=await AT(e,t);this.updateTokensAndExpiration(s,o,Number(u))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:o,expirationTime:u}=t,h=new uo;return s&&(ve(typeof s=="string","internal-error",{appName:e}),h.refreshToken=s),o&&(ve(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),u&&(ve(typeof u=="number","internal-error",{appName:e}),h.expirationTime=u),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new uo,this.toJSON())}_performRefresh(){return Ar("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ui(r,e){ve(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Pn{constructor({uid:e,auth:t,stsTokenManager:s,...o}){this.providerId="firebase",this.proactiveRefresh=new TT(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new wd(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await ja(this,this.stsTokenManager.getToken(this.auth,e));return ve(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return ET(this,e)}reload(){return IT(this)}_assign(e){this!==e&&(ve(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Pn({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){ve(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Hu(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(kn(this.auth.app))return Promise.reject(is(this.auth));const e=await this.getIdToken();return await ja(this,vT(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const s=t.displayName??void 0,o=t.email??void 0,u=t.phoneNumber??void 0,h=t.photoURL??void 0,m=t.tenantId??void 0,y=t._redirectEventId??void 0,v=t.createdAt??void 0,w=t.lastLoginAt??void 0,{uid:A,emailVerified:R,isAnonymous:j,providerData:J,stsTokenManager:X}=t;ve(A&&X,e,"internal-error");const Q=uo.fromJSON(this.name,X);ve(typeof A=="string",e,"internal-error"),ui(s,e.name),ui(o,e.name),ve(typeof R=="boolean",e,"internal-error"),ve(typeof j=="boolean",e,"internal-error"),ui(u,e.name),ui(h,e.name),ui(m,e.name),ui(y,e.name),ui(v,e.name),ui(w,e.name);const Ee=new Pn({uid:A,auth:e,email:o,emailVerified:R,displayName:s,isAnonymous:j,photoURL:h,phoneNumber:u,tenantId:m,stsTokenManager:Q,createdAt:v,lastLoginAt:w});return J&&Array.isArray(J)&&(Ee.providerData=J.map(ge=>({...ge}))),y&&(Ee._redirectEventId=y),Ee}static async _fromIdTokenResponse(e,t,s=!1){const o=new uo;o.updateFromServerResponse(t);const u=new Pn({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:s});return await Hu(u),u}static async _fromGetAccountInfoResponse(e,t,s){const o=t.users[0];ve(o.localId!==void 0,"internal-error");const u=o.providerUserInfo!==void 0?t_(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(u!=null&&u.length),m=new uo;m.updateFromIdToken(s);const y=new Pn({uid:o.localId,auth:e,stsTokenManager:m,isAnonymous:h}),v={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:u,metadata:new wd(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(u!=null&&u.length)};return Object.assign(y,v),y}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gg=new Map;function Rr(r){Pr(r instanceof Function,"Expected a class definition");let e=gg.get(r);return e?(Pr(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,gg.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n_{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}n_.type="NONE";const yg=n_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Du(r,e,t){return`firebase:${r}:${e}:${t}`}class co{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:o,name:u}=this.auth;this.fullUserKey=Du(this.userKey,o.apiKey,u),this.fullPersistenceKey=Du("persistence",o.apiKey,u),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await qu(this.auth,{idToken:e}).catch(()=>{});return t?Pn._fromGetAccountInfoResponse(this.auth,t,e):null}return Pn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new co(Rr(yg),e,s);const o=(await Promise.all(t.map(async v=>{if(await v._isAvailable())return v}))).filter(v=>v);let u=o[0]||Rr(yg);const h=Du(s,e.config.apiKey,e.name);let m=null;for(const v of t)try{const w=await v._get(h);if(w){let A;if(typeof w=="string"){const R=await qu(e,{idToken:w}).catch(()=>{});if(!R)break;A=await Pn._fromGetAccountInfoResponse(e,R,w)}else A=Pn._fromJSON(e,w);v!==u&&(m=A),u=v;break}}catch{}const y=o.filter(v=>v._shouldAllowMigration);return!u._shouldAllowMigration||!y.length?new co(u,e,s):(u=y[0],m&&await u._set(h,m.toJSON()),await Promise.all(t.map(async v=>{if(v!==u)try{await v._remove(h)}catch{}})),new co(u,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _g(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(o_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(r_(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(l_(e))return"Blackberry";if(u_(e))return"Webos";if(i_(e))return"Safari";if((e.includes("chrome/")||s_(e))&&!e.includes("edge/"))return"Chrome";if(a_(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=r.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function r_(r=Ut()){return/firefox\//i.test(r)}function i_(r=Ut()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function s_(r=Ut()){return/crios\//i.test(r)}function o_(r=Ut()){return/iemobile/i.test(r)}function a_(r=Ut()){return/android/i.test(r)}function l_(r=Ut()){return/blackberry/i.test(r)}function u_(r=Ut()){return/webos/i.test(r)}function Qd(r=Ut()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function CT(r=Ut()){var e;return Qd(r)&&!!((e=window.navigator)!=null&&e.standalone)}function kT(){return Bw()&&document.documentMode===10}function c_(r=Ut()){return Qd(r)||a_(r)||u_(r)||l_(r)||/windows phone/i.test(r)||o_(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function h_(r,e=[]){let t;switch(r){case"Browser":t=_g(Ut());break;case"Worker":t=`${_g(Ut())}-${r}`;break;default:t=r}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Io}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PT{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=u=>new Promise((h,m)=>{try{const y=e(u);h(y)}catch(y){m(y)}});s.onAbort=t,this.queue.push(s);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function NT(r,e={}){return So(r,"GET","/v2/passwordPolicy",Gd(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DT=6;class VT{constructor(e){var s;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??DT,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((s=e.allowedNonAlphanumericCharacters)==null?void 0:s.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let o=0;o<e.length;o++)s=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,o,u){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xT{constructor(e,t,s,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new vg(this),this.idTokenSubscription=new vg(this),this.beforeStateQueue=new PT(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Jy,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(u=>this._resolvePersistenceManagerAvailable=u)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Rr(t)),this._initializationPromise=this.queue(async()=>{var s,o,u;if(!this._deleted&&(this.persistenceManager=await co.create(this,e),(s=this._resolvePersistenceManagerAvailable)==null||s.call(this),!this._deleted)){if((o=this._popupRedirectResolver)!=null&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((u=this.currentUser)==null?void 0:u.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await qu(this,{idToken:e}),s=await Pn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var u;if(kn(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(m=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(m,m))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let s=t,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(u=this.redirectUser)==null?void 0:u._redirectEventId,m=s==null?void 0:s._redirectEventId,y=await this.tryRedirectSignIn(e);(!h||h===m)&&(y!=null&&y.user)&&(s=y.user,o=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(s)}catch(h){s=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return ve(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Hu(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=fT()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(kn(this.app))return Promise.reject(is(this));const t=e?jt(e):null;return t&&ve(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&ve(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return kn(this.app)?Promise.reject(is(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return kn(this.app)?Promise.reject(is(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Rr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await NT(this),t=new VT(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Qa("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await RT(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Rr(e)||this._popupRedirectResolver;ve(t,this,"argument-error"),this.redirectPersistenceManager=await co.create(this,[Rr(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)==null?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,o){if(this._deleted)return()=>{};const u=typeof t=="function"?t:t.next.bind(t);let h=!1;const m=this._isInitialized?Promise.resolve():this._initializationPromise;if(ve(m,this,"internal-error"),m.then(()=>{h||u(this.currentUser)}),typeof t=="function"){const y=e.addObserver(t,s,o);return()=>{h=!0,y()}}else{const y=e.addObserver(t);return()=>{h=!0,y()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return ve(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=h_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var o;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((o=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:o.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;if(kn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&uT(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function ac(r){return jt(r)}class vg{constructor(e){this.auth=e,this.observer=null,this.addObserver=Yw(t=>this.observer=t)}get next(){return ve(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yd={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function OT(r){Yd=r}function LT(r){return Yd.loadJS(r)}function bT(){return Yd.gapiScript}function MT(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FT(r,e){const t=$d(r,"auth");if(t.isInitialized()){const o=t.getImmediate(),u=t.getOptions();if(as(u,e??{}))return o;ir(o,"already-initialized")}return t.initialize({options:e})}function UT(r,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Rr);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function jT(r,e,t){const s=ac(r);ve(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const o=!1,u=d_(e),{host:h,port:m}=zT(e),y=m===null?"":`:${m}`,v={url:`${u}//${h}${y}/`},w=Object.freeze({host:h,port:m,protocol:u.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!s._canInitEmulator){ve(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),ve(as(v,s.config.emulator)&&as(w,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=v,s.emulatorConfig=w,s.settings.appVerificationDisabledForTesting=!0,To(h)?(By(`${u}//${h}${y}`),$y("Auth",!0)):BT()}function d_(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function zT(r){const e=d_(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(s);if(o){const u=o[1];return{host:u,port:Eg(s.substr(u.length+1))}}else{const[u,h]=s.split(":");return{host:u,port:Eg(h)}}}function Eg(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function BT(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f_{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ar("not implemented")}_getIdTokenResponse(e){return Ar("not implemented")}_linkToIdToken(e,t){return Ar("not implemented")}_getReauthenticationResolver(e){return Ar("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ho(r,e){return yT(r,"POST","/v1/accounts:signInWithIdp",Gd(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $T="http://localhost";class us extends f_{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new us(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):ir("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:o,...u}=t;if(!s||!o)return null;const h=new us(s,o);return h.idToken=u.idToken||void 0,h.accessToken=u.accessToken||void 0,h.secret=u.secret,h.nonce=u.nonce,h.pendingToken=u.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return ho(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,ho(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,ho(e,t)}buildRequest(){const e={requestUri:$T,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ya(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jd{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xa extends Jd{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ci extends Xa{constructor(){super("facebook.com")}static credential(e){return us._fromParams({providerId:ci.PROVIDER_ID,signInMethod:ci.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ci.credentialFromTaggedObject(e)}static credentialFromError(e){return ci.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ci.credential(e.oauthAccessToken)}catch{return null}}}ci.FACEBOOK_SIGN_IN_METHOD="facebook.com";ci.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr extends Xa{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return us._fromParams({providerId:Sr.PROVIDER_ID,signInMethod:Sr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Sr.credentialFromTaggedObject(e)}static credentialFromError(e){return Sr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Sr.credential(t,s)}catch{return null}}}Sr.GOOGLE_SIGN_IN_METHOD="google.com";Sr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi extends Xa{constructor(){super("github.com")}static credential(e){return us._fromParams({providerId:hi.PROVIDER_ID,signInMethod:hi.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return hi.credentialFromTaggedObject(e)}static credentialFromError(e){return hi.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return hi.credential(e.oauthAccessToken)}catch{return null}}}hi.GITHUB_SIGN_IN_METHOD="github.com";hi.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class di extends Xa{constructor(){super("twitter.com")}static credential(e,t){return us._fromParams({providerId:di.PROVIDER_ID,signInMethod:di.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return di.credentialFromTaggedObject(e)}static credentialFromError(e){return di.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return di.credential(t,s)}catch{return null}}}di.TWITTER_SIGN_IN_METHOD="twitter.com";di.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class go{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,o=!1){const u=await Pn._fromIdTokenResponse(e,s,o),h=wg(s);return new go({user:u,providerId:h,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const o=wg(s);return new go({user:e,providerId:o,_tokenResponse:s,operationType:t})}}function wg(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wu extends Vr{constructor(e,t,s,o){super(t.code,t.message),this.operationType=s,this.user=o,Object.setPrototypeOf(this,Wu.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,o){return new Wu(e,t,s,o)}}function p_(r,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(u=>{throw u.code==="auth/multi-factor-auth-required"?Wu._fromErrorAndOperation(r,u,e,s):u})}async function qT(r,e,t=!1){const s=await ja(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return go._forOperation(r,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function HT(r,e,t=!1){const{auth:s}=r;if(kn(s.app))return Promise.reject(is(s));const o="reauthenticate";try{const u=await ja(r,p_(s,o,e,r),t);ve(u.idToken,s,"internal-error");const h=Kd(u.idToken);ve(h,s,"internal-error");const{sub:m}=h;return ve(r.uid===m,s,"user-mismatch"),go._forOperation(r,o,u)}catch(u){throw(u==null?void 0:u.code)==="auth/user-not-found"&&ir(s,"user-mismatch"),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function WT(r,e,t=!1){if(kn(r.app))return Promise.reject(is(r));const s="signIn",o=await p_(r,s,e),u=await go._fromIdTokenResponse(r,s,o);return t||await r._updateCurrentUser(u.user),u}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function GT(r,e){return jt(r).setPersistence(e)}function KT(r,e,t,s){return jt(r).onIdTokenChanged(e,t,s)}function QT(r,e,t){return jt(r).beforeAuthStateChanged(e,t)}function YT(r,e,t,s){return jt(r).onAuthStateChanged(e,t,s)}function JT(r){return jt(r).signOut()}const Gu="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m_{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Gu,"1"),this.storage.removeItem(Gu),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XT=1e3,ZT=10;class g_ extends m_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=c_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),o=this.localCache[t];s!==o&&e(t,o,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,m,y)=>{this.notifyListeners(h,y)});return}const s=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(s);!t&&this.localCache[s]===h||this.notifyListeners(s,h)},u=this.storage.getItem(s);kT()&&u!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,ZT):o()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},XT)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}g_.type="LOCAL";const y_=g_;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class __ extends m_{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}__.type="SESSION";const v_=__;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eI(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const s=new lc(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:o,data:u}=t.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:o});const m=Array.from(h).map(async v=>v(t.origin,u)),y=await eI(m);t.ports[0].postMessage({status:"done",eventId:s,eventType:o,response:y})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}lc.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xd(r="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tI{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let u,h;return new Promise((m,y)=>{const v=Xd("",20);o.port1.start();const w=setTimeout(()=>{y(new Error("unsupported_event"))},s);h={messageChannel:o,onMessage(A){const R=A;if(R.data.eventId===v)switch(R.data.status){case"ack":clearTimeout(w),u=setTimeout(()=>{y(new Error("timeout"))},3e3);break;case"done":clearTimeout(u),m(R.data.response);break;default:clearTimeout(w),clearTimeout(u),y(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:v,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function er(){return window}function nI(r){er().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function E_(){return typeof er().WorkerGlobalScope<"u"&&typeof er().importScripts=="function"}async function rI(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function iI(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function sI(){return E_()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w_="firebaseLocalStorageDb",oI=1,Ku="firebaseLocalStorage",T_="fbase_key";class Za{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function uc(r,e){return r.transaction([Ku],e?"readwrite":"readonly").objectStore(Ku)}function aI(){const r=indexedDB.deleteDatabase(w_);return new Za(r).toPromise()}function Td(){const r=indexedDB.open(w_,oI);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const s=r.result;try{s.createObjectStore(Ku,{keyPath:T_})}catch(o){t(o)}}),r.addEventListener("success",async()=>{const s=r.result;s.objectStoreNames.contains(Ku)?e(s):(s.close(),await aI(),e(await Td()))})})}async function Tg(r,e,t){const s=uc(r,!0).put({[T_]:e,value:t});return new Za(s).toPromise()}async function lI(r,e){const t=uc(r,!1).get(e),s=await new Za(t).toPromise();return s===void 0?null:s.value}function Ig(r,e){const t=uc(r,!0).delete(e);return new Za(t).toPromise()}const uI=800,cI=3;class I_{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Td(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>cI)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return E_()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=lc._getInstance(sI()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,s;if(this.activeServiceWorker=await rI(),!this.activeServiceWorker)return;this.sender=new tI(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(s=e[0])!=null&&s.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||iI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Td();return await Tg(e,Gu,"1"),await Ig(e,Gu),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Tg(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>lI(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Ig(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const u=uc(o,!1).getAll();return new Za(u).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:o,value:u}of e)s.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(u)&&(this.notifyListeners(o,u),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!s.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),uI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}I_.type="LOCAL";const hI=I_;new Ja(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S_(r,e){return e?Rr(e):(ve(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd extends f_{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ho(e,this._buildIdpRequest())}_linkToIdToken(e,t){return ho(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return ho(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function dI(r){return WT(r.auth,new Zd(r),r.bypassAuthState)}function fI(r){const{auth:e,user:t}=r;return ve(t,e,"internal-error"),HT(t,new Zd(r),r.bypassAuthState)}async function pI(r){const{auth:e,user:t}=r;return ve(t,e,"internal-error"),qT(t,new Zd(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A_{constructor(e,t,s,o,u=!1){this.auth=e,this.resolver=s,this.user=o,this.bypassAuthState=u,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:o,tenantId:u,error:h,type:m}=e;if(h){this.reject(h);return}const y={auth:this.auth,requestUri:t,sessionId:s,tenantId:u||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(m)(y))}catch(v){this.reject(v)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return dI;case"linkViaPopup":case"linkViaRedirect":return pI;case"reauthViaPopup":case"reauthViaRedirect":return fI;default:ir(this.auth,"internal-error")}}resolve(e){Pr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Pr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mI=new Ja(2e3,1e4);async function gI(r,e,t){if(kn(r.app))return Promise.reject(Dn(r,"operation-not-supported-in-this-environment"));const s=ac(r);cT(r,e,Jd);const o=S_(s,t);return new ns(s,"signInViaPopup",e,o).executeNotNull()}class ns extends A_{constructor(e,t,s,o,u){super(e,t,o,u),this.provider=s,this.authWindow=null,this.pollId=null,ns.currentPopupAction&&ns.currentPopupAction.cancel(),ns.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return ve(e,this.auth,"internal-error"),e}async onExecution(){Pr(this.filter.length===1,"Popup operations only handle one event");const e=Xd();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Dn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Dn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ns.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if((s=(t=this.authWindow)==null?void 0:t.window)!=null&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Dn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,mI.get())};e()}}ns.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yI="pendingRedirect",Vu=new Map;class _I extends A_{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Vu.get(this.auth._key());if(!e){try{const s=await vI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Vu.set(this.auth._key(),e)}return this.bypassAuthState||Vu.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function vI(r,e){const t=TI(e),s=wI(r);if(!await s._isAvailable())return!1;const o=await s._get(t)==="true";return await s._remove(t),o}function EI(r,e){Vu.set(r._key(),e)}function wI(r){return Rr(r._redirectPersistence)}function TI(r){return Du(yI,r.config.apiKey,r.name)}async function II(r,e,t=!1){if(kn(r.app))return Promise.reject(is(r));const s=ac(r),o=S_(s,e),h=await new _I(s,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await s._persistUserIfCurrent(h.user),await s._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SI=600*1e3;class AI{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!RI(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!R_(e)){const o=((s=e.error.code)==null?void 0:s.split("auth/")[1])||"internal-error";t.onError(Dn(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=SI&&this.cachedEventUids.clear(),this.cachedEventUids.has(Sg(e))}saveEventToCache(e){this.cachedEventUids.add(Sg(e)),this.lastProcessedEventTime=Date.now()}}function Sg(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function R_({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function RI(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return R_(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function CI(r,e={}){return So(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kI=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,PI=/^https?/;async function NI(r){if(r.config.emulator)return;const{authorizedDomains:e}=await CI(r);for(const t of e)try{if(DI(t))return}catch{}ir(r,"unauthorized-domain")}function DI(r){const e=Ed(),{protocol:t,hostname:s}=new URL(e);if(r.startsWith("chrome-extension://")){const h=new URL(r);return h.hostname===""&&s===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===s}if(!PI.test(t))return!1;if(kI.test(r))return s===r;const o=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VI=new Ja(3e4,6e4);function Ag(){const r=er().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function xI(r){return new Promise((e,t)=>{var o,u,h;function s(){Ag(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ag(),t(Dn(r,"network-request-failed"))},timeout:VI.get()})}if((u=(o=er().gapi)==null?void 0:o.iframes)!=null&&u.Iframe)e(gapi.iframes.getContext());else if((h=er().gapi)!=null&&h.load)s();else{const m=MT("iframefcb");return er()[m]=()=>{gapi.load?s():t(Dn(r,"network-request-failed"))},LT(`${bT()}?onload=${m}`).catch(y=>t(y))}}).catch(e=>{throw xu=null,e})}let xu=null;function OI(r){return xu=xu||xI(r),xu}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LI=new Ja(5e3,15e3),bI="__/auth/iframe",MI="emulator/auth/iframe",FI={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},UI=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function jI(r){const e=r.config;ve(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?Wd(e,MI):`https://${r.config.authDomain}/${bI}`,s={apiKey:e.apiKey,appName:r.name,v:Io},o=UI.get(r.config.apiHost);o&&(s.eid=o);const u=r._getFrameworks();return u.length&&(s.fw=u.join(",")),`${t}?${Ya(s).slice(1)}`}async function zI(r){const e=await OI(r),t=er().gapi;return ve(t,r,"internal-error"),e.open({where:document.body,url:jI(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:FI,dontclear:!0},s=>new Promise(async(o,u)=>{await s.restyle({setHideOnLeave:!1});const h=Dn(r,"network-request-failed"),m=er().setTimeout(()=>{u(h)},LI.get());function y(){er().clearTimeout(m),o(s)}s.ping(y).then(y,()=>{u(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const BI={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},$I=500,qI=600,HI="_blank",WI="http://localhost";class Rg{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function GI(r,e,t,s=$I,o=qI){const u=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-s)/2,0).toString();let m="";const y={...BI,width:s.toString(),height:o.toString(),top:u,left:h},v=Ut().toLowerCase();t&&(m=s_(v)?HI:t),r_(v)&&(e=e||WI,y.scrollbars="yes");const w=Object.entries(y).reduce((R,[j,J])=>`${R}${j}=${J},`,"");if(CT(v)&&m!=="_self")return KI(e||"",m),new Rg(null);const A=window.open(e||"",m,w);ve(A,r,"popup-blocked");try{A.focus()}catch{}return new Rg(A)}function KI(r,e){const t=document.createElement("a");t.href=r,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QI="__/auth/handler",YI="emulator/auth/handler",JI=encodeURIComponent("fac");async function Cg(r,e,t,s,o,u){ve(r.config.authDomain,r,"auth-domain-config-required"),ve(r.config.apiKey,r,"invalid-api-key");const h={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:s,v:Io,eventId:o};if(e instanceof Jd){e.setDefaultLanguage(r.languageCode),h.providerId=e.providerId||"",Qw(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[w,A]of Object.entries({}))h[w]=A}if(e instanceof Xa){const w=e.getScopes().filter(A=>A!=="");w.length>0&&(h.scopes=w.join(","))}r.tenantId&&(h.tid=r.tenantId);const m=h;for(const w of Object.keys(m))m[w]===void 0&&delete m[w];const y=await r._getAppCheckToken(),v=y?`#${JI}=${encodeURIComponent(y)}`:"";return`${XI(r)}?${Ya(m).slice(1)}${v}`}function XI({config:r}){return r.emulator?Wd(r,YI):`https://${r.authDomain}/${QI}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const od="webStorageSupport";class ZI{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=v_,this._completeRedirectFn=II,this._overrideRedirectResult=EI}async _openPopup(e,t,s,o){var h;Pr((h=this.eventManagers[e._key()])==null?void 0:h.manager,"_initialize() not called before _openPopup()");const u=await Cg(e,t,s,Ed(),o);return GI(e,u,Xd())}async _openRedirect(e,t,s,o){await this._originValidation(e);const u=await Cg(e,t,s,Ed(),o);return nI(u),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:u}=this.eventManagers[t];return o?Promise.resolve(o):(Pr(u,"If manager is not set, promise should be"),u)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await zI(e),s=new AI(e);return t.register("authEvent",o=>(ve(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:s.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(od,{type:od},o=>{var h;const u=(h=o==null?void 0:o[0])==null?void 0:h[od];u!==void 0&&t(!!u),ir(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=NI(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return c_()||i_()||Qd()}}const e1=ZI;var kg="@firebase/auth",Pg="1.12.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t1{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){ve(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function n1(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function r1(r){mo(new ls("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),u=e.getProvider("app-check-internal"),{apiKey:h,authDomain:m}=s.options;ve(h&&!h.includes(":"),"invalid-api-key",{appName:s.name});const y={apiKey:h,authDomain:m,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:h_(r)},v=new xT(s,o,u,y);return UT(v,t),v},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),mo(new ls("auth-internal",e=>{const t=ac(e.getProvider("auth").getImmediate());return(s=>new t1(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),gi(kg,Pg,n1(r)),gi(kg,Pg,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const i1=300,s1=zy("authIdTokenMaxAge")||i1;let Ng=null;const o1=r=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>s1)return;const o=t==null?void 0:t.token;Ng!==o&&(Ng=o,await fetch(r,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function a1(r=Gy()){const e=$d(r,"auth");if(e.isInitialized())return e.getImmediate();const t=FT(r,{popupRedirectResolver:e1,persistence:[hI,y_,v_]}),s=zy("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const u=new URL(s,location.origin);if(location.origin===u.origin){const h=o1(u.toString());QT(t,h,()=>h(t.currentUser)),KT(t,m=>h(m))}}const o=Uy("auth");return o&&jT(t,`http://${o}`),t}function l1(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}OT({loadJS(r){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",r),s.onload=e,s.onerror=o=>{const u=Dn("internal-error");u.customData=o,t(u)},s.type="text/javascript",s.charset="UTF-8",l1().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});r1("Browser");var Dg=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var yi,C_;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(N,S){function C(){}C.prototype=S.prototype,N.F=S.prototype,N.prototype=new C,N.prototype.constructor=N,N.D=function(V,P,x){for(var I=Array(arguments.length-2),ye=2;ye<arguments.length;ye++)I[ye-2]=arguments[ye];return S.prototype[P].apply(V,I)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(s,t),s.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(N,S,C){C||(C=0);const V=Array(16);if(typeof S=="string")for(var P=0;P<16;++P)V[P]=S.charCodeAt(C++)|S.charCodeAt(C++)<<8|S.charCodeAt(C++)<<16|S.charCodeAt(C++)<<24;else for(P=0;P<16;++P)V[P]=S[C++]|S[C++]<<8|S[C++]<<16|S[C++]<<24;S=N.g[0],C=N.g[1],P=N.g[2];let x=N.g[3],I;I=S+(x^C&(P^x))+V[0]+3614090360&4294967295,S=C+(I<<7&4294967295|I>>>25),I=x+(P^S&(C^P))+V[1]+3905402710&4294967295,x=S+(I<<12&4294967295|I>>>20),I=P+(C^x&(S^C))+V[2]+606105819&4294967295,P=x+(I<<17&4294967295|I>>>15),I=C+(S^P&(x^S))+V[3]+3250441966&4294967295,C=P+(I<<22&4294967295|I>>>10),I=S+(x^C&(P^x))+V[4]+4118548399&4294967295,S=C+(I<<7&4294967295|I>>>25),I=x+(P^S&(C^P))+V[5]+1200080426&4294967295,x=S+(I<<12&4294967295|I>>>20),I=P+(C^x&(S^C))+V[6]+2821735955&4294967295,P=x+(I<<17&4294967295|I>>>15),I=C+(S^P&(x^S))+V[7]+4249261313&4294967295,C=P+(I<<22&4294967295|I>>>10),I=S+(x^C&(P^x))+V[8]+1770035416&4294967295,S=C+(I<<7&4294967295|I>>>25),I=x+(P^S&(C^P))+V[9]+2336552879&4294967295,x=S+(I<<12&4294967295|I>>>20),I=P+(C^x&(S^C))+V[10]+4294925233&4294967295,P=x+(I<<17&4294967295|I>>>15),I=C+(S^P&(x^S))+V[11]+2304563134&4294967295,C=P+(I<<22&4294967295|I>>>10),I=S+(x^C&(P^x))+V[12]+1804603682&4294967295,S=C+(I<<7&4294967295|I>>>25),I=x+(P^S&(C^P))+V[13]+4254626195&4294967295,x=S+(I<<12&4294967295|I>>>20),I=P+(C^x&(S^C))+V[14]+2792965006&4294967295,P=x+(I<<17&4294967295|I>>>15),I=C+(S^P&(x^S))+V[15]+1236535329&4294967295,C=P+(I<<22&4294967295|I>>>10),I=S+(P^x&(C^P))+V[1]+4129170786&4294967295,S=C+(I<<5&4294967295|I>>>27),I=x+(C^P&(S^C))+V[6]+3225465664&4294967295,x=S+(I<<9&4294967295|I>>>23),I=P+(S^C&(x^S))+V[11]+643717713&4294967295,P=x+(I<<14&4294967295|I>>>18),I=C+(x^S&(P^x))+V[0]+3921069994&4294967295,C=P+(I<<20&4294967295|I>>>12),I=S+(P^x&(C^P))+V[5]+3593408605&4294967295,S=C+(I<<5&4294967295|I>>>27),I=x+(C^P&(S^C))+V[10]+38016083&4294967295,x=S+(I<<9&4294967295|I>>>23),I=P+(S^C&(x^S))+V[15]+3634488961&4294967295,P=x+(I<<14&4294967295|I>>>18),I=C+(x^S&(P^x))+V[4]+3889429448&4294967295,C=P+(I<<20&4294967295|I>>>12),I=S+(P^x&(C^P))+V[9]+568446438&4294967295,S=C+(I<<5&4294967295|I>>>27),I=x+(C^P&(S^C))+V[14]+3275163606&4294967295,x=S+(I<<9&4294967295|I>>>23),I=P+(S^C&(x^S))+V[3]+4107603335&4294967295,P=x+(I<<14&4294967295|I>>>18),I=C+(x^S&(P^x))+V[8]+1163531501&4294967295,C=P+(I<<20&4294967295|I>>>12),I=S+(P^x&(C^P))+V[13]+2850285829&4294967295,S=C+(I<<5&4294967295|I>>>27),I=x+(C^P&(S^C))+V[2]+4243563512&4294967295,x=S+(I<<9&4294967295|I>>>23),I=P+(S^C&(x^S))+V[7]+1735328473&4294967295,P=x+(I<<14&4294967295|I>>>18),I=C+(x^S&(P^x))+V[12]+2368359562&4294967295,C=P+(I<<20&4294967295|I>>>12),I=S+(C^P^x)+V[5]+4294588738&4294967295,S=C+(I<<4&4294967295|I>>>28),I=x+(S^C^P)+V[8]+2272392833&4294967295,x=S+(I<<11&4294967295|I>>>21),I=P+(x^S^C)+V[11]+1839030562&4294967295,P=x+(I<<16&4294967295|I>>>16),I=C+(P^x^S)+V[14]+4259657740&4294967295,C=P+(I<<23&4294967295|I>>>9),I=S+(C^P^x)+V[1]+2763975236&4294967295,S=C+(I<<4&4294967295|I>>>28),I=x+(S^C^P)+V[4]+1272893353&4294967295,x=S+(I<<11&4294967295|I>>>21),I=P+(x^S^C)+V[7]+4139469664&4294967295,P=x+(I<<16&4294967295|I>>>16),I=C+(P^x^S)+V[10]+3200236656&4294967295,C=P+(I<<23&4294967295|I>>>9),I=S+(C^P^x)+V[13]+681279174&4294967295,S=C+(I<<4&4294967295|I>>>28),I=x+(S^C^P)+V[0]+3936430074&4294967295,x=S+(I<<11&4294967295|I>>>21),I=P+(x^S^C)+V[3]+3572445317&4294967295,P=x+(I<<16&4294967295|I>>>16),I=C+(P^x^S)+V[6]+76029189&4294967295,C=P+(I<<23&4294967295|I>>>9),I=S+(C^P^x)+V[9]+3654602809&4294967295,S=C+(I<<4&4294967295|I>>>28),I=x+(S^C^P)+V[12]+3873151461&4294967295,x=S+(I<<11&4294967295|I>>>21),I=P+(x^S^C)+V[15]+530742520&4294967295,P=x+(I<<16&4294967295|I>>>16),I=C+(P^x^S)+V[2]+3299628645&4294967295,C=P+(I<<23&4294967295|I>>>9),I=S+(P^(C|~x))+V[0]+4096336452&4294967295,S=C+(I<<6&4294967295|I>>>26),I=x+(C^(S|~P))+V[7]+1126891415&4294967295,x=S+(I<<10&4294967295|I>>>22),I=P+(S^(x|~C))+V[14]+2878612391&4294967295,P=x+(I<<15&4294967295|I>>>17),I=C+(x^(P|~S))+V[5]+4237533241&4294967295,C=P+(I<<21&4294967295|I>>>11),I=S+(P^(C|~x))+V[12]+1700485571&4294967295,S=C+(I<<6&4294967295|I>>>26),I=x+(C^(S|~P))+V[3]+2399980690&4294967295,x=S+(I<<10&4294967295|I>>>22),I=P+(S^(x|~C))+V[10]+4293915773&4294967295,P=x+(I<<15&4294967295|I>>>17),I=C+(x^(P|~S))+V[1]+2240044497&4294967295,C=P+(I<<21&4294967295|I>>>11),I=S+(P^(C|~x))+V[8]+1873313359&4294967295,S=C+(I<<6&4294967295|I>>>26),I=x+(C^(S|~P))+V[15]+4264355552&4294967295,x=S+(I<<10&4294967295|I>>>22),I=P+(S^(x|~C))+V[6]+2734768916&4294967295,P=x+(I<<15&4294967295|I>>>17),I=C+(x^(P|~S))+V[13]+1309151649&4294967295,C=P+(I<<21&4294967295|I>>>11),I=S+(P^(C|~x))+V[4]+4149444226&4294967295,S=C+(I<<6&4294967295|I>>>26),I=x+(C^(S|~P))+V[11]+3174756917&4294967295,x=S+(I<<10&4294967295|I>>>22),I=P+(S^(x|~C))+V[2]+718787259&4294967295,P=x+(I<<15&4294967295|I>>>17),I=C+(x^(P|~S))+V[9]+3951481745&4294967295,N.g[0]=N.g[0]+S&4294967295,N.g[1]=N.g[1]+(P+(I<<21&4294967295|I>>>11))&4294967295,N.g[2]=N.g[2]+P&4294967295,N.g[3]=N.g[3]+x&4294967295}s.prototype.v=function(N,S){S===void 0&&(S=N.length);const C=S-this.blockSize,V=this.C;let P=this.h,x=0;for(;x<S;){if(P==0)for(;x<=C;)o(this,N,x),x+=this.blockSize;if(typeof N=="string"){for(;x<S;)if(V[P++]=N.charCodeAt(x++),P==this.blockSize){o(this,V),P=0;break}}else for(;x<S;)if(V[P++]=N[x++],P==this.blockSize){o(this,V),P=0;break}}this.h=P,this.o+=S},s.prototype.A=function(){var N=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);N[0]=128;for(var S=1;S<N.length-8;++S)N[S]=0;S=this.o*8;for(var C=N.length-8;C<N.length;++C)N[C]=S&255,S/=256;for(this.v(N),N=Array(16),S=0,C=0;C<4;++C)for(let V=0;V<32;V+=8)N[S++]=this.g[C]>>>V&255;return N};function u(N,S){var C=m;return Object.prototype.hasOwnProperty.call(C,N)?C[N]:C[N]=S(N)}function h(N,S){this.h=S;const C=[];let V=!0;for(let P=N.length-1;P>=0;P--){const x=N[P]|0;V&&x==S||(C[P]=x,V=!1)}this.g=C}var m={};function y(N){return-128<=N&&N<128?u(N,function(S){return new h([S|0],S<0?-1:0)}):new h([N|0],N<0?-1:0)}function v(N){if(isNaN(N)||!isFinite(N))return A;if(N<0)return Q(v(-N));const S=[];let C=1;for(let V=0;N>=C;V++)S[V]=N/C|0,C*=4294967296;return new h(S,0)}function w(N,S){if(N.length==0)throw Error("number format error: empty string");if(S=S||10,S<2||36<S)throw Error("radix out of range: "+S);if(N.charAt(0)=="-")return Q(w(N.substring(1),S));if(N.indexOf("-")>=0)throw Error('number format error: interior "-" character');const C=v(Math.pow(S,8));let V=A;for(let x=0;x<N.length;x+=8){var P=Math.min(8,N.length-x);const I=parseInt(N.substring(x,x+P),S);P<8?(P=v(Math.pow(S,P)),V=V.j(P).add(v(I))):(V=V.j(C),V=V.add(v(I)))}return V}var A=y(0),R=y(1),j=y(16777216);r=h.prototype,r.m=function(){if(X(this))return-Q(this).m();let N=0,S=1;for(let C=0;C<this.g.length;C++){const V=this.i(C);N+=(V>=0?V:4294967296+V)*S,S*=4294967296}return N},r.toString=function(N){if(N=N||10,N<2||36<N)throw Error("radix out of range: "+N);if(J(this))return"0";if(X(this))return"-"+Q(this).toString(N);const S=v(Math.pow(N,6));var C=this;let V="";for(;;){const P=Oe(C,S).g;C=Ee(C,P.j(S));let x=((C.g.length>0?C.g[0]:C.h)>>>0).toString(N);if(C=P,J(C))return x+V;for(;x.length<6;)x="0"+x;V=x+V}},r.i=function(N){return N<0?0:N<this.g.length?this.g[N]:this.h};function J(N){if(N.h!=0)return!1;for(let S=0;S<N.g.length;S++)if(N.g[S]!=0)return!1;return!0}function X(N){return N.h==-1}r.l=function(N){return N=Ee(this,N),X(N)?-1:J(N)?0:1};function Q(N){const S=N.g.length,C=[];for(let V=0;V<S;V++)C[V]=~N.g[V];return new h(C,~N.h).add(R)}r.abs=function(){return X(this)?Q(this):this},r.add=function(N){const S=Math.max(this.g.length,N.g.length),C=[];let V=0;for(let P=0;P<=S;P++){let x=V+(this.i(P)&65535)+(N.i(P)&65535),I=(x>>>16)+(this.i(P)>>>16)+(N.i(P)>>>16);V=I>>>16,x&=65535,I&=65535,C[P]=I<<16|x}return new h(C,C[C.length-1]&-2147483648?-1:0)};function Ee(N,S){return N.add(Q(S))}r.j=function(N){if(J(this)||J(N))return A;if(X(this))return X(N)?Q(this).j(Q(N)):Q(Q(this).j(N));if(X(N))return Q(this.j(Q(N)));if(this.l(j)<0&&N.l(j)<0)return v(this.m()*N.m());const S=this.g.length+N.g.length,C=[];for(var V=0;V<2*S;V++)C[V]=0;for(V=0;V<this.g.length;V++)for(let P=0;P<N.g.length;P++){const x=this.i(V)>>>16,I=this.i(V)&65535,ye=N.i(P)>>>16,Je=N.i(P)&65535;C[2*V+2*P]+=I*Je,ge(C,2*V+2*P),C[2*V+2*P+1]+=x*Je,ge(C,2*V+2*P+1),C[2*V+2*P+1]+=I*ye,ge(C,2*V+2*P+1),C[2*V+2*P+2]+=x*ye,ge(C,2*V+2*P+2)}for(N=0;N<S;N++)C[N]=C[2*N+1]<<16|C[2*N];for(N=S;N<2*S;N++)C[N]=0;return new h(C,0)};function ge(N,S){for(;(N[S]&65535)!=N[S];)N[S+1]+=N[S]>>>16,N[S]&=65535,S++}function Ce(N,S){this.g=N,this.h=S}function Oe(N,S){if(J(S))throw Error("division by zero");if(J(N))return new Ce(A,A);if(X(N))return S=Oe(Q(N),S),new Ce(Q(S.g),Q(S.h));if(X(S))return S=Oe(N,Q(S)),new Ce(Q(S.g),S.h);if(N.g.length>30){if(X(N)||X(S))throw Error("slowDivide_ only works with positive integers.");for(var C=R,V=S;V.l(N)<=0;)C=be(C),V=be(V);var P=Ve(C,1),x=Ve(V,1);for(V=Ve(V,2),C=Ve(C,2);!J(V);){var I=x.add(V);I.l(N)<=0&&(P=P.add(C),x=I),V=Ve(V,1),C=Ve(C,1)}return S=Ee(N,P.j(S)),new Ce(P,S)}for(P=A;N.l(S)>=0;){for(C=Math.max(1,Math.floor(N.m()/S.m())),V=Math.ceil(Math.log(C)/Math.LN2),V=V<=48?1:Math.pow(2,V-48),x=v(C),I=x.j(S);X(I)||I.l(N)>0;)C-=V,x=v(C),I=x.j(S);J(x)&&(x=R),P=P.add(x),N=Ee(N,I)}return new Ce(P,N)}r.B=function(N){return Oe(this,N).h},r.and=function(N){const S=Math.max(this.g.length,N.g.length),C=[];for(let V=0;V<S;V++)C[V]=this.i(V)&N.i(V);return new h(C,this.h&N.h)},r.or=function(N){const S=Math.max(this.g.length,N.g.length),C=[];for(let V=0;V<S;V++)C[V]=this.i(V)|N.i(V);return new h(C,this.h|N.h)},r.xor=function(N){const S=Math.max(this.g.length,N.g.length),C=[];for(let V=0;V<S;V++)C[V]=this.i(V)^N.i(V);return new h(C,this.h^N.h)};function be(N){const S=N.g.length+1,C=[];for(let V=0;V<S;V++)C[V]=N.i(V)<<1|N.i(V-1)>>>31;return new h(C,N.h)}function Ve(N,S){const C=S>>5;S%=32;const V=N.g.length-C,P=[];for(let x=0;x<V;x++)P[x]=S>0?N.i(x+C)>>>S|N.i(x+C+1)<<32-S:N.i(x+C);return new h(P,N.h)}s.prototype.digest=s.prototype.A,s.prototype.reset=s.prototype.u,s.prototype.update=s.prototype.v,C_=s,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.B,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=v,h.fromString=w,yi=h}).apply(typeof Dg<"u"?Dg:typeof self<"u"?self:typeof window<"u"?window:{});var Iu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var k_,Ca,P_,Ou,Id,N_,D_,V_;(function(){var r,e=Object.defineProperty;function t(l){l=[typeof globalThis=="object"&&globalThis,l,typeof window=="object"&&window,typeof self=="object"&&self,typeof Iu=="object"&&Iu];for(var p=0;p<l.length;++p){var g=l[p];if(g&&g.Math==Math)return g}throw Error("Cannot find global object")}var s=t(this);function o(l,p){if(p)e:{var g=s;l=l.split(".");for(var E=0;E<l.length-1;E++){var b=l[E];if(!(b in g))break e;g=g[b]}l=l[l.length-1],E=g[l],p=p(E),p!=E&&p!=null&&e(g,l,{configurable:!0,writable:!0,value:p})}}o("Symbol.dispose",function(l){return l||Symbol("Symbol.dispose")}),o("Array.prototype.values",function(l){return l||function(){return this[Symbol.iterator]()}}),o("Object.entries",function(l){return l||function(p){var g=[],E;for(E in p)Object.prototype.hasOwnProperty.call(p,E)&&g.push([E,p[E]]);return g}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var u=u||{},h=this||self;function m(l){var p=typeof l;return p=="object"&&l!=null||p=="function"}function y(l,p,g){return l.call.apply(l.bind,arguments)}function v(l,p,g){return v=y,v.apply(null,arguments)}function w(l,p){var g=Array.prototype.slice.call(arguments,1);return function(){var E=g.slice();return E.push.apply(E,arguments),l.apply(this,E)}}function A(l,p){function g(){}g.prototype=p.prototype,l.Z=p.prototype,l.prototype=new g,l.prototype.constructor=l,l.Ob=function(E,b,U){for(var ee=Array(arguments.length-2),Ae=2;Ae<arguments.length;Ae++)ee[Ae-2]=arguments[Ae];return p.prototype[b].apply(E,ee)}}var R=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?l=>l&&AsyncContext.Snapshot.wrap(l):l=>l;function j(l){const p=l.length;if(p>0){const g=Array(p);for(let E=0;E<p;E++)g[E]=l[E];return g}return[]}function J(l,p){for(let E=1;E<arguments.length;E++){const b=arguments[E];var g=typeof b;if(g=g!="object"?g:b?Array.isArray(b)?"array":g:"null",g=="array"||g=="object"&&typeof b.length=="number"){g=l.length||0;const U=b.length||0;l.length=g+U;for(let ee=0;ee<U;ee++)l[g+ee]=b[ee]}else l.push(b)}}class X{constructor(p,g){this.i=p,this.j=g,this.h=0,this.g=null}get(){let p;return this.h>0?(this.h--,p=this.g,this.g=p.next,p.next=null):p=this.i(),p}}function Q(l){h.setTimeout(()=>{throw l},0)}function Ee(){var l=N;let p=null;return l.g&&(p=l.g,l.g=l.g.next,l.g||(l.h=null),p.next=null),p}class ge{constructor(){this.h=this.g=null}add(p,g){const E=Ce.get();E.set(p,g),this.h?this.h.next=E:this.g=E,this.h=E}}var Ce=new X(()=>new Oe,l=>l.reset());class Oe{constructor(){this.next=this.g=this.h=null}set(p,g){this.h=p,this.g=g,this.next=null}reset(){this.next=this.g=this.h=null}}let be,Ve=!1,N=new ge,S=()=>{const l=Promise.resolve(void 0);be=()=>{l.then(C)}};function C(){for(var l;l=Ee();){try{l.h.call(l.g)}catch(g){Q(g)}var p=Ce;p.j(l),p.h<100&&(p.h++,l.next=p.g,p.g=l)}Ve=!1}function V(){this.u=this.u,this.C=this.C}V.prototype.u=!1,V.prototype.dispose=function(){this.u||(this.u=!0,this.N())},V.prototype[Symbol.dispose]=function(){this.dispose()},V.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function P(l,p){this.type=l,this.g=this.target=p,this.defaultPrevented=!1}P.prototype.h=function(){this.defaultPrevented=!0};var x=(function(){if(!h.addEventListener||!Object.defineProperty)return!1;var l=!1,p=Object.defineProperty({},"passive",{get:function(){l=!0}});try{const g=()=>{};h.addEventListener("test",g,p),h.removeEventListener("test",g,p)}catch{}return l})();function I(l){return/^[\s\xa0]*$/.test(l)}function ye(l,p){P.call(this,l?l.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,l&&this.init(l,p)}A(ye,P),ye.prototype.init=function(l,p){const g=this.type=l.type,E=l.changedTouches&&l.changedTouches.length?l.changedTouches[0]:null;this.target=l.target||l.srcElement,this.g=p,p=l.relatedTarget,p||(g=="mouseover"?p=l.fromElement:g=="mouseout"&&(p=l.toElement)),this.relatedTarget=p,E?(this.clientX=E.clientX!==void 0?E.clientX:E.pageX,this.clientY=E.clientY!==void 0?E.clientY:E.pageY,this.screenX=E.screenX||0,this.screenY=E.screenY||0):(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0),this.button=l.button,this.key=l.key||"",this.ctrlKey=l.ctrlKey,this.altKey=l.altKey,this.shiftKey=l.shiftKey,this.metaKey=l.metaKey,this.pointerId=l.pointerId||0,this.pointerType=l.pointerType,this.state=l.state,this.i=l,l.defaultPrevented&&ye.Z.h.call(this)},ye.prototype.h=function(){ye.Z.h.call(this);const l=this.i;l.preventDefault?l.preventDefault():l.returnValue=!1};var Je="closure_listenable_"+(Math.random()*1e6|0),it=0;function qe(l,p,g,E,b){this.listener=l,this.proxy=null,this.src=p,this.type=g,this.capture=!!E,this.ha=b,this.key=++it,this.da=this.fa=!1}function te(l){l.da=!0,l.listener=null,l.proxy=null,l.src=null,l.ha=null}function he(l,p,g){for(const E in l)p.call(g,l[E],E,l)}function ie(l,p){for(const g in l)p.call(void 0,l[g],g,l)}function O(l){const p={};for(const g in l)p[g]=l[g];return p}const H="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Te(l,p){let g,E;for(let b=1;b<arguments.length;b++){E=arguments[b];for(g in E)l[g]=E[g];for(let U=0;U<H.length;U++)g=H[U],Object.prototype.hasOwnProperty.call(E,g)&&(l[g]=E[g])}}function B(l){this.src=l,this.g={},this.h=0}B.prototype.add=function(l,p,g,E,b){const U=l.toString();l=this.g[U],l||(l=this.g[U]=[],this.h++);const ee=ue(l,p,E,b);return ee>-1?(p=l[ee],g||(p.fa=!1)):(p=new qe(p,this.src,U,!!E,b),p.fa=g,l.push(p)),p};function Z(l,p){const g=p.type;if(g in l.g){var E=l.g[g],b=Array.prototype.indexOf.call(E,p,void 0),U;(U=b>=0)&&Array.prototype.splice.call(E,b,1),U&&(te(p),l.g[g].length==0&&(delete l.g[g],l.h--))}}function ue(l,p,g,E){for(let b=0;b<l.length;++b){const U=l[b];if(!U.da&&U.listener==p&&U.capture==!!g&&U.ha==E)return b}return-1}var Ie="closure_lm_"+(Math.random()*1e6|0),Se={};function Me(l,p,g,E,b){if(Array.isArray(p)){for(let U=0;U<p.length;U++)Me(l,p[U],g,E,b);return null}return g=Do(g),l&&l[Je]?l.J(p,g,m(E)?!!E.capture:!1,b):zt(l,p,g,!1,E,b)}function zt(l,p,g,E,b,U){if(!p)throw Error("Invalid event type");const ee=m(b)?!!b.capture:!!b;let Ae=vs(l);if(Ae||(l[Ie]=Ae=new B(l)),g=Ae.add(p,g,E,ee,U),g.proxy)return g;if(E=ys(),g.proxy=E,E.src=l,E.listener=g,l.addEventListener)x||(b=ee),b===void 0&&(b=!1),l.addEventListener(p.toString(),E,b);else if(l.attachEvent)l.attachEvent(_s(p.toString()),E);else if(l.addListener&&l.removeListener)l.addListener(E);else throw Error("addEventListener and attachEvent are unavailable.");return g}function ys(){function l(g){return p.call(l.src,l.listener,g)}const p=ol;return l}function No(l,p,g,E,b){if(Array.isArray(p))for(var U=0;U<p.length;U++)No(l,p[U],g,E,b);else E=m(E)?!!E.capture:!!E,g=Do(g),l&&l[Je]?(l=l.i,U=String(p).toString(),U in l.g&&(p=l.g[U],g=ue(p,g,E,b),g>-1&&(te(p[g]),Array.prototype.splice.call(p,g,1),p.length==0&&(delete l.g[U],l.h--)))):l&&(l=vs(l))&&(p=l.g[p.toString()],l=-1,p&&(l=ue(p,g,E,b)),(g=l>-1?p[l]:null)&&xr(g))}function xr(l){if(typeof l!="number"&&l&&!l.da){var p=l.src;if(p&&p[Je])Z(p.i,l);else{var g=l.type,E=l.proxy;p.removeEventListener?p.removeEventListener(g,E,l.capture):p.detachEvent?p.detachEvent(_s(g),E):p.addListener&&p.removeListener&&p.removeListener(E),(g=vs(p))?(Z(g,l),g.h==0&&(g.src=null,p[Ie]=null)):te(l)}}}function _s(l){return l in Se?Se[l]:Se[l]="on"+l}function ol(l,p){if(l.da)l=!0;else{p=new ye(p,this);const g=l.listener,E=l.ha||l.src;l.fa&&xr(l),l=g.call(E,p)}return l}function vs(l){return l=l[Ie],l instanceof B?l:null}var Ci="__closure_events_fn_"+(Math.random()*1e9>>>0);function Do(l){return typeof l=="function"?l:(l[Ci]||(l[Ci]=function(p){return l.handleEvent(p)}),l[Ci])}function ct(){V.call(this),this.i=new B(this),this.M=this,this.G=null}A(ct,V),ct.prototype[Je]=!0,ct.prototype.removeEventListener=function(l,p,g,E){No(this,l,p,g,E)};function st(l,p){var g,E=l.G;if(E)for(g=[];E;E=E.G)g.push(E);if(l=l.M,E=p.type||p,typeof p=="string")p=new P(p,l);else if(p instanceof P)p.target=p.target||l;else{var b=p;p=new P(E,l),Te(p,b)}b=!0;let U,ee;if(g)for(ee=g.length-1;ee>=0;ee--)U=p.g=g[ee],b=_n(U,E,!0,p)&&b;if(U=p.g=l,b=_n(U,E,!0,p)&&b,b=_n(U,E,!1,p)&&b,g)for(ee=0;ee<g.length;ee++)U=p.g=g[ee],b=_n(U,E,!1,p)&&b}ct.prototype.N=function(){if(ct.Z.N.call(this),this.i){var l=this.i;for(const p in l.g){const g=l.g[p];for(let E=0;E<g.length;E++)te(g[E]);delete l.g[p],l.h--}}this.G=null},ct.prototype.J=function(l,p,g,E){return this.i.add(String(l),p,!1,g,E)},ct.prototype.K=function(l,p,g,E){return this.i.add(String(l),p,!0,g,E)};function _n(l,p,g,E){if(p=l.i.g[String(p)],!p)return!0;p=p.concat();let b=!0;for(let U=0;U<p.length;++U){const ee=p[U];if(ee&&!ee.da&&ee.capture==g){const Ae=ee.listener,ot=ee.ha||ee.src;ee.fa&&Z(l.i,ee),b=Ae.call(ot,E)!==!1&&b}}return b&&!E.defaultPrevented}function Vo(l,p){if(typeof l!="function")if(l&&typeof l.handleEvent=="function")l=v(l.handleEvent,l);else throw Error("Invalid listener argument");return Number(p)>2147483647?-1:h.setTimeout(l,p||0)}function xo(l){l.g=Vo(()=>{l.g=null,l.i&&(l.i=!1,xo(l))},l.l);const p=l.h;l.h=null,l.m.apply(null,p)}class al extends V{constructor(p,g){super(),this.m=p,this.l=g,this.h=null,this.i=!1,this.g=null}j(p){this.h=arguments,this.g?this.i=!0:xo(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Or(l){V.call(this),this.h=l,this.g={}}A(Or,V);var Oo=[];function Es(l){he(l.g,function(p,g){this.g.hasOwnProperty(g)&&xr(p)},l),l.g={}}Or.prototype.N=function(){Or.Z.N.call(this),Es(this)},Or.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Lr=h.JSON.stringify,ll=h.JSON.parse,ki=class{stringify(l){return h.JSON.stringify(l,void 0)}parse(l){return h.JSON.parse(l,void 0)}};function br(){}function ul(){}var Mr={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function ws(){P.call(this,"d")}A(ws,P);function Lo(){P.call(this,"c")}A(Lo,P);var vn={},Ts=null;function Fr(){return Ts=Ts||new ct}vn.Ia="serverreachability";function Is(l){P.call(this,vn.Ia,l)}A(Is,P);function or(l){const p=Fr();st(p,new Is(p))}vn.STAT_EVENT="statevent";function ar(l,p){P.call(this,vn.STAT_EVENT,l),this.stat=p}A(ar,P);function nt(l){const p=Fr();st(p,new ar(p,l))}vn.Ja="timingevent";function bo(l,p){P.call(this,vn.Ja,l),this.size=p}A(bo,P);function Ur(l,p){if(typeof l!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){l()},p)}function jr(){this.g=!0}jr.prototype.ua=function(){this.g=!1};function cl(l,p,g,E,b,U){l.info(function(){if(l.g)if(U){var ee="",Ae=U.split("&");for(let Be=0;Be<Ae.length;Be++){var ot=Ae[Be].split("=");if(ot.length>1){const ht=ot[0];ot=ot[1];const nn=ht.split("_");ee=nn.length>=2&&nn[1]=="type"?ee+(ht+"="+ot+"&"):ee+(ht+"=redacted&")}}}else ee=null;else ee=U;return"XMLHTTP REQ ("+E+") [attempt "+b+"]: "+p+`
`+g+`
`+ee})}function hl(l,p,g,E,b,U,ee){l.info(function(){return"XMLHTTP RESP ("+E+") [ attempt "+b+"]: "+p+`
`+g+`
`+U+" "+ee})}function Ln(l,p,g,E){l.info(function(){return"XMLHTTP TEXT ("+p+"): "+Pi(l,g)+(E?" "+E:"")})}function dl(l,p){l.info(function(){return"TIMEOUT: "+p})}jr.prototype.info=function(){};function Pi(l,p){if(!l.g)return p;if(!p)return null;try{const U=JSON.parse(p);if(U){for(l=0;l<U.length;l++)if(Array.isArray(U[l])){var g=U[l];if(!(g.length<2)){var E=g[1];if(Array.isArray(E)&&!(E.length<1)){var b=E[0];if(b!="noop"&&b!="stop"&&b!="close")for(let ee=1;ee<E.length;ee++)E[ee]=""}}}}return Lr(U)}catch{return p}}var zr={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Br={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},fl;function lr(){}A(lr,br),lr.prototype.g=function(){return new XMLHttpRequest},fl=new lr;function bn(l){return encodeURIComponent(String(l))}function Ss(l){var p=1;l=l.split(":");const g=[];for(;p>0&&l.length;)g.push(l.shift()),p--;return l.length&&g.push(l.join(":")),g}function an(l,p,g,E){this.j=l,this.i=p,this.l=g,this.S=E||1,this.V=new Or(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new pl}function pl(){this.i=null,this.g="",this.h=!1}var ml={},Mo={};function En(l,p,g){l.M=1,l.A=cr(ln(p)),l.u=g,l.R=!0,Fo(l,null)}function Fo(l,p){l.F=Date.now(),Ni(l),l.B=ln(l.A);var g=l.B,E=l.S;Array.isArray(E)||(E=[String(E)]),Ko(g.i,"t",E),l.C=0,g=l.j.L,l.h=new pl,l.g=Al(l.j,g?p:null,!l.u),l.P>0&&(l.O=new al(v(l.Y,l,l.g),l.P)),p=l.V,g=l.g,E=l.ba;var b="readystatechange";Array.isArray(b)||(b&&(Oo[0]=b.toString()),b=Oo);for(let U=0;U<b.length;U++){const ee=Me(g,b[U],E||p.handleEvent,!1,p.h||p);if(!ee)break;p.g[ee.key]=ee}p=l.J?O(l.J):{},l.u?(l.v||(l.v="POST"),p["Content-Type"]="application/x-www-form-urlencoded",l.g.ea(l.B,l.v,l.u,p)):(l.v="GET",l.g.ea(l.B,l.v,null,p)),or(),cl(l.i,l.v,l.B,l.l,l.S,l.u)}an.prototype.ba=function(l){l=l.target;const p=this.O;p&&$n(l)==3?p.j():this.Y(l)},an.prototype.Y=function(l){try{if(l==this.g)e:{const Ae=$n(this.g),ot=this.g.ya(),Be=this.g.ca();if(!(Ae<3)&&(Ae!=3||this.g&&(this.h.h||this.g.la()||Il(this.g)))){this.K||Ae!=4||ot==7||(ot==8||Be<=0?or(3):or(2)),As(this);var p=this.g.ca();this.X=p;var g=gl(this);if(this.o=p==200,hl(this.i,this.v,this.B,this.l,this.S,Ae,p),this.o){if(this.U&&!this.L){t:{if(this.g){var E,b=this.g;if((E=b.g?b.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!I(E)){var U=E;break t}}U=null}if(l=U)Ln(this.i,this.l,l,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Ke(this,l);else{this.o=!1,this.m=3,nt(12),ur(this),Di(this);break e}}if(this.R){l=!0;let ht;for(;!this.K&&this.C<g.length;)if(ht=_l(this,g),ht==Mo){Ae==4&&(this.m=4,nt(14),l=!1),Ln(this.i,this.l,null,"[Incomplete Response]");break}else if(ht==ml){this.m=4,nt(15),Ln(this.i,this.l,g,"[Invalid Chunk]"),l=!1;break}else Ln(this.i,this.l,ht,null),Ke(this,ht);if(yl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ae!=4||g.length!=0||this.h.h||(this.m=1,nt(16),l=!1),this.o=this.o&&l,!l)Ln(this.i,this.l,g,"[Invalid Chunked Response]"),ur(this),Di(this);else if(g.length>0&&!this.W){this.W=!0;var ee=this.j;ee.g==this&&ee.aa&&!ee.P&&(ee.j.info("Great, no buffering proxy detected. Bytes received: "+g.length),ji(ee),ee.P=!0,nt(11))}}else Ln(this.i,this.l,g,null),Ke(this,g);Ae==4&&ur(this),this.o&&!this.K&&(Ae==4?Ls(this.j,this):(this.o=!1,Ni(this)))}else Yo(this.g),p==400&&g.indexOf("Unknown SID")>0?(this.m=3,nt(12)):(this.m=0,nt(13)),ur(this),Di(this)}}}catch{}finally{}};function gl(l){if(!yl(l))return l.g.la();const p=Il(l.g);if(p==="")return"";let g="";const E=p.length,b=$n(l.g)==4;if(!l.h.i){if(typeof TextDecoder>"u")return ur(l),Di(l),"";l.h.i=new h.TextDecoder}for(let U=0;U<E;U++)l.h.h=!0,g+=l.h.i.decode(p[U],{stream:!(b&&U==E-1)});return p.length=0,l.h.g+=g,l.C=0,l.h.g}function yl(l){return l.g?l.v=="GET"&&l.M!=2&&l.j.Aa:!1}function _l(l,p){var g=l.C,E=p.indexOf(`
`,g);return E==-1?Mo:(g=Number(p.substring(g,E)),isNaN(g)?ml:(E+=1,E+g>p.length?Mo:(p=p.slice(E,E+g),l.C=E+g,p)))}an.prototype.cancel=function(){this.K=!0,ur(this)};function Ni(l){l.T=Date.now()+l.H,Uo(l,l.H)}function Uo(l,p){if(l.D!=null)throw Error("WatchDog timer not null");l.D=Ur(v(l.aa,l),p)}function As(l){l.D&&(h.clearTimeout(l.D),l.D=null)}an.prototype.aa=function(){this.D=null;const l=Date.now();l-this.T>=0?(dl(this.i,this.B),this.M!=2&&(or(),nt(17)),ur(this),this.m=2,Di(this)):Uo(this,this.T-l)};function Di(l){l.j.I==0||l.K||Ls(l.j,l)}function ur(l){As(l);var p=l.O;p&&typeof p.dispose=="function"&&p.dispose(),l.O=null,Es(l.V),l.g&&(p=l.g,l.g=null,p.abort(),p.dispose())}function Ke(l,p){try{var g=l.j;if(g.I!=0&&(g.g==l||zo(g.h,l))){if(!l.L&&zo(g.h,l)&&g.I==3){try{var E=g.Ba.g.parse(p)}catch{E=null}if(Array.isArray(E)&&E.length==3){var b=E;if(b[0]==0){e:if(!g.v){if(g.g)if(g.g.F+3e3<l.F)Os(g),en(g);else break e;Wn(g),nt(18)}}else g.xa=b[1],0<g.xa-g.K&&b[2]<37500&&g.F&&g.A==0&&!g.C&&(g.C=Ur(v(g.Va,g),6e3));Vi(g.h)<=1&&g.ta&&(g.ta=void 0)}else tn(g,11)}else if((l.L||g.g==l)&&Os(g),!I(p))for(b=g.Ba.g.parse(p),p=0;p<b.length;p++){let Be=b[p];const ht=Be[0];if(!(ht<=g.K))if(g.K=ht,Be=Be[1],g.I==2)if(Be[0]=="c"){g.M=Be[1],g.ba=Be[2];const nn=Be[3];nn!=null&&(g.ka=nn,g.j.info("VER="+g.ka));const mr=Be[4];mr!=null&&(g.za=mr,g.j.info("SVER="+g.za));const Gn=Be[5];Gn!=null&&typeof Gn=="number"&&Gn>0&&(E=1.5*Gn,g.O=E,g.j.info("backChannelRequestTimeoutMs_="+E)),E=g;const Kn=l.g;if(Kn){const Fs=Kn.g?Kn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Fs){var U=E.h;U.g||Fs.indexOf("spdy")==-1&&Fs.indexOf("quic")==-1&&Fs.indexOf("h2")==-1||(U.j=U.l,U.g=new Set,U.h&&(Cs(U,U.h),U.h=null))}if(E.G){const Zo=Kn.g?Kn.g.getResponseHeader("X-HTTP-Session-Id"):null;Zo&&(E.wa=Zo,je(E.J,E.G,Zo))}}g.I=3,g.l&&g.l.ra(),g.aa&&(g.T=Date.now()-l.F,g.j.info("Handshake RTT: "+g.T+"ms")),E=g;var ee=l;if(E.na=Xo(E,E.L?E.ba:null,E.W),ee.L){xi(E.h,ee);var Ae=ee,ot=E.O;ot&&(Ae.H=ot),Ae.D&&(As(Ae),Ni(Ae)),E.g=ee}else Dt(E);g.i.length>0&&pr(g)}else Be[0]!="stop"&&Be[0]!="close"||tn(g,7);else g.I==3&&(Be[0]=="stop"||Be[0]=="close"?Be[0]=="stop"?tn(g,7):Vs(g):Be[0]!="noop"&&g.l&&g.l.qa(Be),g.A=0)}}or(4)}catch{}}var Rc=class{constructor(l,p){this.g=l,this.map=p}};function Rs(l){this.l=l||10,h.PerformanceNavigationTiming?(l=h.performance.getEntriesByType("navigation"),l=l.length>0&&(l[0].nextHopProtocol=="hq"||l[0].nextHopProtocol=="h2")):l=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=l?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function jo(l){return l.h?!0:l.g?l.g.size>=l.j:!1}function Vi(l){return l.h?1:l.g?l.g.size:0}function zo(l,p){return l.h?l.h==p:l.g?l.g.has(p):!1}function Cs(l,p){l.g?l.g.add(p):l.h=p}function xi(l,p){l.h&&l.h==p?l.h=null:l.g&&l.g.has(p)&&l.g.delete(p)}Rs.prototype.cancel=function(){if(this.i=Jt(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const l of this.g.values())l.cancel();this.g.clear()}};function Jt(l){if(l.h!=null)return l.i.concat(l.h.G);if(l.g!=null&&l.g.size!==0){let p=l.i;for(const g of l.g.values())p=p.concat(g.G);return p}return j(l.i)}var vl=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Xt(l,p){if(l){l=l.split("&");for(let g=0;g<l.length;g++){const E=l[g].indexOf("=");let b,U=null;E>=0?(b=l[g].substring(0,E),U=l[g].substring(E+1)):b=l[g],p(b,U?decodeURIComponent(U.replace(/\+/g," ")):"")}}}function Mn(l){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let p;l instanceof Mn?(this.l=l.l,Oi(this,l.j),this.o=l.o,this.g=l.g,Fn(this,l.u),this.h=l.h,$r(this,Qo(l.i)),this.m=l.m):l&&(p=String(l).match(vl))?(this.l=!1,Oi(this,p[1]||"",!0),this.o=Li(p[2]||""),this.g=Li(p[3]||"",!0),Fn(this,p[4]),this.h=Li(p[5]||"",!0),$r(this,p[6]||"",!0),this.m=Li(p[7]||"")):(this.l=!1,this.i=new xe(null,this.l))}Mn.prototype.toString=function(){const l=[];var p=this.j;p&&l.push(bi(p,$o,!0),":");var g=this.g;return(g||p=="file")&&(l.push("//"),(p=this.o)&&l.push(bi(p,$o,!0),"@"),l.push(bn(g).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),g=this.u,g!=null&&l.push(":",String(g))),(g=this.h)&&(this.g&&g.charAt(0)!="/"&&l.push("/"),l.push(bi(g,g.charAt(0)=="/"?Mi:qo,!0))),(g=this.i.toString())&&l.push("?",g),(g=this.m)&&l.push("#",bi(g,Ho)),l.join("")},Mn.prototype.resolve=function(l){const p=ln(this);let g=!!l.j;g?Oi(p,l.j):g=!!l.o,g?p.o=l.o:g=!!l.g,g?p.g=l.g:g=l.u!=null;var E=l.h;if(g)Fn(p,l.u);else if(g=!!l.h){if(E.charAt(0)!="/")if(this.g&&!this.h)E="/"+E;else{var b=p.h.lastIndexOf("/");b!=-1&&(E=p.h.slice(0,b+1)+E)}if(b=E,b==".."||b==".")E="";else if(b.indexOf("./")!=-1||b.indexOf("/.")!=-1){E=b.lastIndexOf("/",0)==0,b=b.split("/");const U=[];for(let ee=0;ee<b.length;){const Ae=b[ee++];Ae=="."?E&&ee==b.length&&U.push(""):Ae==".."?((U.length>1||U.length==1&&U[0]!="")&&U.pop(),E&&ee==b.length&&U.push("")):(U.push(Ae),E=!0)}E=U.join("/")}else E=b}return g?p.h=E:g=l.i.toString()!=="",g?$r(p,Qo(l.i)):g=!!l.m,g&&(p.m=l.m),p};function ln(l){return new Mn(l)}function Oi(l,p,g){l.j=g?Li(p,!0):p,l.j&&(l.j=l.j.replace(/:$/,""))}function Fn(l,p){if(p){if(p=Number(p),isNaN(p)||p<0)throw Error("Bad port number "+p);l.u=p}else l.u=null}function $r(l,p,g){p instanceof xe?(l.i=p,Ps(l.i,l.l)):(g||(p=bi(p,Cc)),l.i=new xe(p,l.l))}function je(l,p,g){l.i.set(p,g)}function cr(l){return je(l,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),l}function Li(l,p){return l?p?decodeURI(l.replace(/%25/g,"%2525")):decodeURIComponent(l):""}function bi(l,p,g){return typeof l=="string"?(l=encodeURI(l).replace(p,Bo),g&&(l=l.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l):null}function Bo(l){return l=l.charCodeAt(0),"%"+(l>>4&15).toString(16)+(l&15).toString(16)}var $o=/[#\/\?@]/g,qo=/[#\?:]/g,Mi=/[#\?]/g,Cc=/[#\?@]/g,Ho=/#/g;function xe(l,p){this.h=this.g=null,this.i=l||null,this.j=!!p}function Un(l){l.g||(l.g=new Map,l.h=0,l.i&&Xt(l.i,function(p,g){l.add(decodeURIComponent(p.replace(/\+/g," ")),g)}))}r=xe.prototype,r.add=function(l,p){Un(this),this.i=null,l=jn(this,l);let g=this.g.get(l);return g||this.g.set(l,g=[]),g.push(p),this.h+=1,this};function Wo(l,p){Un(l),p=jn(l,p),l.g.has(p)&&(l.i=null,l.h-=l.g.get(p).length,l.g.delete(p))}function ks(l,p){return Un(l),p=jn(l,p),l.g.has(p)}r.forEach=function(l,p){Un(this),this.g.forEach(function(g,E){g.forEach(function(b){l.call(p,b,E,this)},this)},this)};function Go(l,p){Un(l);let g=[];if(typeof p=="string")ks(l,p)&&(g=g.concat(l.g.get(jn(l,p))));else for(l=Array.from(l.g.values()),p=0;p<l.length;p++)g=g.concat(l[p]);return g}r.set=function(l,p){return Un(this),this.i=null,l=jn(this,l),ks(this,l)&&(this.h-=this.g.get(l).length),this.g.set(l,[p]),this.h+=1,this},r.get=function(l,p){return l?(l=Go(this,l),l.length>0?String(l[0]):p):p};function Ko(l,p,g){Wo(l,p),g.length>0&&(l.i=null,l.g.set(jn(l,p),j(g)),l.h+=g.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const l=[],p=Array.from(this.g.keys());for(let E=0;E<p.length;E++){var g=p[E];const b=bn(g);g=Go(this,g);for(let U=0;U<g.length;U++){let ee=b;g[U]!==""&&(ee+="="+bn(g[U])),l.push(ee)}}return this.i=l.join("&")};function Qo(l){const p=new xe;return p.i=l.i,l.g&&(p.g=new Map(l.g),p.h=l.h),p}function jn(l,p){return p=String(p),l.j&&(p=p.toLowerCase()),p}function Ps(l,p){p&&!l.j&&(Un(l),l.i=null,l.g.forEach(function(g,E){const b=E.toLowerCase();E!=b&&(Wo(this,E),Ko(this,b,g))},l)),l.j=p}function zn(l,p){const g=new jr;if(h.Image){const E=new Image;E.onload=w(St,g,"TestLoadImage: loaded",!0,p,E),E.onerror=w(St,g,"TestLoadImage: error",!1,p,E),E.onabort=w(St,g,"TestLoadImage: abort",!1,p,E),E.ontimeout=w(St,g,"TestLoadImage: timeout",!1,p,E),h.setTimeout(function(){E.ontimeout&&E.ontimeout()},1e4),E.src=l}else p(!1)}function Bn(l,p){const g=new jr,E=new AbortController,b=setTimeout(()=>{E.abort(),St(g,"TestPingServer: timeout",!1,p)},1e4);fetch(l,{signal:E.signal}).then(U=>{clearTimeout(b),U.ok?St(g,"TestPingServer: ok",!0,p):St(g,"TestPingServer: server error",!1,p)}).catch(()=>{clearTimeout(b),St(g,"TestPingServer: error",!1,p)})}function St(l,p,g,E,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),E(g)}catch{}}function Fi(){this.g=new ki}function hr(l){this.i=l.Sb||null,this.h=l.ab||!1}A(hr,br),hr.prototype.g=function(){return new Zt(this.i,this.h)};function Zt(l,p){ct.call(this),this.H=l,this.o=p,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}A(Zt,ct),r=Zt.prototype,r.open=function(l,p){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=l,this.D=p,this.readyState=1,wn(this)},r.send=function(l){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const p={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};l&&(p.body=l),(this.H||h).fetch(new Request(this.D,p)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,qr(this)),this.readyState=0},r.Pa=function(l){if(this.g&&(this.l=l,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=l.headers,this.readyState=2,wn(this)),this.g&&(this.readyState=3,wn(this),this.g)))if(this.responseType==="arraybuffer")l.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in l){if(this.j=l.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;El(this)}else l.text().then(this.Oa.bind(this),this.ga.bind(this))};function El(l){l.j.read().then(l.Ma.bind(l)).catch(l.ga.bind(l))}r.Ma=function(l){if(this.g){if(this.o&&l.value)this.response.push(l.value);else if(!this.o){var p=l.value?l.value:new Uint8Array(0);(p=this.B.decode(p,{stream:!l.done}))&&(this.response=this.responseText+=p)}l.done?qr(this):wn(this),this.readyState==3&&El(this)}},r.Oa=function(l){this.g&&(this.response=this.responseText=l,qr(this))},r.Na=function(l){this.g&&(this.response=l,qr(this))},r.ga=function(){this.g&&qr(this)};function qr(l){l.readyState=4,l.l=null,l.j=null,l.B=null,wn(l)}r.setRequestHeader=function(l,p){this.A.append(l,p)},r.getResponseHeader=function(l){return this.h&&this.h.get(l.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const l=[],p=this.h.entries();for(var g=p.next();!g.done;)g=g.value,l.push(g[0]+": "+g[1]),g=p.next();return l.join(`\r
`)};function wn(l){l.onreadystatechange&&l.onreadystatechange.call(l)}Object.defineProperty(Zt.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(l){this.m=l?"include":"same-origin"}});function wl(l){let p="";return he(l,function(g,E){p+=E,p+=":",p+=g,p+=`\r
`}),p}function Ns(l,p,g){e:{for(E in g){var E=!1;break e}E=!0}E||(g=wl(g),typeof l=="string"?g!=null&&bn(g):je(l,p,g))}function $e(l){ct.call(this),this.headers=new Map,this.L=l||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}A($e,ct);var Tl=/^https?$/i,kc=["POST","PUT"];r=$e.prototype,r.Fa=function(l){this.H=l},r.ea=function(l,p,g,E){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+l);p=p?p.toUpperCase():"GET",this.D=l,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():fl.g(),this.g.onreadystatechange=R(v(this.Ca,this));try{this.B=!0,this.g.open(p,String(l),!0),this.B=!1}catch(U){Hr(this,U);return}if(l=g||"",g=new Map(this.headers),E)if(Object.getPrototypeOf(E)===Object.prototype)for(var b in E)g.set(b,E[b]);else if(typeof E.keys=="function"&&typeof E.get=="function")for(const U of E.keys())g.set(U,E.get(U));else throw Error("Unknown input type for opt_headers: "+String(E));E=Array.from(g.keys()).find(U=>U.toLowerCase()=="content-type"),b=h.FormData&&l instanceof h.FormData,!(Array.prototype.indexOf.call(kc,p,void 0)>=0)||E||b||g.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[U,ee]of g)this.g.setRequestHeader(U,ee);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(l),this.v=!1}catch(U){Hr(this,U)}};function Hr(l,p){l.h=!1,l.g&&(l.j=!0,l.g.abort(),l.j=!1),l.l=p,l.o=5,Wr(l),fr(l)}function Wr(l){l.A||(l.A=!0,st(l,"complete"),st(l,"error"))}r.abort=function(l){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=l||7,st(this,"complete"),st(this,"abort"),fr(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),fr(this,!0)),$e.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?dr(this):this.Xa())},r.Xa=function(){dr(this)};function dr(l){if(l.h&&typeof u<"u"){if(l.v&&$n(l)==4)setTimeout(l.Ca.bind(l),0);else if(st(l,"readystatechange"),$n(l)==4){l.h=!1;try{const U=l.ca();e:switch(U){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var p=!0;break e;default:p=!1}var g;if(!(g=p)){var E;if(E=U===0){let ee=String(l.D).match(vl)[1]||null;!ee&&h.self&&h.self.location&&(ee=h.self.location.protocol.slice(0,-1)),E=!Tl.test(ee?ee.toLowerCase():"")}g=E}if(g)st(l,"complete"),st(l,"success");else{l.o=6;try{var b=$n(l)>2?l.g.statusText:""}catch{b=""}l.l=b+" ["+l.ca()+"]",Wr(l)}}finally{fr(l)}}}}function fr(l,p){if(l.g){l.m&&(clearTimeout(l.m),l.m=null);const g=l.g;l.g=null,p||st(l,"ready");try{g.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function $n(l){return l.g?l.g.readyState:0}r.ca=function(){try{return $n(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(l){if(this.g){var p=this.g.responseText;return l&&p.indexOf(l)==0&&(p=p.substring(l.length)),ll(p)}};function Il(l){try{if(!l.g)return null;if("response"in l.g)return l.g.response;switch(l.F){case"":case"text":return l.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in l.g)return l.g.mozResponseArrayBuffer}return null}catch{return null}}function Yo(l){const p={};l=(l.g&&$n(l)>=2&&l.g.getAllResponseHeaders()||"").split(`\r
`);for(let E=0;E<l.length;E++){if(I(l[E]))continue;var g=Ss(l[E]);const b=g[0];if(g=g[1],typeof g!="string")continue;g=g.trim();const U=p[b]||[];p[b]=U,U.push(g)}ie(p,function(E){return E.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function qn(l,p,g){return g&&g.internalChannelParams&&g.internalChannelParams[l]||p}function Ds(l){this.za=0,this.i=[],this.j=new jr,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=qn("failFast",!1,l),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=qn("baseRetryDelayMs",5e3,l),this.Za=qn("retryDelaySeedMs",1e4,l),this.Ta=qn("forwardChannelMaxRetries",2,l),this.va=qn("forwardChannelRequestTimeoutMs",2e4,l),this.ma=l&&l.xmlHttpFactory||void 0,this.Ua=l&&l.Rb||void 0,this.Aa=l&&l.useFetchStreams||!1,this.O=void 0,this.L=l&&l.supportsCrossDomainXhr||!1,this.M="",this.h=new Rs(l&&l.concurrentRequestLimit),this.Ba=new Fi,this.S=l&&l.fastHandshake||!1,this.R=l&&l.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=l&&l.Pb||!1,l&&l.ua&&this.j.ua(),l&&l.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&l&&l.detectBufferingProxy||!1,this.ia=void 0,l&&l.longPollingTimeout&&l.longPollingTimeout>0&&(this.ia=l.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Ds.prototype,r.ka=8,r.I=1,r.connect=function(l,p,g,E){nt(0),this.W=l,this.H=p||{},g&&E!==void 0&&(this.H.OSID=g,this.H.OAID=E),this.F=this.X,this.J=Xo(this,null,this.W),pr(this)};function Vs(l){if(xs(l),l.I==3){var p=l.V++,g=ln(l.J);if(je(g,"SID",l.M),je(g,"RID",p),je(g,"TYPE","terminate"),Hn(l,g),p=new an(l,l.j,p),p.M=2,p.A=cr(ln(g)),g=!1,h.navigator&&h.navigator.sendBeacon)try{g=h.navigator.sendBeacon(p.A.toString(),"")}catch{}!g&&h.Image&&(new Image().src=p.A,g=!0),g||(p.g=Al(p.j,null),p.g.ea(p.A)),p.F=Date.now(),Ni(p)}zi(l)}function en(l){l.g&&(ji(l),l.g.cancel(),l.g=null)}function xs(l){en(l),l.v&&(h.clearTimeout(l.v),l.v=null),Os(l),l.h.cancel(),l.m&&(typeof l.m=="number"&&h.clearTimeout(l.m),l.m=null)}function pr(l){if(!jo(l.h)&&!l.m){l.m=!0;var p=l.Ea;be||S(),Ve||(be(),Ve=!0),N.add(p,l),l.D=0}}function Sl(l,p){return Vi(l.h)>=l.h.j-(l.m?1:0)?!1:l.m?(l.i=p.G.concat(l.i),!0):l.I==1||l.I==2||l.D>=(l.Sa?0:l.Ta)?!1:(l.m=Ur(v(l.Ea,l,p),bs(l,l.D)),l.D++,!0)}r.Ea=function(l){if(this.m)if(this.m=null,this.I==1){if(!l){this.V=Math.floor(Math.random()*1e5),l=this.V++;const b=new an(this,this.j,l);let U=this.o;if(this.U&&(U?(U=O(U),Te(U,this.U)):U=this.U),this.u!==null||this.R||(b.J=U,U=null),this.S)e:{for(var p=0,g=0;g<this.i.length;g++){t:{var E=this.i[g];if("__data__"in E.map&&(E=E.map.__data__,typeof E=="string")){E=E.length;break t}E=void 0}if(E===void 0)break;if(p+=E,p>4096){p=g;break e}if(p===4096||g===this.i.length-1){p=g+1;break e}}p=1e3}else p=1e3;p=Jo(this,b,p),g=ln(this.J),je(g,"RID",l),je(g,"CVER",22),this.G&&je(g,"X-HTTP-Session-Id",this.G),Hn(this,g),U&&(this.R?p="headers="+bn(wl(U))+"&"+p:this.u&&Ns(g,this.u,U)),Cs(this.h,b),this.Ra&&je(g,"TYPE","init"),this.S?(je(g,"$req",p),je(g,"SID","null"),b.U=!0,En(b,g,null)):En(b,g,p),this.I=2}}else this.I==3&&(l?Ui(this,l):this.i.length==0||jo(this.h)||Ui(this))};function Ui(l,p){var g;p?g=p.l:g=l.V++;const E=ln(l.J);je(E,"SID",l.M),je(E,"RID",g),je(E,"AID",l.K),Hn(l,E),l.u&&l.o&&Ns(E,l.u,l.o),g=new an(l,l.j,g,l.D+1),l.u===null&&(g.J=l.o),p&&(l.i=p.G.concat(l.i)),p=Jo(l,g,1e3),g.H=Math.round(l.va*.5)+Math.round(l.va*.5*Math.random()),Cs(l.h,g),En(g,E,p)}function Hn(l,p){l.H&&he(l.H,function(g,E){je(p,E,g)}),l.l&&he({},function(g,E){je(p,E,g)})}function Jo(l,p,g){g=Math.min(l.i.length,g);const E=l.l?v(l.l.Ka,l.l,l):null;e:{var b=l.i;let Ae=-1;for(;;){const ot=["count="+g];Ae==-1?g>0?(Ae=b[0].g,ot.push("ofs="+Ae)):Ae=0:ot.push("ofs="+Ae);let Be=!0;for(let ht=0;ht<g;ht++){var U=b[ht].g;const nn=b[ht].map;if(U-=Ae,U<0)Ae=Math.max(0,b[ht].g-100),Be=!1;else try{U="req"+U+"_"||"";try{var ee=nn instanceof Map?nn:Object.entries(nn);for(const[mr,Gn]of ee){let Kn=Gn;m(Gn)&&(Kn=Lr(Gn)),ot.push(U+mr+"="+encodeURIComponent(Kn))}}catch(mr){throw ot.push(U+"type="+encodeURIComponent("_badmap")),mr}}catch{E&&E(nn)}}if(Be){ee=ot.join("&");break e}}ee=void 0}return l=l.i.splice(0,g),p.G=l,ee}function Dt(l){if(!l.g&&!l.v){l.Y=1;var p=l.Da;be||S(),Ve||(be(),Ve=!0),N.add(p,l),l.A=0}}function Wn(l){return l.g||l.v||l.A>=3?!1:(l.Y++,l.v=Ur(v(l.Da,l),bs(l,l.A)),l.A++,!0)}r.Da=function(){if(this.v=null,Gr(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var l=4*this.T;this.j.info("BP detection timer enabled: "+l),this.B=Ur(v(this.Wa,this),l)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,nt(10),en(this),Gr(this))};function ji(l){l.B!=null&&(h.clearTimeout(l.B),l.B=null)}function Gr(l){l.g=new an(l,l.j,"rpc",l.Y),l.u===null&&(l.g.J=l.o),l.g.P=0;var p=ln(l.na);je(p,"RID","rpc"),je(p,"SID",l.M),je(p,"AID",l.K),je(p,"CI",l.F?"0":"1"),!l.F&&l.ia&&je(p,"TO",l.ia),je(p,"TYPE","xmlhttp"),Hn(l,p),l.u&&l.o&&Ns(p,l.u,l.o),l.O&&(l.g.H=l.O);var g=l.g;l=l.ba,g.M=1,g.A=cr(ln(p)),g.u=null,g.R=!0,Fo(g,l)}r.Va=function(){this.C!=null&&(this.C=null,en(this),Wn(this),nt(19))};function Os(l){l.C!=null&&(h.clearTimeout(l.C),l.C=null)}function Ls(l,p){var g=null;if(l.g==p){Os(l),ji(l),l.g=null;var E=2}else if(zo(l.h,p))g=p.G,xi(l.h,p),E=1;else return;if(l.I!=0){if(p.o)if(E==1){g=p.u?p.u.length:0,p=Date.now()-p.F;var b=l.D;E=Fr(),st(E,new bo(E,g)),pr(l)}else Dt(l);else if(b=p.m,b==3||b==0&&p.X>0||!(E==1&&Sl(l,p)||E==2&&Wn(l)))switch(g&&g.length>0&&(p=l.h,p.i=p.i.concat(g)),b){case 1:tn(l,5);break;case 4:tn(l,10);break;case 3:tn(l,6);break;default:tn(l,2)}}}function bs(l,p){let g=l.Qa+Math.floor(Math.random()*l.Za);return l.isActive()||(g*=2),g*p}function tn(l,p){if(l.j.info("Error code "+p),p==2){var g=v(l.bb,l),E=l.Ua;const b=!E;E=new Mn(E||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||Oi(E,"https"),cr(E),b?zn(E.toString(),g):Bn(E.toString(),g)}else nt(2);l.I=0,l.l&&l.l.pa(p),zi(l),xs(l)}r.bb=function(l){l?(this.j.info("Successfully pinged google.com"),nt(2)):(this.j.info("Failed to ping google.com"),nt(1))};function zi(l){if(l.I=0,l.ja=[],l.l){const p=Jt(l.h);(p.length!=0||l.i.length!=0)&&(J(l.ja,p),J(l.ja,l.i),l.h.i.length=0,j(l.i),l.i.length=0),l.l.oa()}}function Xo(l,p,g){var E=g instanceof Mn?ln(g):new Mn(g);if(E.g!="")p&&(E.g=p+"."+E.g),Fn(E,E.u);else{var b=h.location;E=b.protocol,p=p?p+"."+b.hostname:b.hostname,b=+b.port;const U=new Mn(null);E&&Oi(U,E),p&&(U.g=p),b&&Fn(U,b),g&&(U.h=g),E=U}return g=l.G,p=l.wa,g&&p&&je(E,g,p),je(E,"VER",l.ka),Hn(l,E),E}function Al(l,p,g){if(p&&!l.L)throw Error("Can't create secondary domain capable XhrIo object.");return p=l.Aa&&!l.ma?new $e(new hr({ab:g})):new $e(l.ma),p.Fa(l.L),p}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Rl(){}r=Rl.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function Ms(){}Ms.prototype.g=function(l,p){return new At(l,p)};function At(l,p){ct.call(this),this.g=new Ds(p),this.l=l,this.h=p&&p.messageUrlParams||null,l=p&&p.messageHeaders||null,p&&p.clientProtocolHeaderRequired&&(l?l["X-Client-Protocol"]="webchannel":l={"X-Client-Protocol":"webchannel"}),this.g.o=l,l=p&&p.initMessageHeaders||null,p&&p.messageContentType&&(l?l["X-WebChannel-Content-Type"]=p.messageContentType:l={"X-WebChannel-Content-Type":p.messageContentType}),p&&p.sa&&(l?l["X-WebChannel-Client-Profile"]=p.sa:l={"X-WebChannel-Client-Profile":p.sa}),this.g.U=l,(l=p&&p.Qb)&&!I(l)&&(this.g.u=l),this.A=p&&p.supportsCrossDomainXhr||!1,this.v=p&&p.sendRawJson||!1,(p=p&&p.httpSessionIdParam)&&!I(p)&&(this.g.G=p,l=this.h,l!==null&&p in l&&(l=this.h,p in l&&delete l[p])),this.j=new Kr(this)}A(At,ct),At.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},At.prototype.close=function(){Vs(this.g)},At.prototype.o=function(l){var p=this.g;if(typeof l=="string"){var g={};g.__data__=l,l=g}else this.v&&(g={},g.__data__=Lr(l),l=g);p.i.push(new Rc(p.Ya++,l)),p.I==3&&pr(p)},At.prototype.N=function(){this.g.l=null,delete this.j,Vs(this.g),delete this.g,At.Z.N.call(this)};function Cl(l){ws.call(this),l.__headers__&&(this.headers=l.__headers__,this.statusCode=l.__status__,delete l.__headers__,delete l.__status__);var p=l.__sm__;if(p){e:{for(const g in p){l=g;break e}l=void 0}(this.i=l)&&(l=this.i,p=p!==null&&l in p?p[l]:void 0),this.data=p}else this.data=l}A(Cl,ws);function kl(){Lo.call(this),this.status=1}A(kl,Lo);function Kr(l){this.g=l}A(Kr,Rl),Kr.prototype.ra=function(){st(this.g,"a")},Kr.prototype.qa=function(l){st(this.g,new Cl(l))},Kr.prototype.pa=function(l){st(this.g,new kl)},Kr.prototype.oa=function(){st(this.g,"b")},Ms.prototype.createWebChannel=Ms.prototype.g,At.prototype.send=At.prototype.o,At.prototype.open=At.prototype.m,At.prototype.close=At.prototype.close,V_=function(){return new Ms},D_=function(){return Fr()},N_=vn,Id={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},zr.NO_ERROR=0,zr.TIMEOUT=8,zr.HTTP_ERROR=6,Ou=zr,Br.COMPLETE="complete",P_=Br,ul.EventType=Mr,Mr.OPEN="a",Mr.CLOSE="b",Mr.ERROR="c",Mr.MESSAGE="d",ct.prototype.listen=ct.prototype.J,Ca=ul,$e.prototype.listenOnce=$e.prototype.K,$e.prototype.getLastError=$e.prototype.Ha,$e.prototype.getLastErrorCode=$e.prototype.ya,$e.prototype.getStatus=$e.prototype.ca,$e.prototype.getResponseJson=$e.prototype.La,$e.prototype.getResponseText=$e.prototype.la,$e.prototype.send=$e.prototype.ea,$e.prototype.setWithCredentials=$e.prototype.Fa,k_=$e}).apply(typeof Iu<"u"?Iu:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Mt.UNAUTHENTICATED=new Mt(null),Mt.GOOGLE_CREDENTIALS=new Mt("google-credentials-uid"),Mt.FIRST_PARTY=new Mt("first-party-uid"),Mt.MOCK_USER=new Mt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ao="12.9.0";function u1(r){Ao=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cs=new zd("@firebase/firestore");function so(){return cs.logLevel}function se(r,...e){if(cs.logLevel<=Pe.DEBUG){const t=e.map(ef);cs.debug(`Firestore (${Ao}): ${r}`,...t)}}function Nr(r,...e){if(cs.logLevel<=Pe.ERROR){const t=e.map(ef);cs.error(`Firestore (${Ao}): ${r}`,...t)}}function hs(r,...e){if(cs.logLevel<=Pe.WARN){const t=e.map(ef);cs.warn(`Firestore (${Ao}): ${r}`,...t)}}function ef(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function me(r,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,x_(r,s,t)}function x_(r,e,t){let s=`FIRESTORE (${Ao}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw Nr(s),new Error(s)}function ze(r,e,t,s){let o="Unexpected state";typeof t=="string"?o=t:s=t,r||x_(e,o,s)}function Re(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ne extends Vr{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cr{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O_{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class c1{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Mt.UNAUTHENTICATED)))}shutdown(){}}class h1{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class d1{constructor(e){this.t=e,this.currentUser=Mt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ze(this.o===void 0,42304);let s=this.i;const o=y=>this.i!==s?(s=this.i,t(y)):Promise.resolve();let u=new Cr;this.o=()=>{this.i++,this.currentUser=this.u(),u.resolve(),u=new Cr,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const y=u;e.enqueueRetryable((async()=>{await y.promise,await o(this.currentUser)}))},m=y=>{se("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=y,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((y=>m(y))),setTimeout((()=>{if(!this.auth){const y=this.t.getImmediate({optional:!0});y?m(y):(se("FirebaseAuthCredentialsProvider","Auth not yet detected"),u.resolve(),u=new Cr)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(se("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(ze(typeof s.accessToken=="string",31837,{l:s}),new O_(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ze(e===null||typeof e=="string",2055,{h:e}),new Mt(e)}}class f1{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Mt.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class p1{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new f1(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Mt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Vg{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class m1{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,kn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){ze(this.o===void 0,3512);const s=u=>{u.error!=null&&se("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${u.error.message}`);const h=u.token!==this.m;return this.m=u.token,se("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(u.token):Promise.resolve()};this.o=u=>{e.enqueueRetryable((()=>s(u)))};const o=u=>{se("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=u,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((u=>o(u))),setTimeout((()=>{if(!this.appCheck){const u=this.V.getImmediate({optional:!0});u?o(u):se("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Vg(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(ze(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Vg(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g1(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<r;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const o=g1(40);for(let u=0;u<o.length;++u)s.length<20&&o[u]<t&&(s+=e.charAt(o[u]%62))}return s}}function Ne(r,e){return r<e?-1:r>e?1:0}function Sd(r,e){const t=Math.min(r.length,e.length);for(let s=0;s<t;s++){const o=r.charAt(s),u=e.charAt(s);if(o!==u)return ad(o)===ad(u)?Ne(o,u):ad(o)?1:-1}return Ne(r.length,e.length)}const y1=55296,_1=57343;function ad(r){const e=r.charCodeAt(0);return e>=y1&&e<=_1}function yo(r,e,t){return r.length===e.length&&r.every(((s,o)=>t(s,e[o])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xg="__name__";class Zn{constructor(e,t,s){t===void 0?t=0:t>e.length&&me(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&me(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Zn.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Zn?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let o=0;o<s;o++){const u=Zn.compareSegments(e.get(o),t.get(o));if(u!==0)return u}return Ne(e.length,t.length)}static compareSegments(e,t){const s=Zn.isNumericId(e),o=Zn.isNumericId(t);return s&&!o?-1:!s&&o?1:s&&o?Zn.extractNumericId(e).compare(Zn.extractNumericId(t)):Sd(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return yi.fromString(e.substring(4,e.length-2))}}class We extends Zn{construct(e,t,s){return new We(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new ne($.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((o=>o.length>0)))}return new We(t)}static emptyPath(){return new We([])}}const v1=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Pt extends Zn{construct(e,t,s){return new Pt(e,t,s)}static isValidIdentifier(e){return v1.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Pt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===xg}static keyField(){return new Pt([xg])}static fromServerFormat(e){const t=[];let s="",o=0;const u=()=>{if(s.length===0)throw new ne($.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let h=!1;for(;o<e.length;){const m=e[o];if(m==="\\"){if(o+1===e.length)throw new ne($.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const y=e[o+1];if(y!=="\\"&&y!=="."&&y!=="`")throw new ne($.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=y,o+=2}else m==="`"?(h=!h,o++):m!=="."||h?(s+=m,o++):(u(),o++)}if(u(),h)throw new ne($.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Pt(t)}static emptyPath(){return new Pt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(e){this.path=e}static fromPath(e){return new de(We.fromString(e))}static fromName(e){return new de(We.fromString(e).popFirst(5))}static empty(){return new de(We.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&We.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return We.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new de(new We(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L_(r,e,t){if(!t)throw new ne($.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function E1(r,e,t,s){if(e===!0&&s===!0)throw new ne($.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Og(r){if(!de.isDocumentKey(r))throw new ne($.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Lg(r){if(de.isDocumentKey(r))throw new ne($.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function b_(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function cc(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":me(12329,{type:typeof r})}function yn(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new ne($.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=cc(r);throw new ne($.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mt(r,e){const t={typeString:r};return e&&(t.value=e),t}function el(r,e){if(!b_(r))throw new ne($.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const o=e[s].typeString,u="value"in e[s]?{value:e[s].value}:void 0;if(!(s in r)){t=`JSON missing required field: '${s}'`;break}const h=r[s];if(o&&typeof h!==o){t=`JSON field '${s}' must be a ${o}.`;break}if(u!==void 0&&h!==u.value){t=`Expected '${s}' field to equal '${u.value}'`;break}}if(t)throw new ne($.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bg=-62135596800,Mg=1e6;class Ge{static now(){return Ge.fromMillis(Date.now())}static fromDate(e){return Ge.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*Mg);return new Ge(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new ne($.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new ne($.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<bg)throw new ne($.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new ne($.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Mg}_compareTo(e){return this.seconds===e.seconds?Ne(this.nanoseconds,e.nanoseconds):Ne(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ge._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(el(e,Ge._jsonSchema))return new Ge(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-bg;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ge._jsonSchemaVersion="firestore/timestamp/1.0",Ge._jsonSchema={type:mt("string",Ge._jsonSchemaVersion),seconds:mt("number"),nanoseconds:mt("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{static fromTimestamp(e){return new we(e)}static min(){return new we(new Ge(0,0))}static max(){return new we(new Ge(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const za=-1;function w1(r,e){const t=r.toTimestamp().seconds,s=r.toTimestamp().nanoseconds+1,o=we.fromTimestamp(s===1e9?new Ge(t+1,0):new Ge(t,s));return new vi(o,de.empty(),e)}function T1(r){return new vi(r.readTime,r.key,za)}class vi{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new vi(we.min(),de.empty(),za)}static max(){return new vi(we.max(),de.empty(),za)}}function I1(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=de.comparator(r.documentKey,e.documentKey),t!==0?t:Ne(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S1="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class A1{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ro(r){if(r.code!==$.FAILED_PRECONDITION||r.message!==S1)throw r;se("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&me(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new q(((s,o)=>{this.nextCallback=u=>{this.wrapSuccess(e,u).next(s,o)},this.catchCallback=u=>{this.wrapFailure(t,u).next(s,o)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof q?t:q.resolve(t)}catch(t){return q.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):q.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):q.reject(t)}static resolve(e){return new q(((t,s)=>{t(e)}))}static reject(e){return new q(((t,s)=>{s(e)}))}static waitFor(e){return new q(((t,s)=>{let o=0,u=0,h=!1;e.forEach((m=>{++o,m.next((()=>{++u,h&&u===o&&t()}),(y=>s(y)))})),h=!0,u===o&&t()}))}static or(e){let t=q.resolve(!1);for(const s of e)t=t.next((o=>o?q.resolve(o):s()));return t}static forEach(e,t){const s=[];return e.forEach(((o,u)=>{s.push(t.call(this,o,u))})),this.waitFor(s)}static mapArray(e,t){return new q(((s,o)=>{const u=e.length,h=new Array(u);let m=0;for(let y=0;y<u;y++){const v=y;t(e[v]).next((w=>{h[v]=w,++m,m===u&&s(h)}),(w=>o(w)))}}))}static doWhile(e,t){return new q(((s,o)=>{const u=()=>{e()===!0?t().next((()=>{u()}),o):s()};u()}))}}function R1(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Co(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ae(s),this.ue=s=>t.writeSequenceNumber(s))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}hc.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nf=-1;function dc(r){return r==null}function Qu(r){return r===0&&1/r==-1/0}function C1(r){return typeof r=="number"&&Number.isInteger(r)&&!Qu(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M_="";function k1(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Fg(e)),e=P1(r.get(t),e);return Fg(e)}function P1(r,e){let t=e;const s=r.length;for(let o=0;o<s;o++){const u=r.charAt(o);switch(u){case"\0":t+="";break;case M_:t+="";break;default:t+=u}}return t}function Fg(r){return r+M_+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ug(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function fs(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function F_(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e,t){this.comparator=e,this.root=t||kt.EMPTY}insert(e,t){return new tt(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,kt.BLACK,null,null))}remove(e){return new tt(this.comparator,this.root.remove(e,this.comparator).copy(null,null,kt.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const o=this.comparator(e,s.key);if(o===0)return t+s.left.size;o<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Su(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Su(this.root,e,this.comparator,!1)}getReverseIterator(){return new Su(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Su(this.root,e,this.comparator,!0)}}class Su{constructor(e,t,s,o){this.isReverse=o,this.nodeStack=[];let u=1;for(;!e.isEmpty();)if(u=t?s(e.key,t):1,t&&o&&(u*=-1),u<0)e=this.isReverse?e.left:e.right;else{if(u===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class kt{constructor(e,t,s,o,u){this.key=e,this.value=t,this.color=s??kt.RED,this.left=o??kt.EMPTY,this.right=u??kt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,o,u){return new kt(e??this.key,t??this.value,s??this.color,o??this.left,u??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let o=this;const u=s(e,o.key);return o=u<0?o.copy(null,null,null,o.left.insert(e,t,s),null):u===0?o.copy(null,t,null,null,null):o.copy(null,null,null,null,o.right.insert(e,t,s)),o.fixUp()}removeMin(){if(this.left.isEmpty())return kt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,o=this;if(t(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,t),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),t(e,o.key)===0){if(o.right.isEmpty())return kt.EMPTY;s=o.right.min(),o=o.copy(s.key,s.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,t))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,kt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,kt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw me(43730,{key:this.key,value:this.value});if(this.right.isRed())throw me(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw me(27949);return e+(this.isRed()?0:1)}}kt.EMPTY=null,kt.RED=!0,kt.BLACK=!1;kt.EMPTY=new class{constructor(){this.size=0}get key(){throw me(57766)}get value(){throw me(16141)}get color(){throw me(16727)}get left(){throw me(29726)}get right(){throw me(36894)}copy(e,t,s,o,u){return this}insert(e,t,s){return new kt(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(e){this.comparator=e,this.data=new tt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const o=s.getNext();if(this.comparator(o.key,e[1])>=0)return;t(o.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new jg(this.data.getIterator())}getIteratorFrom(e){return new jg(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof vt)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const o=t.getNext().key,u=s.getNext().key;if(this.comparator(o,u)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new vt(this.comparator);return t.data=e,t}}class jg{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e){this.fields=e,e.sort(Pt.comparator)}static empty(){return new Nn([])}unionWith(e){let t=new vt(Pt.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new Nn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return yo(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_ extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(u){throw typeof DOMException<"u"&&u instanceof DOMException?new U_("Invalid base64 string: "+u):u}})(e);return new Nt(t)}static fromUint8Array(e){const t=(function(o){let u="";for(let h=0;h<o.length;++h)u+=String.fromCharCode(o[h]);return u})(e);return new Nt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let o=0;o<t.length;o++)s[o]=t.charCodeAt(o);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Ne(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Nt.EMPTY_BYTE_STRING=new Nt("");const N1=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ei(r){if(ze(!!r,39018),typeof r=="string"){let e=0;const t=N1.exec(r);if(ze(!!t,46558,{timestamp:r}),t[1]){let o=t[1];o=(o+"000000000").substr(0,9),e=Number(o)}const s=new Date(r);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:lt(r.seconds),nanos:lt(r.nanos)}}function lt(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function wi(r){return typeof r=="string"?Nt.fromBase64String(r):Nt.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j_="server_timestamp",z_="__type__",B_="__previous_value__",$_="__local_write_time__";function rf(r){var t,s;return((s=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[z_])==null?void 0:s.stringValue)===j_}function fc(r){const e=r.mapValue.fields[B_];return rf(e)?fc(e):e}function Ba(r){const e=Ei(r.mapValue.fields[$_].timestampValue);return new Ge(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D1{constructor(e,t,s,o,u,h,m,y,v,w,A){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=o,this.ssl=u,this.forceLongPolling=h,this.autoDetectLongPolling=m,this.longPollingOptions=y,this.useFetchStreams=v,this.isUsingEmulator=w,this.apiKey=A}}const Yu="(default)";class $a{constructor(e,t){this.projectId=e,this.database=t||Yu}static empty(){return new $a("","")}get isDefaultDatabase(){return this.database===Yu}isEqual(e){return e instanceof $a&&e.projectId===this.projectId&&e.database===this.database}}function V1(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new ne($.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new $a(r.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q_="__type__",x1="__max__",Au={mapValue:{}},H_="__vector__",Ju="value";function Ti(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?rf(r)?4:L1(r)?9007199254740991:O1(r)?10:11:me(28295,{value:r})}function sr(r,e){if(r===e)return!0;const t=Ti(r);if(t!==Ti(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Ba(r).isEqual(Ba(e));case 3:return(function(o,u){if(typeof o.timestampValue=="string"&&typeof u.timestampValue=="string"&&o.timestampValue.length===u.timestampValue.length)return o.timestampValue===u.timestampValue;const h=Ei(o.timestampValue),m=Ei(u.timestampValue);return h.seconds===m.seconds&&h.nanos===m.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(o,u){return wi(o.bytesValue).isEqual(wi(u.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(o,u){return lt(o.geoPointValue.latitude)===lt(u.geoPointValue.latitude)&&lt(o.geoPointValue.longitude)===lt(u.geoPointValue.longitude)})(r,e);case 2:return(function(o,u){if("integerValue"in o&&"integerValue"in u)return lt(o.integerValue)===lt(u.integerValue);if("doubleValue"in o&&"doubleValue"in u){const h=lt(o.doubleValue),m=lt(u.doubleValue);return h===m?Qu(h)===Qu(m):isNaN(h)&&isNaN(m)}return!1})(r,e);case 9:return yo(r.arrayValue.values||[],e.arrayValue.values||[],sr);case 10:case 11:return(function(o,u){const h=o.mapValue.fields||{},m=u.mapValue.fields||{};if(Ug(h)!==Ug(m))return!1;for(const y in h)if(h.hasOwnProperty(y)&&(m[y]===void 0||!sr(h[y],m[y])))return!1;return!0})(r,e);default:return me(52216,{left:r})}}function qa(r,e){return(r.values||[]).find((t=>sr(t,e)))!==void 0}function _o(r,e){if(r===e)return 0;const t=Ti(r),s=Ti(e);if(t!==s)return Ne(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return Ne(r.booleanValue,e.booleanValue);case 2:return(function(u,h){const m=lt(u.integerValue||u.doubleValue),y=lt(h.integerValue||h.doubleValue);return m<y?-1:m>y?1:m===y?0:isNaN(m)?isNaN(y)?0:-1:1})(r,e);case 3:return zg(r.timestampValue,e.timestampValue);case 4:return zg(Ba(r),Ba(e));case 5:return Sd(r.stringValue,e.stringValue);case 6:return(function(u,h){const m=wi(u),y=wi(h);return m.compareTo(y)})(r.bytesValue,e.bytesValue);case 7:return(function(u,h){const m=u.split("/"),y=h.split("/");for(let v=0;v<m.length&&v<y.length;v++){const w=Ne(m[v],y[v]);if(w!==0)return w}return Ne(m.length,y.length)})(r.referenceValue,e.referenceValue);case 8:return(function(u,h){const m=Ne(lt(u.latitude),lt(h.latitude));return m!==0?m:Ne(lt(u.longitude),lt(h.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return Bg(r.arrayValue,e.arrayValue);case 10:return(function(u,h){var R,j,J,X;const m=u.fields||{},y=h.fields||{},v=(R=m[Ju])==null?void 0:R.arrayValue,w=(j=y[Ju])==null?void 0:j.arrayValue,A=Ne(((J=v==null?void 0:v.values)==null?void 0:J.length)||0,((X=w==null?void 0:w.values)==null?void 0:X.length)||0);return A!==0?A:Bg(v,w)})(r.mapValue,e.mapValue);case 11:return(function(u,h){if(u===Au.mapValue&&h===Au.mapValue)return 0;if(u===Au.mapValue)return 1;if(h===Au.mapValue)return-1;const m=u.fields||{},y=Object.keys(m),v=h.fields||{},w=Object.keys(v);y.sort(),w.sort();for(let A=0;A<y.length&&A<w.length;++A){const R=Sd(y[A],w[A]);if(R!==0)return R;const j=_o(m[y[A]],v[w[A]]);if(j!==0)return j}return Ne(y.length,w.length)})(r.mapValue,e.mapValue);default:throw me(23264,{he:t})}}function zg(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return Ne(r,e);const t=Ei(r),s=Ei(e),o=Ne(t.seconds,s.seconds);return o!==0?o:Ne(t.nanos,s.nanos)}function Bg(r,e){const t=r.values||[],s=e.values||[];for(let o=0;o<t.length&&o<s.length;++o){const u=_o(t[o],s[o]);if(u)return u}return Ne(t.length,s.length)}function vo(r){return Ad(r)}function Ad(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const s=Ei(t);return`time(${s.seconds},${s.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return wi(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return de.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let s="[",o=!0;for(const u of t.values||[])o?o=!1:s+=",",s+=Ad(u);return s+"]"})(r.arrayValue):"mapValue"in r?(function(t){const s=Object.keys(t.fields||{}).sort();let o="{",u=!0;for(const h of s)u?u=!1:o+=",",o+=`${h}:${Ad(t.fields[h])}`;return o+"}"})(r.mapValue):me(61005,{value:r})}function Lu(r){switch(Ti(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=fc(r);return e?16+Lu(e):16;case 5:return 2*r.stringValue.length;case 6:return wi(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((o,u)=>o+Lu(u)),0)})(r.arrayValue);case 10:case 11:return(function(s){let o=0;return fs(s.fields,((u,h)=>{o+=u.length+Lu(h)})),o})(r.mapValue);default:throw me(13486,{value:r})}}function $g(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Rd(r){return!!r&&"integerValue"in r}function sf(r){return!!r&&"arrayValue"in r}function qg(r){return!!r&&"nullValue"in r}function Hg(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function bu(r){return!!r&&"mapValue"in r}function O1(r){var t,s;return((s=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[q_])==null?void 0:s.stringValue)===H_}function xa(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return fs(r.mapValue.fields,((t,s)=>e.mapValue.fields[t]=xa(s))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=xa(r.arrayValue.values[t]);return e}return{...r}}function L1(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===x1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{constructor(e){this.value=e}static empty(){return new mn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!bu(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=xa(t)}setAll(e){let t=Pt.emptyPath(),s={},o=[];e.forEach(((h,m)=>{if(!t.isImmediateParentOf(m)){const y=this.getFieldsMap(t);this.applyChanges(y,s,o),s={},o=[],t=m.popLast()}h?s[m.lastSegment()]=xa(h):o.push(m.lastSegment())}));const u=this.getFieldsMap(t);this.applyChanges(u,s,o)}delete(e){const t=this.field(e.popLast());bu(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return sr(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let o=t.mapValue.fields[e.get(s)];bu(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=o),t=o}return t.mapValue.fields}applyChanges(e,t,s){fs(t,((o,u)=>e[o]=u));for(const o of s)delete e[o]}clone(){return new mn(xa(this.value))}}function W_(r){const e=[];return fs(r.fields,((t,s)=>{const o=new Pt([t]);if(bu(s)){const u=W_(s.mapValue).fields;if(u.length===0)e.push(o);else for(const h of u)e.push(o.child(h))}else e.push(o)})),new Nn(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(e,t,s,o,u,h,m){this.key=e,this.documentType=t,this.version=s,this.readTime=o,this.createTime=u,this.data=h,this.documentState=m}static newInvalidDocument(e){return new Ft(e,0,we.min(),we.min(),we.min(),mn.empty(),0)}static newFoundDocument(e,t,s,o){return new Ft(e,1,t,we.min(),s,o,0)}static newNoDocument(e,t){return new Ft(e,2,t,we.min(),we.min(),mn.empty(),0)}static newUnknownDocument(e,t){return new Ft(e,3,t,we.min(),we.min(),mn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(we.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=mn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=mn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=we.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ft&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ft(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xu{constructor(e,t){this.position=e,this.inclusive=t}}function Wg(r,e,t){let s=0;for(let o=0;o<r.position.length;o++){const u=e[o],h=r.position[o];if(u.field.isKeyField()?s=de.comparator(de.fromName(h.referenceValue),t.key):s=_o(h,t.data.field(u.field)),u.dir==="desc"&&(s*=-1),s!==0)break}return s}function Gg(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!sr(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ha{constructor(e,t="asc"){this.field=e,this.dir=t}}function b1(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G_{}class pt extends G_{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new F1(e,t,s):t==="array-contains"?new z1(e,s):t==="in"?new B1(e,s):t==="not-in"?new $1(e,s):t==="array-contains-any"?new q1(e,s):new pt(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new U1(e,s):new j1(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(_o(t,this.value)):t!==null&&Ti(this.value)===Ti(t)&&this.matchesComparison(_o(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return me(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class On extends G_{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new On(e,t)}matches(e){return K_(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function K_(r){return r.op==="and"}function Q_(r){return M1(r)&&K_(r)}function M1(r){for(const e of r.filters)if(e instanceof On)return!1;return!0}function Cd(r){if(r instanceof pt)return r.field.canonicalString()+r.op.toString()+vo(r.value);if(Q_(r))return r.filters.map((e=>Cd(e))).join(",");{const e=r.filters.map((t=>Cd(t))).join(",");return`${r.op}(${e})`}}function Y_(r,e){return r instanceof pt?(function(s,o){return o instanceof pt&&s.op===o.op&&s.field.isEqual(o.field)&&sr(s.value,o.value)})(r,e):r instanceof On?(function(s,o){return o instanceof On&&s.op===o.op&&s.filters.length===o.filters.length?s.filters.reduce(((u,h,m)=>u&&Y_(h,o.filters[m])),!0):!1})(r,e):void me(19439)}function J_(r){return r instanceof pt?(function(t){return`${t.field.canonicalString()} ${t.op} ${vo(t.value)}`})(r):r instanceof On?(function(t){return t.op.toString()+" {"+t.getFilters().map(J_).join(" ,")+"}"})(r):"Filter"}class F1 extends pt{constructor(e,t,s){super(e,t,s),this.key=de.fromName(s.referenceValue)}matches(e){const t=de.comparator(e.key,this.key);return this.matchesComparison(t)}}class U1 extends pt{constructor(e,t){super(e,"in",t),this.keys=X_("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class j1 extends pt{constructor(e,t){super(e,"not-in",t),this.keys=X_("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function X_(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((s=>de.fromName(s.referenceValue)))}class z1 extends pt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return sf(t)&&qa(t.arrayValue,this.value)}}class B1 extends pt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&qa(this.value.arrayValue,t)}}class $1 extends pt{constructor(e,t){super(e,"not-in",t)}matches(e){if(qa(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!qa(this.value.arrayValue,t)}}class q1 extends pt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!sf(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>qa(this.value.arrayValue,s)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H1{constructor(e,t=null,s=[],o=[],u=null,h=null,m=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=o,this.limit=u,this.startAt=h,this.endAt=m,this.Te=null}}function Kg(r,e=null,t=[],s=[],o=null,u=null,h=null){return new H1(r,e,t,s,o,u,h)}function of(r){const e=Re(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>Cd(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(u){return u.field.canonicalString()+u.dir})(s))).join(","),dc(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>vo(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>vo(s))).join(",")),e.Te=t}return e.Te}function af(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!b1(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Y_(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Gg(r.startAt,e.startAt)&&Gg(r.endAt,e.endAt)}function kd(r){return de.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ko{constructor(e,t=null,s=[],o=[],u=null,h="F",m=null,y=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=o,this.limit=u,this.limitType=h,this.startAt=m,this.endAt=y,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function W1(r,e,t,s,o,u,h,m){return new ko(r,e,t,s,o,u,h,m)}function pc(r){return new ko(r)}function Qg(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function G1(r){return de.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Z_(r){return r.collectionGroup!==null}function Oa(r){const e=Re(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const u of e.explicitOrderBy)e.Ie.push(u),t.add(u.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(h){let m=new vt(Pt.comparator);return h.filters.forEach((y=>{y.getFlattenedFilters().forEach((v=>{v.isInequality()&&(m=m.add(v.field))}))})),m})(e).forEach((u=>{t.has(u.canonicalString())||u.isKeyField()||e.Ie.push(new Ha(u,s))})),t.has(Pt.keyField().canonicalString())||e.Ie.push(new Ha(Pt.keyField(),s))}return e.Ie}function tr(r){const e=Re(r);return e.Ee||(e.Ee=K1(e,Oa(r))),e.Ee}function K1(r,e){if(r.limitType==="F")return Kg(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((o=>{const u=o.dir==="desc"?"asc":"desc";return new Ha(o.field,u)}));const t=r.endAt?new Xu(r.endAt.position,r.endAt.inclusive):null,s=r.startAt?new Xu(r.startAt.position,r.startAt.inclusive):null;return Kg(r.path,r.collectionGroup,e,r.filters,r.limit,t,s)}}function Pd(r,e){const t=r.filters.concat([e]);return new ko(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function Q1(r,e){const t=r.explicitOrderBy.concat([e]);return new ko(r.path,r.collectionGroup,t,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function Nd(r,e,t){return new ko(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function mc(r,e){return af(tr(r),tr(e))&&r.limitType===e.limitType}function ev(r){return`${of(tr(r))}|lt:${r.limitType}`}function oo(r){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((o=>J_(o))).join(", ")}]`),dc(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((o=>(function(h){return`${h.field.canonicalString()} (${h.dir})`})(o))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((o=>vo(o))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((o=>vo(o))).join(",")),`Target(${s})`})(tr(r))}; limitType=${r.limitType})`}function gc(r,e){return e.isFoundDocument()&&(function(s,o){const u=o.key.path;return s.collectionGroup!==null?o.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(u):de.isDocumentKey(s.path)?s.path.isEqual(u):s.path.isImmediateParentOf(u)})(r,e)&&(function(s,o){for(const u of Oa(s))if(!u.field.isKeyField()&&o.data.field(u.field)===null)return!1;return!0})(r,e)&&(function(s,o){for(const u of s.filters)if(!u.matches(o))return!1;return!0})(r,e)&&(function(s,o){return!(s.startAt&&!(function(h,m,y){const v=Wg(h,m,y);return h.inclusive?v<=0:v<0})(s.startAt,Oa(s),o)||s.endAt&&!(function(h,m,y){const v=Wg(h,m,y);return h.inclusive?v>=0:v>0})(s.endAt,Oa(s),o))})(r,e)}function Y1(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function tv(r){return(e,t)=>{let s=!1;for(const o of Oa(r)){const u=J1(o,e,t);if(u!==0)return u;s=s||o.field.isKeyField()}return 0}}function J1(r,e,t){const s=r.field.isKeyField()?de.comparator(e.key,t.key):(function(u,h,m){const y=h.data.field(u),v=m.data.field(u);return y!==null&&v!==null?_o(y,v):me(42886)})(r.field,e,t);switch(r.dir){case"asc":return s;case"desc":return-1*s;default:return me(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ps{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[o,u]of s)if(this.equalsFn(o,e))return u}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),o=this.inner[s];if(o===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let u=0;u<o.length;u++)if(this.equalsFn(o[u][0],e))return void(o[u]=[e,t]);o.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return s.length===1?delete this.inner[t]:s.splice(o,1),this.innerSize--,!0;return!1}forEach(e){fs(this.inner,((t,s)=>{for(const[o,u]of s)e(o,u)}))}isEmpty(){return F_(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X1=new tt(de.comparator);function Dr(){return X1}const nv=new tt(de.comparator);function ka(...r){let e=nv;for(const t of r)e=e.insert(t.key,t);return e}function rv(r){let e=nv;return r.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function rs(){return La()}function iv(){return La()}function La(){return new ps((r=>r.toString()),((r,e)=>r.isEqual(e)))}const Z1=new tt(de.comparator),eS=new vt(de.comparator);function De(...r){let e=eS;for(const t of r)e=e.add(t);return e}const tS=new vt(Ne);function nS(){return tS}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lf(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Qu(e)?"-0":e}}function sv(r){return{integerValue:""+r}}function rS(r,e){return C1(e)?sv(e):lf(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yc{constructor(){this._=void 0}}function iS(r,e,t){return r instanceof Wa?(function(o,u){const h={fields:{[z_]:{stringValue:j_},[$_]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return u&&rf(u)&&(u=fc(u)),u&&(h.fields[B_]=u),{mapValue:h}})(t,e):r instanceof Ga?av(r,e):r instanceof Ka?lv(r,e):(function(o,u){const h=ov(o,u),m=Yg(h)+Yg(o.Ae);return Rd(h)&&Rd(o.Ae)?sv(m):lf(o.serializer,m)})(r,e)}function sS(r,e,t){return r instanceof Ga?av(r,e):r instanceof Ka?lv(r,e):t}function ov(r,e){return r instanceof Zu?(function(s){return Rd(s)||(function(u){return!!u&&"doubleValue"in u})(s)})(e)?e:{integerValue:0}:null}class Wa extends yc{}class Ga extends yc{constructor(e){super(),this.elements=e}}function av(r,e){const t=uv(e);for(const s of r.elements)t.some((o=>sr(o,s)))||t.push(s);return{arrayValue:{values:t}}}class Ka extends yc{constructor(e){super(),this.elements=e}}function lv(r,e){let t=uv(e);for(const s of r.elements)t=t.filter((o=>!sr(o,s)));return{arrayValue:{values:t}}}class Zu extends yc{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function Yg(r){return lt(r.integerValue||r.doubleValue)}function uv(r){return sf(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oS{constructor(e,t){this.field=e,this.transform=t}}function aS(r,e){return r.field.isEqual(e.field)&&(function(s,o){return s instanceof Ga&&o instanceof Ga||s instanceof Ka&&o instanceof Ka?yo(s.elements,o.elements,sr):s instanceof Zu&&o instanceof Zu?sr(s.Ae,o.Ae):s instanceof Wa&&o instanceof Wa})(r.transform,e.transform)}class lS{constructor(e,t){this.version=e,this.transformResults=t}}class Vn{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Vn}static exists(e){return new Vn(void 0,e)}static updateTime(e){return new Vn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Mu(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class _c{}function cv(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new uf(r.key,Vn.none()):new tl(r.key,r.data,Vn.none());{const t=r.data,s=mn.empty();let o=new vt(Pt.comparator);for(let u of e.fields)if(!o.has(u)){let h=t.field(u);h===null&&u.length>1&&(u=u.popLast(),h=t.field(u)),h===null?s.delete(u):s.set(u,h),o=o.add(u)}return new ms(r.key,s,new Nn(o.toArray()),Vn.none())}}function uS(r,e,t){r instanceof tl?(function(o,u,h){const m=o.value.clone(),y=Xg(o.fieldTransforms,u,h.transformResults);m.setAll(y),u.convertToFoundDocument(h.version,m).setHasCommittedMutations()})(r,e,t):r instanceof ms?(function(o,u,h){if(!Mu(o.precondition,u))return void u.convertToUnknownDocument(h.version);const m=Xg(o.fieldTransforms,u,h.transformResults),y=u.data;y.setAll(hv(o)),y.setAll(m),u.convertToFoundDocument(h.version,y).setHasCommittedMutations()})(r,e,t):(function(o,u,h){u.convertToNoDocument(h.version).setHasCommittedMutations()})(0,e,t)}function ba(r,e,t,s){return r instanceof tl?(function(u,h,m,y){if(!Mu(u.precondition,h))return m;const v=u.value.clone(),w=Zg(u.fieldTransforms,y,h);return v.setAll(w),h.convertToFoundDocument(h.version,v).setHasLocalMutations(),null})(r,e,t,s):r instanceof ms?(function(u,h,m,y){if(!Mu(u.precondition,h))return m;const v=Zg(u.fieldTransforms,y,h),w=h.data;return w.setAll(hv(u)),w.setAll(v),h.convertToFoundDocument(h.version,w).setHasLocalMutations(),m===null?null:m.unionWith(u.fieldMask.fields).unionWith(u.fieldTransforms.map((A=>A.field)))})(r,e,t,s):(function(u,h,m){return Mu(u.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):m})(r,e,t)}function cS(r,e){let t=null;for(const s of r.fieldTransforms){const o=e.data.field(s.field),u=ov(s.transform,o||null);u!=null&&(t===null&&(t=mn.empty()),t.set(s.field,u))}return t||null}function Jg(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(s,o){return s===void 0&&o===void 0||!(!s||!o)&&yo(s,o,((u,h)=>aS(u,h)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class tl extends _c{constructor(e,t,s,o=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class ms extends _c{constructor(e,t,s,o,u=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=o,this.fieldTransforms=u,this.type=1}getFieldMask(){return this.fieldMask}}function hv(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=r.data.field(t);e.set(t,s)}})),e}function Xg(r,e,t){const s=new Map;ze(r.length===t.length,32656,{Ve:t.length,de:r.length});for(let o=0;o<t.length;o++){const u=r[o],h=u.transform,m=e.data.field(u.field);s.set(u.field,sS(h,m,t[o]))}return s}function Zg(r,e,t){const s=new Map;for(const o of r){const u=o.transform,h=t.data.field(o.field);s.set(o.field,iS(u,h,e))}return s}class uf extends _c{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class hS extends _c{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dS{constructor(e,t,s,o){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=o}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let o=0;o<this.mutations.length;o++){const u=this.mutations[o];u.key.isEqual(e.key)&&uS(u,e,s[o])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=ba(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=ba(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=iv();return this.mutations.forEach((o=>{const u=e.get(o.key),h=u.overlayedDocument;let m=this.applyToLocalView(h,u.mutatedFields);m=t.has(o.key)?null:m;const y=cv(h,m);y!==null&&s.set(o.key,y),h.isValidDocument()||h.convertToNoDocument(we.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),De())}isEqual(e){return this.batchId===e.batchId&&yo(this.mutations,e.mutations,((t,s)=>Jg(t,s)))&&yo(this.baseMutations,e.baseMutations,((t,s)=>Jg(t,s)))}}class cf{constructor(e,t,s,o){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=o}static from(e,t,s){ze(e.mutations.length===s.length,58842,{me:e.mutations.length,fe:s.length});let o=(function(){return Z1})();const u=e.mutations;for(let h=0;h<u.length;h++)o=o.insert(u[h].key,s[h].version);return new cf(e,t,s,o)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fS{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pS{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ft,Le;function mS(r){switch(r){case $.OK:return me(64938);case $.CANCELLED:case $.UNKNOWN:case $.DEADLINE_EXCEEDED:case $.RESOURCE_EXHAUSTED:case $.INTERNAL:case $.UNAVAILABLE:case $.UNAUTHENTICATED:return!1;case $.INVALID_ARGUMENT:case $.NOT_FOUND:case $.ALREADY_EXISTS:case $.PERMISSION_DENIED:case $.FAILED_PRECONDITION:case $.ABORTED:case $.OUT_OF_RANGE:case $.UNIMPLEMENTED:case $.DATA_LOSS:return!0;default:return me(15467,{code:r})}}function dv(r){if(r===void 0)return Nr("GRPC error has no .code"),$.UNKNOWN;switch(r){case ft.OK:return $.OK;case ft.CANCELLED:return $.CANCELLED;case ft.UNKNOWN:return $.UNKNOWN;case ft.DEADLINE_EXCEEDED:return $.DEADLINE_EXCEEDED;case ft.RESOURCE_EXHAUSTED:return $.RESOURCE_EXHAUSTED;case ft.INTERNAL:return $.INTERNAL;case ft.UNAVAILABLE:return $.UNAVAILABLE;case ft.UNAUTHENTICATED:return $.UNAUTHENTICATED;case ft.INVALID_ARGUMENT:return $.INVALID_ARGUMENT;case ft.NOT_FOUND:return $.NOT_FOUND;case ft.ALREADY_EXISTS:return $.ALREADY_EXISTS;case ft.PERMISSION_DENIED:return $.PERMISSION_DENIED;case ft.FAILED_PRECONDITION:return $.FAILED_PRECONDITION;case ft.ABORTED:return $.ABORTED;case ft.OUT_OF_RANGE:return $.OUT_OF_RANGE;case ft.UNIMPLEMENTED:return $.UNIMPLEMENTED;case ft.DATA_LOSS:return $.DATA_LOSS;default:return me(39323,{code:r})}}(Le=ft||(ft={}))[Le.OK=0]="OK",Le[Le.CANCELLED=1]="CANCELLED",Le[Le.UNKNOWN=2]="UNKNOWN",Le[Le.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Le[Le.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Le[Le.NOT_FOUND=5]="NOT_FOUND",Le[Le.ALREADY_EXISTS=6]="ALREADY_EXISTS",Le[Le.PERMISSION_DENIED=7]="PERMISSION_DENIED",Le[Le.UNAUTHENTICATED=16]="UNAUTHENTICATED",Le[Le.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Le[Le.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Le[Le.ABORTED=10]="ABORTED",Le[Le.OUT_OF_RANGE=11]="OUT_OF_RANGE",Le[Le.UNIMPLEMENTED=12]="UNIMPLEMENTED",Le[Le.INTERNAL=13]="INTERNAL",Le[Le.UNAVAILABLE=14]="UNAVAILABLE",Le[Le.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gS(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yS=new yi([4294967295,4294967295],0);function ey(r){const e=gS().encode(r),t=new C_;return t.update(e),new Uint8Array(t.digest())}function ty(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),o=e.getUint32(8,!0),u=e.getUint32(12,!0);return[new yi([t,s],0),new yi([o,u],0)]}class hf{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Pa(`Invalid padding: ${t}`);if(s<0)throw new Pa(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Pa(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Pa(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=yi.fromNumber(this.ge)}ye(e,t,s){let o=e.add(t.multiply(yi.fromNumber(s)));return o.compare(yS)===1&&(o=new yi([o.getBits(0),o.getBits(1)],0)),o.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=ey(e),[s,o]=ty(t);for(let u=0;u<this.hashCount;u++){const h=this.ye(s,o,u);if(!this.we(h))return!1}return!0}static create(e,t,s){const o=e%8==0?0:8-e%8,u=new Uint8Array(Math.ceil(e/8)),h=new hf(u,o,t);return s.forEach((m=>h.insert(m))),h}insert(e){if(this.ge===0)return;const t=ey(e),[s,o]=ty(t);for(let u=0;u<this.hashCount;u++){const h=this.ye(s,o,u);this.be(h)}}be(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Pa extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vc{constructor(e,t,s,o,u){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=o,this.resolvedLimboDocuments=u}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const o=new Map;return o.set(e,nl.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new vc(we.min(),o,new tt(Ne),Dr(),De())}}class nl{constructor(e,t,s,o,u){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=o,this.removedDocuments=u}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new nl(s,t,De(),De(),De())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fu{constructor(e,t,s,o){this.Se=e,this.removedTargetIds=t,this.key=s,this.De=o}}class fv{constructor(e,t){this.targetId=e,this.Ce=t}}class pv{constructor(e,t,s=Nt.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=o}}class ny{constructor(){this.ve=0,this.Fe=ry(),this.Me=Nt.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=De(),t=De(),s=De();return this.Fe.forEach(((o,u)=>{switch(u){case 0:e=e.add(o);break;case 2:t=t.add(o);break;case 1:s=s.add(o);break;default:me(38017,{changeType:u})}})),new nl(this.Me,this.xe,e,t,s)}Ke(){this.Oe=!1,this.Fe=ry()}qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,ze(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class _S{constructor(e){this.Ge=e,this.ze=new Map,this.je=Dr(),this.He=Ru(),this.Je=Ru(),this.Ze=new tt(Ne)}Xe(e){for(const t of e.Se)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const s=this.nt(t);switch(e.state){case 0:this.rt(t)&&s.Le(e.resumeToken);break;case 1:s.We(),s.Ne||s.Ke(),s.Le(e.resumeToken);break;case 2:s.We(),s.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(s.Qe(),s.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),s.Le(e.resumeToken));break;default:me(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((s,o)=>{this.rt(o)&&t(o)}))}st(e){const t=e.targetId,s=e.Ce.count,o=this.ot(t);if(o){const u=o.target;if(kd(u))if(s===0){const h=new de(u.path);this.et(t,h,Ft.newNoDocument(h,we.min()))}else ze(s===1,20013,{expectedCount:s});else{const h=this._t(t);if(h!==s){const m=this.ut(e),y=m?this.ct(m,e,h):1;if(y!==0){this.it(t);const v=y===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,v)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:o=0},hashCount:u=0}=t;let h,m;try{h=wi(s).toUint8Array()}catch(y){if(y instanceof U_)return hs("Decoding the base64 bloom filter in existence filter failed ("+y.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw y}try{m=new hf(h,o,u)}catch(y){return hs(y instanceof Pa?"BloomFilter error: ":"Applying bloom filter failed: ",y),null}return m.ge===0?null:m}ct(e,t,s){return t.Ce.count===s-this.Pt(e,t.targetId)?0:2}Pt(e,t){const s=this.Ge.getRemoteKeysForTarget(t);let o=0;return s.forEach((u=>{const h=this.Ge.ht(),m=`projects/${h.projectId}/databases/${h.database}/documents/${u.path.canonicalString()}`;e.mightContain(m)||(this.et(t,u,null),o++)})),o}Tt(e){const t=new Map;this.ze.forEach(((u,h)=>{const m=this.ot(h);if(m){if(u.current&&kd(m.target)){const y=new de(m.target.path);this.It(y).has(h)||this.Et(h,y)||this.et(h,y,Ft.newNoDocument(y,e))}u.Be&&(t.set(h,u.ke()),u.Ke())}}));let s=De();this.Je.forEach(((u,h)=>{let m=!0;h.forEachWhile((y=>{const v=this.ot(y);return!v||v.purpose==="TargetPurposeLimboResolution"||(m=!1,!1)})),m&&(s=s.add(u))})),this.je.forEach(((u,h)=>h.setReadTime(e)));const o=new vc(e,t,this.Ze,this.je,s);return this.je=Dr(),this.He=Ru(),this.Je=Ru(),this.Ze=new tt(Ne),o}Ye(e,t){if(!this.rt(e))return;const s=this.Et(e,t.key)?2:0;this.nt(e).qe(t.key,s),this.je=this.je.insert(t.key,t),this.He=this.He.insert(t.key,this.It(t.key).add(e)),this.Je=this.Je.insert(t.key,this.Rt(t.key).add(e))}et(e,t,s){if(!this.rt(e))return;const o=this.nt(e);this.Et(e,t)?o.qe(t,1):o.Ue(t),this.Je=this.Je.insert(t,this.Rt(t).delete(e)),this.Je=this.Je.insert(t,this.Rt(t).add(e)),s&&(this.je=this.je.insert(t,s))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new ny,this.ze.set(e,t)),t}Rt(e){let t=this.Je.get(e);return t||(t=new vt(Ne),this.Je=this.Je.insert(e,t)),t}It(e){let t=this.He.get(e);return t||(t=new vt(Ne),this.He=this.He.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||se("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new ny),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Ru(){return new tt(de.comparator)}function ry(){return new tt(de.comparator)}const vS={asc:"ASCENDING",desc:"DESCENDING"},ES={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},wS={and:"AND",or:"OR"};class TS{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Dd(r,e){return r.useProto3Json||dc(e)?e:{value:e}}function ec(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function mv(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function IS(r,e){return ec(r,e.toTimestamp())}function nr(r){return ze(!!r,49232),we.fromTimestamp((function(t){const s=Ei(t);return new Ge(s.seconds,s.nanos)})(r))}function df(r,e){return Vd(r,e).canonicalString()}function Vd(r,e){const t=(function(o){return new We(["projects",o.projectId,"databases",o.database])})(r).child("documents");return e===void 0?t:t.child(e)}function gv(r){const e=We.fromString(r);return ze(wv(e),10190,{key:e.toString()}),e}function xd(r,e){return df(r.databaseId,e.path)}function ld(r,e){const t=gv(e);if(t.get(1)!==r.databaseId.projectId)throw new ne($.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new ne($.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new de(_v(t))}function yv(r,e){return df(r.databaseId,e)}function SS(r){const e=gv(r);return e.length===4?We.emptyPath():_v(e)}function Od(r){return new We(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function _v(r){return ze(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function iy(r,e,t){return{name:xd(r,e),fields:t.value.mapValue.fields}}function AS(r,e){let t;if("targetChange"in e){e.targetChange;const s=(function(v){return v==="NO_CHANGE"?0:v==="ADD"?1:v==="REMOVE"?2:v==="CURRENT"?3:v==="RESET"?4:me(39313,{state:v})})(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],u=(function(v,w){return v.useProto3Json?(ze(w===void 0||typeof w=="string",58123),Nt.fromBase64String(w||"")):(ze(w===void 0||w instanceof Buffer||w instanceof Uint8Array,16193),Nt.fromUint8Array(w||new Uint8Array))})(r,e.targetChange.resumeToken),h=e.targetChange.cause,m=h&&(function(v){const w=v.code===void 0?$.UNKNOWN:dv(v.code);return new ne(w,v.message||"")})(h);t=new pv(s,o,u,m||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const o=ld(r,s.document.name),u=nr(s.document.updateTime),h=s.document.createTime?nr(s.document.createTime):we.min(),m=new mn({mapValue:{fields:s.document.fields}}),y=Ft.newFoundDocument(o,u,h,m),v=s.targetIds||[],w=s.removedTargetIds||[];t=new Fu(v,w,y.key,y)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const o=ld(r,s.document),u=s.readTime?nr(s.readTime):we.min(),h=Ft.newNoDocument(o,u),m=s.removedTargetIds||[];t=new Fu([],m,h.key,h)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const o=ld(r,s.document),u=s.removedTargetIds||[];t=new Fu([],u,o,null)}else{if(!("filter"in e))return me(11601,{Vt:e});{e.filter;const s=e.filter;s.targetId;const{count:o=0,unchangedNames:u}=s,h=new pS(o,u),m=s.targetId;t=new fv(m,h)}}return t}function RS(r,e){let t;if(e instanceof tl)t={update:iy(r,e.key,e.value)};else if(e instanceof uf)t={delete:xd(r,e.key)};else if(e instanceof ms)t={update:iy(r,e.key,e.data),updateMask:LS(e.fieldMask)};else{if(!(e instanceof hS))return me(16599,{dt:e.type});t={verify:xd(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(u,h){const m=h.transform;if(m instanceof Wa)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(m instanceof Ga)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:m.elements}};if(m instanceof Ka)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:m.elements}};if(m instanceof Zu)return{fieldPath:h.field.canonicalString(),increment:m.Ae};throw me(20930,{transform:h.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(o,u){return u.updateTime!==void 0?{updateTime:IS(o,u.updateTime)}:u.exists!==void 0?{exists:u.exists}:me(27497)})(r,e.precondition)),t}function CS(r,e){return r&&r.length>0?(ze(e!==void 0,14353),r.map((t=>(function(o,u){let h=o.updateTime?nr(o.updateTime):nr(u);return h.isEqual(we.min())&&(h=nr(u)),new lS(h,o.transformResults||[])})(t,e)))):[]}function kS(r,e){return{documents:[yv(r,e.path)]}}function PS(r,e){const t={structuredQuery:{}},s=e.path;let o;e.collectionGroup!==null?(o=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=yv(r,o);const u=(function(v){if(v.length!==0)return Ev(On.create(v,"and"))})(e.filters);u&&(t.structuredQuery.where=u);const h=(function(v){if(v.length!==0)return v.map((w=>(function(R){return{field:ao(R.field),direction:VS(R.dir)}})(w)))})(e.orderBy);h&&(t.structuredQuery.orderBy=h);const m=Dd(r,e.limit);return m!==null&&(t.structuredQuery.limit=m),e.startAt&&(t.structuredQuery.startAt=(function(v){return{before:v.inclusive,values:v.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(v){return{before:!v.inclusive,values:v.position}})(e.endAt)),{ft:t,parent:o}}function NS(r){let e=SS(r.parent);const t=r.structuredQuery,s=t.from?t.from.length:0;let o=null;if(s>0){ze(s===1,65062);const w=t.from[0];w.allDescendants?o=w.collectionId:e=e.child(w.collectionId)}let u=[];t.where&&(u=(function(A){const R=vv(A);return R instanceof On&&Q_(R)?R.getFilters():[R]})(t.where));let h=[];t.orderBy&&(h=(function(A){return A.map((R=>(function(J){return new Ha(lo(J.field),(function(Q){switch(Q){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(J.direction))})(R)))})(t.orderBy));let m=null;t.limit&&(m=(function(A){let R;return R=typeof A=="object"?A.value:A,dc(R)?null:R})(t.limit));let y=null;t.startAt&&(y=(function(A){const R=!!A.before,j=A.values||[];return new Xu(j,R)})(t.startAt));let v=null;return t.endAt&&(v=(function(A){const R=!A.before,j=A.values||[];return new Xu(j,R)})(t.endAt)),W1(e,o,h,u,m,"F",y,v)}function DS(r,e){const t=(function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return me(28987,{purpose:o})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function vv(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=lo(t.unaryFilter.field);return pt.create(s,"==",{doubleValue:NaN});case"IS_NULL":const o=lo(t.unaryFilter.field);return pt.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const u=lo(t.unaryFilter.field);return pt.create(u,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=lo(t.unaryFilter.field);return pt.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return me(61313);default:return me(60726)}})(r):r.fieldFilter!==void 0?(function(t){return pt.create(lo(t.fieldFilter.field),(function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return me(58110);default:return me(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return On.create(t.compositeFilter.filters.map((s=>vv(s))),(function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return me(1026)}})(t.compositeFilter.op))})(r):me(30097,{filter:r})}function VS(r){return vS[r]}function xS(r){return ES[r]}function OS(r){return wS[r]}function ao(r){return{fieldPath:r.canonicalString()}}function lo(r){return Pt.fromServerFormat(r.fieldPath)}function Ev(r){return r instanceof pt?(function(t){if(t.op==="=="){if(Hg(t.value))return{unaryFilter:{field:ao(t.field),op:"IS_NAN"}};if(qg(t.value))return{unaryFilter:{field:ao(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Hg(t.value))return{unaryFilter:{field:ao(t.field),op:"IS_NOT_NAN"}};if(qg(t.value))return{unaryFilter:{field:ao(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ao(t.field),op:xS(t.op),value:t.value}}})(r):r instanceof On?(function(t){const s=t.getFilters().map((o=>Ev(o)));return s.length===1?s[0]:{compositeFilter:{op:OS(t.op),filters:s}}})(r):me(54877,{filter:r})}function LS(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function wv(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function Tv(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fi{constructor(e,t,s,o,u=we.min(),h=we.min(),m=Nt.EMPTY_BYTE_STRING,y=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=o,this.snapshotVersion=u,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=m,this.expectedCount=y}withSequenceNumber(e){return new fi(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new fi(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new fi(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new fi(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bS{constructor(e){this.yt=e}}function MS(r){const e=NS({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Nd(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FS{constructor(){this.Sn=new US}addToCollectionParentIndex(e,t){return this.Sn.add(t),q.resolve()}getCollectionParents(e,t){return q.resolve(this.Sn.getEntries(t))}addFieldIndex(e,t){return q.resolve()}deleteFieldIndex(e,t){return q.resolve()}deleteAllFieldIndexes(e){return q.resolve()}createTargetIndexes(e,t){return q.resolve()}getDocumentsMatchingTarget(e,t){return q.resolve(null)}getIndexType(e,t){return q.resolve(0)}getFieldIndexes(e,t){return q.resolve([])}getNextCollectionGroupToUpdate(e){return q.resolve(null)}getMinOffset(e,t){return q.resolve(vi.min())}getMinOffsetFromCollectionGroup(e,t){return q.resolve(vi.min())}updateCollectionGroup(e,t,s){return q.resolve()}updateIndexEntries(e,t){return q.resolve()}}class US{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t]||new vt(We.comparator),u=!o.has(s);return this.index[t]=o.add(s),u}has(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t];return o&&o.has(s)}getEntries(e){return(this.index[e]||new vt(We.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sy={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Iv=41943040;class Yt{static withCacheSize(e){return new Yt(e,Yt.DEFAULT_COLLECTION_PERCENTILE,Yt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Yt.DEFAULT_COLLECTION_PERCENTILE=10,Yt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Yt.DEFAULT=new Yt(Iv,Yt.DEFAULT_COLLECTION_PERCENTILE,Yt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Yt.DISABLED=new Yt(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eo{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new Eo(0)}static ar(){return new Eo(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oy="LruGarbageCollector",jS=1048576;function ay([r,e],[t,s]){const o=Ne(r,t);return o===0?Ne(e,s):o}class zS{constructor(e){this.Pr=e,this.buffer=new vt(ay),this.Tr=0}Ir(){return++this.Tr}Er(e){const t=[e,this.Ir()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();ay(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class BS{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){se(oy,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Co(t)?se(oy,"Ignoring IndexedDB error during garbage collection: ",t):await Ro(t)}await this.Ar(3e5)}))}}class $S{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return q.resolve(hc.ce);const s=new zS(t);return this.Vr.forEachTarget(e,(o=>s.Er(o.sequenceNumber))).next((()=>this.Vr.mr(e,(o=>s.Er(o))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(se("LruGarbageCollector","Garbage collection skipped; disabled"),q.resolve(sy)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(se("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),sy):this.gr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let s,o,u,h,m,y,v;const w=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((A=>(A>this.params.maximumSequenceNumbersToCollect?(se("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${A}`),o=this.params.maximumSequenceNumbersToCollect):o=A,h=Date.now(),this.nthSequenceNumber(e,o)))).next((A=>(s=A,m=Date.now(),this.removeTargets(e,s,t)))).next((A=>(u=A,y=Date.now(),this.removeOrphanedDocuments(e,s)))).next((A=>(v=Date.now(),so()<=Pe.DEBUG&&se("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-w}ms
	Determined least recently used ${o} in `+(m-h)+`ms
	Removed ${u} targets in `+(y-m)+`ms
	Removed ${A} documents in `+(v-y)+`ms
Total Duration: ${v-w}ms`),q.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:u,documentsRemoved:A}))))}}function qS(r,e){return new $S(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HS{constructor(){this.changes=new ps((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ft.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?q.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WS{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GS{constructor(e,t,s,o){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=o}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((o=>(s=o,this.remoteDocumentCache.getEntry(e,t)))).next((o=>(s!==null&&ba(s.mutation,o,Nn.empty(),Ge.now()),o)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,De()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=De()){const o=rs();return this.populateOverlays(e,o,t).next((()=>this.computeViews(e,t,o,s).next((u=>{let h=ka();return u.forEach(((m,y)=>{h=h.insert(m,y.overlayedDocument)})),h}))))}getOverlayedDocuments(e,t){const s=rs();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,De())))}populateOverlays(e,t,s){const o=[];return s.forEach((u=>{t.has(u)||o.push(u)})),this.documentOverlayCache.getOverlays(e,o).next((u=>{u.forEach(((h,m)=>{t.set(h,m)}))}))}computeViews(e,t,s,o){let u=Dr();const h=La(),m=(function(){return La()})();return t.forEach(((y,v)=>{const w=s.get(v.key);o.has(v.key)&&(w===void 0||w.mutation instanceof ms)?u=u.insert(v.key,v):w!==void 0?(h.set(v.key,w.mutation.getFieldMask()),ba(w.mutation,v,w.mutation.getFieldMask(),Ge.now())):h.set(v.key,Nn.empty())})),this.recalculateAndSaveOverlays(e,u).next((y=>(y.forEach(((v,w)=>h.set(v,w))),t.forEach(((v,w)=>m.set(v,new WS(w,h.get(v)??null)))),m)))}recalculateAndSaveOverlays(e,t){const s=La();let o=new tt(((h,m)=>h-m)),u=De();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((h=>{for(const m of h)m.keys().forEach((y=>{const v=t.get(y);if(v===null)return;let w=s.get(y)||Nn.empty();w=m.applyToLocalView(v,w),s.set(y,w);const A=(o.get(m.batchId)||De()).add(y);o=o.insert(m.batchId,A)}))})).next((()=>{const h=[],m=o.getReverseIterator();for(;m.hasNext();){const y=m.getNext(),v=y.key,w=y.value,A=iv();w.forEach((R=>{if(!u.has(R)){const j=cv(t.get(R),s.get(R));j!==null&&A.set(R,j),u=u.add(R)}})),h.push(this.documentOverlayCache.saveOverlays(e,v,A))}return q.waitFor(h)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,o){return G1(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Z_(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,o):this.getDocumentsMatchingCollectionQuery(e,t,s,o)}getNextDocuments(e,t,s,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,o).next((u=>{const h=o-u.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,o-u.size):q.resolve(rs());let m=za,y=u;return h.next((v=>q.forEach(v,((w,A)=>(m<A.largestBatchId&&(m=A.largestBatchId),u.get(w)?q.resolve():this.remoteDocumentCache.getEntry(e,w).next((R=>{y=y.insert(w,R)}))))).next((()=>this.populateOverlays(e,v,u))).next((()=>this.computeViews(e,y,v,De()))).next((w=>({batchId:m,changes:rv(w)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new de(t)).next((s=>{let o=ka();return s.isFoundDocument()&&(o=o.insert(s.key,s)),o}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,o){const u=t.collectionGroup;let h=ka();return this.indexManager.getCollectionParents(e,u).next((m=>q.forEach(m,(y=>{const v=(function(A,R){return new ko(R,null,A.explicitOrderBy.slice(),A.filters.slice(),A.limit,A.limitType,A.startAt,A.endAt)})(t,y.child(u));return this.getDocumentsMatchingCollectionQuery(e,v,s,o).next((w=>{w.forEach(((A,R)=>{h=h.insert(A,R)}))}))})).next((()=>h))))}getDocumentsMatchingCollectionQuery(e,t,s,o){let u;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((h=>(u=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,u,o)))).next((h=>{u.forEach(((y,v)=>{const w=v.getKey();h.get(w)===null&&(h=h.insert(w,Ft.newInvalidDocument(w)))}));let m=ka();return h.forEach(((y,v)=>{const w=u.get(y);w!==void 0&&ba(w.mutation,v,Nn.empty(),Ge.now()),gc(t,v)&&(m=m.insert(y,v))})),m}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KS{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return q.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,(function(o){return{id:o.id,version:o.version,createTime:nr(o.createTime)}})(t)),q.resolve()}getNamedQuery(e,t){return q.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,(function(o){return{name:o.name,query:MS(o.bundledQuery),readTime:nr(o.readTime)}})(t)),q.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QS{constructor(){this.overlays=new tt(de.comparator),this.Lr=new Map}getOverlay(e,t){return q.resolve(this.overlays.get(t))}getOverlays(e,t){const s=rs();return q.forEach(t,(o=>this.getOverlay(e,o).next((u=>{u!==null&&s.set(o,u)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((o,u)=>{this.bt(e,t,u)})),q.resolve()}removeOverlaysForBatchId(e,t,s){const o=this.Lr.get(s);return o!==void 0&&(o.forEach((u=>this.overlays=this.overlays.remove(u))),this.Lr.delete(s)),q.resolve()}getOverlaysForCollection(e,t,s){const o=rs(),u=t.length+1,h=new de(t.child("")),m=this.overlays.getIteratorFrom(h);for(;m.hasNext();){const y=m.getNext().value,v=y.getKey();if(!t.isPrefixOf(v.path))break;v.path.length===u&&y.largestBatchId>s&&o.set(y.getKey(),y)}return q.resolve(o)}getOverlaysForCollectionGroup(e,t,s,o){let u=new tt(((v,w)=>v-w));const h=this.overlays.getIterator();for(;h.hasNext();){const v=h.getNext().value;if(v.getKey().getCollectionGroup()===t&&v.largestBatchId>s){let w=u.get(v.largestBatchId);w===null&&(w=rs(),u=u.insert(v.largestBatchId,w)),w.set(v.getKey(),v)}}const m=rs(),y=u.getIterator();for(;y.hasNext()&&(y.getNext().value.forEach(((v,w)=>m.set(v,w))),!(m.size()>=o)););return q.resolve(m)}bt(e,t,s){const o=this.overlays.get(s.key);if(o!==null){const h=this.Lr.get(o.largestBatchId).delete(s.key);this.Lr.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(s.key,new fS(t,s));let u=this.Lr.get(t);u===void 0&&(u=De(),this.Lr.set(t,u)),this.Lr.set(t,u.add(s.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YS{constructor(){this.sessionToken=Nt.EMPTY_BYTE_STRING}getSessionToken(e){return q.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,q.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff{constructor(){this.kr=new vt(It.Kr),this.qr=new vt(It.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){const s=new It(e,t);this.kr=this.kr.add(s),this.qr=this.qr.add(s)}$r(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new It(e,t))}Qr(e,t){e.forEach((s=>this.removeReference(s,t)))}Gr(e){const t=new de(new We([])),s=new It(t,e),o=new It(t,e+1),u=[];return this.qr.forEachInRange([s,o],(h=>{this.Wr(h),u.push(h.key)})),u}zr(){this.kr.forEach((e=>this.Wr(e)))}Wr(e){this.kr=this.kr.delete(e),this.qr=this.qr.delete(e)}jr(e){const t=new de(new We([])),s=new It(t,e),o=new It(t,e+1);let u=De();return this.qr.forEachInRange([s,o],(h=>{u=u.add(h.key)})),u}containsKey(e){const t=new It(e,0),s=this.kr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class It{constructor(e,t){this.key=e,this.Hr=t}static Kr(e,t){return de.comparator(e.key,t.key)||Ne(e.Hr,t.Hr)}static Ur(e,t){return Ne(e.Hr,t.Hr)||de.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JS{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Jr=new vt(It.Kr)}checkEmpty(e){return q.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,o){const u=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new dS(u,t,s,o);this.mutationQueue.push(h);for(const m of o)this.Jr=this.Jr.add(new It(m.key,u)),this.indexManager.addToCollectionParentIndex(e,m.key.path.popLast());return q.resolve(h)}lookupMutationBatch(e,t){return q.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,o=this.Xr(s),u=o<0?0:o;return q.resolve(this.mutationQueue.length>u?this.mutationQueue[u]:null)}getHighestUnacknowledgedBatchId(){return q.resolve(this.mutationQueue.length===0?nf:this.Yn-1)}getAllMutationBatches(e){return q.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new It(t,0),o=new It(t,Number.POSITIVE_INFINITY),u=[];return this.Jr.forEachInRange([s,o],(h=>{const m=this.Zr(h.Hr);u.push(m)})),q.resolve(u)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new vt(Ne);return t.forEach((o=>{const u=new It(o,0),h=new It(o,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([u,h],(m=>{s=s.add(m.Hr)}))})),q.resolve(this.Yr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,o=s.length+1;let u=s;de.isDocumentKey(u)||(u=u.child(""));const h=new It(new de(u),0);let m=new vt(Ne);return this.Jr.forEachWhile((y=>{const v=y.key.path;return!!s.isPrefixOf(v)&&(v.length===o&&(m=m.add(y.Hr)),!0)}),h),q.resolve(this.Yr(m))}Yr(e){const t=[];return e.forEach((s=>{const o=this.Zr(s);o!==null&&t.push(o)})),t}removeMutationBatch(e,t){ze(this.ei(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Jr;return q.forEach(t.mutations,(o=>{const u=new It(o.key,t.batchId);return s=s.delete(u),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)})).next((()=>{this.Jr=s}))}nr(e){}containsKey(e,t){const s=new It(t,0),o=this.Jr.firstAfterOrEqual(s);return q.resolve(t.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,q.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XS{constructor(e){this.ti=e,this.docs=(function(){return new tt(de.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,o=this.docs.get(s),u=o?o.size:0,h=this.ti(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:h}),this.size+=h-u,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return q.resolve(s?s.document.mutableCopy():Ft.newInvalidDocument(t))}getEntries(e,t){let s=Dr();return t.forEach((o=>{const u=this.docs.get(o);s=s.insert(o,u?u.document.mutableCopy():Ft.newInvalidDocument(o))})),q.resolve(s)}getDocumentsMatchingQuery(e,t,s,o){let u=Dr();const h=t.path,m=new de(h.child("__id-9223372036854775808__")),y=this.docs.getIteratorFrom(m);for(;y.hasNext();){const{key:v,value:{document:w}}=y.getNext();if(!h.isPrefixOf(v.path))break;v.path.length>h.length+1||I1(T1(w),s)<=0||(o.has(w.key)||gc(t,w))&&(u=u.insert(w.key,w.mutableCopy()))}return q.resolve(u)}getAllFromCollectionGroup(e,t,s,o){me(9500)}ni(e,t){return q.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new ZS(this)}getSize(e){return q.resolve(this.size)}}class ZS extends HS{constructor(e){super(),this.Mr=e}applyChanges(e){const t=[];return this.changes.forEach(((s,o)=>{o.isValidDocument()?t.push(this.Mr.addEntry(e,o)):this.Mr.removeEntry(s)})),q.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eA{constructor(e){this.persistence=e,this.ri=new ps((t=>of(t)),af),this.lastRemoteSnapshotVersion=we.min(),this.highestTargetId=0,this.ii=0,this.si=new ff,this.targetCount=0,this.oi=Eo._r()}forEachTarget(e,t){return this.ri.forEach(((s,o)=>t(o))),q.resolve()}getLastRemoteSnapshotVersion(e){return q.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return q.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),q.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.ii&&(this.ii=t),q.resolve()}lr(e){this.ri.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.oi=new Eo(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,q.resolve()}updateTargetData(e,t){return this.lr(t),q.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,q.resolve()}removeTargets(e,t,s){let o=0;const u=[];return this.ri.forEach(((h,m)=>{m.sequenceNumber<=t&&s.get(m.targetId)===null&&(this.ri.delete(h),u.push(this.removeMatchingKeysForTargetId(e,m.targetId)),o++)})),q.waitFor(u).next((()=>o))}getTargetCount(e){return q.resolve(this.targetCount)}getTargetData(e,t){const s=this.ri.get(t)||null;return q.resolve(s)}addMatchingKeys(e,t,s){return this.si.$r(t,s),q.resolve()}removeMatchingKeys(e,t,s){this.si.Qr(t,s);const o=this.persistence.referenceDelegate,u=[];return o&&t.forEach((h=>{u.push(o.markPotentiallyOrphaned(e,h))})),q.waitFor(u)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),q.resolve()}getMatchingKeysForTargetId(e,t){const s=this.si.jr(t);return q.resolve(s)}containsKey(e,t){return q.resolve(this.si.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sv{constructor(e,t){this._i={},this.overlays={},this.ai=new hc(0),this.ui=!1,this.ui=!0,this.ci=new YS,this.referenceDelegate=e(this),this.li=new eA(this),this.indexManager=new FS,this.remoteDocumentCache=(function(o){return new XS(o)})((s=>this.referenceDelegate.hi(s))),this.serializer=new bS(t),this.Pi=new KS(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new QS,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this._i[e.toKey()];return s||(s=new JS(t,this.referenceDelegate),this._i[e.toKey()]=s),s}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,s){se("MemoryPersistence","Starting transaction:",e);const o=new tA(this.ai.next());return this.referenceDelegate.Ti(),s(o).next((u=>this.referenceDelegate.Ii(o).next((()=>u)))).toPromise().then((u=>(o.raiseOnCommittedEvent(),u)))}Ei(e,t){return q.or(Object.values(this._i).map((s=>()=>s.containsKey(e,t))))}}class tA extends A1{constructor(e){super(),this.currentSequenceNumber=e}}class pf{constructor(e){this.persistence=e,this.Ri=new ff,this.Ai=null}static Vi(e){return new pf(e)}get di(){if(this.Ai)return this.Ai;throw me(60996)}addReference(e,t,s){return this.Ri.addReference(s,t),this.di.delete(s.toString()),q.resolve()}removeReference(e,t,s){return this.Ri.removeReference(s,t),this.di.add(s.toString()),q.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),q.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach((o=>this.di.add(o.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((o=>{o.forEach((u=>this.di.add(u.toString())))})).next((()=>s.removeTargetData(e,t)))}Ti(){this.Ai=new Set}Ii(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return q.forEach(this.di,(s=>{const o=de.fromPath(s);return this.mi(e,o).next((u=>{u||t.removeEntry(o,we.min())}))})).next((()=>(this.Ai=null,t.apply(e))))}updateLimboDocument(e,t){return this.mi(e,t).next((s=>{s?this.di.delete(t.toString()):this.di.add(t.toString())}))}hi(e){return 0}mi(e,t){return q.or([()=>q.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class tc{constructor(e,t){this.persistence=e,this.fi=new ps((s=>k1(s.path)),((s,o)=>s.isEqual(o))),this.garbageCollector=qS(this,t)}static Vi(e,t){return new tc(e,t)}Ti(){}Ii(e){return q.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((o=>s+o))))}pr(e){let t=0;return this.mr(e,(s=>{t++})).next((()=>t))}mr(e,t){return q.forEach(this.fi,((s,o)=>this.wr(e,s,o).next((u=>u?q.resolve():t(o)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const o=this.persistence.getRemoteDocumentCache(),u=o.newChangeBuffer();return o.ni(e,(h=>this.wr(e,h,t).next((m=>{m||(s++,u.removeEntry(h,we.min()))})))).next((()=>u.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),q.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.fi.set(s,e.currentSequenceNumber),q.resolve()}removeReference(e,t,s){return this.fi.set(s,e.currentSequenceNumber),q.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),q.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Lu(e.data.value)),t}wr(e,t,s){return q.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const o=this.fi.get(t);return q.resolve(o!==void 0&&o>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mf{constructor(e,t,s,o){this.targetId=e,this.fromCache=t,this.Ts=s,this.Is=o}static Es(e,t){let s=De(),o=De();for(const u of t.docChanges)switch(u.type){case 0:s=s.add(u.doc.key);break;case 1:o=o.add(u.doc.key)}return new mf(e,t.fromCache,s,o)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rA{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=(function(){return $w()?8:R1(Ut())>0?6:4})()}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,s,o){const u={result:null};return this.gs(e,t).next((h=>{u.result=h})).next((()=>{if(!u.result)return this.ps(e,t,o,s).next((h=>{u.result=h}))})).next((()=>{if(u.result)return;const h=new nA;return this.ys(e,t,h).next((m=>{if(u.result=m,this.As)return this.ws(e,t,h,m.size)}))})).next((()=>u.result))}ws(e,t,s,o){return s.documentReadCount<this.Vs?(so()<=Pe.DEBUG&&se("QueryEngine","SDK will not create cache indexes for query:",oo(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),q.resolve()):(so()<=Pe.DEBUG&&se("QueryEngine","Query:",oo(t),"scans",s.documentReadCount,"local documents and returns",o,"documents as results."),s.documentReadCount>this.ds*o?(so()<=Pe.DEBUG&&se("QueryEngine","The SDK decides to create cache indexes for query:",oo(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,tr(t))):q.resolve())}gs(e,t){if(Qg(t))return q.resolve(null);let s=tr(t);return this.indexManager.getIndexType(e,s).next((o=>o===0?null:(t.limit!==null&&o===1&&(t=Nd(t,null,"F"),s=tr(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((u=>{const h=De(...u);return this.fs.getDocuments(e,h).next((m=>this.indexManager.getMinOffset(e,s).next((y=>{const v=this.bs(t,m);return this.Ss(t,v,h,y.readTime)?this.gs(e,Nd(t,null,"F")):this.Ds(e,v,t,y)}))))})))))}ps(e,t,s,o){return Qg(t)||o.isEqual(we.min())?q.resolve(null):this.fs.getDocuments(e,s).next((u=>{const h=this.bs(t,u);return this.Ss(t,h,s,o)?q.resolve(null):(so()<=Pe.DEBUG&&se("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),oo(t)),this.Ds(e,h,t,w1(o,za)).next((m=>m)))}))}bs(e,t){let s=new vt(tv(e));return t.forEach(((o,u)=>{gc(e,u)&&(s=s.add(u))})),s}Ss(e,t,s,o){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const u=e.limitType==="F"?t.last():t.first();return!!u&&(u.hasPendingWrites||u.version.compareTo(o)>0)}ys(e,t,s){return so()<=Pe.DEBUG&&se("QueryEngine","Using full collection scan to execute query:",oo(t)),this.fs.getDocumentsMatchingQuery(e,t,vi.min(),s)}Ds(e,t,s,o){return this.fs.getDocumentsMatchingQuery(e,s,o).next((u=>(t.forEach((h=>{u=u.insert(h.key,h)})),u)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gf="LocalStore",iA=3e8;class sA{constructor(e,t,s,o){this.persistence=e,this.Cs=t,this.serializer=o,this.vs=new tt(Ne),this.Fs=new ps((u=>of(u)),af),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(s)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new GS(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.vs)))}}function oA(r,e,t,s){return new sA(r,e,t,s)}async function Av(r,e){const t=Re(r);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let o;return t.mutationQueue.getAllMutationBatches(s).next((u=>(o=u,t.Os(e),t.mutationQueue.getAllMutationBatches(s)))).next((u=>{const h=[],m=[];let y=De();for(const v of o){h.push(v.batchId);for(const w of v.mutations)y=y.add(w.key)}for(const v of u){m.push(v.batchId);for(const w of v.mutations)y=y.add(w.key)}return t.localDocuments.getDocuments(s,y).next((v=>({Ns:v,removedBatchIds:h,addedBatchIds:m})))}))}))}function aA(r,e){const t=Re(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const o=e.batch.keys(),u=t.xs.newChangeBuffer({trackRemovals:!0});return(function(m,y,v,w){const A=v.batch,R=A.keys();let j=q.resolve();return R.forEach((J=>{j=j.next((()=>w.getEntry(y,J))).next((X=>{const Q=v.docVersions.get(J);ze(Q!==null,48541),X.version.compareTo(Q)<0&&(A.applyToRemoteDocument(X,v),X.isValidDocument()&&(X.setReadTime(v.commitVersion),w.addEntry(X)))}))})),j.next((()=>m.mutationQueue.removeMutationBatch(y,A)))})(t,s,e,u).next((()=>u.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,o,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(m){let y=De();for(let v=0;v<m.mutationResults.length;++v)m.mutationResults[v].transformResults.length>0&&(y=y.add(m.batch.mutations[v].key));return y})(e)))).next((()=>t.localDocuments.getDocuments(s,o)))}))}function Rv(r){const e=Re(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.li.getLastRemoteSnapshotVersion(t)))}function lA(r,e){const t=Re(r),s=e.snapshotVersion;let o=t.vs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(u=>{const h=t.xs.newChangeBuffer({trackRemovals:!0});o=t.vs;const m=[];e.targetChanges.forEach(((w,A)=>{const R=o.get(A);if(!R)return;m.push(t.li.removeMatchingKeys(u,w.removedDocuments,A).next((()=>t.li.addMatchingKeys(u,w.addedDocuments,A))));let j=R.withSequenceNumber(u.currentSequenceNumber);e.targetMismatches.get(A)!==null?j=j.withResumeToken(Nt.EMPTY_BYTE_STRING,we.min()).withLastLimboFreeSnapshotVersion(we.min()):w.resumeToken.approximateByteSize()>0&&(j=j.withResumeToken(w.resumeToken,s)),o=o.insert(A,j),(function(X,Q,Ee){return X.resumeToken.approximateByteSize()===0||Q.snapshotVersion.toMicroseconds()-X.snapshotVersion.toMicroseconds()>=iA?!0:Ee.addedDocuments.size+Ee.modifiedDocuments.size+Ee.removedDocuments.size>0})(R,j,w)&&m.push(t.li.updateTargetData(u,j))}));let y=Dr(),v=De();if(e.documentUpdates.forEach((w=>{e.resolvedLimboDocuments.has(w)&&m.push(t.persistence.referenceDelegate.updateLimboDocument(u,w))})),m.push(uA(u,h,e.documentUpdates).next((w=>{y=w.Bs,v=w.Ls}))),!s.isEqual(we.min())){const w=t.li.getLastRemoteSnapshotVersion(u).next((A=>t.li.setTargetsMetadata(u,u.currentSequenceNumber,s)));m.push(w)}return q.waitFor(m).next((()=>h.apply(u))).next((()=>t.localDocuments.getLocalViewOfDocuments(u,y,v))).next((()=>y))})).then((u=>(t.vs=o,u)))}function uA(r,e,t){let s=De(),o=De();return t.forEach((u=>s=s.add(u))),e.getEntries(r,s).next((u=>{let h=Dr();return t.forEach(((m,y)=>{const v=u.get(m);y.isFoundDocument()!==v.isFoundDocument()&&(o=o.add(m)),y.isNoDocument()&&y.version.isEqual(we.min())?(e.removeEntry(m,y.readTime),h=h.insert(m,y)):!v.isValidDocument()||y.version.compareTo(v.version)>0||y.version.compareTo(v.version)===0&&v.hasPendingWrites?(e.addEntry(y),h=h.insert(m,y)):se(gf,"Ignoring outdated watch update for ",m,". Current version:",v.version," Watch version:",y.version)})),{Bs:h,Ls:o}}))}function cA(r,e){const t=Re(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=nf),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function hA(r,e){const t=Re(r);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let o;return t.li.getTargetData(s,e).next((u=>u?(o=u,q.resolve(o)):t.li.allocateTargetId(s).next((h=>(o=new fi(e,h,"TargetPurposeListen",s.currentSequenceNumber),t.li.addTargetData(s,o).next((()=>o)))))))})).then((s=>{const o=t.vs.get(s.targetId);return(o===null||s.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(t.vs=t.vs.insert(s.targetId,s),t.Fs.set(e,s.targetId)),s}))}async function Ld(r,e,t){const s=Re(r),o=s.vs.get(e),u=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",u,(h=>s.persistence.referenceDelegate.removeTarget(h,o)))}catch(h){if(!Co(h))throw h;se(gf,`Failed to update sequence numbers for target ${e}: ${h}`)}s.vs=s.vs.remove(e),s.Fs.delete(o.target)}function ly(r,e,t){const s=Re(r);let o=we.min(),u=De();return s.persistence.runTransaction("Execute query","readwrite",(h=>(function(y,v,w){const A=Re(y),R=A.Fs.get(w);return R!==void 0?q.resolve(A.vs.get(R)):A.li.getTargetData(v,w)})(s,h,tr(e)).next((m=>{if(m)return o=m.lastLimboFreeSnapshotVersion,s.li.getMatchingKeysForTargetId(h,m.targetId).next((y=>{u=y}))})).next((()=>s.Cs.getDocumentsMatchingQuery(h,e,t?o:we.min(),t?u:De()))).next((m=>(dA(s,Y1(e),m),{documents:m,ks:u})))))}function dA(r,e,t){let s=r.Ms.get(e)||we.min();t.forEach(((o,u)=>{u.readTime.compareTo(s)>0&&(s=u.readTime)})),r.Ms.set(e,s)}class uy{constructor(){this.activeTargetIds=nS()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class fA{constructor(){this.vo=new uy,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,s){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new uy,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pA{Mo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cy="ConnectivityMonitor";class hy{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){se(cy,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){se(cy,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Cu=null;function bd(){return Cu===null?Cu=(function(){return 268435456+Math.round(2147483648*Math.random())})():Cu++,"0x"+Cu.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud="RestConnection",mA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class gA{get Ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Uo=`projects/${s}/databases/${o}`,this.$o=this.databaseId.database===Yu?`project_id=${s}`:`project_id=${s}&database_id=${o}`}Wo(e,t,s,o,u){const h=bd(),m=this.Qo(e,t.toUriEncodedString());se(ud,`Sending RPC '${e}' ${h}:`,m,s);const y={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(y,o,u);const{host:v}=new URL(m),w=To(v);return this.zo(e,m,y,s,w).then((A=>(se(ud,`Received RPC '${e}' ${h}: `,A),A)),(A=>{throw hs(ud,`RPC '${e}' ${h} failed with error: `,A,"url: ",m,"request:",s),A}))}jo(e,t,s,o,u,h){return this.Wo(e,t,s,o,u)}Go(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Ao})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((o,u)=>e[u]=o)),s&&s.headers.forEach(((o,u)=>e[u]=o))}Qo(e,t){const s=mA[e];let o=`${this.qo}/v1/${t}:${s}`;return this.databaseInfo.apiKey&&(o=`${o}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),o}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yA{constructor(e){this.Ho=e.Ho,this.Jo=e.Jo}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Jo()}send(e){this.Ho(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bt="WebChannelConnection",Aa=(r,e,t)=>{r.listen(e,(s=>{try{t(s)}catch(o){setTimeout((()=>{throw o}),0)}}))};class fo extends gA{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!fo.c_){const e=D_();Aa(e,N_.STAT_EVENT,(t=>{t.stat===Id.PROXY?se(bt,"STAT_EVENT: detected buffering proxy"):t.stat===Id.NOPROXY&&se(bt,"STAT_EVENT: detected no buffering proxy")})),fo.c_=!0}}zo(e,t,s,o,u){const h=bd();return new Promise(((m,y)=>{const v=new k_;v.setWithCredentials(!0),v.listenOnce(P_.COMPLETE,(()=>{try{switch(v.getLastErrorCode()){case Ou.NO_ERROR:const A=v.getResponseJson();se(bt,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(A)),m(A);break;case Ou.TIMEOUT:se(bt,`RPC '${e}' ${h} timed out`),y(new ne($.DEADLINE_EXCEEDED,"Request time out"));break;case Ou.HTTP_ERROR:const R=v.getStatus();if(se(bt,`RPC '${e}' ${h} failed with status:`,R,"response text:",v.getResponseText()),R>0){let j=v.getResponseJson();Array.isArray(j)&&(j=j[0]);const J=j==null?void 0:j.error;if(J&&J.status&&J.message){const X=(function(Ee){const ge=Ee.toLowerCase().replace(/_/g,"-");return Object.values($).indexOf(ge)>=0?ge:$.UNKNOWN})(J.status);y(new ne(X,J.message))}else y(new ne($.UNKNOWN,"Server responded with status "+v.getStatus()))}else y(new ne($.UNAVAILABLE,"Connection failed."));break;default:me(9055,{l_:e,streamId:h,h_:v.getLastErrorCode(),P_:v.getLastError()})}}finally{se(bt,`RPC '${e}' ${h} completed.`)}}));const w=JSON.stringify(o);se(bt,`RPC '${e}' ${h} sending request:`,o),v.send(t,"POST",w,s,15)}))}T_(e,t,s){const o=bd(),u=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],h=this.createWebChannelTransport(),m={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},y=this.longPollingOptions.timeoutSeconds;y!==void 0&&(m.longPollingTimeout=Math.round(1e3*y)),this.useFetchStreams&&(m.useFetchStreams=!0),this.Go(m.initMessageHeaders,t,s),m.encodeInitMessageHeaders=!0;const v=u.join("");se(bt,`Creating RPC '${e}' stream ${o}: ${v}`,m);const w=h.createWebChannel(v,m);this.I_(w);let A=!1,R=!1;const j=new yA({Ho:J=>{R?se(bt,`Not sending because RPC '${e}' stream ${o} is closed:`,J):(A||(se(bt,`Opening RPC '${e}' stream ${o} transport.`),w.open(),A=!0),se(bt,`RPC '${e}' stream ${o} sending:`,J),w.send(J))},Jo:()=>w.close()});return Aa(w,Ca.EventType.OPEN,(()=>{R||(se(bt,`RPC '${e}' stream ${o} transport opened.`),j.i_())})),Aa(w,Ca.EventType.CLOSE,(()=>{R||(R=!0,se(bt,`RPC '${e}' stream ${o} transport closed`),j.o_(),this.E_(w))})),Aa(w,Ca.EventType.ERROR,(J=>{R||(R=!0,hs(bt,`RPC '${e}' stream ${o} transport errored. Name:`,J.name,"Message:",J.message),j.o_(new ne($.UNAVAILABLE,"The operation could not be completed")))})),Aa(w,Ca.EventType.MESSAGE,(J=>{var X;if(!R){const Q=J.data[0];ze(!!Q,16349);const Ee=Q,ge=(Ee==null?void 0:Ee.error)||((X=Ee[0])==null?void 0:X.error);if(ge){se(bt,`RPC '${e}' stream ${o} received error:`,ge);const Ce=ge.status;let Oe=(function(N){const S=ft[N];if(S!==void 0)return dv(S)})(Ce),be=ge.message;Ce==="NOT_FOUND"&&be.includes("database")&&be.includes("does not exist")&&be.includes(this.databaseId.database)&&hs(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),Oe===void 0&&(Oe=$.INTERNAL,be="Unknown error status: "+Ce+" with message "+ge.message),R=!0,j.o_(new ne(Oe,be)),w.close()}else se(bt,`RPC '${e}' stream ${o} received:`,Q),j.__(Q)}})),fo.u_(),setTimeout((()=>{j.s_()}),0),j}terminate(){this.a_.forEach((e=>e.close())),this.a_=[]}I_(e){this.a_.push(e)}E_(e){this.a_=this.a_.filter((t=>t===e))}Go(e,t,s){super.Go(e,t,s),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return V_()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _A(r){return new fo(r)}function cd(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ec(r){return new TS(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */fo.c_=!1;class Cv{constructor(e,t,s=1e3,o=1.5,u=6e4){this.Ci=e,this.timerId=t,this.R_=s,this.A_=o,this.V_=u,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),s=Math.max(0,Date.now()-this.f_),o=Math.max(0,t-s);o>0&&se("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,o,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dy="PersistentStream";class kv{constructor(e,t,s,o,u,h,m,y){this.Ci=e,this.b_=s,this.S_=o,this.connection=u,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=m,this.listener=y,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Cv(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.b_,6e4,(()=>this.k_())))}K_(e){this.q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===$.RESOURCE_EXHAUSTED?(Nr(t.toString()),Nr("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===$.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,o])=>{this.D_===t&&this.G_(s,o)}),(s=>{e((()=>{const o=new ne($.UNKNOWN,"Fetching auth token failed: "+s.message);return this.z_(o)}))}))}G_(e,t){const s=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.Yo((()=>{s((()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.S_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.Yo())))})),this.stream.t_((o=>{s((()=>this.z_(o)))})),this.stream.onMessage((o=>{s((()=>++this.F_==1?this.H_(o):this.onNext(o)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return se(dy,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget((()=>this.D_===e?t():(se(dy,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class vA extends kv{constructor(e,t,s,o,u,h){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,o,h),this.serializer=u}j_(e,t){return this.connection.T_("Listen",e,t)}H_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=AS(this.serializer,e),s=(function(u){if(!("targetChange"in u))return we.min();const h=u.targetChange;return h.targetIds&&h.targetIds.length?we.min():h.readTime?nr(h.readTime):we.min()})(e);return this.listener.J_(t,s)}Z_(e){const t={};t.database=Od(this.serializer),t.addTarget=(function(u,h){let m;const y=h.target;if(m=kd(y)?{documents:kS(u,y)}:{query:PS(u,y).ft},m.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){m.resumeToken=mv(u,h.resumeToken);const v=Dd(u,h.expectedCount);v!==null&&(m.expectedCount=v)}else if(h.snapshotVersion.compareTo(we.min())>0){m.readTime=ec(u,h.snapshotVersion.toTimestamp());const v=Dd(u,h.expectedCount);v!==null&&(m.expectedCount=v)}return m})(this.serializer,e);const s=DS(this.serializer,e);s&&(t.labels=s),this.K_(t)}X_(e){const t={};t.database=Od(this.serializer),t.removeTarget=e,this.K_(t)}}class EA extends kv{constructor(e,t,s,o,u,h){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,o,h),this.serializer=u}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}H_(e){return ze(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,ze(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){ze(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=CS(e.writeResults,e.commitTime),s=nr(e.commitTime);return this.listener.na(s,t)}ra(){const e={};e.database=Od(this.serializer),this.K_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>RS(this.serializer,s)))};this.K_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wA{}class TA extends wA{constructor(e,t,s,o){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=o,this.ia=!1}sa(){if(this.ia)throw new ne($.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([u,h])=>this.connection.Wo(e,Vd(t,s),o,u,h))).catch((u=>{throw u.name==="FirebaseError"?(u.code===$.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),u):new ne($.UNKNOWN,u.toString())}))}jo(e,t,s,o,u){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([h,m])=>this.connection.jo(e,Vd(t,s),o,h,m,u))).catch((h=>{throw h.name==="FirebaseError"?(h.code===$.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new ne($.UNKNOWN,h.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}function IA(r,e,t,s){return new TA(r,e,t,s)}class SA{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Nr(t),this.aa=!1):se("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ds="RemoteStore";class AA{constructor(e,t,s,o,u){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.Ra=[],this.Aa=u,this.Aa.Mo((h=>{s.enqueueAndForget((async()=>{gs(this)&&(se(ds,"Restarting streams for network reachability change."),await(async function(y){const v=Re(y);v.Ea.add(4),await rl(v),v.Va.set("Unknown"),v.Ea.delete(4),await wc(v)})(this))}))})),this.Va=new SA(s,o)}}async function wc(r){if(gs(r))for(const e of r.Ra)await e(!0)}async function rl(r){for(const e of r.Ra)await e(!1)}function Pv(r,e){const t=Re(r);t.Ia.has(e.targetId)||(t.Ia.set(e.targetId,e),Ef(t)?vf(t):Po(t).O_()&&_f(t,e))}function yf(r,e){const t=Re(r),s=Po(t);t.Ia.delete(e),s.O_()&&Nv(t,e),t.Ia.size===0&&(s.O_()?s.L_():gs(t)&&t.Va.set("Unknown"))}function _f(r,e){if(r.da.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(we.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Po(r).Z_(e)}function Nv(r,e){r.da.$e(e),Po(r).X_(e)}function vf(r){r.da=new _S({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),At:e=>r.Ia.get(e)||null,ht:()=>r.datastore.serializer.databaseId}),Po(r).start(),r.Va.ua()}function Ef(r){return gs(r)&&!Po(r).x_()&&r.Ia.size>0}function gs(r){return Re(r).Ea.size===0}function Dv(r){r.da=void 0}async function RA(r){r.Va.set("Online")}async function CA(r){r.Ia.forEach(((e,t)=>{_f(r,e)}))}async function kA(r,e){Dv(r),Ef(r)?(r.Va.ha(e),vf(r)):r.Va.set("Unknown")}async function PA(r,e,t){if(r.Va.set("Online"),e instanceof pv&&e.state===2&&e.cause)try{await(async function(o,u){const h=u.cause;for(const m of u.targetIds)o.Ia.has(m)&&(await o.remoteSyncer.rejectListen(m,h),o.Ia.delete(m),o.da.removeTarget(m))})(r,e)}catch(s){se(ds,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await nc(r,s)}else if(e instanceof Fu?r.da.Xe(e):e instanceof fv?r.da.st(e):r.da.tt(e),!t.isEqual(we.min()))try{const s=await Rv(r.localStore);t.compareTo(s)>=0&&await(function(u,h){const m=u.da.Tt(h);return m.targetChanges.forEach(((y,v)=>{if(y.resumeToken.approximateByteSize()>0){const w=u.Ia.get(v);w&&u.Ia.set(v,w.withResumeToken(y.resumeToken,h))}})),m.targetMismatches.forEach(((y,v)=>{const w=u.Ia.get(y);if(!w)return;u.Ia.set(y,w.withResumeToken(Nt.EMPTY_BYTE_STRING,w.snapshotVersion)),Nv(u,y);const A=new fi(w.target,y,v,w.sequenceNumber);_f(u,A)})),u.remoteSyncer.applyRemoteEvent(m)})(r,t)}catch(s){se(ds,"Failed to raise snapshot:",s),await nc(r,s)}}async function nc(r,e,t){if(!Co(e))throw e;r.Ea.add(1),await rl(r),r.Va.set("Offline"),t||(t=()=>Rv(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{se(ds,"Retrying IndexedDB access"),await t(),r.Ea.delete(1),await wc(r)}))}function Vv(r,e){return e().catch((t=>nc(r,t,e)))}async function Tc(r){const e=Re(r),t=Ii(e);let s=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:nf;for(;NA(e);)try{const o=await cA(e.localStore,s);if(o===null){e.Ta.length===0&&t.L_();break}s=o.batchId,DA(e,o)}catch(o){await nc(e,o)}xv(e)&&Ov(e)}function NA(r){return gs(r)&&r.Ta.length<10}function DA(r,e){r.Ta.push(e);const t=Ii(r);t.O_()&&t.Y_&&t.ea(e.mutations)}function xv(r){return gs(r)&&!Ii(r).x_()&&r.Ta.length>0}function Ov(r){Ii(r).start()}async function VA(r){Ii(r).ra()}async function xA(r){const e=Ii(r);for(const t of r.Ta)e.ea(t.mutations)}async function OA(r,e,t){const s=r.Ta.shift(),o=cf.from(s,e,t);await Vv(r,(()=>r.remoteSyncer.applySuccessfulWrite(o))),await Tc(r)}async function LA(r,e){e&&Ii(r).Y_&&await(async function(s,o){if((function(h){return mS(h)&&h!==$.ABORTED})(o.code)){const u=s.Ta.shift();Ii(s).B_(),await Vv(s,(()=>s.remoteSyncer.rejectFailedWrite(u.batchId,o))),await Tc(s)}})(r,e),xv(r)&&Ov(r)}async function fy(r,e){const t=Re(r);t.asyncQueue.verifyOperationInProgress(),se(ds,"RemoteStore received new credentials");const s=gs(t);t.Ea.add(3),await rl(t),s&&t.Va.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ea.delete(3),await wc(t)}async function bA(r,e){const t=Re(r);e?(t.Ea.delete(2),await wc(t)):e||(t.Ea.add(2),await rl(t),t.Va.set("Unknown"))}function Po(r){return r.ma||(r.ma=(function(t,s,o){const u=Re(t);return u.sa(),new vA(s,u.connection,u.authCredentials,u.appCheckCredentials,u.serializer,o)})(r.datastore,r.asyncQueue,{Zo:RA.bind(null,r),Yo:CA.bind(null,r),t_:kA.bind(null,r),J_:PA.bind(null,r)}),r.Ra.push((async e=>{e?(r.ma.B_(),Ef(r)?vf(r):r.Va.set("Unknown")):(await r.ma.stop(),Dv(r))}))),r.ma}function Ii(r){return r.fa||(r.fa=(function(t,s,o){const u=Re(t);return u.sa(),new EA(s,u.connection,u.authCredentials,u.appCheckCredentials,u.serializer,o)})(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),Yo:VA.bind(null,r),t_:LA.bind(null,r),ta:xA.bind(null,r),na:OA.bind(null,r)}),r.Ra.push((async e=>{e?(r.fa.B_(),await Tc(r)):(await r.fa.stop(),r.Ta.length>0&&(se(ds,`Stopping write stream with ${r.Ta.length} pending writes`),r.Ta=[]))}))),r.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wf{constructor(e,t,s,o,u){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=o,this.removalCallback=u,this.deferred=new Cr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,o,u){const h=Date.now()+s,m=new wf(e,t,h,o,u);return m.start(s),m}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new ne($.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Tf(r,e){if(Nr("AsyncQueue",`${e}: ${r}`),Co(r))return new ne($.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class po{static emptySet(e){return new po(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||de.comparator(t.key,s.key):(t,s)=>de.comparator(t.key,s.key),this.keyedMap=ka(),this.sortedSet=new tt(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof po)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const o=t.getNext().key,u=s.getNext().key;if(!o.isEqual(u))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new po;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class py{constructor(){this.ga=new tt(de.comparator)}track(e){const t=e.doc.key,s=this.ga.get(t);s?e.type!==0&&s.type===3?this.ga=this.ga.insert(t,e):e.type===3&&s.type!==1?this.ga=this.ga.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.ga=this.ga.remove(t):e.type===1&&s.type===2?this.ga=this.ga.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):me(63341,{Vt:e,pa:s}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal(((t,s)=>{e.push(s)})),e}}class wo{constructor(e,t,s,o,u,h,m,y,v){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=o,this.mutatedKeys=u,this.fromCache=h,this.syncStateChanged=m,this.excludesMetadataChanges=y,this.hasCachedResults=v}static fromInitialDocuments(e,t,s,o,u){const h=[];return t.forEach((m=>{h.push({type:0,doc:m})})),new wo(e,t,po.emptySet(t),h,s,o,!0,!1,u)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&mc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let o=0;o<t.length;o++)if(t[o].type!==s[o].type||!t[o].doc.isEqual(s[o].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MA{constructor(){this.wa=void 0,this.ba=[]}Sa(){return this.ba.some((e=>e.Da()))}}class FA{constructor(){this.queries=my(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,s){const o=Re(t),u=o.queries;o.queries=my(),u.forEach(((h,m)=>{for(const y of m.ba)y.onError(s)}))})(this,new ne($.ABORTED,"Firestore shutting down"))}}function my(){return new ps((r=>ev(r)),mc)}async function If(r,e){const t=Re(r);let s=3;const o=e.query;let u=t.queries.get(o);u?!u.Sa()&&e.Da()&&(s=2):(u=new MA,s=e.Da()?0:1);try{switch(s){case 0:u.wa=await t.onListen(o,!0);break;case 1:u.wa=await t.onListen(o,!1);break;case 2:await t.onFirstRemoteStoreListen(o)}}catch(h){const m=Tf(h,`Initialization of query '${oo(e.query)}' failed`);return void e.onError(m)}t.queries.set(o,u),u.ba.push(e),e.va(t.onlineState),u.wa&&e.Fa(u.wa)&&Af(t)}async function Sf(r,e){const t=Re(r),s=e.query;let o=3;const u=t.queries.get(s);if(u){const h=u.ba.indexOf(e);h>=0&&(u.ba.splice(h,1),u.ba.length===0?o=e.Da()?0:1:!u.Sa()&&e.Da()&&(o=2))}switch(o){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function UA(r,e){const t=Re(r);let s=!1;for(const o of e){const u=o.query,h=t.queries.get(u);if(h){for(const m of h.ba)m.Fa(o)&&(s=!0);h.wa=o}}s&&Af(t)}function jA(r,e,t){const s=Re(r),o=s.queries.get(e);if(o)for(const u of o.ba)u.onError(t);s.queries.delete(e)}function Af(r){r.Ca.forEach((e=>{e.next()}))}var Md,gy;(gy=Md||(Md={})).Ma="default",gy.Cache="cache";class Rf{constructor(e,t,s){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=s||{}}Fa(e){if(!this.options.includeMetadataChanges){const s=[];for(const o of e.docChanges)o.type!==3&&s.push(o);e=new wo(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const s=t!=="Offline";return(!this.options.Ka||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=wo.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==Md.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lv{constructor(e){this.key=e}}class bv{constructor(e){this.key=e}}class zA{constructor(e,t){this.query=e,this.Za=t,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=De(),this.mutatedKeys=De(),this.eu=tv(e),this.tu=new po(this.eu)}get nu(){return this.Za}ru(e,t){const s=t?t.iu:new py,o=t?t.tu:this.tu;let u=t?t.mutatedKeys:this.mutatedKeys,h=o,m=!1;const y=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,v=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal(((w,A)=>{const R=o.get(w),j=gc(this.query,A)?A:null,J=!!R&&this.mutatedKeys.has(R.key),X=!!j&&(j.hasLocalMutations||this.mutatedKeys.has(j.key)&&j.hasCommittedMutations);let Q=!1;R&&j?R.data.isEqual(j.data)?J!==X&&(s.track({type:3,doc:j}),Q=!0):this.su(R,j)||(s.track({type:2,doc:j}),Q=!0,(y&&this.eu(j,y)>0||v&&this.eu(j,v)<0)&&(m=!0)):!R&&j?(s.track({type:0,doc:j}),Q=!0):R&&!j&&(s.track({type:1,doc:R}),Q=!0,(y||v)&&(m=!0)),Q&&(j?(h=h.add(j),u=X?u.add(w):u.delete(w)):(h=h.delete(w),u=u.delete(w)))})),this.query.limit!==null)for(;h.size>this.query.limit;){const w=this.query.limitType==="F"?h.last():h.first();h=h.delete(w.key),u=u.delete(w.key),s.track({type:1,doc:w})}return{tu:h,iu:s,Ss:m,mutatedKeys:u}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,o){const u=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const h=e.iu.ya();h.sort(((w,A)=>(function(j,J){const X=Q=>{switch(Q){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return me(20277,{Vt:Q})}};return X(j)-X(J)})(w.type,A.type)||this.eu(w.doc,A.doc))),this.ou(s),o=o??!1;const m=t&&!o?this._u():[],y=this.Ya.size===0&&this.current&&!o?1:0,v=y!==this.Xa;return this.Xa=y,h.length!==0||v?{snapshot:new wo(this.query,e.tu,u,h,e.mutatedKeys,y===0,v,!1,!!s&&s.resumeToken.approximateByteSize()>0),au:m}:{au:m}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new py,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((t=>this.Za=this.Za.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Za=this.Za.delete(t))),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=De(),this.tu.forEach((s=>{this.uu(s.key)&&(this.Ya=this.Ya.add(s.key))}));const t=[];return e.forEach((s=>{this.Ya.has(s)||t.push(new bv(s))})),this.Ya.forEach((s=>{e.has(s)||t.push(new Lv(s))})),t}cu(e){this.Za=e.ks,this.Ya=De();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return wo.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Xa===0,this.hasCachedResults)}}const Cf="SyncEngine";class BA{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class $A{constructor(e){this.key=e,this.hu=!1}}class qA{constructor(e,t,s,o,u,h){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=o,this.currentUser=u,this.maxConcurrentLimboResolutions=h,this.Pu={},this.Tu=new ps((m=>ev(m)),mc),this.Iu=new Map,this.Eu=new Set,this.Ru=new tt(de.comparator),this.Au=new Map,this.Vu=new ff,this.du={},this.mu=new Map,this.fu=Eo.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function HA(r,e,t=!0){const s=Bv(r);let o;const u=s.Tu.get(e);return u?(s.sharedClientState.addLocalQueryTarget(u.targetId),o=u.view.lu()):o=await Mv(s,e,t,!0),o}async function WA(r,e){const t=Bv(r);await Mv(t,e,!0,!1)}async function Mv(r,e,t,s){const o=await hA(r.localStore,tr(e)),u=o.targetId,h=r.sharedClientState.addLocalQueryTarget(u,t);let m;return s&&(m=await GA(r,e,u,h==="current",o.resumeToken)),r.isPrimaryClient&&t&&Pv(r.remoteStore,o),m}async function GA(r,e,t,s,o){r.pu=(A,R,j)=>(async function(X,Q,Ee,ge){let Ce=Q.view.ru(Ee);Ce.Ss&&(Ce=await ly(X.localStore,Q.query,!1).then((({documents:N})=>Q.view.ru(N,Ce))));const Oe=ge&&ge.targetChanges.get(Q.targetId),be=ge&&ge.targetMismatches.get(Q.targetId)!=null,Ve=Q.view.applyChanges(Ce,X.isPrimaryClient,Oe,be);return _y(X,Q.targetId,Ve.au),Ve.snapshot})(r,A,R,j);const u=await ly(r.localStore,e,!0),h=new zA(e,u.ks),m=h.ru(u.documents),y=nl.createSynthesizedTargetChangeForCurrentChange(t,s&&r.onlineState!=="Offline",o),v=h.applyChanges(m,r.isPrimaryClient,y);_y(r,t,v.au);const w=new BA(e,t,h);return r.Tu.set(e,w),r.Iu.has(t)?r.Iu.get(t).push(e):r.Iu.set(t,[e]),v.snapshot}async function KA(r,e,t){const s=Re(r),o=s.Tu.get(e),u=s.Iu.get(o.targetId);if(u.length>1)return s.Iu.set(o.targetId,u.filter((h=>!mc(h,e)))),void s.Tu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(o.targetId),s.sharedClientState.isActiveQueryTarget(o.targetId)||await Ld(s.localStore,o.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(o.targetId),t&&yf(s.remoteStore,o.targetId),Fd(s,o.targetId)})).catch(Ro)):(Fd(s,o.targetId),await Ld(s.localStore,o.targetId,!0))}async function QA(r,e){const t=Re(r),s=t.Tu.get(e),o=t.Iu.get(s.targetId);t.isPrimaryClient&&o.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),yf(t.remoteStore,s.targetId))}async function YA(r,e,t){const s=rR(r);try{const o=await(function(h,m){const y=Re(h),v=Ge.now(),w=m.reduce(((j,J)=>j.add(J.key)),De());let A,R;return y.persistence.runTransaction("Locally write mutations","readwrite",(j=>{let J=Dr(),X=De();return y.xs.getEntries(j,w).next((Q=>{J=Q,J.forEach(((Ee,ge)=>{ge.isValidDocument()||(X=X.add(Ee))}))})).next((()=>y.localDocuments.getOverlayedDocuments(j,J))).next((Q=>{A=Q;const Ee=[];for(const ge of m){const Ce=cS(ge,A.get(ge.key).overlayedDocument);Ce!=null&&Ee.push(new ms(ge.key,Ce,W_(Ce.value.mapValue),Vn.exists(!0)))}return y.mutationQueue.addMutationBatch(j,v,Ee,m)})).next((Q=>{R=Q;const Ee=Q.applyToLocalDocumentSet(A,X);return y.documentOverlayCache.saveOverlays(j,Q.batchId,Ee)}))})).then((()=>({batchId:R.batchId,changes:rv(A)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(o.batchId),(function(h,m,y){let v=h.du[h.currentUser.toKey()];v||(v=new tt(Ne)),v=v.insert(m,y),h.du[h.currentUser.toKey()]=v})(s,o.batchId,t),await il(s,o.changes),await Tc(s.remoteStore)}catch(o){const u=Tf(o,"Failed to persist write");t.reject(u)}}async function Fv(r,e){const t=Re(r);try{const s=await lA(t.localStore,e);e.targetChanges.forEach(((o,u)=>{const h=t.Au.get(u);h&&(ze(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.hu=!0:o.modifiedDocuments.size>0?ze(h.hu,14607):o.removedDocuments.size>0&&(ze(h.hu,42227),h.hu=!1))})),await il(t,s,e)}catch(s){await Ro(s)}}function yy(r,e,t){const s=Re(r);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const o=[];s.Tu.forEach(((u,h)=>{const m=h.view.va(e);m.snapshot&&o.push(m.snapshot)})),(function(h,m){const y=Re(h);y.onlineState=m;let v=!1;y.queries.forEach(((w,A)=>{for(const R of A.ba)R.va(m)&&(v=!0)})),v&&Af(y)})(s.eventManager,e),o.length&&s.Pu.J_(o),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function JA(r,e,t){const s=Re(r);s.sharedClientState.updateQueryState(e,"rejected",t);const o=s.Au.get(e),u=o&&o.key;if(u){let h=new tt(de.comparator);h=h.insert(u,Ft.newNoDocument(u,we.min()));const m=De().add(u),y=new vc(we.min(),new Map,new tt(Ne),h,m);await Fv(s,y),s.Ru=s.Ru.remove(u),s.Au.delete(e),kf(s)}else await Ld(s.localStore,e,!1).then((()=>Fd(s,e,t))).catch(Ro)}async function XA(r,e){const t=Re(r),s=e.batch.batchId;try{const o=await aA(t.localStore,e);jv(t,s,null),Uv(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await il(t,o)}catch(o){await Ro(o)}}async function ZA(r,e,t){const s=Re(r);try{const o=await(function(h,m){const y=Re(h);return y.persistence.runTransaction("Reject batch","readwrite-primary",(v=>{let w;return y.mutationQueue.lookupMutationBatch(v,m).next((A=>(ze(A!==null,37113),w=A.keys(),y.mutationQueue.removeMutationBatch(v,A)))).next((()=>y.mutationQueue.performConsistencyCheck(v))).next((()=>y.documentOverlayCache.removeOverlaysForBatchId(v,w,m))).next((()=>y.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(v,w))).next((()=>y.localDocuments.getDocuments(v,w)))}))})(s.localStore,e);jv(s,e,t),Uv(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await il(s,o)}catch(o){await Ro(o)}}function Uv(r,e){(r.mu.get(e)||[]).forEach((t=>{t.resolve()})),r.mu.delete(e)}function jv(r,e,t){const s=Re(r);let o=s.du[s.currentUser.toKey()];if(o){const u=o.get(e);u&&(t?u.reject(t):u.resolve(),o=o.remove(e)),s.du[s.currentUser.toKey()]=o}}function Fd(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const s of r.Iu.get(e))r.Tu.delete(s),t&&r.Pu.yu(s,t);r.Iu.delete(e),r.isPrimaryClient&&r.Vu.Gr(e).forEach((s=>{r.Vu.containsKey(s)||zv(r,s)}))}function zv(r,e){r.Eu.delete(e.path.canonicalString());const t=r.Ru.get(e);t!==null&&(yf(r.remoteStore,t),r.Ru=r.Ru.remove(e),r.Au.delete(t),kf(r))}function _y(r,e,t){for(const s of t)s instanceof Lv?(r.Vu.addReference(s.key,e),eR(r,s)):s instanceof bv?(se(Cf,"Document no longer in limbo: "+s.key),r.Vu.removeReference(s.key,e),r.Vu.containsKey(s.key)||zv(r,s.key)):me(19791,{wu:s})}function eR(r,e){const t=e.key,s=t.path.canonicalString();r.Ru.get(t)||r.Eu.has(s)||(se(Cf,"New document in limbo: "+t),r.Eu.add(s),kf(r))}function kf(r){for(;r.Eu.size>0&&r.Ru.size<r.maxConcurrentLimboResolutions;){const e=r.Eu.values().next().value;r.Eu.delete(e);const t=new de(We.fromString(e)),s=r.fu.next();r.Au.set(s,new $A(t)),r.Ru=r.Ru.insert(t,s),Pv(r.remoteStore,new fi(tr(pc(t.path)),s,"TargetPurposeLimboResolution",hc.ce))}}async function il(r,e,t){const s=Re(r),o=[],u=[],h=[];s.Tu.isEmpty()||(s.Tu.forEach(((m,y)=>{h.push(s.pu(y,e,t).then((v=>{var w;if((v||t)&&s.isPrimaryClient){const A=v?!v.fromCache:(w=t==null?void 0:t.targetChanges.get(y.targetId))==null?void 0:w.current;s.sharedClientState.updateQueryState(y.targetId,A?"current":"not-current")}if(v){o.push(v);const A=mf.Es(y.targetId,v);u.push(A)}})))})),await Promise.all(h),s.Pu.J_(o),await(async function(y,v){const w=Re(y);try{await w.persistence.runTransaction("notifyLocalViewChanges","readwrite",(A=>q.forEach(v,(R=>q.forEach(R.Ts,(j=>w.persistence.referenceDelegate.addReference(A,R.targetId,j))).next((()=>q.forEach(R.Is,(j=>w.persistence.referenceDelegate.removeReference(A,R.targetId,j)))))))))}catch(A){if(!Co(A))throw A;se(gf,"Failed to update sequence numbers: "+A)}for(const A of v){const R=A.targetId;if(!A.fromCache){const j=w.vs.get(R),J=j.snapshotVersion,X=j.withLastLimboFreeSnapshotVersion(J);w.vs=w.vs.insert(R,X)}}})(s.localStore,u))}async function tR(r,e){const t=Re(r);if(!t.currentUser.isEqual(e)){se(Cf,"User change. New user:",e.toKey());const s=await Av(t.localStore,e);t.currentUser=e,(function(u,h){u.mu.forEach((m=>{m.forEach((y=>{y.reject(new ne($.CANCELLED,h))}))})),u.mu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await il(t,s.Ns)}}function nR(r,e){const t=Re(r),s=t.Au.get(e);if(s&&s.hu)return De().add(s.key);{let o=De();const u=t.Iu.get(e);if(!u)return o;for(const h of u){const m=t.Tu.get(h);o=o.unionWith(m.view.nu)}return o}}function Bv(r){const e=Re(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Fv.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=nR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=JA.bind(null,e),e.Pu.J_=UA.bind(null,e.eventManager),e.Pu.yu=jA.bind(null,e.eventManager),e}function rR(r){const e=Re(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=XA.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=ZA.bind(null,e),e}class rc{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ec(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return oA(this.persistence,new rA,e.initialUser,this.serializer)}Cu(e){return new Sv(pf.Vi,this.serializer)}Du(e){return new fA}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}rc.provider={build:()=>new rc};class iR extends rc{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){ze(this.persistence.referenceDelegate instanceof tc,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new BS(s,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?Yt.withCacheSize(this.cacheSizeBytes):Yt.DEFAULT;return new Sv((s=>tc.Vi(s,t)),this.serializer)}}class Ud{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>yy(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=tR.bind(null,this.syncEngine),await bA(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new FA})()}createDatastore(e){const t=Ec(e.databaseInfo.databaseId),s=_A(e.databaseInfo);return IA(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,o,u,h,m){return new AA(s,o,u,h,m)})(this.localStore,this.datastore,e.asyncQueue,(t=>yy(this.syncEngine,t,0)),(function(){return hy.v()?new hy:new pA})())}createSyncEngine(e,t){return(function(o,u,h,m,y,v,w){const A=new qA(o,u,h,m,y,v);return w&&(A.gu=!0),A})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(o){const u=Re(o);se(ds,"RemoteStore shutting down."),u.Ea.add(5),await rl(u),u.Aa.shutdown(),u.Va.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Ud.provider={build:()=>new Ud};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pf{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):Nr("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Si="FirestoreClient";class sR{constructor(e,t,s,o,u){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this._databaseInfo=o,this.user=Mt.UNAUTHENTICATED,this.clientId=tf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=u,this.authCredentials.start(s,(async h=>{se(Si,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h})),this.appCheckCredentials.start(s,(h=>(se(Si,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Cr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=Tf(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function hd(r,e){r.asyncQueue.verifyOperationInProgress(),se(Si,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let s=t.initialUser;r.setCredentialChangeListener((async o=>{s.isEqual(o)||(await Av(e.localStore,o),s=o)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function vy(r,e){r.asyncQueue.verifyOperationInProgress();const t=await oR(r);se(Si,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((s=>fy(e.remoteStore,s))),r.setAppCheckTokenChangeListener(((s,o)=>fy(e.remoteStore,o))),r._onlineComponents=e}async function oR(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){se(Si,"Using user provided OfflineComponentProvider");try{await hd(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(o){return o.name==="FirebaseError"?o.code===$.FAILED_PRECONDITION||o.code===$.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11})(t))throw t;hs("Error using user provided cache. Falling back to memory cache: "+t),await hd(r,new rc)}}else se(Si,"Using default OfflineComponentProvider"),await hd(r,new iR(void 0));return r._offlineComponents}async function $v(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(se(Si,"Using user provided OnlineComponentProvider"),await vy(r,r._uninitializedComponentsProvider._online)):(se(Si,"Using default OnlineComponentProvider"),await vy(r,new Ud))),r._onlineComponents}function aR(r){return $v(r).then((e=>e.syncEngine))}async function ic(r){const e=await $v(r),t=e.eventManager;return t.onListen=HA.bind(null,e.syncEngine),t.onUnlisten=KA.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=WA.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=QA.bind(null,e.syncEngine),t}function lR(r,e,t,s){const o=new Pf(s),u=new Rf(e,o,t);return r.asyncQueue.enqueueAndForget((async()=>If(await ic(r),u))),()=>{o.Nu(),r.asyncQueue.enqueueAndForget((async()=>Sf(await ic(r),u)))}}function uR(r,e,t={}){const s=new Cr;return r.asyncQueue.enqueueAndForget((async()=>(function(u,h,m,y,v){const w=new Pf({next:R=>{w.Nu(),h.enqueueAndForget((()=>Sf(u,A)));const j=R.docs.has(m);!j&&R.fromCache?v.reject(new ne($.UNAVAILABLE,"Failed to get document because the client is offline.")):j&&R.fromCache&&y&&y.source==="server"?v.reject(new ne($.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):v.resolve(R)},error:R=>v.reject(R)}),A=new Rf(pc(m.path),w,{includeMetadataChanges:!0,Ka:!0});return If(u,A)})(await ic(r),r.asyncQueue,e,t,s))),s.promise}function cR(r,e,t={}){const s=new Cr;return r.asyncQueue.enqueueAndForget((async()=>(function(u,h,m,y,v){const w=new Pf({next:R=>{w.Nu(),h.enqueueAndForget((()=>Sf(u,A))),R.fromCache&&y.source==="server"?v.reject(new ne($.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):v.resolve(R)},error:R=>v.reject(R)}),A=new Rf(m,w,{includeMetadataChanges:!0,Ka:!0});return If(u,A)})(await ic(r),r.asyncQueue,e,t,s))),s.promise}function hR(r,e){const t=new Cr;return r.asyncQueue.enqueueAndForget((async()=>YA(await aR(r),e,t))),t.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qv(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dR="ComponentProvider",Ey=new Map;function fR(r,e,t,s,o){return new D1(r,e,t,o.host,o.ssl,o.experimentalForceLongPolling,o.experimentalAutoDetectLongPolling,qv(o.experimentalLongPollingOptions),o.useFetchStreams,o.isUsingEmulator,s)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hv="firestore.googleapis.com",wy=!0;class Ty{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new ne($.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Hv,this.ssl=wy}else this.host=e.host,this.ssl=e.ssl??wy;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Iv;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<jS)throw new ne($.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}E1("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=qv(e.experimentalLongPollingOptions??{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new ne($.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new ne($.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new ne($.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,o){return s.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ic{constructor(e,t,s,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ty({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new ne($.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new ne($.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ty(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new c1;switch(s.type){case"firstParty":return new p1(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new ne($.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=Ey.get(t);s&&(se(dR,"Removing Datastore"),Ey.delete(t),s.terminate())})(this),Promise.resolve()}}function pR(r,e,t,s={}){var v;r=yn(r,Ic);const o=To(e),u=r._getSettings(),h={...u,emulatorOptions:r._getEmulatorOptions()},m=`${e}:${t}`;o&&(By(`https://${m}`),$y("Firestore",!0)),u.host!==Hv&&u.host!==m&&hs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const y={...u,host:m,ssl:o,emulatorOptions:s};if(!as(y,h)&&(r._setSettings(y),s.mockUserToken)){let w,A;if(typeof s.mockUserToken=="string")w=s.mockUserToken,A=Mt.MOCK_USER;else{w=Ow(s.mockUserToken,(v=r._app)==null?void 0:v.options.projectId);const R=s.mockUserToken.sub||s.mockUserToken.user_id;if(!R)throw new ne($.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");A=new Mt(R)}r._authCredentials=new h1(new O_(w,A))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ri{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Ri(this.firestore,e,this._query)}}class ut{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new _i(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ut(this.firestore,e,this._key)}toJSON(){return{type:ut._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(el(t,ut._jsonSchema))return new ut(e,s||null,new de(We.fromString(t.referencePath)))}}ut._jsonSchemaVersion="firestore/documentReference/1.0",ut._jsonSchema={type:mt("string",ut._jsonSchemaVersion),referencePath:mt("string")};class _i extends Ri{constructor(e,t,s){super(e,t,pc(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ut(this.firestore,null,new de(e))}withConverter(e){return new _i(this.firestore,e,this._path)}}function ku(r,e,...t){if(r=jt(r),L_("collection","path",e),r instanceof Ic){const s=We.fromString(e,...t);return Lg(s),new _i(r,null,s)}{if(!(r instanceof ut||r instanceof _i))throw new ne($.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(We.fromString(e,...t));return Lg(s),new _i(r.firestore,null,s)}}function Uu(r,e,...t){if(r=jt(r),arguments.length===1&&(e=tf.newId()),L_("doc","path",e),r instanceof Ic){const s=We.fromString(e,...t);return Og(s),new ut(r,null,new de(s))}{if(!(r instanceof ut||r instanceof _i))throw new ne($.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(We.fromString(e,...t));return Og(s),new ut(r.firestore,r instanceof _i?r.converter:null,new de(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iy="AsyncQueue";class Sy{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Cv(this,"async_queue_retry"),this._c=()=>{const s=cd();s&&se(Iy,"Visibility state changed to "+s.visibilityState),this.M_.w_()},this.ac=e;const t=cd();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=cd();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new Cr;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!Co(e))throw e;se(Iy,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((s=>{throw this.nc=s,this.rc=!1,Nr("INTERNAL UNHANDLED ERROR: ",Ay(s)),s})).then((s=>(this.rc=!1,s))))));return this.ac=t,t}enqueueAfterDelay(e,t,s){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const o=wf.createAndSchedule(this,e,t,s,(u=>this.hc(u)));return this.tc.push(o),o}uc(){this.nc&&me(47125,{Pc:Ay(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then((()=>{this.tc.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Ay(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class Ai extends Ic{constructor(e,t,s,o){super(e,t,s,o),this.type="firestore",this._queue=new Sy,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Sy(e),this._firestoreClient=void 0,await e}}}function mR(r,e){const t=typeof r=="object"?r:Gy(),s=typeof r=="string"?r:Yu,o=$d(t,"firestore").getImmediate({identifier:s});if(!o._initialized){const u=Vw("firestore");u&&pR(o,...u)}return o}function Sc(r){if(r._terminated)throw new ne($.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||gR(r),r._firestoreClient}function gR(r){var s,o,u,h;const e=r._freezeSettings(),t=fR(r._databaseId,((s=r._app)==null?void 0:s.options.appId)||"",r._persistenceKey,(o=r._app)==null?void 0:o.options.apiKey,e);r._componentsProvider||(u=e.localCache)!=null&&u._offlineComponentProvider&&((h=e.localCache)!=null&&h._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new sR(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(y){const v=y==null?void 0:y._online.build();return{_offline:y==null?void 0:y._offline.build(v),_online:v}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new gn(Nt.fromBase64String(e))}catch(t){throw new ne($.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new gn(Nt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:gn._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(el(e,gn._jsonSchema))return gn.fromBase64String(e.bytes)}}gn._jsonSchemaVersion="firestore/bytes/1.0",gn._jsonSchema={type:mt("string",gn._jsonSchemaVersion),bytes:mt("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wv{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new ne($.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Pt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new ne($.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new ne($.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Ne(this._lat,e._lat)||Ne(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:rr._jsonSchemaVersion}}static fromJSON(e){if(el(e,rr._jsonSchema))return new rr(e.latitude,e.longitude)}}rr._jsonSchemaVersion="firestore/geoPoint/1.0",rr._jsonSchema={type:mt("string",rr._jsonSchemaVersion),latitude:mt("number"),longitude:mt("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,o){if(s.length!==o.length)return!1;for(let u=0;u<s.length;++u)if(s[u]!==o[u])return!1;return!0})(this._values,e._values)}toJSON(){return{type:xn._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(el(e,xn._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new xn(e.vectorValues);throw new ne($.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}xn._jsonSchemaVersion="firestore/vectorValue/1.0",xn._jsonSchema={type:mt("string",xn._jsonSchemaVersion),vectorValues:mt("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yR=/^__.*__$/;class _R{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new ms(e,this.data,this.fieldMask,t,this.fieldTransforms):new tl(e,this.data,t,this.fieldTransforms)}}function Gv(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw me(40011,{dataSource:r})}}class Df{constructor(e,t,s,o,u,h){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=o,u===void 0&&this.validatePath(),this.fieldTransforms=u||[],this.fieldMask=h||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new Df({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var o;const t=(o=this.path)==null?void 0:o.child(e),s=this.contextWith({path:t,arrayElement:!1});return s.validatePathSegment(e),s}childContextForFieldPath(e){var o;const t=(o=this.path)==null?void 0:o.child(e),s=this.contextWith({path:t,arrayElement:!1});return s.validatePath(),s}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return sc(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(Gv(this.dataSource)&&yR.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class vR{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||Ec(e)}createContext(e,t,s,o=!1){return new Df({dataSource:e,methodName:t,targetDoc:s,path:Pt.emptyPath(),arrayElement:!1,hasConverter:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Vf(r){const e=r._freezeSettings(),t=Ec(r._databaseId);return new vR(r._databaseId,!!e.ignoreUndefinedProperties,t)}function Kv(r,e,t,s,o,u={}){const h=r.createContext(u.merge||u.mergeFields?2:0,e,t,o);Jv("Data must be an object, but it was:",h,s);const m=Qv(s,h);let y,v;if(u.merge)y=new Nn(h.fieldMask),v=h.fieldTransforms;else if(u.mergeFields){const w=[];for(const A of u.mergeFields){const R=sl(e,A,t);if(!h.contains(R))throw new ne($.INVALID_ARGUMENT,`Field '${R}' is specified in your field mask but missing from your input data.`);IR(w,R)||w.push(R)}y=new Nn(w),v=h.fieldTransforms.filter((A=>y.covers(A.field)))}else y=null,v=h.fieldTransforms;return new _R(new mn(m),y,v)}class xf extends Nf{_toFieldTransform(e){return new oS(e.path,new Wa)}isEqual(e){return e instanceof xf}}function ER(r,e,t,s=!1){return Of(t,r.createContext(s?4:3,e))}function Of(r,e){if(Yv(r=jt(r)))return Jv("Unsupported field value:",e,r),Qv(r,e);if(r instanceof Nf)return(function(s,o){if(!Gv(o.dataSource))throw o.createError(`${s._methodName}() can only be used with update() and set()`);if(!o.path)throw o.createError(`${s._methodName}() is not currently supported inside arrays`);const u=s._toFieldTransform(o);u&&o.fieldTransforms.push(u)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,o){const u=[];let h=0;for(const m of s){let y=Of(m,o.childContextForArray(h));y==null&&(y={nullValue:"NULL_VALUE"}),u.push(y),h++}return{arrayValue:{values:u}}})(r,e)}return(function(s,o){if((s=jt(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return rS(o.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const u=Ge.fromDate(s);return{timestampValue:ec(o.serializer,u)}}if(s instanceof Ge){const u=new Ge(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:ec(o.serializer,u)}}if(s instanceof rr)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof gn)return{bytesValue:mv(o.serializer,s._byteString)};if(s instanceof ut){const u=o.databaseId,h=s.firestore._databaseId;if(!h.isEqual(u))throw o.createError(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${u.projectId}/${u.database}`);return{referenceValue:df(s.firestore._databaseId||o.databaseId,s._key.path)}}if(s instanceof xn)return(function(h,m){const y=h instanceof xn?h.toArray():h;return{mapValue:{fields:{[q_]:{stringValue:H_},[Ju]:{arrayValue:{values:y.map((w=>{if(typeof w!="number")throw m.createError("VectorValues must only contain numeric values.");return lf(m.serializer,w)}))}}}}}})(s,o);if(Tv(s))return s._toProto(o.serializer);throw o.createError(`Unsupported field value: ${cc(s)}`)})(r,e)}function Qv(r,e){const t={};return F_(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):fs(r,((s,o)=>{const u=Of(o,e.childContextForField(s));u!=null&&(t[s]=u)})),{mapValue:{fields:t}}}function Yv(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Ge||r instanceof rr||r instanceof gn||r instanceof ut||r instanceof Nf||r instanceof xn||Tv(r))}function Jv(r,e,t){if(!Yv(t)||!b_(t)){const s=cc(t);throw s==="an object"?e.createError(r+" a custom object"):e.createError(r+" "+s)}}function sl(r,e,t){if((e=jt(e))instanceof Wv)return e._internalPath;if(typeof e=="string")return TR(r,e);throw sc("Field path arguments must be of type string or ",r,!1,void 0,t)}const wR=new RegExp("[~\\*/\\[\\]]");function TR(r,e,t){if(e.search(wR)>=0)throw sc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Wv(...e.split("."))._internalPath}catch{throw sc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function sc(r,e,t,s,o){const u=s&&!s.isEmpty(),h=o!==void 0;let m=`Function ${e}() called with invalid data`;t&&(m+=" (via `toFirestore()`)"),m+=". ";let y="";return(u||h)&&(y+=" (found",u&&(y+=` in field ${s}`),h&&(y+=` in document ${o}`),y+=")"),new ne($.INVALID_ARGUMENT,m+r+y)}function IR(r,e){return r.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SR{convertValue(e,t="none"){switch(Ti(e)){case 0:return null;case 1:return e.booleanValue;case 2:return lt(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(wi(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw me(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return fs(e,((o,u)=>{s[o]=this.convertValue(u,t)})),s}convertVectorValue(e){var s,o,u;const t=(u=(o=(s=e.fields)==null?void 0:s[Ju].arrayValue)==null?void 0:o.values)==null?void 0:u.map((h=>lt(h.doubleValue)));return new xn(t)}convertGeoPoint(e){return new rr(lt(e.latitude),lt(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=fc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Ba(e));default:return null}}convertTimestamp(e){const t=Ei(e);return new Ge(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=We.fromString(e);ze(wv(s),9688,{name:e});const o=new $a(s.get(1),s.get(3)),u=new de(s.popFirst(5));return o.isEqual(t)||Nr(`Document ${u} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),u}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lf extends SR{constructor(e){super(),this.firestore=e}convertBytes(e){return new gn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ut(this.firestore,null,t)}}function Ry(){return new xf("serverTimestamp")}const Cy="@firebase/firestore",ky="4.11.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Py(r){return(function(t,s){if(typeof t!="object"||t===null)return!1;const o=t;for(const u of s)if(u in o&&typeof o[u]=="function")return!0;return!1})(r,["next","error","complete"])}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xv{constructor(e,t,s,o,u){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=o,this._converter=u}get id(){return this._key.path.lastSegment()}get ref(){return new ut(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new AR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(sl("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class AR extends Xv{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zv(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new ne($.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class bf{}class eE extends bf{}function dd(r,e,...t){let s=[];e instanceof bf&&s.push(e),s=s.concat(t),(function(u){const h=u.filter((y=>y instanceof Mf)).length,m=u.filter((y=>y instanceof Ac)).length;if(h>1||h>0&&m>0)throw new ne($.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(s);for(const o of s)r=o._apply(r);return r}class Ac extends eE{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new Ac(e,t,s)}_apply(e){const t=this._parse(e);return tE(e._query,t),new Ri(e.firestore,e.converter,Pd(e._query,t))}_parse(e){const t=Vf(e.firestore);return(function(u,h,m,y,v,w,A){let R;if(v.isKeyField()){if(w==="array-contains"||w==="array-contains-any")throw new ne($.INVALID_ARGUMENT,`Invalid Query. You can't perform '${w}' queries on documentId().`);if(w==="in"||w==="not-in"){Dy(A,w);const J=[];for(const X of A)J.push(Ny(y,u,X));R={arrayValue:{values:J}}}else R=Ny(y,u,A)}else w!=="in"&&w!=="not-in"&&w!=="array-contains-any"||Dy(A,w),R=ER(m,h,A,w==="in"||w==="not-in");return pt.create(v,w,R)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function fd(r,e,t){const s=e,o=sl("where",r);return Ac._create(o,s,t)}class Mf extends bf{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Mf(e,t)}_parse(e){const t=this._queryConstraints.map((s=>s._parse(e))).filter((s=>s.getFilters().length>0));return t.length===1?t[0]:On.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(o,u){let h=o;const m=u.getFlattenedFilters();for(const y of m)tE(h,y),h=Pd(h,y)})(e._query,t),new Ri(e.firestore,e.converter,Pd(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Ff extends eE{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Ff(e,t)}_apply(e){const t=(function(o,u,h){if(o.startAt!==null)throw new ne($.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(o.endAt!==null)throw new ne($.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ha(u,h)})(e._query,this._field,this._direction);return new Ri(e.firestore,e.converter,Q1(e._query,t))}}function RR(r,e="asc"){const t=e,s=sl("orderBy",r);return Ff._create(s,t)}function Ny(r,e,t){if(typeof(t=jt(t))=="string"){if(t==="")throw new ne($.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Z_(e)&&t.indexOf("/")!==-1)throw new ne($.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(We.fromString(t));if(!de.isDocumentKey(s))throw new ne($.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return $g(r,new de(s))}if(t instanceof ut)return $g(r,t._key);throw new ne($.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${cc(t)}.`)}function Dy(r,e){if(!Array.isArray(r)||r.length===0)throw new ne($.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function tE(r,e){const t=(function(o,u){for(const h of o)for(const m of h.getFlattenedFilters())if(u.indexOf(m.op)>=0)return m.op;return null})(r.filters,(function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new ne($.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new ne($.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function nE(r,e,t){let s;return s=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,s}class Na{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ss extends Xv{constructor(e,t,s,o,u,h){super(e,t,s,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=u}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ju(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(sl("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new ne($.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=ss._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}ss._jsonSchemaVersion="firestore/documentSnapshot/1.0",ss._jsonSchema={type:mt("string",ss._jsonSchemaVersion),bundleSource:mt("string","DocumentSnapshot"),bundleName:mt("string"),bundle:mt("string")};class ju extends ss{data(e={}){return super.data(e)}}class os{constructor(e,t,s,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new Na(o.hasPendingWrites,o.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new ju(this._firestore,this._userDataWriter,s.key,s,new Na(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new ne($.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,u){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((m=>{const y=new ju(o._firestore,o._userDataWriter,m.doc.key,m.doc,new Na(o._snapshot.mutatedKeys.has(m.doc.key),o._snapshot.fromCache),o.query.converter);return m.doc,{type:"added",doc:y,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((m=>u||m.type!==3)).map((m=>{const y=new ju(o._firestore,o._userDataWriter,m.doc.key,m.doc,new Na(o._snapshot.mutatedKeys.has(m.doc.key),o._snapshot.fromCache),o.query.converter);let v=-1,w=-1;return m.type!==0&&(v=h.indexOf(m.doc.key),h=h.delete(m.doc.key)),m.type!==1&&(h=h.add(m.doc),w=h.indexOf(m.doc.key)),{type:CR(m.type),doc:y,oldIndex:v,newIndex:w}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new ne($.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=os._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=tf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],o=[];return this.docs.forEach((u=>{u._document!==null&&(t.push(u._document),s.push(this._userDataWriter.convertObjectMap(u._document.data.value.mapValue.fields,"previous")),o.push(u.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function CR(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return me(61501,{type:r})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */os._jsonSchemaVersion="firestore/querySnapshot/1.0",os._jsonSchema={type:mt("string",os._jsonSchemaVersion),bundleSource:mt("string","QuerySnapshot"),bundleName:mt("string"),bundle:mt("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kR(r){r=yn(r,ut);const e=yn(r.firestore,Ai),t=Sc(e);return uR(t,r._key).then((s=>rE(e,r,s)))}function Vy(r){r=yn(r,Ri);const e=yn(r.firestore,Ai),t=Sc(e),s=new Lf(e);return Zv(r._query),cR(t,r._query).then((o=>new os(e,s,r,o)))}function PR(r,e,t){r=yn(r,ut);const s=yn(r.firestore,Ai),o=nE(r.converter,e,t),u=Vf(s);return Uf(s,[Kv(u,"setDoc",r._key,o,r.converter!==null,t).toMutation(r._key,Vn.none())])}function NR(r){return Uf(yn(r.firestore,Ai),[new uf(r._key,Vn.none())])}function DR(r,e){const t=yn(r.firestore,Ai),s=Uu(r),o=nE(r.converter,e),u=Vf(r.firestore);return Uf(t,[Kv(u,"addDoc",s._key,o,r.converter!==null,{}).toMutation(s._key,Vn.exists(!1))]).then((()=>s))}function VR(r,...e){var v,w,A;r=jt(r);let t={includeMetadataChanges:!1,source:"default"},s=0;typeof e[s]!="object"||Py(e[s])||(t=e[s++]);const o={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Py(e[s])){const R=e[s];e[s]=(v=R.next)==null?void 0:v.bind(R),e[s+1]=(w=R.error)==null?void 0:w.bind(R),e[s+2]=(A=R.complete)==null?void 0:A.bind(R)}let u,h,m;if(r instanceof ut)h=yn(r.firestore,Ai),m=pc(r._key.path),u={next:R=>{e[s]&&e[s](rE(h,r,R))},error:e[s+1],complete:e[s+2]};else{const R=yn(r,Ri);h=yn(R.firestore,Ai),m=R._query;const j=new Lf(h);u={next:J=>{e[s]&&e[s](new os(h,j,R,J))},error:e[s+1],complete:e[s+2]},Zv(r._query)}const y=Sc(h);return lR(y,m,o,u)}function Uf(r,e){const t=Sc(r);return hR(t,e)}function rE(r,e,t){const s=t.docs.get(e._key),o=new Lf(r);return new ss(r,o,e._key,s,new Na(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){u1(Io),mo(new ls("firestore",((s,{instanceIdentifier:o,options:u})=>{const h=s.getProvider("app").getImmediate(),m=new Ai(new d1(s.getProvider("auth-internal")),new m1(h,s.getProvider("app-check-internal")),V1(h,o),h);return u={useFetchStreams:t,...u},m._setSettings(u),m}),"PUBLIC").setMultipleInstances(!0)),gi(Cy,ky,e),gi(Cy,ky,"esm2020")})();const xR=[{flavor:"amenerrasulu",package:"com.parsfilo.amenerrasulu",admob_app_id:"ca-app-pub-3312485084079132~4012562548",ad_units:{banner:"ca-app-pub-3312485084079132/5773559718",interstitial:"ca-app-pub-3312485084079132/9095252852",native:"ca-app-pub-3312485084079132/8502830681",rewarded:"ca-app-pub-3312485084079132/1834314703",open_app:"ca-app-pub-3312485084079132/5170924485"}},{flavor:"ayetelkursi",package:"com.parsfilo.ayetelkursi",admob_app_id:"ca-app-pub-3312485084079132~7496307482",ad_units:{banner:"ca-app-pub-3312485084079132/9783652332",interstitial:"ca-app-pub-3312485084079132/4531325655",native:"ca-app-pub-3312485084079132/1216289106",rewarded:"ca-app-pub-3312485084079132/7226339270",open_app:"ca-app-pub-3312485084079132/7905820537"}},{flavor:"bereketduasi",package:"com.parsfilo.bereketduasi",admob_app_id:"ca-app-pub-3312485084079132~4161185675",ad_units:{banner:"ca-app-pub-3312485084079132/1125217972",interstitial:"ca-app-pub-3312485084079132/2745820786",native:"ca-app-pub-3312485084079132/7499054633",rewarded:"ca-app-pub-3312485084079132/9119657445",rewarded_interstitial:"ca-app-pub-3312485084079132/1432739117",open_app:"ca-app-pub-3312485084079132/1097297810"}},{flavor:"esmaulhusna",package:"com.parsfilo.esmaulhusna",admob_app_id:"ca-app-pub-3312485084079132~7465066634",ad_units:{banner:"ca-app-pub-3312485084079132/9248154654",interstitial:"ca-app-pub-3312485084079132/9959983985",native:"ca-app-pub-3312485084079132/4624226664",rewarded:"ca-app-pub-3312485084079132/5937308331",open_app:"ca-app-pub-3312485084079132/3474796526"}},{flavor:"fetihsuresi",package:"com.parsfilo.fetihsuresi",admob_app_id:"ca-app-pub-3312485084079132~2457444899",ad_units:{banner:"ca-app-pub-3312485084079132/1216762831",interstitial:"ca-app-pub-3312485084079132/9231085852",native:"ca-app-pub-3312485084079132/7918004182",rewarded:"ca-app-pub-3312485084079132/5854845998",open_app:"ca-app-pub-3312485084079132/6604922517"}},{flavor:"kenzularsduasi",package:"com.parsfilo.kenzularsduasi",admob_app_id:"ca-app-pub-3312485084079132~3739252267",ad_units:{banner:"ca-app-pub-3312485084079132/8031782695",interstitial:"ca-app-pub-3312485084079132/4136801532",native:"ca-app-pub-3312485084079132/8524675084",rewarded:"ca-app-pub-3312485084079132/3547680579",open_app:"ca-app-pub-3312485084079132/9569091613"}},{flavor:"kuran_kerim",package:"com.parsfilo.kuran_kerim",admob_app_id:"ca-app-pub-3312485084079132~2762839648",ad_units:{banner:"ca-app-pub-3312485084079132/6856037442",interstitial:"ca-app-pub-3312485084079132/6349196286",native:"ca-app-pub-3312485084079132/3723032944",rewarded:"ca-app-pub-3312485084079132/7058818314",open_app:"ca-app-pub-3312485084079132/6715203385"}},{flavor:"kible",package:"com.parsfilo.kible",admob_app_id:"ca-app-pub-3312485084079132~9575660006",ad_units:{banner:"ca-app-pub-3312485084079132/1438258457",interstitial:"ca-app-pub-3312485084079132/6467791378",native:"ca-app-pub-3312485084079132/7836713366",rewarded:"ca-app-pub-3312485084079132/6209595486",open_app:"ca-app-pub-3312485084079132/5083654994"}},{flavor:"mucizedualar",package:"com.parsfilo.mucizedualar",admob_app_id:"ca-app-pub-3312485084079132~6594273442",ad_units:{banner:"ca-app-pub-3312485084079132/1326500863",interstitial:"ca-app-pub-3312485084079132/2887293262",native:"ca-app-pub-3312485084079132/5530114227",rewarded:"ca-app-pub-3312485084079132/2337799084",open_app:"ca-app-pub-3312485084079132/9848633188"}},{flavor:"nazarayeti",package:"com.parsfilo.nazarayeti",admob_app_id:"ca-app-pub-3312485084079132~7557505209",ad_units:{banner:"ca-app-pub-3312485084079132/2246727958",interstitial:"ca-app-pub-3312485084079132/9992096854",native:"ca-app-pub-3312485084079132/3867330760",rewarded:"ca-app-pub-3312485084079132/7365933511",rewarded_interstitial:"ca-app-pub-3312485084079132/6158052807",open_app:"ca-app-pub-3312485084079132/1343450648"}},{flavor:"namazvakitleri",package:"com.parsfilo.namazvakitleri",admob_app_id:"ca-app-pub-3312485084079132~3715770142",ad_units:{banner:"ca-app-pub-3312485084079132/8867491644",interstitial:"ca-app-pub-3312485084079132/1024717414",native:"ca-app-pub-3312485084079132/2218379585",rewarded:"ca-app-pub-3312485084079132/5554164955",open_app:"ca-app-pub-3312485084079132/3775003832"}},{flavor:"namazsurelerivedualarsesli",package:"com.parsfilo.namazsurelerivedualarsesli",admob_app_id:"ca-app-pub-3312485084079132~9767231692",ad_units:{banner:"ca-app-pub-3312485084079132/7065557480",interstitial:"ca-app-pub-3312485084079132/7079268847",native:"ca-app-pub-3312485084079132/4652971236",rewarded:"ca-app-pub-3312485084079132/4049511590",open_app:"ca-app-pub-3312485084079132/7222469849"}},{flavor:"vakiasuresi",package:"com.parsfilo.vakiasuresi",admob_app_id:"ca-app-pub-3312485084079132~4284536659",ad_units:{banner:"ca-app-pub-3312485084079132/7489284497",interstitial:"ca-app-pub-3312485084079132/4531948666",native:"ca-app-pub-3312485084079132/2707747011",rewarded:"ca-app-pub-3312485084079132/5964465747",open_app:"ca-app-pub-3312485084079132/9432813754"}},{flavor:"yasinsuresi",package:"com.parsfilo.yasinsuresi",admob_app_id:"ca-app-pub-3312485084079132~2954411334",ad_units:{banner:"ca-app-pub-3312485084079132/6310730629",interstitial:"ca-app-pub-3312485084079132/4778975340",native:"ca-app-pub-3312485084079132/7548938750",rewarded:"ca-app-pub-3312485084079132/4269827850",open_app:"ca-app-pub-3312485084079132/2146227394"}},{flavor:"zikirmatik",package:"com.parsfilo.zikirmatik",admob_app_id:"ca-app-pub-3312485084079132~1856290341",ad_units:{banner:"ca-app-pub-3312485084079132/9351636983",interstitial:"ca-app-pub-3312485084079132/5391337838",native:"ca-app-pub-3312485084079132/5774481214",rewarded:"ca-app-pub-3312485084079132/4772390738",open_app:"ca-app-pub-3312485084079132/3459309063"}},{flavor:"imsakiye",package:"com.parsfilo.imsakiye",admob_app_id:"ca-app-pub-3312485084079132~7652510108",ad_units:{banner:"ca-app-pub-3312485084079132/3713265099",interstitial:"ca-app-pub-3312485084079132/6335559002",native:"ca-app-pub-3312485084079132/2560067078",rewarded:"ca-app-pub-3312485084079132/3975358588",open_app:"ca-app-pub-3312485084079132/6537054695"}},{flavor:"insirahsuresi",package:"com.parsfilo.insirahsuresi",admob_app_id:"ca-app-pub-3312485084079132~5523265003",ad_units:{banner:"ca-app-pub-3312485084079132/8352624231",interstitial:"ca-app-pub-3312485084079132/3224296928",native:"ca-app-pub-3312485084079132/9598133584",rewarded:"ca-app-pub-3312485084079132/7039542568",open_app:"ca-app-pub-3312485084079132/3032725230"}},{flavor:"ismiazamduasi",package:"com.parsfilo.ismiazamduasi",admob_app_id:"ca-app-pub-3312485084079132~2404917464",ad_units:{banner:"ca-app-pub-3312485084079132/5769447404",interstitial:"ca-app-pub-3312485084079132/6942928272",native:"ca-app-pub-3312485084079132/1646369564",rewarded:"ca-app-pub-3312485084079132/4316764933",open_app:"ca-app-pub-3312485084079132/1690601598"}}];var OR="firebase",LR="12.9.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */gi(OR,LR,"app");const bR={apiKey:void 0,authDomain:void 0,projectId:void 0,appId:void 0,messagingSenderId:void 0,storageBucket:void 0},iE=J0()[0]??Wy(bR),zu=a1(iE);GT(zu,y_);const es=mR(iE),sE=new Sr;sE.setCustomParameters({prompt:"select_account"});const oE=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],xy={name:"",type:"campaign",status:"scheduled",localDeliveryTime:"21:00",topic:"",packages:["*"],scheduleMode:"daily",date:"",weeklyDay:"friday",title:{tr:"",en:"",de:""},body:{tr:"",en:"",de:""}},MR=["scheduled","paused","sent","expired"];function FR(r){return typeof r=="string"&&MR.includes(r)?r:"scheduled"}function Pu(r){return r?r instanceof Date?r:r instanceof Ge?r.toDate():null:null}function Oy(r){const e=r&&typeof r=="object"?r:{};return{tr:typeof e.tr=="string"?e.tr:"",en:typeof e.en=="string"?e.en:"",de:typeof e.de=="string"?e.de:""}}function UR(r,e){return{id:r,name:typeof e.name=="string"?e.name:"",type:typeof e.type=="string"?e.type:"campaign",status:FR(e.status),localDeliveryTime:typeof e.localDeliveryTime=="string"?e.localDeliveryTime:"21:00",topic:typeof e.topic=="string"?e.topic:"",packages:Array.isArray(e.packages)?e.packages.filter(t=>typeof t=="string"):["*"],title:Oy(e.title),body:Oy(e.body),date:typeof e.date=="string"?e.date:void 0,recurrence:typeof e.recurrence=="string"?e.recurrence:void 0,sentTimezones:Array.isArray(e.sentTimezones)?e.sentTimezones.filter(t=>typeof t=="string"):[],lastResetAt:Pu(e.lastResetAt),lastDispatchedAt:Pu(e.lastDispatchedAt),createdAt:Pu(e.createdAt),updatedAt:Pu(e.updatedAt),createdBy:typeof e.createdBy=="string"?e.createdBy:void 0,updatedBy:typeof e.updatedBy=="string"?e.updatedBy:void 0}}function pd(r){var s;let e="daily",t="friday";if(r.date)e="once";else if((s=r.recurrence)!=null&&s.startsWith("weekly:")){e="weekly";const o=r.recurrence.split(":")[1];o&&oE.includes(o)&&(t=o)}else r.recurrence==="daily"&&(e="daily");return{name:r.name,type:r.type,status:r.status,localDeliveryTime:r.localDeliveryTime,topic:r.topic,packages:r.packages.length>0?r.packages:["*"],scheduleMode:e,date:r.date??"",weeklyDay:t,title:{...r.title},body:{...r.body}}}function jR(r,e,t){const s={name:r.name.trim(),type:r.type.trim(),status:r.status,localDeliveryTime:r.localDeliveryTime.trim(),topic:r.topic.trim()||null,packages:Ma(r.packages),title:{tr:r.title.tr.trim(),en:r.title.en.trim(),de:r.title.de.trim()},body:{tr:r.body.tr.trim(),en:r.body.en.trim(),de:r.body.de.trim()},updatedAt:Ry(),updatedBy:e.uid};return r.scheduleMode==="once"?(s.date=r.date.trim(),s.recurrence=null):r.scheduleMode==="daily"?(s.date=null,s.recurrence="daily"):(s.date=null,s.recurrence=`weekly:${r.weeklyDay}`),t&&(s.sentTimezones=[],s.lastResetAt=null,s.lastDispatchedAt=null,s.createdAt=Ry(),s.createdBy=e.uid),s}function Ma(r){return r.includes("*")?["*"]:[...new Set(r)].sort()}function zR(r){return r.name.trim()?r.type.trim()?/^\d{2}:\d{2}$/.test(r.localDeliveryTime.trim())?r.scheduleMode==="once"&&!r.date.trim()?"Date is required for one-time events.":r.title.tr.trim()?r.body.tr.trim()?Ma(r.packages).length===0?"At least one target package or '*' is required.":null:"TR body is required.":"TR title is required.":"Local delivery time must be HH:mm.":"Type is required.":"Event name is required."}function Ra(r){return r?new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(r):"-"}function BR(r){return r.date?`Once: ${r.date} @ ${r.localDeliveryTime}`:r.recurrence?`${r.recurrence} @ ${r.localDeliveryTime}`:`@ ${r.localDeliveryTime}`}function $R(r){return r.includes("*")?"All apps (*)":`${r.length} app(s)`}const qR=[...xR].sort((r,e)=>r.flavor.localeCompare(e.flavor));function HR(){const[r,e]=_t.useState(null),[t,s]=_t.useState("loading"),[o,u]=_t.useState("checking"),[h,m]=_t.useState([]),[y,v]=_t.useState("loading"),[w,A]=_t.useState(null),[R,j]=_t.useState(xy),[J,X]=_t.useState(!1),[Q,Ee]=_t.useState(!1),[ge,Ce]=_t.useState(!1),[Oe,be]=_t.useState(null),[Ve,N]=_t.useState({}),[S,C]=_t.useState(""),[V,P]=_t.useState(""),[x,I]=_t.useState("");_t.useEffect(()=>{const B=YT(zu,async Z=>{if(e(Z),s("ready"),m([]),A(null),v("loading"),u(Z?"checking":"unauthorized"),!!Z)try{const ue=await kR(Uu(es,"admins",Z.uid));u(ue.exists()?"authorized":"unauthorized")}catch(ue){console.error(ue),I("Failed to verify admin access."),u("unauthorized")}},Z=>{console.error(Z),s("error"),I("Firebase Auth initialization failed.")});return()=>B()},[]),_t.useEffect(()=>{if(o!=="authorized")return;v("loading");const B=dd(ku(es,"scheduled_events"),RR("updatedAt","desc")),Z=VR(B,ue=>{const Ie=ue.docs.map(Se=>UR(Se.id,Se.data()));if(m(Ie),v("ready"),w){const Se=Ie.find(Me=>Me.id===w);if(Se){j(pd(Se));return}}!w&&Ie.length>0&&(A(Ie[0].id),j(pd(Ie[0])))},ue=>{console.error(ue),v("error"),I("Failed to load scheduled_events.")});return()=>Z()},[o,w]);const ye=_t.useMemo(()=>h.find(B=>B.id===w)??null,[h,w]),Je=w===null,it=()=>{A(null),j(xy),I(""),P("")},qe=B=>{A(B.id),j(pd(B)),I(""),P("")},te=async()=>{I("");try{await gI(zu,sE)}catch(B){console.error(B),I("Google sign-in failed.")}},he=async()=>{await JT(zu),it()},ie=async()=>{if(!r)return;const B=zR(R);if(B){I(B);return}X(!0),I(""),P("");try{const Z=jR(R,r,Je);if(Je){const ue=await DR(ku(es,"scheduled_events"),Z);A(ue.id),P("Event created.")}else w&&(await PR(Uu(es,"scheduled_events",w),Z,{merge:!0}),P("Event updated."))}catch(Z){console.error(Z),I("Failed to save event.")}finally{X(!1)}},O=async()=>{if(!(!w||!window.confirm("Delete this scheduled event?"))){Ee(!0),I(""),P("");try{await NR(Uu(es,"scheduled_events",w)),P("Event deleted."),it()}catch(Z){console.error(Z),I("Failed to delete event.")}finally{Ee(!1)}}},H=(B,Z)=>{j(ue=>{if(B==="*")return{...ue,packages:Z?["*"]:[]};const Ie=ue.packages.filter(Me=>Me!=="*"),Se=Z?[...Ie,B]:Ie.filter(Me=>Me!==B);return{...ue,packages:Ma(Se)}})},Te=async()=>{Ce(!0),C(""),be(null),N({});try{const B=Ma(R.packages);if(B.length===0){be(0);return}if(B.includes("*")){const Ie=await Vy(dd(ku(es,"devices"),fd("notificationsEnabled","==",!0)));be(Ie.size);return}let Z=0;const ue={};for(const Ie of B){const Se=await Vy(dd(ku(es,"devices"),fd("notificationsEnabled","==",!0),fd("packageName","==",Ie)));ue[Ie]=Se.size,Z+=Se.size}N(ue),be(Z)}catch(B){console.error(B),C("Failed to preview target devices. Check Firestore rules/admin access for devices read.")}finally{Ce(!1)}};return t==="loading"?z.jsx("div",{className:"center-screen",children:"Loading Firebase Auth…"}):t==="error"?z.jsx("div",{className:"center-screen error",children:"Auth init failed. Check console."}):r?o==="checking"?z.jsx("div",{className:"center-screen",children:"Checking admin access…"}):o==="unauthorized"?z.jsx("div",{className:"center-screen",children:z.jsxs("div",{className:"auth-card",children:[z.jsx("h1",{children:"Access denied"}),z.jsxs("p",{children:[r.email??r.uid," is not in the Firestore ",z.jsx("code",{children:"admins"})," list."]}),z.jsx("button",{onClick:he,children:"Sign out"}),x&&z.jsx("p",{className:"inline-error",children:x})]})}):z.jsxs("div",{className:"app-shell",children:[z.jsxs("header",{className:"topbar",children:[z.jsxs("div",{children:[z.jsx("h1",{children:"Notifications Admin"}),z.jsxs("p",{children:["Manage Firestore ",z.jsx("code",{children:"scheduled_events"})," used by dispatchNotifications."]})]}),z.jsxs("div",{className:"topbar-actions",children:[z.jsx("div",{className:"user-pill",children:r.email??r.uid}),z.jsx("button",{className:"secondary",onClick:he,children:"Sign out"})]})]}),(x||V)&&z.jsx("div",{className:`banner ${x?"banner-error":"banner-success"}`,children:x||V}),z.jsxs("div",{className:"content-grid",children:[z.jsxs("aside",{className:"panel list-panel",children:[z.jsxs("div",{className:"panel-header",children:[z.jsx("h2",{children:"Scheduled events"}),z.jsx("button",{className:"secondary",onClick:it,children:"New event"})]}),y==="loading"&&z.jsx("p",{className:"muted",children:"Loading events…"}),y==="error"&&z.jsx("p",{className:"inline-error",children:"Failed to load events."}),y==="ready"&&h.length===0&&z.jsx("p",{className:"muted",children:"No scheduled_events documents yet."}),z.jsx("div",{className:"event-list",children:h.map(B=>z.jsxs("button",{type:"button",className:`event-card ${w===B.id?"active":""}`,onClick:()=>qe(B),children:[z.jsxs("div",{className:"event-card-top",children:[z.jsx("strong",{children:B.name||"(untitled)"}),z.jsx("span",{className:`status-pill status-${B.status}`,children:B.status})]}),z.jsxs("div",{className:"event-card-meta",children:[B.type," · ",BR(B)]}),z.jsx("div",{className:"event-card-meta",children:$R(B.packages)}),z.jsxs("div",{className:"event-card-meta",children:["sentTimezones=",B.sentTimezones.length," · updated ",Ra(B.updatedAt)]})]},B.id))})]}),z.jsxs("main",{className:"panel form-panel",children:[z.jsxs("div",{className:"panel-header",children:[z.jsx("h2",{children:Je?"Create event":"Edit event"}),!Je&&z.jsx("button",{className:"danger",onClick:O,disabled:Q||J,children:Q?"Deleting…":"Delete"})]}),z.jsxs("div",{className:"form-grid",children:[z.jsxs("label",{children:["Event name",z.jsx("input",{value:R.name,onChange:B=>j(Z=>({...Z,name:B.target.value})),placeholder:"Friday reminder"})]}),z.jsxs("label",{children:["Type",z.jsx("input",{value:R.type,onChange:B=>j(Z=>({...Z,type:B.target.value})),placeholder:"campaign"})]}),z.jsxs("label",{children:["Status",z.jsxs("select",{value:R.status,onChange:B=>j(Z=>({...Z,status:B.target.value})),children:[z.jsx("option",{value:"scheduled",children:"scheduled"}),z.jsx("option",{value:"paused",children:"paused"}),z.jsx("option",{value:"sent",children:"sent"}),z.jsx("option",{value:"expired",children:"expired"})]})]}),z.jsxs("label",{children:["Local delivery time",z.jsx("input",{type:"time",value:R.localDeliveryTime,onChange:B=>j(Z=>({...Z,localDeliveryTime:B.target.value}))})]}),z.jsxs("label",{children:["Topic (optional)",z.jsx("input",{value:R.topic,onChange:B=>j(Z=>({...Z,topic:B.target.value})),placeholder:"dini-bildirim"})]}),z.jsxs("label",{children:["Schedule mode",z.jsxs("select",{value:R.scheduleMode,onChange:B=>j(Z=>({...Z,scheduleMode:B.target.value})),children:[z.jsx("option",{value:"daily",children:"daily"}),z.jsx("option",{value:"weekly",children:"weekly"}),z.jsx("option",{value:"once",children:"once"})]})]}),R.scheduleMode==="weekly"&&z.jsxs("label",{children:["Weekly day",z.jsx("select",{value:R.weeklyDay,onChange:B=>j(Z=>({...Z,weeklyDay:B.target.value})),children:oE.map(B=>z.jsx("option",{value:B,children:B},B))})]}),R.scheduleMode==="once"&&z.jsxs("label",{children:["Date",z.jsx("input",{type:"date",value:R.date,onChange:B=>j(Z=>({...Z,date:B.target.value}))})]})]}),z.jsxs("section",{className:"subsection",children:[z.jsx("h3",{children:"Target apps"}),z.jsxs("div",{className:"checkbox-grid",children:[z.jsxs("label",{className:"checkbox-row",children:[z.jsx("input",{type:"checkbox",checked:R.packages.includes("*"),onChange:B=>H("*",B.target.checked)}),"All apps (*)"]}),qR.map(B=>{const Z=R.packages.includes("*");return z.jsxs("label",{className:`checkbox-row ${Z?"disabled":""}`,children:[z.jsx("input",{type:"checkbox",checked:!Z&&R.packages.includes(B.package),disabled:Z,onChange:ue=>H(B.package,ue.target.checked)}),z.jsx("span",{children:B.flavor}),z.jsx("small",{children:B.package})]},B.package)})]}),z.jsxs("div",{className:"device-preview-box",children:[z.jsxs("div",{className:"device-preview-header",children:[z.jsx("strong",{children:"Target device preview"}),z.jsx("button",{type:"button",className:"secondary",onClick:Te,disabled:ge,children:ge?"Checking…":"Preview target device count"})]}),z.jsx("p",{className:"muted device-preview-note",children:"Estimate only: actual dispatch also filters by timezone, schedule date, recurrence, and sentTimezones."}),S&&z.jsx("p",{className:"inline-error",children:S}),Oe!=null&&!S&&z.jsxs("div",{className:"device-preview-result",children:[z.jsxs("div",{className:"device-preview-total",children:[z.jsx("span",{children:"Estimated target devices"}),z.jsx("strong",{children:Oe})]}),!Ma(R.packages).includes("*")&&Object.keys(Ve).length>0&&z.jsx("ul",{className:"device-preview-list",children:Object.entries(Ve).map(([B,Z])=>z.jsxs("li",{children:[z.jsx("code",{children:B}),z.jsx("span",{children:Z})]},B))})]})]})]}),z.jsx("section",{className:"subsection locale-grid",children:["tr","en","de"].map(B=>z.jsxs("div",{className:"locale-card",children:[z.jsx("h3",{children:B.toUpperCase()}),z.jsxs("label",{children:["Title",z.jsx("input",{value:R.title[B],onChange:Z=>j(ue=>({...ue,title:{...ue.title,[B]:Z.target.value}}))})]}),z.jsxs("label",{children:["Body",z.jsx("textarea",{value:R.body[B],onChange:Z=>j(ue=>({...ue,body:{...ue.body,[B]:Z.target.value}})),rows:4})]})]},B))}),z.jsxs("section",{className:"subsection preview-grid",children:[z.jsxs("div",{children:[z.jsx("h3",{children:"Preview"}),z.jsx("div",{className:"preview-cards",children:["tr","en","de"].map(B=>z.jsxs("div",{className:"preview-card",children:[z.jsx("div",{className:"preview-locale",children:B.toUpperCase()}),z.jsx("div",{className:"preview-title",children:R.title[B]||"(empty title)"}),z.jsx("div",{className:"preview-body",children:R.body[B]||"(empty body)"})]},B))})]}),z.jsxs("div",{children:[z.jsx("h3",{children:"Dispatch metadata"}),z.jsxs("dl",{className:"meta-list",children:[z.jsx("dt",{children:"sentTimezones"}),z.jsx("dd",{children:(ye==null?void 0:ye.sentTimezones.length)??0}),z.jsx("dt",{children:"lastResetAt"}),z.jsx("dd",{children:Ra(ye==null?void 0:ye.lastResetAt)}),z.jsx("dt",{children:"lastDispatchedAt"}),z.jsx("dd",{children:Ra(ye==null?void 0:ye.lastDispatchedAt)}),z.jsx("dt",{children:"createdAt"}),z.jsx("dd",{children:Ra(ye==null?void 0:ye.createdAt)}),z.jsx("dt",{children:"updatedAt"}),z.jsx("dd",{children:Ra(ye==null?void 0:ye.updatedAt)}),z.jsx("dt",{children:"createdBy"}),z.jsx("dd",{children:(ye==null?void 0:ye.createdBy)??"-"}),z.jsx("dt",{children:"updatedBy"}),z.jsx("dd",{children:(ye==null?void 0:ye.updatedBy)??"-"})]})]})]}),z.jsxs("div",{className:"form-actions",children:[z.jsx("button",{onClick:ie,disabled:J||Q,children:J?"Saving…":Je?"Create event":"Save changes"}),z.jsx("button",{className:"secondary",onClick:it,disabled:J||Q,children:"Reset form"})]})]})]})]}):z.jsx("div",{className:"center-screen",children:z.jsxs("div",{className:"auth-card",children:[z.jsx("h1",{children:"Notifications Admin"}),z.jsx("p",{children:"Sign in with Google to manage scheduled push events."}),z.jsx("button",{onClick:te,children:"Sign in with Google"}),x&&z.jsx("p",{className:"inline-error",children:x})]})})}Iw.createRoot(document.getElementById("root")).render(z.jsx(gw.StrictMode,{children:z.jsx(HR,{})}));
