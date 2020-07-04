import axios from "axios";
import { generateHmac } from "./hmacGenerator";

const REQUEST_METHOD = "GET";
const DOMAIN: string = "https://api-gateway.coupang.com";
const BASE_URL: string = "/v2/providers/affiliate_open_api/apis/openapi/v1";

interface subUrlsProps {
  [subId: string]: {
    method: string;
    url: string;
  };
}

const SUB_URLS: subUrlsProps = {
  BESTCATEGORIES: { method: "GET", url: "/products/bestcategories" }, // 카테고리 별 베스트 상품에 대한 상세 상품 정보를 생성합니다.
  GOLDBOX: { method: "GET", url: "/products/goldbox" }, // 골드박스 상품에 대한 상세 상품 정보를 생성합니다. (골드박스 상품은 매일 오전 7:30에 업데이트 됩니다)
  COUPANGPL: { method: "GET", url: "/products/coupangPL" }, // 쿠팡 PL 상품에 대한 상세 정보를 생성합니다.
  COUPANGPL_BRAND: { method: "GET", url: "/products/coupangPL" }, // 쿠팡 PL 브랜드 별 상품 상세 정보를 생성합니다.
  SEARCH: { method: "GET", url: "/products/search" }, // 검색 키워드에 대한 쿠팡 검색 결과와 상세 상품 정보를 생성합니다
  DEEPLINK: { method: "POST", url: "/deeplink" }, // 쿠팡 URL을 회원 트래킹 코드가 포함된 단축 URL로 변환합니다.
};

interface getCouPangApiProps {
  subUrls: string;
  categoryId?: number | undefined;
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
}: getCouPangApiProps) {
  const method: string = SUB_URLS[subUrls].method;
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

  const authorization: string = generateHmac({
    REQUEST_METHOD: method,
    URL: url,
    SECRET_KEY: secretKey,
    ACCESS_KEY: accessKey,
  });
  axios.defaults.baseURL = DOMAIN;

  try {
    const response = await axios.request({
      method: REQUEST_METHOD,
      url: url,
      headers: { Authorization: authorization },
      data: REQUEST,
    });
    // console.log(response.data.data.productData);
    return response;
  } catch (err) {
    console.error(err);
    return;
  }
}

// const params: getCouPangApiProps = {
//   subUrls: "DEEPLINK",
//   subId: process.env.COUPANG_ID,
//   transUrls: [
//     "https://www.coupang.com/np/search?component=&q=good&channel=user",
//     "https://www.coupang.com/np/coupangglobal"
//   ]
// };
export { getCouPangApi, getCouPangApiProps };

// const params = {
//   subUrls: "BESTCATEGORIES",
//   categoryId: 1025,
//   limit: 5,
// };
// getCouPangApi(params);

// const params = {
//   subUrls: "SEARCH",
//   keyword: "여행",
//   limit: 5,
// };
// getCouPangApi(params);
