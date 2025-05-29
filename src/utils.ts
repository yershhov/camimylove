export async function getPlaceName(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  const data = await res.json();

  console.log(data);

  return data.display_name
    .split(",")
    .filter((s: string) => isNaN(Number(s)) && s !== "Tempini")
    .slice(0, 2)
    .join(", ");
}
