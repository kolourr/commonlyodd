import { Button } from "@suid/material";
import { createSignal, onMount } from "solid-js";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = createSignal(true);
  const [consentGiven, setConsentGiven] = createSignal(false);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setConsentGiven(true);
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setConsentGiven(false);
    setShowBanner(false);
  };

  onMount(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      setShowBanner(false);
      setConsentGiven(consent === "accepted");
    }
  });

  return (
    <div>
      {showBanner() && (
        <div class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 text-gray-200 p-4 flex flex-col justify-center border-2 shadow-sm shadow-gray-50   ">
          <div class="flex justify-center items-center">
            We use cookies to provide essential features of Commonly Odd. By
            accepting, you consent to our policy.
          </div>
          <div class=" flex justify-center items-center pt-2">
            <div class="px-2">
              {" "}
              <Button
                size="small"
                sx={{
                  color: "#f9fafb",
                  width: 100,
                  height: 40,
                }}
                color="success"
                onClick={handleAccept}
                variant="contained"
              >
                Accept
              </Button>
            </div>
            <div class="px-2">
              <Button
                size="small"
                sx={{
                  color: "#f9fafb",
                  width: 100,
                  height: 40,
                }}
                color="error"
                onClick={handleReject}
                variant="contained"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
