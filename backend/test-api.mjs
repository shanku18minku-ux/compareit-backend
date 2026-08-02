const testAPI = async () => {
  try {
    console.log('Fetching trending deals from local backend...');
    const res = await fetch('http://localhost:5000/api/v1/db/trending_deals');
    const data = await res.json();
    console.log('Status Code:', res.status);
    console.log('Success:', data.success);
    console.log('Items Count:', data.data ? data.data.length : 0);
    if (data.data && data.data.length > 0) {
      console.log('First Item Sample:', JSON.stringify(data.data[0], null, 2));
    } else {
      console.error('ERROR: No data returned from database.');
    }
  } catch (err) {
    console.error('Fetch Failed:', err.message);
  }
};

testAPI();
