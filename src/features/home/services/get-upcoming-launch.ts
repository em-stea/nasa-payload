export async function getNextUpcomingLaunch() {
  const response = await fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1");
  const data = await response.json();

  const nextLaunch = data.results?.[0];

  return {
    name: nextLaunch?.name,
    date: nextLaunch?.net?.split("T")[0],
    status: nextLaunch?.status,
    location: nextLaunch?.pad?.location?.name,
  };
}
