import {createApp} from "vue"
import {createI18n} from "vue-i18n"
import axios from "axios"
import VueAxios from "vue-axios"
import App from "./App.vue"
import "./index.css"
import "nprogress/nprogress.css"
import hljs from "highlight.js/lib/core"
import groovy from "highlight.js/lib/languages/groovy"
import gradle from "highlight.js/lib/languages/gradle"
import java from "highlight.js/lib/languages/java"
import kotlin from "highlight.js/lib/languages/kotlin"
import hljsVuePlugin from "@highlightjs/vue-plugin"
// @ts-ignore
import NProgress from "nprogress"
import {HTTP} from "./app/backend"
import {createPinia} from "pinia"
import persistedState from "pinia-plugin-persistedstate"
// @ts-ignore
import enUS from "./locales/en_US.json"
// @ts-ignore
import enGB from "./locales/en_GB.json"
// @ts-ignore
import zhCN from "./locales/zh_CN.json"
// @ts-ignore
import zhTW from "./locales/zh_TW.json"

NProgress.configure({
    showSpinner: false,
})

const app = createApp(App)

HTTP.interceptors.request.use(config => {
    NProgress.start()
    return config
}, error => {
    console.log(error)
    return Promise.reject(error)
})

HTTP.interceptors.response.use(response => {
    NProgress.done()
    return response
}, error => {
    if (!axios.isCancel(error)) {
        console.log(error)
    }
    return Promise.reject(error)
})

hljs.registerLanguage("java", java)
hljs.registerLanguage("groovy", groovy)
hljs.registerLanguage("kotlin", kotlin)
hljs.registerLanguage("gradle", gradle)

const i18n = createI18n({
    locale: "en_US",
    fallbackLocale: "en_US",
    messages: {
        "en_US": enUS,
        "en_GB": enGB,
        "zh_CN": zhCN,
        "zh_TW": zhTW,
    },
})

let pinia = createPinia()

pinia.use(persistedState)

app.use(pinia)
app.use(VueAxios, axios)
app.provide("axios", app.config.globalProperties.axios)

app.use(hljsVuePlugin)

app.use(i18n)

app.mount("#app")
