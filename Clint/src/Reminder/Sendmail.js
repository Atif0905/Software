import React, { useState, useEffect } from "react";

const SendEmail = () => {
  const [customers, setCustomers] = useState([]);
  // const [dueDates, setDueDates] = useState([]); 
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetchCustomersAndDueDates();
  }, []);
  const fetchCustomersAndDueDates = async () => {
    try {
      // Fetch customers
      const customerResponse = await fetch(`${process.env.REACT_APP_API_URL}/customer`);
      const customerData = await customerResponse.json();
  
      // Fetch due dates
      const dueDateResponse = await fetch(`${process.env.REACT_APP_API_URL}/Duedate`);
      const dueDateData = await dueDateResponse.json();
      
      // Map due dates to customers
      const customersWithDueDates = customerData.map((customer) => {
        // Filter due dates for the current customer and sort them in ascending order
        const customerDueDates = dueDateData
          .filter((due) => due.customerId === customer.customerId)
          .map((due) => new Date(due.dueDate)) // Convert to Date objects
          .filter((dueDate) => dueDate >= new Date()) // Only keep future dates
          .sort((a, b) => a - b); // Sort by the nearest date
  
        // Assign the closest due date (if available) to the customer
        return {
          ...customer,
          dueDate: customerDueDates.length > 0 ? customerDueDates[0] : null,
        };
      });
  
      setCustomers(customersWithDueDates);
    } catch (error) {
      console.error("Error fetching customers or due dates:", error);
    }
  };
  const handleSubmit = (e, customerId, customerEmail) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString();
    localStorage.setItem(`emailSent_${customerId}`, today);
    fetch(`${process.env.REACT_APP_API_URL}/reminder-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerEmail,
        subject: "Reminder Email",
        message: "Your payment is due soon.",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResponse(`Email sent successfully to ${customerEmail}!`);
        } else {
          setResponse(`Error sending email to ${customerEmail}.`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setResponse(`Error sending email to ${customerEmail}.`);
      });
  };
  const isDueIn7Days = (dueDate) => {
    if (!dueDate) return false;
    const currentDate = new Date();
    const timeDifference = dueDate - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference <= 7 && daysDifference >= 0;
  };
  const hasEmailBeenSentToday = (customerId) => {
    const today = new Date().toLocaleDateString();
    const lastSentDate = localStorage.getItem(`emailSent_${customerId}`);
    return lastSentDate === today;
  };
  return (
    <div className="main-content">
      <div className="formback">
        <h2 className="formhead">Send Reminder Email</h2>
        <div className="p-3">
          <h3 className="Headtext">Customers with Due Dates:</h3>
          {customers.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Due Date</th>
                  <th>Send Email</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>
                      {customer.dueDate ? (
                        isDueIn7Days(customer.dueDate) ? (
                          <span style={{ color: "red" }}>
                            Due in {Math.ceil((customer.dueDate - new Date()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        ) : (
                          customer.dueDate.toDateString()
                        )
                      ) : (
                        "No Due Date"
                      )}
                    </td>
                    <td>
                      {hasEmailBeenSentToday(customer.customerId) ? (
                        <span style={{ color: "green", margin: "30px" }}>Sent ✔</span>
                      ) : (
                        <button className="loginbutt1"
                          onClick={(e) => handleSubmit(e, customer.customerId, customer.email)}
                          disabled={hasEmailBeenSentToday(customer.customerId)}
                        >
                          Send Email
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No customers available</p>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
