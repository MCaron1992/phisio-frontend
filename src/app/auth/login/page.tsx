'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LightRays from '@/components/bits/LightBackground';
import ElectricBorder from '@/components/bits/ElectricBorder';
import SplitText from '@/components/bits/SplitText';
import { useState } from 'react';
import UniversalAlert, {
  AlertState,
} from '@/components/custom /UniversalAlert';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const { login, isLoggingIn } = useAuth();

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    description: '',
  });

  const showAlert = (
    type: AlertState['type'],
    title: string,
    description: string
  ) => {
    setAlert({
      show: true,
      type,
      title,
      description,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      showAlert(
        'warning',
        'Campi mancanti',
        'Per favore, compila tutti i campi.'
      );
      return;
    }

    if (!email.includes('@')) {
      showAlert(
        'error',
        'Email non valida',
        'Inserisci un indirizzo email valido.'
      );
      return;
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          showAlert(
            'success',
            'Login riuscito!',
            "Hai effettuato l'accesso con successo!"
          );
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        },
        onError: () => {
          showAlert(
            'error',
            'Credenziali non valide',
            'Email o password errate. Riprova.'
          );
        },
      }
    );
  };

  const handleAlertClose = () => setAlert(prev => ({ ...prev, show: false }));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#aeabab"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="w-full h-full"
        />
      </div>
      <div className="flex h-full w-full items-center justify-center px-4">
        <ElectricBorder
          color="#7df9ff"
          speed={0.5}
          chaos={4}
          thickness={2}
          style={{ borderRadius: 16 }}
        >
          <Card style={{ width: '30rem', height: '25rem' }}>
            <SplitText
              text="Energy Analytics"
              className="text-3xl font-bold text-center"
              delay={150}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.3}
              rootMargin="-100px"
              textAlign="center"
            />
            <CardHeader>
              <CardTitle style={{ textAlign: 'center' }}>
                Accedi al tuo account
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="test@test.com"
                    required
                  />
                </div>

                <div className="grid gap-2 mt-4">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Hai dimenticato la password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-8"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Accesso in corso...' : 'Accedi'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </ElectricBorder>
      </div>
      <>
        <UniversalAlert
          title={alert.title}
          description={alert.description}
          isVisible={alert.show}
          onClose={handleAlertClose}
          type={alert.type}
          duration={3000}
          position="top-right"
        />
      </>
    </div>
  );
};

export default LoginPage;
