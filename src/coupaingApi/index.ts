import axios from "axios";
import { generateHmac } from "./hmacGenerator";

const METHOD = { GET: "GET", POST: "POST" } as const;
const DOMAIN: string = "https://api-gateway.coupang.com";
const BASE_URL: string = "/v2/providers/affiliate_open_api/apis/openapi/v1";

interface ISUB_URLSProps {
  [subId: string]: {
    method: "POST" | "GET";
    url: string;
  };
}

const SUB_URLS: ISUB_URLSProps = {
  BESTCATEGORIES: { method: METHOD.GET, url: "/products/bestcategories" }, // 카테고리 별 베스트 상품에 대한 상세 상품 정보를 생성합니다.
  GOLDBOX: { method: METHOD.GET, url: "/products/goldbox" }, // 골드박스 상품에 대한 상세 상품 정보를 생성합니다. (골드박스 상품은 매일 오전 7:30에 업데이트 됩니다)
  COUPANGPL: { method: METHOD.GET, url: "/products/coupangPL" }, // 쿠팡 PL 상품에 대한 상세 정보를 생성합니다.
  COUPANGPL_BRAND: { method: METHOD.GET, url: "/products/coupangPL" }, // 쿠팡 PL 브랜드 별 상품 상세 정보를 생성합니다.
  SEARCH: { method: METHOD.GET, url: "/products/search" }, // 검색 키워드에 대한 쿠팡 검색 결과와 상세 상품 정보를 생성합니다
  DEEPLINK: { method: METHOD.POST, url: "/deeplink" }, // 쿠팡 URL을 회원 트래킹 코드가 포함된 단축 URL로 변환합니다.
};

export type TSubUrlsType =
  | "GOLDBOX"
  | "DEEPLINK"
  | "SEARCH"
  | "BESTCATEGORIES"
  | "COUPANGPL"
  | "COUPANGPL_BRAND";
export interface IGetCouPangApiProps {
  subUrls: TSubUrlsType;
  categoryId?: number;
  limit?: number | undefined;
  subId?: string;
  keyword?: string;
  transUrls?: string[];
  accessKey: string;
  secretKey: string;
}
async function getCouPangApi({
  subUrls,
  categoryId,
  limit,
  subId,
  keyword,
  transUrls,
  accessKey,
  secretKey,
}: IGetCouPangApiProps) {
  const method = SUB_URLS[subUrls].method;
  const sSubUrl: string = SUB_URLS[subUrls].url;
  const sCategoryId = categoryId ? `/${categoryId}` : "";
  const questionMark = limit || subId || keyword ? "?" : "";
  const sKeyword = keyword ? `keyword=${encodeURIComponent(keyword)}` : "";
  const sAndMark1 = keyword ? "&" : "";
  let sLimit = limit ? `limit=${limit}` : "";
  const sAndMark2 = limit ? "&" : "";
  const sSubId = subId ? `subId=${subId}` : "";

  if (subUrls === "GOLDBOX") {
    sLimit = "";
  }

  let url: string = "";

  let REQUEST;
  if (subUrls === "DEEPLINK") {
    url = `${BASE_URL}${sSubUrl}`;
    REQUEST = {
      coupangUrls: transUrls,
    };
  } else {
    url = `${BASE_URL}${sSubUrl}${sCategoryId}${questionMark}${sKeyword}${sAndMark1}${sLimit}${sAndMark2}${sSubId}`;
  }

  try {
    const authorization: string = generateHmac({
      REQUEST_METHOD: method,
      URL: url,
      SECRET_KEY: secretKey,
      ACCESS_KEY: accessKey,
    });
    axios.defaults.baseURL = DOMAIN;

    const response = await axios.request({
      method: METHOD[method],
      url: url,
      headers: { Authorization: authorization },
      data: REQUEST,
    });
    // console.log(response.data.data.productData);
    return response;
  } catch (err) {
    throw err;
  }
}

export default getCouPangApi;
