import React, { useState, useEffect } from "react";

const SendEmail = () => {
  const [customers, setCustomers] = useState([]); // State to store customer list with due dates
  const [email, setEmail] = useState(""); // State for email
  const [subject, setSubject] = useState(""); // State for subject
  const [message, setMessage] = useState(""); // State for message
  const [response, setResponse] = useState(""); // State for response messages

  // Step 1: Fetch all customers and their due dates from the backend API
  useEffect(() => {
    fetchCustomersWithDueDates();
  }, []);

  // Function to fetch customers and their due dates
  const fetchCustomersWithDueDates = async () => {
    try {
      console.log("Fetching customers...");
      
      // Fetch customers
      const customerResponse = await fetch(`${process.env.REACT_APP_API_URL}/customer`);
      console.log("Customer response status:", customerResponse.status);
      
      if (!customerResponse.ok) {
        throw new Error(`Failed to fetch customers: ${customerResponse.statusText}`);
      }
  
      const customerData = await customerResponse.json();
      console.log("Customer data:", customerData);
  
      if (customerData.length === 0) {
        console.log("No customers found");
        return;
      }
  
      // Fetch due dates for each customer
      const customerPromises = customerData.map(async (customer) => {
        const dueDateResponse = await fetch(`${process.env.REACT_APP_API_URL}/customer/${customer.customerId}`);
        const dueDateData = await dueDateResponse.json();

        // Check if installments exist
        if (dueDateData.length > 0) {
          const nextDueDate = dueDateData[0]?.dueDate;
          return {
            ...customer,
            dueDate: new Date(nextDueDate),
          };
        } else {
          return {
            ...customer,
            dueDate: null,
          };
        }
      });
  
      // Wait for all due dates to be fetched
      const customersWithDueDates = await Promise.all(customerPromises);
  
      // Update state with customers that have due dates
      console.log("Customers with due dates:", customersWithDueDates);
      setCustomers(customersWithDueDates);
    } catch (error) {
      console.error("Error fetching customers or due dates:", error);
    }
  };
  
  // Step 2: Handle form submission for sending email
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/reminder-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email, // Ensure message is also passed
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResponse("Email sent successfully!");
        } else {
          setResponse("Error sending email.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setResponse("Error sending email.");
      });
  };

  // Step 3: When a customer name is clicked, set the email field
  const handleCustomerClick = (customerEmail) => {
    setEmail(customerEmail);
  };

  // Step 4: Calculate if the due date is within the next 7 days
  const isDueIn7Days = (dueDate) => {
    if (!dueDate) return false;
    
    const currentDate = new Date();
    const timeDifference = dueDate - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return daysDifference <= 7 && daysDifference >= 0; // Check if due date is within the next 7 days
  };

  return (
    <div>
      <h2>Send Reminder Email</h2>

      {/* Step 5: Render the customer list with due date reminders */}
      <h3>Select a customer:</h3>
      {customers.length > 0 ? (
        <ul>
          {customers.map((customer) => (
            <li key={customer.customerId}>
              <button onClick={() => handleCustomerClick(customer.email)}>
                {customer.name}
              </button>
              {customer.dueDate && isDueIn7Days(customer.dueDate) && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  - Due in {Math.ceil((customer.dueDate - new Date()) / (1000 * 60 * 60 * 24))} days! Send Reminder Email
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No customers available</p>
      )}

      {/* Step 6: Email form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Customer email"
          />
        </div>

        <button type="submit">Send Email</button>
      </form>

      {/* Display response message */}
      {response && <p>{response}</p>}
    </div>
  );
};

export default SendEmail;
