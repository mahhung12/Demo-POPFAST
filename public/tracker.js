// import UAParser from 'ua-parser-js';

(function () {
    try {
        // Fallback to find the script tag if document.currentScript is null
        const scriptElement = document.currentScript || [...document.querySelectorAll('script')].find(script => script.src.includes('tracker.js'));
        if (!scriptElement) {
            console.error('Tracker script not found or missing data-website-id attribute.');
            return;
        }

        const siteId = scriptElement.getAttribute('data-website-id');
        // const parser = new UAParser(); // From ua-parser-js
        // const ua = parser.getResult();

        if (!siteId) {
            console.error('Missing data-website-id attribute on tracker script.');
            return;
        }

        const payload = {
            site_id: siteId,
            url: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            country: "",
            browser: "",
            os: "",
            device: "",
            // browser: ua.browser.name || "",
            // os: ua.os.name || "",
            // device: ua.device.type || "desktop"
        };

        navigator.sendBeacon("http://localhost:3000/api/collect", JSON.stringify(payload));
    } catch (err) {
        console.error('Error in tracker script:', err);
    }
})();
