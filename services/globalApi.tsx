export const RunStatus = async (eventId: string) => {
  const response = await fetch(`http://127.0.0.1:8288/v1/events/${eventId}/runs`, {
    headers: {
      Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error from Inngest:', response.status, errorText);
    throw new Error('Failed to fetch run status');
  }

  const json = await response.json();
  return json.data;
};
