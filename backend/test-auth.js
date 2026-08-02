async function testAuth() {
  console.log('Testing Registration...');
  
  const registerRes = await fetch('http://localhost:5000/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'securepassword123',
      displayName: 'Test User'
    })
  });
  
  const registerData = await registerRes.json();
  console.log('Register Response:', registerData);
  
  console.log('\nTesting Login...');
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'securepassword123'
    })
  });
  
  const loginData = await loginRes.json();
  console.log('Login Response:', loginData);
  
  if (loginData.token) {
    console.log('\nTesting Protected Route /me...');
    const meRes = await fetch('http://localhost:5000/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });
    const meData = await meRes.json();
    console.log('Me Response:', meData);
  }
}

testAuth();
