import getCouPangApi, { IGetCouPangApiProps } from "./coupaingApi";
import { getCurrentDate, setSequeunce } from "./utils";

export interface IGetCoupangDataReturnProps {
  productId: number;
  productImage: string;
  productPrice: number;
  productName: string;
  productUrl: string;
  categoryName: string;
  keyword?: string;
  rank: number;
  isRocket: boolean;
  isFreeShipping?: boolean;
  seq: number;
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
}: IGetCouPangApiProps): Promise<IGetCoupangDataReturnProps[]> {
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
          return setSequeunce(data);
        } else {
          // 검색어로 상품 검색할때
          return setSequeunce(data.productData);
        }
      }
      throw `${getCurrentDate()} rMessage: ${rMessage}`;
    } else {
      throw `${getCurrentDate()} 조회된 데이터가 없습니다.`;
    }
  } catch (err) {
    throw `${getCurrentDate()} ${err}`;
  }
}

export default getCoupangAPIData;
