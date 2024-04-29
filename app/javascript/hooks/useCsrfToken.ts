// useCsrfToken.ts

import { useEffect, useState } from 'react';

const useCsrfToken = (): string => {
    const [csrfToken, setCsrfToken] = useState<string>('');

    useEffect(() => {
        const csrfTokenElement = document.head.querySelector("[name='csrf-token']") as HTMLMetaElement;
        const token = csrfTokenElement ? csrfTokenElement.content : '';
        setCsrfToken(token);
    }, []);

    return csrfToken;
};

export default useCsrfToken;
