import React from "react";

const ayarlar = () => {
  const config = {
    Username: "fiwek76641@ibtrades.com",
    Password: "934ED41093894F2A23F222C88DE04AC238C2",
    Host: "smtp.elasticemail.com",
    Port: 2525,
    From: "fiwek76641@ibtrades.com",
    To: "zxy6o4ubkw@sfolkar.com",
    Subject: "TEST Mail",
    Body: "Test Body"
  };

  const sendMail = () => {
    if(window.Email){
      console.log("girdi mi")
      window.Email.send(config).then(
        message => alert(message)
      );
    }
  };

  return (
    <div>
      ayarlarcc
      <button onClick={() => sendMail()} className="bg-red-500 rounded-lg p-2">
        SEND
      </button>
    </div>
  );
};

export default ayarlar;
