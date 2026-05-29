const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const put = await fetch(`${url}/storage/v1/bucket/recitations`, {
  method: 'PUT',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'recitations',
    public: true,
    file_size_limit: 5000000,
    allowed_mime_types: ['audio/mpeg'],
  }),
});
console.log('PUT status:', put.status);
console.log('PUT body:', await put.text());

const get = await fetch(`${url}/storage/v1/bucket/recitations`, {
  headers: { Authorization: `Bearer ${key}` },
});
console.log('\nGET body:', await get.text());
