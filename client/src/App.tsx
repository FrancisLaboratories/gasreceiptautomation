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
  const rc = (window as any).__RUNTIME_CONFIG__ || {};
  const domain = rc.PUBLIC_AUTH0_DOMAIN || import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = rc.PUBLIC_AUTH0_CLIENT_ID || import.meta.env.VITE_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    throw new Error(
      "Missing required environment variables: PUBLIC_AUTH0_DOMAIN and PUBLIC_AUTH0_CLIENT_ID",
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri:
          rc.PUBLIC_AUTH0_REDIRECT_URI || import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
        audience: rc.PUBLIC_AUTH0_AUDIENCE || import.meta.env.VITE_AUTH0_AUDIENCE || "",
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
