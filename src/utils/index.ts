import moment from "moment";
import { IGetCoupangDataReturnProps } from "..";

/**
 * 현재날짜를 가져온다.
 * @param N/A
 * @return string: YYYY-MM-DD HH:mm:ss
 */
function getCurrentDate(pFormat?: string): string {
  pFormat = pFormat || "YYYY-MM-DD HH:mm:ss";
  const datetime = moment().format(pFormat);
  return datetime;
}

export interface ISetSequenceProps extends IGetCoupangDataReturnProps {
  seq: number;
}

/**
 * 시퀀스값을 구한다.
 * @param dummy: 현재날짜,시간,분,초 뒤에 붙을 숫자
 * @return seq: number
 */
function getSequence(dummy: number) {
  const today = getCurrentDate("YYYYMMDDHHmmss");
  const seq = Number(today + String(dummy));
  return seq;
}

/**
 * OBJECT에 시퀀스값을 추가한다.
 * @param arrData: IGetCoupangDataReturnProps[]
 * @return rsltData: ISetSequenceProps
 */
function setSequeunce(
  arrData: IGetCoupangDataReturnProps[]
): ISetSequenceProps[] {
  const rsltData = arrData.reduce((acc: ISetSequenceProps[], cur) => {
    const seq = getSequence(cur.rank);
    acc.push({ ...cur, seq });
    return acc;
  }, []);
  return rsltData;
}

export { getCurrentDate, setSequeunce };
