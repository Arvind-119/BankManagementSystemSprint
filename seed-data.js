const http = require('http');

async function doFetch(url, method, body, token) {
  const parsedUrl = new URL(url);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname,
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function seed() {
  console.log("Seeding data...");

  // 1. Manager Login
  const loginRes = await doFetch('http://localhost:8085/api/v1/auth/login', 'POST', {
    loginId: 'manager1',
    password: 'manager123',
    role: 'manager'
  });
  
  if (loginRes.status !== 200 || !loginRes.body.token) {
      console.log("Manager login failed. Is auth-service running?", loginRes.body);
      return;
  }
  const token = loginRes.body.token;
  console.log("Logged in as Manager.");

  // 2. Create Customers
  const customers = [
    {
      ssnId: "111122223333",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      contact: "9876543210",
      password: "Password@123",
      address: "123 Elm St"
    },
    {
      ssnId: "444455556666",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      contact: "8765432109",
      password: "Password@123",
      address: "456 Oak St"
    },
    {
      ssnId: "777788889999",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.j@example.com",
      contact: "7654321098",
      password: "Password@123",
      address: "789 Pine St"
    }
  ];

  for (const c of customers) {
    console.log(`\nRegistering customer: ${c.firstName} ${c.lastName}`);
    const regRes = await doFetch('http://localhost:8085/api/v1/auth/register/by-manager', 'POST', c, token);
    
    if (regRes.status !== 201) {
      console.error("Failed to register", c.firstName, regRes.body);
      continue;
    }
    
    const customerId = regRes.body.customerId || regRes.body.id; 
    console.log(`Registered successfully with Customer ID: ${customerId}`);

    if (!customerId) {
      console.log("Could not extract customer ID from response. Skipping account creation.");
      continue;
    }

    // Create Account
    console.log(`Creating Bank Account for ${c.firstName}...`);
    const accRes = await doFetch('http://localhost:8083/api/v1/accounts', 'POST', {
      customerId: customerId,
      accountType: "SAVINGS",
      branchName: "Main Branch",
      ifscCode: "BANK0001234",
      initialDeposit: 5000.00
    }, token);

    if (accRes.status !== 201) {
      console.error("Failed to create account for", c.firstName, accRes.body);
    } else {
      console.log(`Account created successfully! Account No: ${accRes.body.accountNo}`);
      
      // Perform a sample deposit to create a transaction
      console.log(`Making an initial deposit for ${c.firstName}...`);
      const depRes = await doFetch(`http://localhost:8083/api/v1/accounts/${accRes.body.accountNo}/deposit`, 'PUT', {
        amount: 1500.00,
        description: "Welcome bonus"
      }, token);
      
      if (depRes.status === 200) {
        console.log(`Initial deposit successful. Balance: ₹${depRes.body.balance}`);
      } else {
        console.error("Failed to make deposit", depRes.body);
      }
    }
  }
  
  console.log("\nSeeding complete!");
}

seed();
