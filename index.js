import { isHealthUrl, isResourceUrl } from './helpers/url-string'
import VmdBaseLogger from './logging/vmd-base-logger'
import VmdHapiLogger from './logging/vmd-hapi-logger'

export {
    // Ideally these would be exposed via a separate library to be shared
    isHealthUrl, isResourceUrl,

    VmdBaseLogger,
    VmdHapiLogger
}
