import { isHealthUrl, isResourceUrl } from './helpers/url-string'
import { VmdBaseLogger } from './logging/vmd-base-loggerg'
import { VmdHapiLogger } from './logging/nmd-hapi-logger'

export {
    // Ideally these would be exposed via a separate library to be shared
    isHealthUrl, isResourceUrl,

    VmdBaseLogger,
    VmdHapiLogger
}
