import { fetchOndcListings } from './src/services/ondcService.js';
import { ONDC_NETWORK_LISTINGS } from './src/services/mockOndcData.js';

console.log("Mock data length:", ONDC_NETWORK_LISTINGS.length);

async function test() {
  console.log("Testing Apple iPhone 16 (128GB)...");
  const res = await fetchOndcListings("Apple iPhone 16 (128GB)");
  console.log("Result length:", res.length);
  console.log("Result:", res);
}

test();
