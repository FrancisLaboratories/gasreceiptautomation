import { AuthProvider, useAuth } from "react-oidc-context";
import GasLogForm from "./components/GasLogForm";
import LoginLanding from "./components/LoginLanding";
import LoadingScreen from "./components/LoadingScreen";
import { oidcConfig } from "./lib/oidc";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return isAuthenticated ? <GasLogForm /> : <LoginLanding />;
}

function App() {
  return (
    <AuthProvider
      {...oidcConfig}
      onSigninCallback={() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }}
    >
      <AppContent />
    </AuthProvider>
  );
}

export default App;