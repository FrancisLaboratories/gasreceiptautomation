import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import GasLogForm from "./components/GasLogForm";
import LoginLanding from "./components/LoginLanding";
import LoadingScreen from "./components/LoadingScreen";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <LoadingScreen />;

  return isAuthenticated ? <GasLogForm /> : <LoginLanding />;
}

function App() {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    throw new Error(
      "Missing required environment variables: VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID",
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri:
          import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE || "",
      }}
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
      cacheLocation="localstorage"
    >
      <AppContent />
    </Auth0Provider>
  );
}

export default App;
