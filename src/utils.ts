export async function getPlaceName(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, {
    headers: {
      "Accept-Language": "it",
    },
  });
  const data = await res.json();

  const cyrillicRegex = /[\u0400-\u04FF]/;

  for (const [key, value] of Object.entries(data.address)) {
    if (String(value).includes("Tempini")) delete data.address[key];
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

  console.log(data.address, data.display_name);

  const {
    road,
    village,
    town,
    tourism,
    county,
    railway,
    highway,
    shop,
    man_made,
    city,
  } = data.address;

  const pl = "Via Dante Alighieri, Jesolo";
  const papaLuciani = "Via Papa Luciani, Ca' Gamba, Jesolo";

  const displayName = data.display_name
    .split(",")
    .filter(
      (s: string) =>
        isNaN(Number(s)) &&
        s !== "Tempini" &&
        s !== "Isola" &&
        !cyrillicRegex.test(s)
    );

  if (displayName.stratsWith(pl)) return pl;
  if (displayName.stratsWith(papaLuciani)) return papaLuciani;

  const bestTownName = village ?? county ?? town;

  if (man_made) return `${man_made}, ${city}`;
  if (shop) return [shop, town, road].filter((e) => Boolean(e)).join(", ");
  if (tourism && bestTownName) return `${tourism}, ${bestTownName}`;
  if (railway && county) return `${railway}, ${county}`;

  if (highway && (town ?? village ?? county))
    return `${highway}, ${town ?? village ?? county}`;

  if (road && bestTownName) return `${road}, ${bestTownName}`;
  if (village && !city) return village;
  if (city && !village && !town && !road) return city;

  return displayName.slice(0, 2).join(", ");
}
