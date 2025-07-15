import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Github,
  Link,
  CheckCircle,
  Smartphone,
  Lightbulb,
  ExternalLink
} from "lucide-react";
import { useNavigate } from 'react-router-dom'; 

export default function GitHubProTrack() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-1 mt-14 w-[90%] mx-auto"> 
      <div className="text-left mb-8 flex justify-between items-center"> 
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
          onClick={() => navigate('/dashboard/students/journey')} 
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
                onClick={() => window.open('https://play.google.com/store/apps/details?id=br.estacio.estaciomobile&hl=pt_BR', '_blank')}
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

     

      {/* Seção de Recursos Adicionais */}
      <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" /> Recursos Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <div>
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
          </div> */}
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
              Acessar Repositório com o tutorail do passo a passo!<ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
