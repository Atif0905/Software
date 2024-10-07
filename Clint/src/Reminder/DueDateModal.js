import React, { useState, useEffect } from "react";
import './DueDateModal.css';

const DueDateModal = () => {
  const [customers, setCustomers] = useState([]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetchCustomersAndDueDates();
  }, []);

  const fetchCustomersAndDueDates = async () => {
    try {
      const customerResponse = await fetch(`${process.env.REACT_APP_API_URL}/customer`);
      const customerData = await customerResponse.json();
      const dueDateResponse = await fetch(`${process.env.REACT_APP_API_URL}/Duedate`);
      const dueDateData = await dueDateResponse.json();

      const customersWithDueDates = customerData.map((customer) => {
        const customerDueDates = dueDateData
          .filter((due) => due.customerId === customer.customerId)
          .map((due) => new Date(due.dueDate))
          .filter((dueDate) => dueDate >= new Date())
          .sort((a, b) => a - b);
        return {
          ...customer,
          dueDate: customerDueDates.length > 0 ? customerDueDates[0] : null,
        };
      });

      const filteredCustomers = customersWithDueDates.filter((customer) =>
        customer.dueDate && isDueIn7Days(customer.dueDate)
      );

      setCustomers(filteredCustomers);
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
          // Remove the customer from the state
          setCustomers((prevCustomers) =>
            prevCustomers.filter((customer) => customer.customerId !== customerId)
          );
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
    <div className="">
      <div className="">
        <div className="notification">Notifications</div>
        <div className="">
          {customers.length > 0 ? (
            <a href="/reminder">
              <div>
                {customers.map((customer) => (
                  <div key={customer.customerId} className="hov p-3 d-flex justify-content-between">
                    <p>{customer.name}</p>
                    <p>
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
                    </p>
                  </div>
                ))}
              </div>
            </a>
          ) : (
            <p>No Such Notifications</p>
          )}
          {response && <p>{response}</p>}
        </div>
      </div>
    </div>
  );
};

export default DueDateModal;
