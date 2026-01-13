
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Mail, Loader2, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  // Chave interna para permitir o login direto sem expor campo de senha ao usuário
  const INTERNAL_KEY = 'crm_direct_access_key_2024';

  const handleDirectAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // 1. Tenta o login direto primeiro
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: INTERNAL_KEY,
      });

      // 2. Se o login falhar porque o usuário não existe, tenta cadastrar (Sign Up)
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: INTERNAL_KEY,
          });

          if (signUpError) throw signUpError;
          
          // Se o cadastro funcionou e não requer confirmação, o Supabase já loga o usuário.
          // Nota: Certifique-se de que "Confirm email" está DESATIVADO no painel do Supabase.
          if (!signUpData.session) {
            setError('O cadastro foi realizado, mas aguarda liberação. Verifique as configurações de e-mail no Supabase.');
          }
        } else {
          throw signInError;
        }
      }
    } catch (err: any) {
      console.error('Erro de Acesso:', err);
      setError(err.message || 'Erro ao processar acesso. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-6 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
             <img 
              src="./logo.png" 
              alt="Logo" 
              className="w-14 h-14 rounded-full" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const icon = parent.querySelector('.fallback-icon');
                  if (icon) (icon as HTMLElement).style.display = 'block';
                }
              }} 
            />
            <Zap className="fallback-icon w-10 h-10 text-white hidden fill-current" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            Gabriel <span className="text-blue-600">CRM</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em] opacity-60">
            Acesso Instantâneo
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] dark:shadow-none border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleDirectAccess} className="space-y-6">
            <div className="space-y-4 text-center mb-8">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Bem-vindo!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Digite seu e-mail para começar a gerenciar seus clientes.</p>
            </div>

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                required
                type="email"
                placeholder="seu@email.com"
                className="w-full h-16 pl-14 pr-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl text-base font-bold focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 outline-none transition-all dark:text-white placeholder-slate-300 dark:placeholder-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl border border-red-100 dark:border-red-900/50 animate-bounce">
                {error}
              </div>
            )}

            <button
              disabled={isLoading || !email}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm rounded-[24px] shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Entrar Agora
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Security Badge */}
        <div className="flex flex-col items-center gap-6 pt-4">
          <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.1em]">
              Seus dados estão protegidos
            </span>
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Login rápido sem senha • Gabriel CRM v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
