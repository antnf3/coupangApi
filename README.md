## coupangApi

### 카테고리 상품조회

```typescript
(async () => {
  const ACCESS_KEY = "";
  const SECRET_KEY = "";
  const arrData = await getCoupangAPIData({
    subUrls: "BESTCATEGORIES",
    categoryId: 1001,
    limit: 5,
    subId: "dryadshop",
    accessKey: ACCESS_KEY,
    secretKey: SECRET_KEY,
  });
  console.log(arrData);
})();
```

### 검색어 상품 조회

```typescript
(async () => {
  const ACCESS_KEY = "";
  const SECRET_KEY = "";
  const arrData = await getCoupangAPIData({
    subUrls: "SEARCH",
    limit: 5,
    subId: "anderson",
    keyword: "맥북프로",
    accessKey: ACCESS_KEY,
    secretKey: SECRET_KEY,
  });
  console.log(arrData);
})();
```

### 쿠팡 단축URL변화

```typescript
(async () => {
  const ACCESS_KEY = "";
  const SECRET_KEY = "";
  const arrUrls = [
    "https://www.coupang.com/np/search?component=&q=good&channel=user",
    "https://www.coupang.com/np/coupangglobal",
  ];
  const arrTransUrl = await getCoupangAPIData({
    subUrls: "DEEPLINK",
    transUrls: arrUrls,
    accessKey: ACCESS_KEY,
    secretKey: SECRET_KEY,
  });
  console.log(arrTransUrl);
})();
```
