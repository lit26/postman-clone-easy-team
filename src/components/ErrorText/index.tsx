import React from 'react';

interface ErrorTextProps {
    error: string;
}

const ErrorText: React.FC<ErrorTextProps> = ({ error }) => {
    if (error === '') {
        return null;
    }

    return <small className="text-danger">{error}</small>;
};

export default ErrorText;
