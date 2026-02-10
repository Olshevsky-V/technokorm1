export const goodsApiLink = "http://technokorm-db.test/api/goods";

export const locationsApiLink = "http://technokorm-db.test/api/locations";

export const categoriesApiLink = "http://technokorm-db.test/api/categories";

export const animalsApiLink = "http://technokorm-db.test/api/animals";

export const imagesApiLink = "http://technokorm-db.test/images";

export async function fetchData(apiUrl) {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}
