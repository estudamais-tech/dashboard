import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Github,
  Link,
  CheckCircle,
  XCircle,
  BookOpen,
  Monitor,
  Smartphone,
  Mail,
  UserCheck,
  Hourglass,
  Lightbulb,
  Video,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

export default function GitHubProTrack() {
  const navigate = useNavigate(); // Inicializar useNavigate

  return (
    <div className="space-y-4 p-1 mt-14 w-[90%] mx-auto"> {/* Ajustado para w-[80%] e mx-auto */}
      <div className="text-left mb-8 flex justify-between items-center"> {/* Adicionado flex e justify-between para o botão */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Trilha: Ative seu GitHub Pro!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Siga este guia passo a passo para desbloquear os incríveis benefícios do GitHub Student Developer Pack.
          </p>
        </div>
        <Button
          variant="outline"
          className="dark:bg-gray-900 dark:text-white dark:border-gray-600 hover:dark:bg-gray-700"
          onClick={() => navigate('/dashboard/students/journey')} // Botão para voltar para a jornada
        >
          Voltar para Jornada
        </Button>
      </div>

      {/* Seção de Requisitos Iniciais */}
      <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" /> Requisitos Iniciais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              <Github className="w-5 h-5" /> Conta no GitHub
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Caso ainda não tenha uma conta no GitHub, você precisará criar uma.
            </p>
            <Button
              variant="outline"
              className="mt-2 dark:bg-gray-900 dark:text-white dark:border-gray-600 hover:dark:bg-gray-700"
              onClick={() => window.open('https://github.com/join', '_blank')}
            >
              Não tem conta no GitHub? Crie aqui <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5" /> App Estácio Mobile Instalado e Logado
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Certifique-se de que o aplicativo da Estácio está instalado no seu celular e que você está logado.
            </p>
            <div className="flex gap-4 mt-2">
              <Button
                variant="outline"
                className="dark:bg-gray-900 dark:text-white dark:border-gray-600 hover:dark:bg-gray-700"
                onClick={() => window.open('https://apps.apple.com/br/app/est%C3%A1cio/id1451000679', '_blank')}
              >
                App Store <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="dark:bg-gray-900 dark:text-white dark:border-gray-600 hover:dark:bg-gray-700"
                onClick={() => window.open('https://play.google.com/store/apps/details?id=br.com.estacio.mobile&hl=pt_BR', '_blank')}
              >
                Play Store <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Para verificar sua carteirinha: Vá em "Perfil" &gt; "Acessar Carteirinha" dentro do app.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Etapas do Processo */}
      <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Monitor className="w-6 h-6 text-blue-500" /> Etapas do Processo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Etapa 1 */}
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              1. Acessar o GitHub Student Developer Pack
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Abra o navegador e acesse a página oficial do GitHub Education.
            </p>
            <Button
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
              onClick={() => window.open('https://education.github.com/pack', '_blank')}
            >
              Ir para GitHub Education <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Clique em "Sign up for Student Developer Pack" ou "Get student benefits" e faça login com sua conta GitHub.
            </p>
          </div>

          {/* Etapa 2 */}
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              2. Preencher o Formulário de Estudante
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No formulário, escolha "Student", adicione seu e-mail institucional e informe "ESTÁCIO" como nome da instituição.
            </p>
          </div>

          {/* Etapa 3 */}
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              3. Enviar Carteirinha
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Use a webcam para comprovar seu vínculo. Utilize o app da Estácio (Perfil &gt; Carteirinha de Estudante) para exibir sua carteirinha.
            </p>
            <div className="mt-2 flex flex-col items-start gap-2"> {/* Alterado para items-start para alinhar à esquerda */}
              {/* <UserCheck className="w-6 h-6 text-gray-500 dark:text-gray-400" /> Removido o ícone UserCheck */}
              <img
                src="https://placehold.co/300x200/E0E0E0/000000?text=Sua+Carteirinha+Est%C3%A1cio"
                alt="Exemplo de Carteirinha Estácio"
                className="rounded-md shadow-sm border dark:border-gray-600"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-left"> {/* Alterado text-center para text-left */}
              
            </p>
            <p className="text-xs text-red-400 mt-1 text-left"> {/* Alterado text-center para text-left */}
              Lembre-se de preservar seus dados pessoais nas imagens.
            </p>
          </div>

          {/* Etapa 4 */}
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              4. Aguardar Aprovação
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              A aprovação geralmente leva de 1 a 2 dias. Você receberá uma notificação no GitHub ou por e-mail.
            </p>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
              <Hourglass className="w-5 h-5" /> Tempo estimado: 1-2 dias
            </div>
          </div>

          {/* Etapa 5 */}
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              5. Verificar Ativação dos Benefícios
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Após a aprovação, acesse o portal GitHub Education (Global Campus) e confira se o GitHub Pro está ativo na área "Billing".
            </p>
            <Button
              variant="outline"
              className="mt-2 dark:bg-gray-900 dark:text-white dark:border-gray-600 hover:dark:bg-gray-700"
              onClick={() => window.open('https://education.github.com/global-campus/student', '_blank')}
            >
              Acessar Global Campus <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Etapa 6 */}
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              6. Ativar GitHub Pro / Copilot Pro
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No GitHub, vá em "Settings" &gt; "Billing & plans" e confirme seu GitHub Pro gratuito. Para o Copilot, acesse "Settings" &gt; "Code & automation" &gt; "Copilot" e habilite.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Recursos Adicionais */}
      <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" /> Recursos Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5" /> Vídeo Tutorial (Português)
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Assista a este tutorial para um passo a passo visual da inscrição no GitHub Student Developer Pack.
            </p>
            <Button
              className="mt-2 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => window.open('https://www.youtube.com/results?search_query=github+student+developer+pack+tutorial+portugues', '_blank')}
            >
              Assistir no YouTube <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div>
            <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
              <Link className="w-5 h-5" /> Repositório da Trilha
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Consulte o repositório oficial para mais detalhes e atualizações.
            </p>
            <Button
              variant="outline"
              className="mt-2 dark:bg-gray-900 dark:text-white dark:border-gray-600 hover:dark:bg-gray-700"
              onClick={() => window.open('https://github.com/estudamais-tech/ativar-github-pro', '_blank')}
            >
              Acessar Repositório <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
