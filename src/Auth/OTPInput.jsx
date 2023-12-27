import React, { useState } from 'react';

const OTPInput = ({ length }) => {
    const [otp, setOTP] = useState(Array(length).fill(''));

    const handleChange = (e, index) => {
        if (!isNaN(e.target.value)) {
            const newOTP = [...otp];
            newOTP[index] = e.target.value;

            setOTP(newOTP);

            if (e.target.nextSibling) {
                e.target.nextSibling.focus();
            }
        }
    };

    return (
        <div className="otp-input" style={{ display: 'flex' }}>
            {otp.map((digit, index) => (
                <input
                    style={
                        {
                            "border": "none",
                            "color": "black"
                        }
                    }
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onFocus={(e) => e.target.select()}
                    style={{ width: '40px', marginRight: '10px', textAlign: 'center' }}
                />
            ))}
        </div>
    );
};

export default OTPInput;
