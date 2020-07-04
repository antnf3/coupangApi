import { getCouPangApi, getCouPangApiProps } from "./coupaingApi";
import moment from "moment";

/**
 * 현재날짜를 가져온다.
 * @param N/A
 * @return string: YYYY-MM-DD HH:mm:ss
 */
function getCurrentDate(pFormat?: string) {
  pFormat = pFormat || "YYYY-MM-DD HH:mm:ss";
  const datetime = moment().format(pFormat);
  return datetime;
}

interface getCoupangDataReturn {
  categoryName: string;
  isRocket: boolean;
  productId: number;
  productImage: string;
  productName: string;
  productPrice: number;
  productUrl: string;
}

/**
 * 쿠팡API를 이용하여 상품 데이터를 조회한다.
 */
async function getCoupangAPIData({
  subUrls,
  categoryId,
  limit,
  subId,
  keyword,
  transUrls,
  accessKey,
  secretKey,
}: getCouPangApiProps): Promise<getCoupangDataReturn[]> {
  try {
    const response = await getCouPangApi({
      subUrls,
      categoryId,
      limit,
      subId,
      keyword,
      transUrls,
      accessKey,
      secretKey,
    });
    if (response) {
      const {
        data: { rCode, rMessage, data },
      } = response;
      if (rCode == "0") {
        if (subUrls !== "SEARCH") {
          // 검색이 아닐때
          return data;
        } else {
          // console.log(data.productData);
          return data.productData;
        }
      }
      console.log(`${getCurrentDate} rMessage: ${rMessage}`);
      return [];
    } else {
      console.log(`${getCurrentDate} 조회된 데이터가 없습니다.`);
      return [];
    }
  } catch (err) {
    console.log(`${getCurrentDate} ${err}`);
    return [];
  }
}

export default getCoupangAPIData;
