// src/hooks/useIsMobile.ts
"use client";

import { useEffect, useState } from 'react';

const mobileBreakpoint = 768; // Define your mobile breakpoint (e.g., 768px for typical mobile/tablet cutoff)

export const useIsMobile = () => {
    // Initialize state with 'undefined' because window is not available on the server initially
    const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        // This runs only on the client side after hydration
        const handleResize = () => {
            setIsMobile(window.innerWidth < mobileBreakpoint);
        };

        // Set initial value
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array ensures this runs once after initial render

    return isMobile;
};
