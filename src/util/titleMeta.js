import { SITE_DOMAIN_DEV, } from 'src/constants'
let isStripeSDKLoaded = false
// const debug = require('debug')('CLIENT:titleMeta')

function getMetaInfo (vm) {
  const { metaInfo, } = vm.$options
  if (metaInfo) {
    return typeof metaInfo === 'function'
      ? metaInfo.call(vm)
      : metaInfo
  }
}


const serverMetaInfoMixin = {
  created () {
    const metaInfo = getMetaInfo(this)
    if (metaInfo) {
      const title = metaInfo.title
      const description = metaInfo.description
      const metaUrl = metaInfo.metaUrl
      const metaImage = metaInfo.metaImage
      
      if (title) {
        this.$ssrContext.title = `${title} - Readr`
      }
      if (description) { 
        this.$ssrContext.description = description 
      }
      if (metaUrl) {
        this.$ssrContext.metaUrl = SITE_DOMAIN_DEV + metaUrl
      }
      if (metaImage) { 
        this.$ssrContext.metaImage = metaImage
      }
    }
  },
}

const clientMetaInfoMixin = {
  mounted () {
    const metaInfo = getMetaInfo(this)
    if (metaInfo) {
      const title = metaInfo.title
      const description = metaInfo.description
      const metaUrl = metaInfo.metaUrl
      const metaImage = metaInfo.metaImage
      if (title) {
        document.title = `${title} - Readr`
        document.head.querySelector(`meta[property='og:title']`).content = `${title} - Readr`
      }
      if (description) {
        document.head.querySelector(`meta[name=description]`).content = description
        document.head.querySelector(`meta[property='og:description']`).content = description
      }
      if (metaUrl) {
        document.head.querySelector(`meta[property='og:url']`).content = SITE_DOMAIN_DEV + metaUrl
      }
      if (metaImage) {
        document.head.querySelector(`meta[property='og:image']`).content = metaImage
      }
    }
  },
  updated () {
    const metaInfo = getMetaInfo(this)
    if (metaInfo) {
      /**
       * If Stripe SDK needed.
       */
      const { isStripeNeeded, } = metaInfo
      if (isStripeNeeded && !isStripeSDKLoaded) {
        const script = document.createElement('script')
        script.setAttribute('src', 'https://checkout.stripe.com/checkout.js')
        document.head.appendChild(script)
        isStripeSDKLoaded = true
      }      
    }
  },
}

export default process.env.VUE_ENV === 'server'
  ? serverMetaInfoMixin
  : clientMetaInfoMixin
