export async function getPlaceName(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data);

  const validData = [];

  if (isNaN(Number(data.address.road))) {
    validData.push(data.address.road);
  }

  if (data.address.village) validData.push(data.address.village);

  if (!data.address.village && data.address.town && !data.address.suburb) {
    validData.push(data.address.town);
  } else {
    validData.push(data.address.suburb);
  }

  if (
    !data.address.village &&
    !data.address.town &&
    !data.address.suburb &&
    data.address.city
  )
    validData.push(data.address.city);

  return validData.filter((d) => Boolean(d)).join(", ");
}
