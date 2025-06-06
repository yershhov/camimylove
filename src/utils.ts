export async function getPlaceName(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  const data = await res.json();

  const cyrillicRegex = /[\u0400-\u04FF]/;

  for (const [key, value] of Object.entries(data.address)) {
    if (value === "Tempini") delete data.address[key];
    if (!isNaN(Number(value))) delete data.address[key];
    if (typeof value === "string" && cyrillicRegex.test(value)) {
      delete data.address[key];
    }
    if (value === "Isola") delete data.address[key];
  }

  if (data.address.village?.includes(data.address.town))
    delete data.address.town;
  if (data.address.village?.includes(data.address.city))
    delete data.address.city;

  const {
    road,
    village,
    town,
    tourism,
    county,
    railway,
    shop,
    man_made,
    city,
  } = data.address;

  if (man_made) return `${man_made}, ${city}`;
  if (shop) return [shop, town, road].filter((e) => Boolean(e)).join(", ");
  if (tourism && (village ?? town)) return `${tourism}, ${village ?? town}`;
  if (railway && county) return `${railway}, ${county}`;
  if (road && (village ?? county ?? town))
    return `${road}, ${village ?? county ?? town}`;
  if (village && !city) return village;
  if (city && !village && !town && !road) return city;

  return data.display_name
    .split(",")
    .filter(
      (s: string) =>
        isNaN(Number(s)) &&
        s !== "Tempini" &&
        s !== "Isola" &&
        !cyrillicRegex.test(s)
    )
    .slice(0, 2)
    .join(", ");
}
