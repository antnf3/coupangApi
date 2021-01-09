import crypto from "crypto";
import moment from "moment";

interface IGenerateHmacProps {
  REQUEST_METHOD: string;
  URL: string;
  SECRET_KEY: any;
  ACCESS_KEY: any;
}
function generateHmac({
  REQUEST_METHOD,
  URL,
  SECRET_KEY,
  ACCESS_KEY,
}: IGenerateHmacProps): string {
  const parts = URL.split(/\?/);
  const [path, query = ""] = parts;

  const datetime = moment.utc().format("YYMMDD[T]HHmmss[Z]");
  const message = datetime + REQUEST_METHOD + path + query;

  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(message)
    .digest("hex");

  return `CEA algorithm=HmacSHA256, access-key=${ACCESS_KEY}, signed-date=${datetime}, signature=${signature}`;
}
export { generateHmac };
