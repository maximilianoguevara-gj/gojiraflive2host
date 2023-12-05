class UtmUtils {
  getUtmObject(queryParams) {
    return {
      utm_source: queryParams.utm_source,
      utm_medium: queryParams.utm_medium,
      utm_campaign: queryParams.utm_campaign,
      utm_term: queryParams.utm_term,
      utm_content: queryParams.utm_content,
    }
  }
}

const instance = new UtmUtils()
Object.freeze(instance)

export default instance
