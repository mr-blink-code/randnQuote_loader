import { BASE_URL } from "./baseurl"
import { commonApi } from "./commonApi"

export const getQuotesApi = async () => {
    return await commonApi("GET",`${BASE_URL}`)
}
